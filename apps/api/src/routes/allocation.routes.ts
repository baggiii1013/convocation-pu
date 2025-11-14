import { Router } from 'express';
import { z } from 'zod';
import { AllocationController } from '../controllers/allocation.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// Validation schemas
const enrollmentIdParamSchema = z.object({
  params: z.object({
    enrollmentId: z.string().min(1).max(50)
  })
});

const enclosureLetterParamSchema = z.object({
  params: z.object({
    enclosureLetter: z.string().min(1).max(5)
  })
});

/**
 * POST /api/allocations/allocate-seats
 * Trigger seat allocation for all eligible attendees
 * Admin only
 */
router.post(
  '/allocate-seats',
  authenticate,
  authorize('admin'),
  AllocationController.allocateSeats
);

/**
 * DELETE /api/allocations/clear
 * Clear all seat allocations (for re-running allocation)
 * Admin only
 */
router.delete(
  '/clear',
  authenticate,
  authorize('admin'),
  AllocationController.clearAllocations
);

/**
 * POST /api/allocations/allocate-enclosure/:enclosureLetter
 * Trigger seat allocation for a specific enclosure
 * Admin only
 */
router.post(
  '/allocate-enclosure/:enclosureLetter',
  authenticate,
  authorize('admin'),
  validate(enclosureLetterParamSchema),
  AllocationController.allocateEnclosureSeats
);

/**
 * DELETE /api/allocations/clear-enclosure/:enclosureLetter
 * Clear seat allocations for a specific enclosure
 * Admin only
 */
router.delete(
  '/clear-enclosure/:enclosureLetter',
  authenticate,
  authorize('admin'),
  validate(enclosureLetterParamSchema),
  AllocationController.clearEnclosureAllocations
);

/**
 * GET /api/allocations/stats
 * Get allocation statistics
 * Admin and staff can view
 */
router.get(
  '/stats',
  authenticate,
  authorize('admin', 'staff'),
  AllocationController.getStats
);

/**
 * GET /api/allocations/:enrollmentId
 * Get seat allocation for a specific attendee
 * Public endpoint (no auth required for students to view their seat)
 */
router.get(
  '/:enrollmentId',
  validate(enrollmentIdParamSchema),
  AllocationController.getSeatAllocation
);

/**
 * GET /api/allocations/enclosure/:enclosureLetter
 * Get all attendees and their seat allocations in a specific enclosure
 * Admin and staff can view
 */
router.get(
  '/enclosure/:enclosureLetter',
  authenticate,
  authorize('admin', 'staff'),
  validate(enclosureLetterParamSchema),
  AllocationController.getEnclosureAllocations
);

export default router;
