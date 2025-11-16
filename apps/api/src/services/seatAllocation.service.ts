import crypto from 'crypto';
import { PrismaClient } from '../../prisma/generated/client/index.js';
import { logger } from '../utils/logger.js';

interface AttendeeToAllocate {
  id: string;
  enrollmentId: string;
  name: string;
  assignedEnclosure: string;
}

interface RowConfig {
  id: string;
  letter: string;
  startSeat: number;
  endSeat: number;
  reservedSeats: string;
  displayOrder: number;
}

interface EnclosureConfig {
  id: string;
  letter: string;
  name: string | null;
  rows: RowConfig[];
}

interface AllocationResult {
  success: boolean;
  allocated: number;
  failed: number;
  errors: Array<{ attendeeId: string; error: string }>;
}

export class SeatAllocationService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Main allocation algorithm - allocates seats for all eligible attendees
   * Reads attendees from database with assigned enclosure
   * Skips admin-reserved and row-reserved seats
   */
  async allocateSeats(): Promise<AllocationResult> {
    try {
      logger.info('Starting seat allocation process...');

      // Fetch all attendees with assigned enclosure who don't have allocations yet
      const attendees = await this.prisma.attendee.findMany({
        where: {
          assignedEnclosure: { not: null },
          allocation: null, // Only attendees without seat allocation
          convocationEligible: true,
          convocationRegistered: true
        },
        select: {
          id: true,
          enrollmentId: true,
          name: true,
          assignedEnclosure: true
        }
      });

      if (attendees.length === 0) {
        logger.info('No attendees to allocate');
        return {
          success: true,
          allocated: 0,
          failed: 0,
          errors: []
        };
      }

      logger.info(`Found ${attendees.length} attendees to allocate`);

      // Group attendees by enclosure
      const attendeesByEnclosure = this.groupByEnclosure(
        attendees as AttendeeToAllocate[]
      );

      let totalAllocated = 0;
      let totalFailed = 0;
      const errors: Array<{ attendeeId: string; error: string }> = [];

      // Process each enclosure
      for (const [enclosureLetter, enclosureAttendees] of Object.entries(
        attendeesByEnclosure
      )) {
        try {
          const result = await this.allocateForEnclosure(
            enclosureLetter,
            enclosureAttendees
          );
          totalAllocated += result.allocated;
          totalFailed += result.failed;
          errors.push(...result.errors);
        } catch (error) {
          logger.error(`Error allocating for enclosure ${enclosureLetter}:`, error);
          errors.push({
            attendeeId: 'ENCLOSURE_' + enclosureLetter,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      logger.info(
        `Allocation complete: ${totalAllocated} allocated, ${totalFailed} failed`
      );

      return {
        success: totalFailed === 0,
        allocated: totalAllocated,
        failed: totalFailed,
        errors
      };
    } catch (error) {
      logger.error('Fatal error in seat allocation:', error);
      throw error;
    }
  }

  /**
   * Allocate seats for a specific enclosure
   */
  private async allocateForEnclosure(
    enclosureLetter: string,
    attendees: AttendeeToAllocate[]
  ): Promise<{ allocated: number; failed: number; errors: Array<{ attendeeId: string; error: string }> }> {
    logger.info(
      `Allocating ${attendees.length} seats in enclosure ${enclosureLetter}`
    );

    // Fetch enclosure configuration
    const enclosure = await this.prisma.enclosure.findUnique({
      where: { letter: enclosureLetter },
      include: {
        rows: {
          orderBy: { displayOrder: 'asc' }
        }
      }
    });

    if (!enclosure) {
      throw new Error(`Enclosure ${enclosureLetter} not found`);
    }

    // Fetch admin-reserved seats for this enclosure
    const adminReservedSeats = await this.prisma.seatReservation.findMany({
      where: { enclosureLetter },
      select: { rowLetter: true, seatNumber: true }
    });

    // Create a Set for quick lookup: "A-5" format
    const adminReservedSet = new Set(
      adminReservedSeats.map((r) => `${r.rowLetter}-${r.seatNumber}`)
    );

    logger.info(
      `Admin reserved ${adminReservedSet.size} seats in enclosure ${enclosureLetter}`
    );

    // Get already allocated seats to avoid conflicts
    const existingAllocations = await this.prisma.seatAllocation.findMany({
      where: { enclosureLetter },
      select: { rowLetter: true, seatNumber: true }
    });

    const allocatedSet = new Set(
      existingAllocations.map((a) => `${a.rowLetter}-${a.seatNumber}`)
    );

    let attendeeIndex = 0;
    let allocated = 0;
    let failed = 0;
    const errors: Array<{ attendeeId: string; error: string }> = [];
    const allocations: Array<{
      enclosureId: string;
      enclosureLetter: string;
      rowLetter: string;
      seatNumber: number;
      attendeeId: string;
    }> = [];

    // Iterate through rows
    for (const row of enclosure.rows) {
      if (attendeeIndex >= attendees.length) break;

      const rowReservedSeats = this.parseReservedSeats(row.reservedSeats);
      const rowReservedSet = new Set(rowReservedSeats);

      // Allocate seats in this row
      for (let seatNum = row.startSeat; seatNum <= row.endSeat; seatNum++) {
        if (attendeeIndex >= attendees.length) break;

        const seatKey = `${row.letter}-${seatNum}`;

        // Skip if seat is reserved by admin
        if (adminReservedSet.has(seatKey)) {
          logger.debug(`Skipping admin-reserved seat: ${seatKey}`);
          continue;
        }

        // Skip if seat is reserved in row configuration
        if (rowReservedSet.has(seatNum)) {
          logger.debug(`Skipping row-reserved seat: ${seatKey}`);
          continue;
        }

        // Skip if seat is already allocated
        if (allocatedSet.has(seatKey)) {
          logger.debug(`Skipping already-allocated seat: ${seatKey}`);
          continue;
        }

        // Allocate seat to attendee
        const attendee = attendees[attendeeIndex];
        if (!attendee) continue;

        allocations.push({
          enclosureId: enclosure.id,
          enclosureLetter: enclosure.letter,
          rowLetter: row.letter,
          seatNumber: seatNum,
          attendeeId: attendee.id
        });

        logger.debug(
          `Allocated seat ${seatKey} to ${attendee.enrollmentId} (${attendee.name})`
        );

        attendeeIndex++;
        allocated++;
      }
    }

    // Bulk create all allocations
    if (allocations.length > 0) {
      try {
        // Create allocations in a transaction, also generating tokens for attendees
        await this.prisma.$transaction(async (tx) => {
          // Create all seat allocations
          await tx.seatAllocation.createMany({
            data: allocations
          });

          // Generate and update verification tokens for all allocated attendees
          for (const allocation of allocations) {
            const verificationToken = this.generateVerificationToken();
            await tx.attendee.update({
              where: { id: allocation.attendeeId },
              data: { verificationToken }
            });
          }
        });

        logger.info(
          `Successfully created ${allocations.length} seat allocations with verification tokens in enclosure ${enclosureLetter}`
        );
      } catch (error) {
        logger.error(`Error creating seat allocations:`, error);
        throw error;
      }
    }

    // Check if we couldn't allocate all attendees
    if (attendeeIndex < attendees.length) {
      const unallocatedCount = attendees.length - attendeeIndex;
      logger.warn(
        `Could not allocate ${unallocatedCount} attendees in enclosure ${enclosureLetter} - not enough seats`
      );
      failed = unallocatedCount;

      // Add errors for unallocated attendees
      for (let i = attendeeIndex; i < attendees.length; i++) {
        const unallocatedAttendee = attendees[i];
        if (unallocatedAttendee) {
          errors.push({
            attendeeId: unallocatedAttendee.enrollmentId,
            error: 'Not enough available seats in enclosure'
          });
        }
      }
    }

    return { allocated, failed, errors };
  }

  /**
   * Parse reserved seat string: "1,5,10" → [1, 5, 10]
   */
  private parseReservedSeats(reservedStr: string): number[] {
    if (!reservedStr || reservedStr === '') return [];
    return reservedStr
      .split(',')
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
  }

  /**
   * Generate a unique verification token for ticket QR code
   */
  private generateVerificationToken(): string {
    // Generate a secure random token (32 bytes = 64 hex characters)
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Group attendees by their assigned enclosure
   */
  private groupByEnclosure(
    attendees: AttendeeToAllocate[]
  ): Record<string, AttendeeToAllocate[]> {
    return attendees.reduce((acc, attendee) => {
      const enclosure = attendee.assignedEnclosure;
      if (!acc[enclosure]) acc[enclosure] = [];
      acc[enclosure].push(attendee);
      return acc;
    }, {} as Record<string, AttendeeToAllocate[]>);
  }

  /**
   * Calculate total available seats in enclosure (excluding admin + row reservations)
   */
  async getTotalSeats(enclosureLetter: string): Promise<number> {
    const enclosure = await this.prisma.enclosure.findUnique({
      where: { letter: enclosureLetter },
      include: { rows: true }
    });

    if (!enclosure) return 0;

    // Get admin-reserved seat count
    const adminReservedCount = await this.prisma.seatReservation.count({
      where: { enclosureLetter }
    });

    // Calculate row-reserved seats
    const rowReservedTotal = enclosure.rows.reduce((total, row) => {
      return total + this.parseReservedSeats(row.reservedSeats).length;
    }, 0);

    // Calculate total seats
    const totalSeats = enclosure.rows.reduce((total, row) => {
      return total + (row.endSeat - row.startSeat + 1);
    }, 0);

    return totalSeats - adminReservedCount - rowReservedTotal;
  }

  /**
   * Get allocation statistics
   */
  async getAllocationStats(): Promise<{
    totalAttendees: number;
    totalAllocated: number;
    totalUnallocated: number;
    byEnclosure: Record<string, { total: number; allocated: number; available: number; reserved: number; totalCapacity: number }>;
  }> {
    const attendees = await this.prisma.attendee.count({
      where: {
        assignedEnclosure: { not: null },
        convocationEligible: true,
        convocationRegistered: true
      }
    });

    const allocated = await this.prisma.seatAllocation.count();

    // Get enclosures
    const enclosures = await this.prisma.enclosure.findMany({
      include: {
        rows: true,
        _count: {
          select: { seatAllocations: true }
        }
      }
    });

    const byEnclosure: Record<string, { total: number; allocated: number; available: number; reserved: number; totalCapacity: number }> = {};

    for (const enclosure of enclosures) {
      // Calculate total capacity (all seats regardless of reservations)
      const totalCapacity = enclosure.rows.reduce((total, row) => {
        return total + (row.endSeat - row.startSeat + 1);
      }, 0);

      // Get admin-reserved seat count
      const adminReservedCount = await this.prisma.seatReservation.count({
        where: { enclosureLetter: enclosure.letter }
      });

      // Calculate row-reserved seats
      const rowReservedTotal = enclosure.rows.reduce((total, row) => {
        return total + this.parseReservedSeats(row.reservedSeats).length;
      }, 0);

      const totalReserved = adminReservedCount + rowReservedTotal;
      const totalSeats = await this.getTotalSeats(enclosure.letter);
      
      byEnclosure[enclosure.letter] = {
        total: totalSeats, // Available capacity (excluding reserved)
        allocated: enclosure._count.seatAllocations,
        available: totalSeats - enclosure._count.seatAllocations,
        reserved: totalReserved, // Total reserved seats (admin + row)
        totalCapacity: totalCapacity // Total physical seats
      };
    }

    return {
      totalAttendees: attendees,
      totalAllocated: allocated,
      totalUnallocated: attendees - allocated,
      byEnclosure
    };
  }

  /**
   * Allocate seats for a specific enclosure only
   */
  async allocateSeatsForEnclosure(enclosureLetter: string): Promise<AllocationResult> {
    try {
      logger.info(`Starting seat allocation for enclosure ${enclosureLetter}...`);

      // Fetch attendees assigned to this enclosure who don't have allocations yet
      const attendees = await this.prisma.attendee.findMany({
        where: {
          assignedEnclosure: enclosureLetter,
          allocation: null,
          convocationEligible: true,
          convocationRegistered: true
        },
        select: {
          id: true,
          enrollmentId: true,
          name: true,
          assignedEnclosure: true
        }
      });

      if (attendees.length === 0) {
        logger.info(`No attendees to allocate in enclosure ${enclosureLetter}`);
        return {
          success: true,
          allocated: 0,
          failed: 0,
          errors: []
        };
      }

      logger.info(`Found ${attendees.length} attendees to allocate in enclosure ${enclosureLetter}`);

      const result = await this.allocateForEnclosure(
        enclosureLetter,
        attendees as AttendeeToAllocate[]
      );

      logger.info(
        `Allocation complete for enclosure ${enclosureLetter}: ${result.allocated} allocated, ${result.failed} failed`
      );

      return {
        success: result.failed === 0,
        allocated: result.allocated,
        failed: result.failed,
        errors: result.errors
      };
    } catch (error) {
      logger.error(`Error allocating seats for enclosure ${enclosureLetter}:`, error);
      throw error;
    }
  }

  /**
   * Clear seat allocations for a specific enclosure
   */
  async clearEnclosureAllocations(enclosureLetter: string): Promise<number> {
    const result = await this.prisma.seatAllocation.deleteMany({
      where: { enclosureLetter }
    });
    logger.info(`Cleared ${result.count} seat allocations from enclosure ${enclosureLetter}`);
    return result.count;
  }

  /**
   * Clear all seat allocations (for re-running allocation)
   */
  async clearAllAllocations(): Promise<number> {
    const result = await this.prisma.seatAllocation.deleteMany({});
    logger.info(`Cleared ${result.count} seat allocations`);
    return result.count;
  }

  /**
   * Get seat allocation for a specific attendee
   */
  async getAttendeeAllocation(enrollmentId: string): Promise<{
    attendee: any;
    allocation: any;
    enclosure: any;
  } | null> {
    const attendee = await this.prisma.attendee.findUnique({
      where: { enrollmentId },
      include: {
        allocation: {
          include: {
            enclosure: {
              include: {
                rows: {
                  orderBy: { displayOrder: 'asc' }
                }
              }
            }
          }
        }
      }
    });

    if (!attendee || !attendee.allocation) {
      return null;
    }

    return {
      attendee: {
        enrollmentId: attendee.enrollmentId,
        name: attendee.name,
        course: attendee.course,
        school: attendee.school,
        degree: attendee.degree
      },
      allocation: {
        enclosure: attendee.allocation.enclosureLetter,
        row: attendee.allocation.rowLetter,
        seat: attendee.allocation.seatNumber
      },
      enclosure: attendee.allocation.enclosure
    };
  }
}
