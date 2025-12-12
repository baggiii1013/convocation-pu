import type { Attendee, Prisma } from '../lib/prisma.js';
import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';
import { AttendanceService } from './attendance.service.js';

export interface AttendeeCreateInput {
  enrollmentId: string;
  name: string;
  course: string;
  school: string;
  degree: string;
  email: string; // Required in schema
  phone?: string;
  convocationEligible?: boolean;
  convocationRegistered?: boolean;
  assignedEnclosure?: string;
  enclosure?: string; // Legacy support for Excel uploads
  crr: string;
}

export interface AttendeeUpdateInput {
  enrollmentId?: string;
  name?: string;
  course?: string;
  school?: string;
  degree?: string;
  email?: string;
  phone?: string;
  convocationEligible?: boolean;
  convocationRegistered?: boolean;
  assignedEnclosure?: string;
  crr?: string;
}

export interface AttendeeFilters {
  school?: string;
  course?: string;
  degree?: string;
  convocationEligible?: boolean;
  convocationRegistered?: boolean;
  search?: string; // Search by name, enrollmentId, or email
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class AttendeeService {
  /**
   * Create a new attendee
   */
  static async create(data: AttendeeCreateInput): Promise<Attendee> {
    try {
      logger.info(`Creating attendee: ${data.enrollmentId}`);

      // Check if enrollmentId already exists
      const existingAttendee = await prisma.attendee.findUnique({
        where: { enrollmentId: data.enrollmentId }
      });

      if (existingAttendee) {
        throw new Error(`Attendee with enrollment ID ${data.enrollmentId} already exists`);
      }

      // Map enclosure to assignedEnclosure for backwards compatibility
      const createData = {
        ...data,
        assignedEnclosure: data.assignedEnclosure || data.enclosure,
        enclosure: undefined // Remove the legacy field
      };

      const attendee = await prisma.attendee.create({
        data: createData,
        include: {
          account: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true
            }
          },
          allocation: true
        }
      });

      logger.info(`Attendee created successfully: ${attendee.id}`);
      return attendee;
    } catch (error) {
      logger.error('Error creating attendee:', error);
      throw error;
    }
  }

  /**
   * Get attendee by ID
   */
  static async getById(id: string): Promise<Attendee | null> {
    try {
      const attendee = await prisma.attendee.findUnique({
        where: { id },
        include: {
          account: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true
            }
          },
          allocation: true
        }
      });

      return attendee;
    } catch (error) {
      logger.error(`Error getting attendee by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get attendee by enrollment ID
   */
  static async getByEnrollmentId(enrollmentId: string): Promise<Attendee | null> {
    try {
      const attendee = await prisma.attendee.findUnique({
        where: { enrollmentId },
        include: {
          account: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true
            }
          },
          allocation: true
        }
      });

      return attendee;
    } catch (error) {
      logger.error(`Error getting attendee by enrollment ID ${enrollmentId}:`, error);
      throw error;
    }
  }

  /**
   * Get all attendees with filtering, pagination, and sorting
   */
  static async getAll(
    filters: AttendeeFilters = {}, 
    pagination: PaginationOptions = {}
  ): Promise<{
    attendees: Attendee[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    try {
      const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
      const skip = (page - 1) * limit;

      // Build where clause for filtering
      const where: Prisma.AttendeeWhereInput = {};

      if (filters.school) {
        where.school = { contains: filters.school, mode: 'insensitive' };
      }

      if (filters.course) {
        where.course = { contains: filters.course, mode: 'insensitive' };
      }

      if (filters.degree) {
        where.degree = { contains: filters.degree, mode: 'insensitive' };
      }

      if (filters.convocationEligible !== undefined) {
        where.convocationEligible = filters.convocationEligible;
      }

      if (filters.convocationRegistered !== undefined) {
        where.convocationRegistered = filters.convocationRegistered;
      }

      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { enrollmentId: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } }
        ];
      }

      // Build orderBy clause
      const orderBy: Prisma.AttendeeOrderByWithRelationInput = 
        sortBy === 'name' ? { name: sortOrder } :
        sortBy === 'enrollmentId' ? { enrollmentId: sortOrder } :
        sortBy === 'school' ? { school: sortOrder } :
        sortBy === 'course' ? { course: sortOrder } :
        sortBy === 'degree' ? { degree: sortOrder } :
        sortBy === 'convocationEligible' ? { convocationEligible: sortOrder } :
        sortBy === 'convocationRegistered' ? { convocationRegistered: sortOrder } :
        sortBy === 'updatedAt' ? { updatedAt: sortOrder } :
        { createdAt: sortOrder }; // default

      // Get attendees with pagination
      const [attendees, totalCount] = await Promise.all([
        prisma.attendee.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            account: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true
              }
            },
            allocation: true
          }
        }),
        prisma.attendee.count({ where })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      logger.info(`Retrieved ${attendees.length} attendees (page ${page}/${totalPages})`);

      return {
        attendees,
        totalCount,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      logger.error('Error getting attendees:', error);
      throw error;
    }
  }

  /**
   * Update attendee
   */
  static async update(id: string, data: AttendeeUpdateInput): Promise<Attendee> {
    try {
      logger.info(`Updating attendee: ${id}`);

      // Check if attendee exists
      const existingAttendee = await prisma.attendee.findUnique({
        where: { id }
      });

      if (!existingAttendee) {
        throw new Error(`Attendee with ID ${id} not found`);
      }

      // Check if enrollmentId is being updated and if it already exists
      if (data.enrollmentId && data.enrollmentId !== existingAttendee.enrollmentId) {
        const duplicateAttendee = await prisma.attendee.findUnique({
          where: { enrollmentId: data.enrollmentId }
        });

        if (duplicateAttendee) {
          throw new Error(`Attendee with enrollment ID ${data.enrollmentId} already exists`);
        }
      }

      const attendee = await prisma.attendee.update({
        where: { id },
        data,
        include: {
          account: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true
            }
          },
          allocation: true
        }
      });

      logger.info(`Attendee updated successfully: ${attendee.id}`);
      return attendee;
    } catch (error) {
      logger.error(`Error updating attendee ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete attendee
   */
  static async delete(id: string): Promise<void> {
    try {
      logger.info(`Deleting attendee: ${id}`);

      // Check if attendee exists
      const existingAttendee = await prisma.attendee.findUnique({
        where: { id }
      });

      if (!existingAttendee) {
        throw new Error(`Attendee with ID ${id} not found`);
      }

      await prisma.attendee.delete({
        where: { id }
      });

      logger.info(`Attendee deleted successfully: ${id}`);
    } catch (error) {
      logger.error(`Error deleting attendee ${id}:`, error);
      throw error;
    }
  }

  /**
   * Bulk create attendees from Excel upload
   */
  static async bulkCreate(
    data: AttendeeCreateInput[],
    options: {
      skipDuplicates: boolean;
      updateExisting: boolean;
    }
  ): Promise<{
    summary: {
      totalRows: number;
      successful: number;
      skipped: number;
      failed: number;
    };
    results: {
      imported: Attendee[];
      errors: {
        row: number;
        data: any;
        error: string;
      }[];
    };
  }> {
    const results = {
      summary: {
        totalRows: data.length,
        successful: 0,
        skipped: 0,
        failed: 0
      },
      results: {
        imported: [] as Attendee[],
        errors: [] as any[]
      }
    };

    // Batch size for processing to avoid memory issues
    const BATCH_SIZE = 200;
    
    try {
      // Get all enrollment IDs from the input data
      const enrollmentIds = data.map(row => row.enrollmentId).filter(Boolean);
      
      // Fetch all existing attendees in one query
      const existingAttendees = await prisma.attendee.findMany({
        where: {
          enrollmentId: { in: enrollmentIds }
        },
        select: { enrollmentId: true }
      });
      
      // Create a Set for fast lookup
      const existingEnrollmentIds = new Set(
        existingAttendees.map(a => a.enrollmentId)
      );
      
      // Separate data into batches for create and update
      const toCreate: any[] = [];
      const toUpdate: any[] = [];
      
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (!row) continue;
        
        const rowNumber = i + 2; // +2 for header and 0-indexing
        
        try {
          const processedRow = {
            ...row,
            assignedEnclosure: row.assignedEnclosure || row.enclosure,
            enclosure: undefined
          };
          
          const exists = existingEnrollmentIds.has(row.enrollmentId);
          
          if (exists) {
            if (options.updateExisting) {
              toUpdate.push({ rowNumber, data: processedRow });
            } else if (options.skipDuplicates) {
              results.summary.skipped++;
            } else {
              results.results.errors.push({
                row: rowNumber,
                data: row,
                error: `Duplicate enrollment ID: ${row.enrollmentId}`
              });
              results.summary.failed++;
            }
          } else {
            toCreate.push({ rowNumber, data: processedRow });
          }
        } catch (error) {
          results.results.errors.push({
            row: rowNumber,
            data: row,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
          results.summary.failed++;
        }
      }
      
      // Process creates in batches
      for (let i = 0; i < toCreate.length; i += BATCH_SIZE) {
        const batch = toCreate.slice(i, i + BATCH_SIZE);
        
        try {
          // MongoDB doesn't support skipDuplicates in createMany, so we remove it
          const created = await prisma.attendee.createMany({
            data: batch.map(item => item.data)
          });
          
          results.summary.successful += created.count;
          
          // Fetch created records to return (optional, can be skipped for performance)
          if (i === 0) { // Only fetch first batch to avoid memory issues
            const createdRecords = await prisma.attendee.findMany({
              where: {
                enrollmentId: {
                  in: batch.map(item => item.data.enrollmentId)
                }
              },
              include: {
                account: true,
                allocation: true
              },
              take: 100 // Limit to avoid memory issues
            });
            results.results.imported.push(...createdRecords);
          }
        } catch (error) {
          // If batch fails, try individually to identify problematic records
          for (const item of batch) {
            try {
              const created = await prisma.attendee.create({
                data: item.data,
                include: {
                  account: true,
                  allocation: true
                }
              });
              results.results.imported.push(created);
              results.summary.successful++;
            } catch (createError) {
              results.results.errors.push({
                row: item.rowNumber,
                data: item.data,
                error: createError instanceof Error ? createError.message : 'Unknown error'
              });
              results.summary.failed++;
            }
          }
        }
      }
      
      // Process updates in batches (updates need to be done individually in Prisma)
      for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
        const batch = toUpdate.slice(i, i + BATCH_SIZE);
        
        // Use Promise.allSettled for parallel updates
        const updatePromises = batch.map(item =>
          prisma.attendee.update({
            where: { enrollmentId: item.data.enrollmentId },
            data: item.data,
            include: {
              account: true,
              allocation: true
            }
          })
          .then(updated => ({ status: 'fulfilled', value: updated, item }))
          .catch(error => ({ status: 'rejected', reason: error, item }))
        );
        
        const batchResults = await Promise.allSettled(updatePromises);
        
        for (const result of batchResults) {
          if (result.status === 'fulfilled') {
            const value = result.value as any;
            if (value.status === 'fulfilled') {
              results.results.imported.push(value.value);
              results.summary.successful++;
            } else {
              results.results.errors.push({
                row: value.item.rowNumber,
                data: value.item.data,
                error: value.reason instanceof Error ? value.reason.message : 'Unknown error'
              });
              results.summary.failed++;
            }
          }
        }
      }
      
    } catch (error) {
      logger.error('Error in bulkCreate:', error);
      throw error;
    }
    
    logger.info(`Bulk create completed: ${JSON.stringify(results.summary)}`);
    return results;
  }

  /**
   * Get attendee statistics
   */
  static async getStatistics(): Promise<{
    total: number;
    eligible: number;
    registered: number;
    bySchool: Record<string, number>;
    byCourse: Record<string, number>;
    byDegree: Record<string, number>;
  }> {
    try {
      const [
        total,
        eligible,
        registered,
        bySchool,
        byCourse,
        byDegree
      ] = await Promise.all([
        prisma.attendee.count(),
        prisma.attendee.count({ where: { convocationEligible: true } }),
        prisma.attendee.count({ where: { convocationRegistered: true } }),
        prisma.attendee.groupBy({
          by: ['school'],
          _count: { school: true }
        }),
        prisma.attendee.groupBy({
          by: ['course'],
          _count: { course: true }
        }),
        prisma.attendee.groupBy({
          by: ['degree'],
          _count: { degree: true }
        })
      ]);

      return {
        total,
        eligible,
        registered,
        bySchool: bySchool.reduce((acc, item) => ({ ...acc, [item.school]: item._count.school }), {}),
        byCourse: byCourse.reduce((acc, item) => item.course ? { ...acc, [item.course]: item._count.course } : acc, {}),
        byDegree: byDegree.reduce((acc, item) => item.degree ? { ...acc, [item.degree]: item._count.degree } : acc, {})
      };
    } catch (error) {
      logger.error('Error getting attendee statistics:', error);
      throw error;
    }
  }

  /**
   * Search attendees by enrollment ID or name
   */
  static async search(query: string): Promise<Array<{
    id: string;
    enrollmentId: string;
    name: string;
    course: string | null;
    school: string;
    degree: string | null;
    assignedEnclosure: string | null;
    allocation: {
      row: string;
      seat: number;
    } | null;
  }>> {
    try {
      const attendees = await prisma.attendee.findMany({
        where: {
          OR: [
            { enrollmentId: { contains: query, mode: 'insensitive' } },
            { name: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          allocation: {
            select: {
              rowLetter: true,
              seatNumber: true
            }
          }
        },
        take: 50 // Limit results
      });

      return attendees.map(a => ({
        id: a.id,
        enrollmentId: a.enrollmentId,
        name: a.name,
        course: a.course,
        school: a.school,
        degree: a.degree,
        assignedEnclosure: a.assignedEnclosure,
        allocation: a.allocation ? {
          row: a.allocation.rowLetter,
          seat: a.allocation.seatNumber
        } : null
      }));
    } catch (error) {
      logger.error('Error searching attendees:', error);
      throw error;
    }
  }

  /**
   * Get attendee by enrollment ID with seat allocation (for public search)
   */
  static async getByEnrollmentIdWithSeat(enrollmentId: string): Promise<Attendee | null> {
    try {
      const attendee = await prisma.attendee.findUnique({
        where: { enrollmentId },
        include: {
          allocation: true
        }
      });

      return attendee;
    } catch (error) {
      logger.error(`Error getting attendee by enrollment ID ${enrollmentId}:`, error);
      throw error;
    }
  }

  /**
   * Get attendee by identifier (enrollment ID or CRR) with seat allocation
   */
  static async getByIdentifierWithSeat(identifier: string): Promise<Attendee | null> {
    try {
      // Try to find by enrollment ID first
      let attendee = await prisma.attendee.findUnique({
        where: { enrollmentId: identifier },
        include: {
          allocation: true
        }
      });

      // If not found, try to find by CRR
      if (!attendee) {
        attendee = await prisma.attendee.findFirst({
          where: { crr: identifier },
          include: {
            allocation: true
          }
        });
      }

      return attendee;
    } catch (error) {
      logger.error(`Error getting attendee by identifier ${identifier}:`, error);
      throw error;
    }
  }

  /**
   * Verify ticket token and mark attendance
   */
  static async verifyAndMarkAttendance(token: string, verifyOnly: boolean = false): Promise<{
    success: boolean;
    message: string;
    attendee?: any;
    alreadyMarked?: boolean;
  }> {
    try {
      // Find attendee by verification token (using findFirst since verificationToken is not unique)
      const attendee = await prisma.attendee.findFirst({
        where: { verificationToken: token },
        include: {
          allocation: true
        }
      });

      if (!attendee) {
        return {
          success: false,
          message: 'Invalid verification token'
        };
      }

      // Cast to any to access allocation property
      const attendeeWithAllocation = attendee as any;

      // If verifyOnly is true, just return the attendee details without marking attendance
      if (verifyOnly) {
        return {
          success: true,
          message: 'Ticket verified successfully',
          attendee: {
            enrollmentId: attendeeWithAllocation.enrollmentId,
            name: attendeeWithAllocation.name,
            course: attendeeWithAllocation.course,
            school: attendeeWithAllocation.school,
            allocation: attendeeWithAllocation.allocation ? {
              enclosure: attendeeWithAllocation.allocation.enclosureLetter,
              row: attendeeWithAllocation.allocation.rowLetter,
              seat: attendeeWithAllocation.allocation.seatNumber
            } : null
          },
          alreadyMarked: false
        };
      }

      // Cast to any to access allocation property
      const updatedWithAllocation = attendee as any;

      // Create attendance record in the Attendance collection
      try {
        await AttendanceService.create({
          attendeeId: attendee.id,
          verificationMethod: 'QR_SCAN', // Since they're using QR code to verify
          status: 'PRESENT',
          checkInTime: new Date(),
          location: 'Self Check-in', // Default location for self-service verification
          notes: 'Verified via QR code scan',
          seatInfo: updatedWithAllocation.allocation ? {
            enclosure: updatedWithAllocation.allocation.enclosureLetter,
            row: updatedWithAllocation.allocation.rowLetter,
            seat: updatedWithAllocation.allocation.seatNumber
          } : undefined
        });
        
        logger.info(`Attendance record created for ${updatedWithAllocation.enrollmentId}`);
      } catch (attendanceError) {
        logger.error('Error creating attendance record:', attendanceError);
        // Don't fail the entire operation if attendance record creation fails
        // The attendanceMarked flag is already set, so the attendance is tracked
      }

      logger.info(`Attendance marked for ${updatedWithAllocation.enrollmentId} at ${updatedWithAllocation.attendanceMarkedAt}`);

      return {
        success: true,
        message: 'Attendance marked successfully',
        attendee: {
          enrollmentId: updatedWithAllocation.enrollmentId,
          name: updatedWithAllocation.name,
          course: updatedWithAllocation.course,
          school: updatedWithAllocation.school,
          allocation: updatedWithAllocation.allocation ? {
            enclosure: updatedWithAllocation.allocation.enclosureLetter,
            row: updatedWithAllocation.allocation.rowLetter,
            seat: updatedWithAllocation.allocation.seatNumber
          } : null
        },
        alreadyMarked: false
      };
    } catch (error) {
      logger.error('Error verifying ticket:', error);
      throw error;
    }
  }

  /**
   * Verify by enrollment ID and mark attendance
   */
  static async verifyAndMarkAttendanceByEnrollment(enrollmentId: string, verifyOnly: boolean = false): Promise<{
    success: boolean;
    message: string;
    attendee?: any;
    alreadyMarked?: boolean;
  }> {
    try {
      // Find attendee by enrollment ID
      const attendee = await prisma.attendee.findUnique({
        where: { enrollmentId: enrollmentId },
        include: {
          allocation: true
        }
      });

      if (!attendee) {
        return {
          success: false,
          message: 'No attendee found with this enrollment ID'
        };
      }

      // Cast to any to access allocation property
      const attendeeWithAllocation = attendee as any;

      // Check if attendance was already marked
      const existingAttendanceList = await AttendanceService.getAll({ attendeeId: attendee.id }, { page: 1, limit: 1 });
      if (existingAttendanceList.pagination.total > 0 && existingAttendanceList.data.length > 0) {
        const existingAttendance = existingAttendanceList.data[0];
        if (existingAttendance) {
          return {
            success: true,
            message: 'Attendance was already marked for this attendee',
            attendee: {
              enrollmentId: attendeeWithAllocation.enrollmentId,
              name: attendeeWithAllocation.name,
              course: attendeeWithAllocation.course,
              school: attendeeWithAllocation.school,
              allocation: attendeeWithAllocation.allocation ? {
                enclosure: attendeeWithAllocation.allocation.enclosureLetter,
                row: attendeeWithAllocation.allocation.rowLetter,
                seat: attendeeWithAllocation.allocation.seatNumber
              } : null,
              attendanceMarked: true,
              attendanceMarkedAt: existingAttendance.checkInTime
            },
            alreadyMarked: true
          };
        }
      }

      // If verifyOnly is true, just return the attendee details without marking attendance
      if (verifyOnly) {
        return {
          success: true,
          message: 'Student verified successfully',
          attendee: {
            enrollmentId: attendeeWithAllocation.enrollmentId,
            name: attendeeWithAllocation.name,
            course: attendeeWithAllocation.course,
            school: attendeeWithAllocation.school,
            allocation: attendeeWithAllocation.allocation ? {
              enclosure: attendeeWithAllocation.allocation.enclosureLetter,
              row: attendeeWithAllocation.allocation.rowLetter,
              seat: attendeeWithAllocation.allocation.seatNumber
            } : null,
            attendanceMarked: false,
            attendanceMarkedAt: null
          },
          alreadyMarked: false
        };
      }

      // Create attendance record in the Attendance collection
      try {
        const attendanceRecord = await AttendanceService.create({
          attendeeId: attendee.id,
          verificationMethod: 'MANUAL', // Since they're using enrollment ID to verify
          status: 'PRESENT',
          checkInTime: new Date(),
          location: 'Manual Check-in', // Manual verification by staff
          notes: 'Verified via enrollment ID',
          seatInfo: attendeeWithAllocation.allocation ? {
            enclosure: attendeeWithAllocation.allocation.enclosureLetter,
            row: attendeeWithAllocation.allocation.rowLetter,
            seat: attendeeWithAllocation.allocation.seatNumber
          } : undefined
        });
        
        logger.info(`Attendance record created for ${attendeeWithAllocation.enrollmentId}`);

        return {
          success: true,
          message: 'Attendance marked successfully',
          attendee: {
            enrollmentId: attendeeWithAllocation.enrollmentId,
            name: attendeeWithAllocation.name,
            course: attendeeWithAllocation.course,
            school: attendeeWithAllocation.school,
            allocation: attendeeWithAllocation.allocation ? {
              enclosure: attendeeWithAllocation.allocation.enclosureLetter,
              row: attendeeWithAllocation.allocation.rowLetter,
              seat: attendeeWithAllocation.allocation.seatNumber
            } : null,
            attendanceMarked: true,
            attendanceMarkedAt: attendanceRecord.checkInTime
          },
          alreadyMarked: false
        };
      } catch (attendanceError) {
        logger.error('Error creating attendance record:', attendanceError);
        // Return error for attendance creation failure
        return {
          success: false,
          message: 'Failed to mark attendance. Please try again.'
        };
      }
    } catch (error) {
      logger.error('Error verifying by enrollment ID:', error);
      throw error;
    }
  }
}


