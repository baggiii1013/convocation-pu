import type { Attendance, AttendanceStatus, Prisma, VerificationMethod } from '../lib/prisma.js';
import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';

export interface AttendanceCreateInput {
  attendeeId: string;
  convocationId?: string;
  status?: AttendanceStatus;
  verificationMethod: VerificationMethod;
  checkInTime?: Date;
  checkOutTime?: Date;
  location?: string;
  confirmedBy?: string;
  confirmedByName?: string;
  notes?: string;
  seatInfo?: Record<string, any>;
}

export interface AttendanceUpdateInput {
  status?: AttendanceStatus;
  verificationMethod?: VerificationMethod;
  checkInTime?: Date;
  checkOutTime?: Date;
  location?: string;
  confirmedBy?: string;
  confirmedByName?: string;
  notes?: string;
}

export interface AttendanceFilters {
  attendeeId?: string;
  convocationId?: string;
  status?: AttendanceStatus;
  verificationMethod?: VerificationMethod;
  confirmedBy?: string;
  location?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class AttendanceService {
  /**
   * Create a new attendance record
   */
  static async create(data: AttendanceCreateInput): Promise<Attendance> {
    try {
      logger.info('Creating attendance record', { attendeeId: data.attendeeId });

      // Get attendee with allocation for seat info
      const attendee = await prisma.attendee.findUnique({
        where: { id: data.attendeeId },
        include: { allocation: true }
      });

      if (!attendee) {
        throw new Error('Attendee not found');
      }

      // Prepare seat info if not provided
      const seatInfo = data.seatInfo || (attendee.allocation ? {
        enclosure: attendee.allocation.enclosureLetter,
        row: attendee.allocation.rowLetter,
        seat: attendee.allocation.seatNumber
      } : undefined);

      // Create attendance record
      const attendance = await prisma.attendance.create({
        data: {
          attendeeId: data.attendeeId,
          convocationId: data.convocationId,
          status: data.status || 'PRESENT',
          verificationMethod: data.verificationMethod,
          checkInTime: data.checkInTime || new Date(),
          checkOutTime: data.checkOutTime,
          location: data.location,
          confirmedBy: data.confirmedBy,
          confirmedByName: data.confirmedByName,
          notes: data.notes,
          seatInfo: seatInfo as any
        },
        include: {
          attendee: {
            select: {
              id: true,
              enrollmentId: true,
              name: true,
              email: true,
              phone: true,
              school: true,
              course: true,
              degree: true
            }
          },
          convocation: {
            select: {
              id: true,
              title: true,
              eventDate: true,
              venue: true
            }
          },
          confirmer: {
            select: {
              id: true,
              email: true,
              displayName: true,
              role: true
            }
          }
        }
      });

      logger.info(`Attendance record created successfully: ${attendance.id}`);
      return attendance;
    } catch (error) {
      logger.error('Error creating attendance record:', error);
      throw error;
    }
  }

  /**
   * Get attendance record by ID
   */
  static async getById(id: string): Promise<Attendance | null> {
    try {
      const attendance = await prisma.attendance.findUnique({
        where: { id },
        include: {
          attendee: {
            select: {
              id: true,
              enrollmentId: true,
              name: true,
              email: true,
              phone: true,
              school: true,
              course: true,
              degree: true
            }
          },
          convocation: {
            select: {
              id: true,
              title: true,
              eventDate: true,
              venue: true
            }
          },
          confirmer: {
            select: {
              id: true,
              email: true,
              displayName: true,
              role: true
            }
          }
        }
      });

      return attendance;
    } catch (error) {
      logger.error('Error fetching attendance record:', error);
      throw error;
    }
  }

  /**
   * Get all attendance records with filters and pagination
   */
  static async getAll(
    filters: AttendanceFilters,
    pagination: PaginationOptions
  ) {
    try {
      const { page, limit, sortBy = 'markedAt', sortOrder = 'desc' } = pagination;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: Prisma.AttendanceWhereInput = {};

      if (filters.attendeeId) {
        where.attendeeId = filters.attendeeId;
      }

      if (filters.convocationId) {
        where.convocationId = filters.convocationId;
      }

      if (filters.status) {
        where.status = filters.status;
      }

      if (filters.verificationMethod) {
        where.verificationMethod = filters.verificationMethod;
      }

      if (filters.confirmedBy) {
        where.confirmedBy = filters.confirmedBy;
      }

      if (filters.location) {
        where.location = {
          contains: filters.location,
          mode: 'insensitive'
        };
      }

      // Date range filter
      if (filters.fromDate || filters.toDate) {
        where.markedAt = {};
        if (filters.fromDate) {
          where.markedAt.gte = filters.fromDate;
        }
        if (filters.toDate) {
          where.markedAt.lte = filters.toDate;
        }
      }

      // Get total count
      const total = await prisma.attendance.count({ where });

      // Get paginated records
      const attendances = await prisma.attendance.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          attendee: {
            select: {
              id: true,
              enrollmentId: true,
              name: true,
              email: true,
              phone: true,
              school: true,
              course: true,
              degree: true
            }
          },
          convocation: {
            select: {
              id: true,
              title: true,
              eventDate: true,
              venue: true
            }
          },
          confirmer: {
            select: {
              id: true,
              email: true,
              displayName: true,
              role: true
            }
          }
        }
      });

