import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
    bulkMarkAttendanceSchema,
    createAttendanceSchema,
    deleteAttendanceSchema,
    getAttendanceSchema,
    getAttendancesSchema,
    getAttendanceStatsSchema,
    getAttendeeAttendanceHistorySchema,
    markAttendanceByQRSchema,
    updateAttendanceSchema
} from '../validations/attendance.validation.js';

const router = Router();

// Public routes (for QR code scanning)
/**
 * @route POST /api/attendance/mark-by-qr
 * @desc Mark attendance by scanning QR code
 * @access Public (requires valid verification token)
 */
router.post(
  '/mark-by-qr',
  validate(markAttendanceByQRSchema),
  AttendanceController.markByQRCode
);

// Protected routes (require authentication)
/**
 * @route POST /api/attendance
 * @desc Create a new attendance record
 * @access Private (Staff/Admin)
 */
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'STAFF'),
  validate(createAttendanceSchema),
  AttendanceController.create
);

/**
 * @route POST /api/attendance/bulk
 * @desc Bulk mark attendance
 * @access Private (Staff/Admin)
 */
router.post(
  '/bulk',
  authenticate,
  authorize('ADMIN', 'STAFF'),
  validate(bulkMarkAttendanceSchema),
  AttendanceController.bulkMark
);

/**
 * @route GET /api/attendance/statistics
 * @desc Get attendance statistics
 * @access Private (Staff/Admin)
 */
router.get(
  '/statistics',
  authenticate,
  authorize('ADMIN', 'STAFF'),
  validate(getAttendanceStatsSchema),
  AttendanceController.getStatistics
);

/**
 * @route GET /api/attendance/attendee/:attendeeId
 * @desc Get attendance history for a specific attendee
 * @access Private (Staff/Admin/Self)
 */
router.get(
  '/attendee/:attendeeId',
  authenticate,
  validate(getAttendeeAttendanceHistorySchema),
  AttendanceController.getAttendeeHistory
);

/**
 * @route GET /api/attendance/:id
 * @desc Get attendance record by ID
 * @access Private (Staff/Admin)
 */
router.get(
  '/:id',
  authenticate,
  authorize('ADMIN', 'STAFF'),
  validate(getAttendanceSchema),
  AttendanceController.getById
);

/**
 * @route GET /api/attendance
 * @desc Get all attendance records with filters
 * @access Private (Staff/Admin)
 */
router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'STAFF'),
  validate(getAttendancesSchema),
  AttendanceController.getAll
);

/**
 * @route PUT /api/attendance/:id
 * @desc Update attendance record
 * @access Private (Staff/Admin)
 */
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'STAFF'),
  validate(updateAttendanceSchema),
  AttendanceController.update
);

/**
 * @route DELETE /api/attendance/:id
 * @desc Delete attendance record
 * @access Private (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(deleteAttendanceSchema),
  AttendanceController.delete
);

export default router;
