import type { Request, Response } from 'express';
import { AttendeeService } from '../services/attendee.service.js';
import { ExcelService } from '../services/excel.service.js';
import type { AccessTokenPayload } from '../utils/auth.js';
import { ExcelParser } from '../utils/excel-parser.js';
import { ExcelValidator } from '../utils/excel-validator.js';
import { logger } from '../utils/logger.js';

export class AttendeeController {
  /**
   * Create a new attendee
   * POST /api/attendees
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as AccessTokenPayload;
      const attendeeData = req.body;

      const attendee = await AttendeeService.create(attendeeData);

      logger.info(`Attendee created by user ${user.email}: ${attendee.enrollmentId}`);

      res.status(201).json({
        success: true,
        message: 'Attendee created successfully',
        data: { attendee }
      });
    } catch (error) {
      logger.error('Error in AttendeeController.create:', error);
      
      const message = error instanceof Error ? error.message : 'Failed to create attendee';
      const statusCode = message.includes('already exists') ? 409 : 500;

      res.status(statusCode).json({
        success: false,
        message,
        code: statusCode === 409 ? 'ATTENDEE_EXISTS' : 'CREATE_ERROR'
      });
    }
  }

  /**
   * Get attendee by ID
   * GET /api/attendees/:id
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Attendee ID is required',
          code: 'INVALID_ID'
        });
        return;
      }

      const attendee = await AttendeeService.getById(id);

      if (!attendee) {
        res.status(404).json({
          success: false,
          message: 'Attendee not found',
          code: 'ATTENDEE_NOT_FOUND'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Attendee retrieved successfully',
        data: { attendee }
      });
    } catch (error) {
      logger.error('Error in AttendeeController.getById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve attendee',
        code: 'RETRIEVE_ERROR'
      });
    }
  }

  /**
   * Get attendee by enrollment ID
   * GET /api/attendees/enrollment/:enrollmentId
   */
  static async getByEnrollmentId(req: Request, res: Response): Promise<void> {
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

      const attendee = await AttendeeService.getByEnrollmentId(enrollmentId);

      if (!attendee) {
        res.status(404).json({
          success: false,
          message: 'Attendee not found',
          code: 'ATTENDEE_NOT_FOUND'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Attendee retrieved successfully',
        data: { attendee }
      });
    } catch (error) {
      logger.error('Error in AttendeeController.getByEnrollmentId:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve attendee',
        code: 'RETRIEVE_ERROR'
      });
    }
  }

  /**
   * Get all attendees with filtering and pagination
   * GET /api/attendees
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = '1',
        limit = '20',
        sortBy = 'createdAt',
        sortOrder = 'desc',
        school,
        course,
        degree,
        convocationEligible,
        convocationRegistered,
        search
      } = req.query;

      const filters = {
        school: school as string,
        course: course as string,
        degree: degree as string,
        convocationEligible: convocationEligible === 'true' ? true : 
                            convocationEligible === 'false' ? false : undefined,
        convocationRegistered: convocationRegistered === 'true' ? true : 
                              convocationRegistered === 'false' ? false : undefined,
        search: search as string
      };

      const pagination = {
        page: parseInt(page as string, 10),
        limit: Math.min(parseInt(limit as string, 10), 100), // Max 100 items per page
        sortBy: sortBy as string,
        sortOrder: (sortOrder as string) === 'asc' ? 'asc' as const : 'desc' as const
      };

      const result = await AttendeeService.getAll(filters, pagination);

      res.json({
        success: true,
        message: 'Attendees retrieved successfully',
        data: result
      });
    } catch (error) {
      logger.error('Error in AttendeeController.getAll:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve attendees',
        code: 'RETRIEVE_ERROR'
      });
    }
  }

  /**
   * Update attendee
   * PUT /api/attendees/:id
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as AccessTokenPayload;
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Attendee ID is required',
          code: 'INVALID_ID'
        });
        return;
      }

      const attendee = await AttendeeService.update(id, updateData);

      logger.info(`Attendee updated by user ${user.email}: ${attendee.enrollmentId}`);

      res.json({
        success: true,
        message: 'Attendee updated successfully',
        data: { attendee }
      });
    } catch (error) {
      logger.error('Error in AttendeeController.update:', error);
      
      const message = error instanceof Error ? error.message : 'Failed to update attendee';
      const statusCode = message.includes('not found') ? 404 :
                        message.includes('already exists') ? 409 : 500;

      res.status(statusCode).json({
        success: false,
        message,
        code: statusCode === 404 ? 'ATTENDEE_NOT_FOUND' :
              statusCode === 409 ? 'ATTENDEE_EXISTS' : 'UPDATE_ERROR'
      });
    }
  }

  /**
   * Delete attendee
   * DELETE /api/attendees/:id
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as AccessTokenPayload;
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Attendee ID is required',
          code: 'INVALID_ID'
        });
        return;
      }

      await AttendeeService.delete(id);

      logger.info(`Attendee deleted by user ${user.email}: ${id}`);

      res.json({
        success: true,
        message: 'Attendee deleted successfully'
      });
    } catch (error) {
      logger.error('Error in AttendeeController.delete:', error);
      
      const message = error instanceof Error ? error.message : 'Failed to delete attendee';
      const statusCode = message.includes('not found') ? 404 : 500;

      res.status(statusCode).json({
        success: false,
        message,
        code: statusCode === 404 ? 'ATTENDEE_NOT_FOUND' : 'DELETE_ERROR'
      });
    }
  }

  /**
   * Bulk create attendees
   * POST /api/attendees/bulk
   */
  static async bulkCreate(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as AccessTokenPayload;
      const { attendees } = req.body;

      if (!Array.isArray(attendees) || attendees.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid request: attendees array is required',
          code: 'INVALID_REQUEST'
        });
        return;
      }

      const result = await AttendeeService.bulkCreate(attendees, {
        skipDuplicates: false,
        updateExisting: false
      });

      logger.info(`Bulk attendee creation by user ${user.email}: ${result.summary.successful} created, ${result.results.errors.length} errors`);

      res.status(201).json({
        success: true,
        message: `Bulk creation completed: ${result.summary.successful} attendees created`,
        data: result
      });
    } catch (error) {
      logger.error('Error in AttendeeController.bulkCreate:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to bulk create attendees',
        code: 'BULK_CREATE_ERROR'
      });
    }
  }

  /**
   * Get attendee statistics
   * GET /api/attendees/statistics
   */
  static async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const statistics = await AttendeeService.getStatistics();

      res.json({
        success: true,
        message: 'Attendee statistics retrieved successfully',
        data: { statistics }
      });
    } catch (error) {
      logger.error('Error in AttendeeController.getStatistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve attendee statistics',
        code: 'STATISTICS_ERROR'
      });
    }
  }

  /**
   * Upload Excel file with attendee data
   * POST /api/attendees/upload
   */
  static async uploadExcel(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as AccessTokenPayload;
      const file = req.file;
      const options = {
        skipDuplicates: req.body.skipDuplicates === 'true',
        updateExisting: req.body.updateExisting === 'true',
        validateOnly: req.body.validateOnly === 'true'
      };
      
      logger.info(`Upload options: ${JSON.stringify(options)}, body: ${JSON.stringify(req.body)}`);
      
      if (!file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded',
          code: 'NO_FILE'
        });
        return;
      }
      
      // Parse Excel file
      const parsedData = ExcelParser.parse(file.buffer);
      
      logger.info(`Parsed ${parsedData.length} rows from Excel file`);
      
      // Validate data
      const validation = ExcelValidator.validate(parsedData);
      
      if (!validation.valid) {
        // Limit the number of errors to send back (for large files)
        const maxErrorsToShow = 50;
        const limitedErrors = validation.errors.slice(0, maxErrorsToShow);
        const totalErrors = validation.errors.length;
        
        logger.error(`Validation failed with ${totalErrors} errors. First few errors:`, 
          JSON.stringify(limitedErrors.slice(0, 5), null, 2));
        
        res.status(400).json({
          success: false,
          message: `Validation failed with ${totalErrors} errors`,
          code: 'VALIDATION_ERROR',
          data: { 
            errors: limitedErrors,
            totalErrors: totalErrors,
            errorsShown: limitedErrors.length
          }
        });
        return;
      }
      
      // If validation only, return here
      if (options.validateOnly) {
        res.json({
          success: true,
          message: 'Validation successful',
          data: {
            rowCount: parsedData.length,
            validRows: parsedData.length - validation.errors.length
          }
        });
        return;
      }
      
      // Process upload
      const result = await AttendeeService.bulkCreate(
        parsedData.map(row => ({
          ...row,
          email: row.email || '', // Provide default empty string if email is missing
          assignedEnclosure: row.enclosure // Map enclosure to assignedEnclosure
        })),
        options
      );
      
      logger.info(
        `Bulk upload by ${user.email}: ${result.summary.successful} successful, ${result.summary.failed} failed`
      );
      
      res.json({
        success: true,
        message: 'Upload processed successfully',
        data: result
      });
    } catch (error) {
      logger.error('Error in AttendeeController.uploadExcel:', error);
      
      res.status(500).json({
        success: false,
        message: 'Failed to process upload',
        code: 'UPLOAD_ERROR'
      });
    }
  }

  /**
   * Download Excel template
   * GET /api/attendees/upload/template
   */
  static async downloadTemplate(req: Request, res: Response): Promise<void> {
    try {
      const buffer = await ExcelService.generateTemplate();
      
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=student_upload_template.xlsx'
      );
      
      res.send(buffer);
    } catch (error) {
      logger.error('Error in AttendeeController.downloadTemplate:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate template',
        code: 'TEMPLATE_ERROR'
      });
    }
  }

  /**
   * Search attendees by enrollment ID or name
   * GET /api/attendees/search?q=<query>
   */
  static async search(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Search query is required',
          code: 'INVALID_QUERY'
        });
        return;
      }

      // Search by enrollment ID or name (case-insensitive)
      const results = await AttendeeService.search(q);

      res.status(200).json({
        success: true,
        message: `Found ${results.length} attendee(s)`,
        data: { results }
      });
    } catch (error) {
      logger.error('Error in AttendeeController.search:', error);
      res.status(500).json({
        success: false,
        message: 'Search failed',
        code: 'SEARCH_ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Public endpoint to search for seat allocation by identifier (enrollment ID or CRR)
   * GET /api/attendees/public/search-by/:identifier
   */
  static async publicSearchByIdentifier(req: Request, res: Response): Promise<void> {
    try {
      const { identifier } = req.params;
      
      logger.info(`Public search request for identifier: ${identifier}`);

      if (!identifier) {
        res.status(400).json({
          success: false,
          message: 'Enrollment ID or CRR is required',
          code: 'INVALID_IDENTIFIER'
        });
        return;
      }

      const attendee = await AttendeeService.getByIdentifierWithSeat(identifier);
      
      logger.info(`Attendee lookup result: ${attendee ? 'Found' : 'Not found'}`);

      if (!attendee) {
        res.status(404).json({
          success: false,
          message: 'No record found for this enrollment ID or CRR',
          code: 'ATTENDEE_NOT_FOUND'
        });
        return;
      }

      // Return public information only
      const attendeeWithAllocation = attendee as any;
      res.json({
        success: true,
        message: 'Attendee found',
        data: {
          enrollmentId: attendeeWithAllocation.enrollmentId,
          name: attendeeWithAllocation.name,
          course: attendeeWithAllocation.course,
          school: attendeeWithAllocation.school,
          degree: attendeeWithAllocation.degree,
          convocationEligible: attendeeWithAllocation.convocationEligible,
          convocationRegistered: attendeeWithAllocation.convocationRegistered,
          crr: attendeeWithAllocation.crr,
          allocation: attendeeWithAllocation.allocation ? {
            enclosure: attendeeWithAllocation.allocation.enclosureLetter,
            row: attendeeWithAllocation.allocation.rowLetter,
            seat: attendeeWithAllocation.allocation.seatNumber,
            allocatedAt: attendeeWithAllocation.allocation.allocatedAt
          } : null,
          hasVerificationToken: !!attendeeWithAllocation.verificationToken
        }
      });
    } catch (error) {
      logger.error('Error in AttendeeController.publicSearchByIdentifier:', error);
      res.status(500).json({
        success: false,
        message: 'Search failed',
        code: 'SEARCH_ERROR'
      });
    }
  }

  /**
   * Public endpoint to search for seat allocation by enrollment ID
   * GET /api/attendees/public/search/:enrollmentId
   */
  static async publicSearch(req: Request, res: Response): Promise<void> {
    try {
      const { enrollmentId } = req.params;
      
      logger.info(`Public search request for enrollment ID: ${enrollmentId}`);

      if (!enrollmentId) {
        res.status(400).json({
          success: false,
          message: 'Enrollment ID is required',
          code: 'INVALID_ENROLLMENT_ID'
        });
        return;
      }

      const attendee = await AttendeeService.getByEnrollmentIdWithSeat(enrollmentId);
      
      logger.info(`Attendee lookup result: ${attendee ? 'Found' : 'Not found'}`);

      if (!attendee) {
        res.status(404).json({
          success: false,
          message: 'No record found for this enrollment ID',
          code: 'ATTENDEE_NOT_FOUND'
        });
        return;
      }

      // Return public information only (cast to any for allocation property)
      // Note: verificationToken is excluded for security, must be fetched via CRR verification
      const attendeeWithAllocation = attendee as any;
      res.json({
        success: true,
        message: 'Attendee found',
        data: {
          enrollmentId: attendeeWithAllocation.enrollmentId,
          name: attendeeWithAllocation.name,
          course: attendeeWithAllocation.course,
          school: attendeeWithAllocation.school,
          degree: attendeeWithAllocation.degree,
          convocationEligible: attendeeWithAllocation.convocationEligible,
          convocationRegistered: attendeeWithAllocation.convocationRegistered,
          crr: attendeeWithAllocation.crr, // Include CRR for verification
          allocation: attendeeWithAllocation.allocation ? {
            enclosure: attendeeWithAllocation.allocation.enclosureLetter,
            row: attendeeWithAllocation.allocation.rowLetter,
            seat: attendeeWithAllocation.allocation.seatNumber,
            allocatedAt: attendeeWithAllocation.allocation.allocatedAt
          } : null,
          hasVerificationToken: !!attendeeWithAllocation.verificationToken // Indicate if QR is available
        }
      });
    } catch (error) {
      logger.error('Error in AttendeeController.publicSearch:', error);
      res.status(500).json({
        success: false,
        message: 'Search failed',
        code: 'SEARCH_ERROR'
      });
    }
  }

  /**
   * Verify attendee CRR and return verification token for QR code
   * POST /api/attendees/public/verify-crr
   */
  static async verifyCrrAndGetToken(req: Request, res: Response): Promise<void> {
    try {
      const { enrollmentId, crr } = req.body;

      if (!enrollmentId || !crr) {
        res.status(400).json({
          success: false,
          message: 'Enrollment ID and CRR number are required',
          code: 'INVALID_REQUEST'
        });
        return;
      }

      logger.info(`CRR verification request for enrollment ID: ${enrollmentId}`);

      const attendee = await AttendeeService.getByEnrollmentIdWithSeat(enrollmentId);

      if (!attendee) {
        res.status(404).json({
          success: false,
          message: 'No record found for this enrollment ID',
          code: 'ATTENDEE_NOT_FOUND'
        });
        return;
      }

      // Verify CRR matches
      if (attendee.crr !== crr) {
        logger.warn(`CRR verification failed for enrollment ID: ${enrollmentId}`);
        res.status(401).json({
          success: false,
          message: 'Invalid CRR number. Please check your CRR number and try again.',
          code: 'INVALID_CRR'
        });
        return;
      }

      // CRR verified successfully, return verification token
      logger.info(`CRR verification successful for enrollment ID: ${enrollmentId}`);
      res.json({
        success: true,
        message: 'CRR verified successfully',
        data: {
          verificationToken: attendee.verificationToken,
          verified: true
        }
      });
    } catch (error) {
      logger.error('Error in AttendeeController.verifyCrrAndGetToken:', error);
      res.status(500).json({
        success: false,
        message: 'Verification failed',
        code: 'VERIFICATION_ERROR'
      });
    }
  }

  /**
   * Verify ticket and mark attendance
   * POST /api/attendees/verify-ticket
   */
  static async verifyTicket(req: Request, res: Response): Promise<void> {
    try {
      const { token, verifyOnly } = req.body;

      if (!token) {
        res.status(400).json({
          success: false,
          message: 'Verification token is required',
          code: 'INVALID_TOKEN'
        });
        return;
      }

      // If verifyOnly is true, just verify the token without marking attendance
      const result = await AttendeeService.verifyAndMarkAttendance(token, verifyOnly === true);

      if (!result.success) {
        res.status(404).json({
          success: false,
          message: result.message,
          code: 'VERIFICATION_FAILED'
        });
        return;
      }

      res.json({
        success: true,
        message: result.message,
        data: {
          attendee: {
            enrollmentId: result.attendee?.enrollmentId,
            name: result.attendee?.name,
            course: result.attendee?.course,
            school: result.attendee?.school,
            allocation: result.attendee?.allocation,
            attendanceMarked: result.attendee?.attendanceMarked,
            attendanceMarkedAt: result.attendee?.attendanceMarkedAt
          },
          alreadyMarked: result.alreadyMarked
        }
      });
    } catch (error) {
      logger.error('Error in AttendeeController.verifyTicket:', error);
      res.status(500).json({
        success: false,
        message: 'Verification failed',
        code: 'VERIFICATION_ERROR'
      });
    }
  }

  /**
   * Verify by enrollment ID and mark attendance
   * POST /api/attendees/verify-by-enrollment
   */
  static async verifyByEnrollment(req: Request, res: Response): Promise<void> {
    try {
      const { enrollmentId, verifyOnly } = req.body;

      if (!enrollmentId) {
        res.status(400).json({
          success: false,
          message: 'Enrollment ID is required',
          code: 'INVALID_ENROLLMENT_ID'
        });
        return;
      }

      // If verifyOnly is true, just verify the enrollment without marking attendance
      const result = await AttendeeService.verifyAndMarkAttendanceByEnrollment(enrollmentId, verifyOnly === true);

      if (!result.success) {
        res.status(404).json({
          success: false,
          message: result.message,
          code: 'VERIFICATION_FAILED'
        });
        return;
      }

      res.json({
        success: true,
        message: result.message,
        data: {
          attendee: {
            enrollmentId: result.attendee?.enrollmentId,
            name: result.attendee?.name,
            course: result.attendee?.course,
            school: result.attendee?.school,
            allocation: result.attendee?.allocation,
            attendanceMarked: result.attendee?.attendanceMarked,
            attendanceMarkedAt: result.attendee?.attendanceMarkedAt
          },
          alreadyMarked: result.alreadyMarked
        }
      });
    } catch (error) {
      logger.error('Error in AttendeeController.verifyByEnrollment:', error);
      res.status(500).json({
        success: false,
        message: 'Verification failed',
        code: 'VERIFICATION_ERROR'
      });
    }
  }
}


