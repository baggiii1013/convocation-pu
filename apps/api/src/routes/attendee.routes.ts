import { Router } from 'express';
import { z } from 'zod';
import { AttendeeController } from '../controllers/attendee.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadExcel } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// Validation schemas
const createAttendeeSchema = z.object({
  body: z.object({
    enrollmentId: z.string().min(1).max(50),
    name: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().min(10).max(15).optional(),
    school: z.string().min(1).max(100),
    course: z.string().min(1).max(100),
    degree: z.string().min(1).max(50),
    academicYear: z.string().regex(/^\d{4}-\d{4}$/),
    batchYear: z.number().int().min(1900).max(2100),
    rollNumber: z.string().min(1).max(50).optional(),
    cgpa: z.number().min(0).max(10).optional(),
    convocationEligible: z.boolean().optional(),
    convocationRegistered: z.boolean().optional(),
    guardianName: z.string().min(1).max(100).optional(),
    guardianPhone: z.string().min(10).max(15).optional(),
    address: z.string().min(1).max(500).optional(),
    emergencyContact: z.string().min(10).max(15).optional()
  })
});

const updateAttendeeSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid attendee ID format')
  }),
  body: z.object({
    enrollmentId: z.string().min(1).max(50).optional(),
    name: z.string().min(1).max(100).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(10).max(15).optional(),
    school: z.string().min(1).max(100).optional(),
    course: z.string().min(1).max(100).optional(),
    degree: z.string().min(1).max(50).optional(),
    academicYear: z.string().regex(/^\d{4}-\d{4}$/).optional(),
    batchYear: z.number().int().min(1900).max(2100).optional(),
    rollNumber: z.string().min(1).max(50).optional(),
    cgpa: z.number().min(0).max(10).optional(),
    convocationEligible: z.boolean().optional(),
    convocationRegistered: z.boolean().optional(),
    guardianName: z.string().min(1).max(100).optional(),
    guardianPhone: z.string().min(10).max(15).optional(),
    address: z.string().min(1).max(500).optional(),
    emergencyContact: z.string().min(10).max(15).optional()
  })
});

// MongoDB ObjectId validation (24-character hexadecimal string)
const idParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid attendee ID format')
  })
});

const enrollmentIdParamSchema = z.object({
  params: z.object({
    enrollmentId: z.string().min(1).max(50)
  })
});

const identifierParamSchema = z.object({
  params: z.object({
    identifier: z.string().min(1).max(50)
  })
});

const getAllQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    sortBy: z.enum(['name', 'enrollmentId', 'email', 'school', 'course', 'degree', 'batchYear', 'cgpa', 'createdAt', 'updatedAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    school: z.string().min(1).max(100).optional(),
    course: z.string().min(1).max(100).optional(),
    degree: z.string().min(1).max(50).optional(),
    convocationEligible: z.enum(['true', 'false']).optional(),
    convocationRegistered: z.enum(['true', 'false']).optional(),
    search: z.string().min(1).max(100).optional()
  })
});

const bulkCreateSchema = z.object({
  body: z.object({
    attendees: z.array(z.object({
      enrollmentId: z.string().min(1).max(50),
      name: z.string().min(1).max(100),
      email: z.string().email(),
      phone: z.string().min(10).max(15).optional(),
      school: z.string().min(1).max(100),
      course: z.string().min(1).max(100),
      degree: z.string().min(1).max(50),
      academicYear: z.string().regex(/^\d{4}-\d{4}$/),
      batchYear: z.number().int().min(1900).max(2100),
      rollNumber: z.string().min(1).max(50).optional(),
      cgpa: z.number().min(0).max(10).optional(),
      convocationEligible: z.boolean().optional(),
      convocationRegistered: z.boolean().optional(),
      guardianName: z.string().min(1).max(100).optional(),
      guardianPhone: z.string().min(10).max(15).optional(),
      address: z.string().min(1).max(500).optional(),
      emergencyContact: z.string().min(10).max(15).optional()
    })).min(1).max(1000)
  })
});

const verifyCrrSchema = z.object({
  body: z.object({
    enrollmentId: z.string().min(1, 'Enrollment ID is required'),
    crr: z.string().min(1, 'CRR number is required')
  })
});

// Routes

// Statistics (must be before /:id route)
router.get(
  '/statistics',
  authenticate,
  authorize('admin', 'staff'),
  AttendeeController.getStatistics
);

// Bulk operations
router.post(
  '/bulk',
  authenticate,
  authorize('admin', 'staff'),
  validate(bulkCreateSchema),
  AttendeeController.bulkCreate
);

// Get attendee by enrollment ID (must be before /:id route)
router.get(
  '/enrollment/:enrollmentId',
  authenticate,
  authorize('admin', 'staff', 'student'),
  validate(enrollmentIdParamSchema),
  AttendeeController.getByEnrollmentId
);

// Public routes (no authentication required) - MUST be before /:id route
// New route that accepts both enrollment ID and CRR
router.get(
  '/public/search-by/:identifier',
  validate(identifierParamSchema),
  AttendeeController.publicSearchByIdentifier
);

// Legacy route for backward compatibility (enrollment ID only)
router.get(
  '/public/search/:enrollmentId',
  AttendeeController.publicSearch
);

router.post(
  '/public/verify-crr',
  validate(verifyCrrSchema),
  AttendeeController.verifyCrrAndGetToken
);

router.post(
  '/verify-ticket',
  AttendeeController.verifyTicket
);

router.post(
  '/verify-by-enrollment',
  AttendeeController.verifyByEnrollment
);

// CRUD operations
router.post(
  '/',
  authenticate,
  authorize('admin', 'staff'),
  validate(createAttendeeSchema),
  AttendeeController.create
);

router.get(
  '/',
  authenticate,
  authorize('admin', 'staff'),
  validate(getAllQuerySchema),
  AttendeeController.getAll
);

router.get(
  '/:id',
  authenticate,
  authorize('admin', 'staff', 'student'),
  validate(idParamSchema),
  AttendeeController.getById
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'staff'),
  validate(updateAttendeeSchema),
  AttendeeController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(idParamSchema),
  AttendeeController.delete
);

// Excel upload routes
router.post(
  '/upload',
  authenticate,
  authorize('admin', 'staff'),
  uploadExcel.single('file'),
  AttendeeController.uploadExcel
);

router.get(
  '/upload/template',
  authenticate,
  authorize('admin', 'staff'),
  AttendeeController.downloadTemplate
);

// Search attendees
router.get(
  '/search',
  authenticate,
  authorize('admin', 'staff'),
  AttendeeController.search
);

export default router;
