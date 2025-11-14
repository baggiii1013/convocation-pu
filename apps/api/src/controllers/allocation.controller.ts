import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { SeatAllocationService } from '../services/seatAllocation.service.js';
import type { AccessTokenPayload } from '../utils/auth.js';
import { logger } from '../utils/logger.js';

export class AllocationController {
  /**
   * POST /api/allocations/allocate-seats
   * Trigger seat allocation for all eligible attendees
   */
  static async allocateSeats(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as AccessTokenPayload;
      logger.info(`Seat allocation triggered by user ${user.email}`);

      const seatService = new SeatAllocationService(prisma);
      const result = await seatService.allocateSeats();

      res.status(200).json({
        success: true,
        message: `Seat allocation completed: ${result.allocated} allocated, ${result.failed} failed`,
        data: {
          allocated: result.allocated,
          failed: result.failed,
          errors: result.errors
        }
      });
    } catch (error) {
      logger.error('Allocation error:', error);
      res.status(500).json({
        success: false,
        message: 'Seat allocation failed',
        code: 'ALLOCATION_ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * DELETE /api/allocations/clear
   * Clear all seat allocations (for re-running allocation)
   */
  static async clearAllocations(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as AccessTokenPayload;
      logger.info(`Clear allocations requested by user ${user.email}`);

      const seatService = new SeatAllocationService(prisma);
      const count = await seatService.clearAllAllocations();

      res.status(200).json({
        success: true,
        message: `Cleared ${count} seat allocations`,
        data: { count }
      });
    } catch (error) {
      logger.error('Clear allocations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clear allocations',
        code: 'CLEAR_ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/allocations/allocate-enclosure/:enclosureLetter
   * Trigger seat allocation for a specific enclosure
   */
  static async allocateEnclosureSeats(req: Request, res: Response): Promise<void> {
    try {
      const { enclosureLetter } = req.params;
      const user = req.user as AccessTokenPayload;

      if (!enclosureLetter) {
        res.status(400).json({
          success: false,
          message: 'Enclosure letter is required',
          code: 'INVALID_ENCLOSURE'
        });
        return;
      }

      logger.info(`Seat allocation for enclosure ${enclosureLetter} triggered by user ${user.email}`);

      const seatService = new SeatAllocationService(prisma);
      const result = await seatService.allocateSeatsForEnclosure(enclosureLetter);

      res.status(200).json({
        success: true,
        message: `Seat allocation completed for enclosure ${enclosureLetter}: ${result.allocated} allocated, ${result.failed} failed`,
        data: {
          enclosure: enclosureLetter,
          allocated: result.allocated,
          failed: result.failed,
          errors: result.errors
        }
      });
    } catch (error) {
      logger.error('Enclosure allocation error:', error);
      res.status(500).json({
        success: false,
        message: 'Seat allocation failed',
        code: 'ALLOCATION_ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * DELETE /api/allocations/clear-enclosure/:enclosureLetter
   * Clear seat allocations for a specific enclosure
   */
  static async clearEnclosureAllocations(req: Request, res: Response): Promise<void> {
    try {
      const { enclosureLetter } = req.params;
      const user = req.user as AccessTokenPayload;

      if (!enclosureLetter) {
        res.status(400).json({
          success: false,
          message: 'Enclosure letter is required',
          code: 'INVALID_ENCLOSURE'
        });
        return;
      }

      logger.info(`Clear allocations for enclosure ${enclosureLetter} requested by user ${user.email}`);

      const seatService = new SeatAllocationService(prisma);
      const count = await seatService.clearEnclosureAllocations(enclosureLetter);

      res.status(200).json({
        success: true,
        message: `Cleared ${count} seat allocations from enclosure ${enclosureLetter}`,
        data: { enclosure: enclosureLetter, count }
      });
    } catch (error) {
      logger.error('Clear enclosure allocations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clear enclosure allocations',
        code: 'CLEAR_ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/allocations/:enrollmentId
   * Get seat allocation for a specific attendee
   */
  static async getSeatAllocation(req: Request, res: Response): Promise<void> {
    try {
      const { enrollmentId } = req.params;

      if (!enrollmentId) {
        res.status(400).json({
          success: false,
          message: 'Enrollment ID is required',
          code: 'INVALID_ENROLLMENT_ID'
        });
        return;
      }

      const seatService = new SeatAllocationService(prisma);
      const allocation = await seatService.getAttendeeAllocation(enrollmentId);

      if (!allocation) {
        res.status(404).json({
          success: false,
          message: 'Seat allocation not found for this attendee',
          code: 'ALLOCATION_NOT_FOUND'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Seat allocation retrieved successfully',
        data: allocation
      });
    } catch (error) {
      logger.error('Get allocation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch seat allocation',
        code: 'GET_ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/allocations/stats
   * Get allocation statistics
   */
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const seatService = new SeatAllocationService(prisma);
      const stats = await seatService.getAllocationStats();

      // Get total attendees by category
      const byCategory = await prisma.attendee.groupBy({
        by: ['assignedEnclosure'],
        where: {
          assignedEnclosure: { not: null },
          convocationEligible: true,
          convocationRegistered: true
        },
        _count: true
      });

      // Get enclosures with details
      const enclosures = await prisma.enclosure.findMany({
        include: {
          _count: {
            select: { seatAllocations: true }
          }
        }
      });

      const enclosureStats = await Promise.all(
        enclosures.map(async (enc) => {
          const totalSeats = await seatService.getTotalSeats(enc.letter);
          const allocatedSeats = enc._count.seatAllocations;
          const availableSeats = totalSeats - allocatedSeats;
          const utilizationRate =
            totalSeats > 0 ? (allocatedSeats / totalSeats) * 100 : 0;

          return {
            letter: enc.letter,
            name: enc.name || enc.letter,
            allocatedFor: enc.allocatedFor,
            totalSeats,
            allocatedSeats,
            availableSeats,
            utilizationRate: Math.round(utilizationRate * 100) / 100
          };
        })
      );

      res.status(200).json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: {
          totalAttendees: stats.totalAttendees,
          totalAllocated: stats.totalAllocated,
          totalUnallocated: stats.totalUnallocated,
          totalEnclosures: enclosures.length,
          byEnclosure: stats.byEnclosure, // Add this for the seat allocation page
          byCategory: byCategory.reduce((acc, item) => {
            acc[item.assignedEnclosure || 'UNASSIGNED'] = item._count;
            return acc;
          }, {} as Record<string, number>),
          enclosureStats
        }
      });
    } catch (error) {
      logger.error('Error fetching stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics',
        code: 'STATS_ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/allocations/enclosure/:enclosureLetter
   * Get all attendees and their seat allocations in a specific enclosure
   */
  static async getEnclosureAllocations(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { enclosureLetter } = req.params;

      if (!enclosureLetter) {
        res.status(400).json({
          success: false,
          message: 'Enclosure letter is required',
          code: 'INVALID_ENCLOSURE'
        });
        return;
      }

      // Get enclosure details
      const enclosure = await prisma.enclosure.findUnique({
        where: { letter: enclosureLetter },
        include: {
          rows: {
            orderBy: { displayOrder: 'asc' }
          }
        }
      });

      if (!enclosure) {
        res.status(404).json({
          success: false,
          message: 'Enclosure not found',
          code: 'ENCLOSURE_NOT_FOUND'
        });
        return;
      }

      // Get all allocations for this enclosure
      const allocations = await prisma.seatAllocation.findMany({
        where: { enclosureLetter },
        include: {
          attendee: {
            select: {
              enrollmentId: true,
              name: true,
              course: true,
              school: true,
              degree: true
            }
          }
        },
        orderBy: [{ rowLetter: 'asc' }, { seatNumber: 'asc' }]
      });

      // Group by row
      const rowData = enclosure.rows.map((row) => {
        const rowAllocations = allocations.filter(
          (a) => a.rowLetter === row.letter
        );

        return {
          row: row.letter,
          startSeat: row.startSeat,
          endSeat: row.endSeat,
          totalSeats: row.endSeat - row.startSeat + 1,
          allocatedSeats: rowAllocations.length,
          attendees: rowAllocations.map((a) => ({
            enrollmentId: a.attendee.enrollmentId,
            name: a.attendee.name,
            course: a.attendee.course,
            school: a.attendee.school,
            degree: a.attendee.degree,
            seat: a.seatNumber
          }))
        };
      });

      res.status(200).json({
        success: true,
        message: 'Enclosure allocations retrieved successfully',
        data: {
          enclosure: {
            letter: enclosure.letter,
            name: enclosure.name,
            allocatedFor: enclosure.allocatedFor,
            entryDirection: enclosure.entryDirection
          },
          rows: rowData,
          totalAllocations: allocations.length
        }
      });
    } catch (error) {
      logger.error('Get enclosure allocations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch enclosure allocations',
        code: 'GET_ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
