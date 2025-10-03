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
      
      // Validate data
      const validation = ExcelValidator.validate(parsedData);
      
      if (!validation.valid) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          data: { errors: validation.errors }
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
        parsedData,
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
}