      return {
        data: attendances,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching attendance records:', error);
      throw error;
    }
  }

  /**
   * Update attendance record
   */
  static async update(
    id: string,
    data: AttendanceUpdateInput
  ): Promise<Attendance> {
    try {
      logger.info('Updating attendance record', { id });

      const attendance = await prisma.attendance.update({
        where: { id },
        data,
        include: {
          attendee: {
            select: {
              id: true,
              enrollmentId: true,
              name: true,
              email: true,
              phone: true,
              school: true,
              course: true,
              degree: true
            }
          },
          convocation: {
            select: {
              id: true,
              title: true,
              eventDate: true,
              venue: true
            }
          },
          confirmer: {
            select: {
              id: true,
              email: true,
              displayName: true,
              role: true
            }
          }
        }
      });

      logger.info(`Attendance record updated successfully: ${id}`);
      return attendance;
    } catch (error) {
      logger.error('Error updating attendance record:', error);
      throw error;
    }
  }

  /**
   * Delete attendance record
   */
  static async delete(id: string): Promise<void> {
    try {
      logger.info('Deleting attendance record', { id });

      const attendance = await prisma.attendance.findUnique({
        where: { id }
      });

      if (!attendance) {
        throw new Error('Attendance record not found');
      }

      await prisma.attendance.delete({
        where: { id }
      });

      logger.info(`Attendance record deleted successfully: ${id}`);
    } catch (error) {
      logger.error('Error deleting attendance record:', error);
      throw error;
    }
  }

  /**
   * Get attendance history for a specific attendee
   */
  static async getAttendeeHistory(
    attendeeId: string,
    convocationId?: string,
    pagination?: PaginationOptions
  ) {
    try {
      const { page = 1, limit = 10 } = pagination || {};
      const skip = (page - 1) * limit;

      const where: Prisma.AttendanceWhereInput = { attendeeId };
      if (convocationId) {
        where.convocationId = convocationId;
      }

      const total = await prisma.attendance.count({ where });

      const attendances = await prisma.attendance.findMany({
        where,
        skip,
        take: limit,
        orderBy: { markedAt: 'desc' },
        include: {
          convocation: {
            select: {
              id: true,
              title: true,
              eventDate: true,
              venue: true
            }
          },
          confirmer: {
            select: {
              id: true,
              displayName: true,
              role: true
            }
          }
        }
      });

      return {
        data: attendances,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching attendee history:', error);
      throw error;
    }
  }

  /**
   * Mark attendance by QR code verification token
   */
  static async markByQRCode(
    verificationToken: string,
    location?: string,
    confirmedBy?: string,
    confirmedByName?: string,
    convocationId?: string
  ): Promise<Attendance> {
    try {
      logger.info('Marking attendance by QR code', { verificationToken });

      // Find attendee by verification token
      const attendee = await prisma.attendee.findFirst({
        where: { verificationToken },
        include: { allocation: true }
      });

      if (!attendee) {
        throw new Error('Invalid verification token');
      }

      // Check if already marked for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const existingAttendance = await prisma.attendance.findFirst({
        where: {
          attendeeId: attendee.id,
          markedAt: {
            gte: today,
            lt: tomorrow
          }
        }
      });

      if (existingAttendance) {
        throw new Error('Attendance already marked for today');
      }

      // Create attendance record
      return await this.create({
        attendeeId: attendee.id,
        convocationId,
        status: 'PRESENT',
        verificationMethod: 'QR_SCAN',
        checkInTime: new Date(),
        location,
        confirmedBy,
        confirmedByName
      });
    } catch (error) {
      logger.error('Error marking attendance by QR code:', error);
      throw error;
    }
  }

  /**
   * Bulk mark attendance
   */
  static async bulkMark(
    attendances: Array<{
      attendeeId: string;
      status?: AttendanceStatus;
      verificationMethod: VerificationMethod;
      location?: string;
      notes?: string;
    }>,
    convocationId?: string,
    confirmedBy?: string,
    confirmedByName?: string
  ) {
    try {
      logger.info('Bulk marking attendance', { count: attendances.length });

      const results = {
        success: [] as string[],
        failed: [] as { attendeeId: string; error: string }[]
      };

      for (const attendance of attendances) {
        try {
          const created = await this.create({
            attendeeId: attendance.attendeeId,
            convocationId,
            status: attendance.status || 'PRESENT',
            verificationMethod: attendance.verificationMethod,
            checkInTime: new Date(),
            location: attendance.location,
            confirmedBy,
            confirmedByName,
            notes: attendance.notes
          });
          results.success.push(created.id);
        } catch (error: any) {
          results.failed.push({
            attendeeId: attendance.attendeeId,
            error: error.message
          });
        }
      }

      logger.info('Bulk attendance marking completed', {
        success: results.success.length,
        failed: results.failed.length
      });

      return results;
    } catch (error) {
      logger.error('Error bulk marking attendance:', error);
      throw error;
    }
  }

  /**
   * Get attendance statistics
   * Computes absent count based on registered attendees with seat allocations minus those who checked in
   */
  static async getStatistics(
    convocationId?: string,
    fromDate?: Date,
    toDate?: Date
  ) {
    try {
      const where: Prisma.AttendanceWhereInput = {};

      if (convocationId) {
        where.convocationId = convocationId;
      }

      if (fromDate || toDate) {
        where.markedAt = {};
        if (fromDate) where.markedAt.gte = fromDate;
        if (toDate) where.markedAt.lte = toDate;
      }

      // Count attendance records by status (within any provided date range / convocation filter)
      const [
        present,
        late,
        excused,
        byVerificationMethod,
        attendanceRecordsCount,
        registeredWithSeatsCount
      ] = await Promise.all([
        prisma.attendance.count({ where: { ...where, status: 'PRESENT' } }),
        prisma.attendance.count({ where: { ...where, status: 'LATE' } }),
        prisma.attendance.count({ where: { ...where, status: 'EXCUSED' } }),
        prisma.attendance.groupBy({
          by: ['verificationMethod'],
          where,
          _count: true
        }),
        // total attendance records matching filters (for backwards compatibility / raw counts)
        prisma.attendance.count({ where }),
        // number of expected/registered attendees WITH SEAT ALLOCATIONS for convocation (used to compute absentees)
        prisma.attendee.count({ 
          where: { 
            convocationRegistered: true,
            allocation: {
              isNot: null
            }
          } 
        })
      ]);

      // Compute absent as registered attendees with seats minus those who have any present-like attendance
      const presentLike = present + late + excused;

      // Only count attendees who have seat allocations as the total
      const total = registeredWithSeatsCount > 0 ? registeredWithSeatsCount : attendanceRecordsCount;

      const absent = registeredWithSeatsCount > 0 ? Math.max(0, registeredWithSeatsCount - presentLike) : (
        // If there is no registered attendee data, fall back to counting explicit ABSENT records
        await prisma.attendance.count({ where: { ...where, status: 'ABSENT' } })
      );

      return {
        total,
        byStatus: {
          present,
          absent,
          late,
          excused
        },
        byVerificationMethod: byVerificationMethod.reduce((acc, item) => {
          acc[item.verificationMethod] = item._count;
          return acc;
        }, {} as Record<string, number>)
      };
    } catch (error) {
      logger.error('Error fetching attendance statistics:', error);
      throw error;
    }
  }
}
