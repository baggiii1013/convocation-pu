import type { Request, Response } from 'express';
import { AttendanceService } from '../services/attendance.service.js';
import { logger } from '../utils/logger.js';

export class AttendanceController {
  /**
   * Create a new attendance record
   */
  static async create(req: Request, res: Response) {
    try {
      const attendance = await AttendanceService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Attendance record created successfully',
        data: attendance
      });
    } catch (error: any) {
      logger.error('Error in create attendance controller:', error);
      res.status(error.message.includes('not found') ? 404 : 500).json({
        success: false,
        message: error.message || 'Failed to create attendance record',
        error: Bun.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Get attendance record by ID
   */
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Attendance ID is required'
        });
      }
      
      const attendance = await AttendanceService.getById(id);

      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: 'Attendance record not found'
        });
      }

      res.status(200).json({
        success: true,
        data: attendance
      });
    } catch (error: any) {
      logger.error('Error in get attendance by ID controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch attendance record',
        error: Bun.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Get all attendance records with filters
   */
  static async getAll(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'markedAt',
        sortOrder = 'desc',
        ...filters
      } = req.query;

      const result = await AttendanceService.getAll(
        filters as any,
        {
          page: Number(page),
          limit: Number(limit),
          sortBy: sortBy as string,
          sortOrder: sortOrder as 'asc' | 'desc'
        }
      );

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error: any) {
      logger.error('Error in get all attendances controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch attendance records',
        error: Bun.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Update attendance record
   */
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Attendance ID is required'
        });
      }
      
      const attendance = await AttendanceService.update(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Attendance record updated successfully',
        data: attendance
      });
    } catch (error: any) {
      logger.error('Error in update attendance controller:', error);
      res.status(error.message.includes('not found') ? 404 : 500).json({
        success: false,
        message: error.message || 'Failed to update attendance record',
        error: Bun.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Delete attendance record
   */
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Attendance ID is required'
        });
      }
      
      await AttendanceService.delete(id);

      res.status(200).json({
        success: true,
        message: 'Attendance record deleted successfully'
      });
    } catch (error: any) {
      logger.error('Error in delete attendance controller:', error);
      res.status(error.message.includes('not found') ? 404 : 500).json({
        success: false,
        message: error.message || 'Failed to delete attendance record',
        error: Bun.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Get attendance history for a specific attendee
   */
  static async getAttendeeHistory(req: Request, res: Response) {
    try {
      const { attendeeId } = req.params;
      const { page = 1, limit = 10, convocationId } = req.query;

      if (!attendeeId) {
        return res.status(400).json({
          success: false,
          message: 'Attendee ID is required'
        });
      }

      const result = await AttendanceService.getAttendeeHistory(
        attendeeId,
        convocationId as string,
        {
          page: Number(page),
          limit: Number(limit)
        }
      );

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error: any) {
      logger.error('Error in get attendee history controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch attendee attendance history',
        error: Bun.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Mark attendance by QR code
   */
  static async markByQRCode(req: Request, res: Response) {
    try {
      const {
        verificationToken,
        location,
        confirmedBy,
        confirmedByName,
        convocationId
      } = req.body;

      const attendance = await AttendanceService.markByQRCode(
        verificationToken,
        location,
        confirmedBy,
        confirmedByName,
        convocationId
      );

      res.status(201).json({
        success: true,
        message: 'Attendance marked successfully',
        data: attendance
      });
    } catch (error: any) {
      logger.error('Error in mark attendance by QR code controller:', error);
      res.status(error.message.includes('Invalid') || error.message.includes('already marked') ? 400 : 500).json({
        success: false,
        message: error.message || 'Failed to mark attendance',
        error: Bun.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Bulk mark attendance
   */
  static async bulkMark(req: Request, res: Response) {
    try {
      const {
        attendances,
        convocationId,
        confirmedBy,
        confirmedByName
      } = req.body;

      const result = await AttendanceService.bulkMark(
        attendances,
        convocationId,
        confirmedBy,
        confirmedByName
      );

      res.status(201).json({
        success: true,
        message: 'Bulk attendance marking completed',
        data: {
          successCount: result.success.length,
          failedCount: result.failed.length,
          success: result.success,
          failed: result.failed
        }
      });
    } catch (error: any) {
      logger.error('Error in bulk mark attendance controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to bulk mark attendance',
        error: Bun.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Get attendance statistics
   */
  static async getStatistics(req: Request, res: Response) {
    try {
      const { convocationId, fromDate, toDate } = req.query;

      const stats = await AttendanceService.getStatistics(
        convocationId as string,
        fromDate ? new Date(fromDate as string) : undefined,
        toDate ? new Date(toDate as string) : undefined
      );

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      logger.error('Error in get attendance statistics controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch attendance statistics',
        error: Bun.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
}
