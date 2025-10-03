import { Router } from 'express';
import {
  changePassword,
  createAccount,
  login,
  logout,
  profile,
  refresh,
  register
} from '../controllers/auth.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  changePasswordSchema,
  loginSchema,
  registerSchema
} from '../validations/auth.validation.js';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account (DISABLED - Admin-only account creation)
 * @access  Disabled
 */
// router.post('/register', validate(registerSchema), register); // Disabled public registration

/**
 * @route   POST /api/auth/login
 * @desc    Login with email and password
 * @access  Public
 */
router.post('/login', validate(loginSchema), login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token cookie
 * @access  Public (requires refresh token cookie)
 */
router.post('/refresh', refresh);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout and clear refresh token cookie
 * @access  Private
 */
router.post('/logout', authenticate, logout);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, profile);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', 
  authenticate, 
  validate(changePasswordSchema), 
  changePassword
);

/**
 * @route   POST /api/auth/admin/create-account
 * @desc    Create a new user account (Admin only)
 * @access  Admin
 */
router.post('/admin/create-account',
  authenticate,
  authorize('ADMIN'), // Only ADMIN role can create accounts
  validate(registerSchema),
  createAccount
);

export default router;
