import { Router } from 'express';
import { z } from 'zod';
import { AccountController } from '../controllers/account.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// Validation schemas
// MongoDB ObjectId validation (24-character hexadecimal string)
const idParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid account ID format')
  })
});

const getAllQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    sortBy: z.enum(['name', 'email', 'role', 'displayName', 'accountState', 'isActive', 'createdAt', 'updatedAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    search: z.string().min(1).max(100).optional(),
    role: z.enum(['ADMIN', 'STAFF', 'STUDENT']).optional(),
    accountState: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION']).optional(),
    isActive: z.enum(['true', 'false']).optional()
  })
});

const updateAccountSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid account ID format')
  }),
  body: z.object({
    email: z.string().email('Invalid email format').optional(),
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    displayName: z.string().min(1).max(100).optional(),
    role: z.enum(['ADMIN', 'STAFF', 'STUDENT']).optional(),
    accountState: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION']).optional(),
    isActive: z.boolean().optional(),
    profileImageURL: z.string().url().optional().nullable()
  }).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update'
  })
});

// Routes

/**
 * @route   GET /api/accounts/statistics
 * @desc    Get account statistics
 * @access  Admin only
 */
router.get(
  '/statistics',
  authenticate,
  authorize('ADMIN'),
  AccountController.getStatistics
);

/**
 * @route   GET /api/accounts
 * @desc    Get all accounts with filtering and pagination
 * @access  Admin only
 */
router.get(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(getAllQuerySchema),
  AccountController.getAll
);

/**
 * @route   GET /api/accounts/:id
 * @desc    Get account by ID
 * @access  Admin only
 */
router.get(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(idParamSchema),
  AccountController.getById
);

/**
 * @route   PUT /api/accounts/:id
 * @desc    Update account
 * @access  Admin only
 */
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateAccountSchema),
  AccountController.update
);

/**
 * @route   DELETE /api/accounts/:id
 * @desc    Delete account
 * @access  Admin only
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(idParamSchema),
  AccountController.delete
);

/**
 * @route   PATCH /api/accounts/:id/toggle-active
 * @desc    Toggle account active status
 * @access  Admin only
 */
router.patch(
  '/:id/toggle-active',
  authenticate,
  authorize('ADMIN'),
  validate(idParamSchema),
  AccountController.toggleActive
);

export default router;
