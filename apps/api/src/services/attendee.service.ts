import type { Attendee, Prisma } from '../lib/prisma.js';
import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';

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
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row) continue;
      
      const rowNumber = i + 2; // +2 for header and 0-indexing
      
      try {
        // Check for existing attendee
        const existing = await prisma.attendee.findUnique({
          where: { enrollmentId: row.enrollmentId }
        });
        
        if (existing) {
          if (options.updateExisting) {
            // Update existing record
            const updateData = {
              ...row,
              assignedEnclosure: row.assignedEnclosure || row.enclosure,
              enclosure: undefined
            };
            const updated = await prisma.attendee.update({
              where: { enrollmentId: row.enrollmentId },
              data: updateData,
              include: {
                account: true,
                allocation: true
              }
            });
            results.results.imported.push(updated);
            results.summary.successful++;
          } else if (options.skipDuplicates) {
            // Skip duplicate
            results.summary.skipped++;
          } else {
            // Report as error
            results.results.errors.push({
              row: rowNumber,
              data: row,
              error: `Duplicate enrollment ID: ${row.enrollmentId}`
            });
            results.summary.failed++;
          }
        } else {
          // Create new record
          const createData = {
            ...row,
            assignedEnclosure: row.assignedEnclosure || row.enclosure,
            enclosure: undefined
          };
          const created = await prisma.attendee.create({
            data: createData,
            include: {
              account: true,
              allocation: true
            }
          });
          results.results.imported.push(created);
          results.summary.successful++;
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
        byCourse: byCourse.reduce((acc, item) => ({ ...acc, [item.course]: item._count.course }), {}),
        byDegree: byDegree.reduce((acc, item) => ({ ...acc, [item.degree]: item._count.degree }), {})
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
    course: string;
    school: string;
    degree: string;
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
}

