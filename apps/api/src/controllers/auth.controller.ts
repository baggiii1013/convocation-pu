import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import {
    generateTokenPair,
    getAccessTokenClearOptions,
    getAccessTokenCookieOptions,
    getRefreshTokenClearOptions,
    getRefreshTokenCookieOptions,
    getUserRoleClearOptions,
    getUserRoleCookieOptions,
    verifyRefreshToken,
    type AccessTokenPayload
} from '../utils/auth.js';
import { logger } from '../utils/logger.js';

/**
 * Register a new user account
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, role = 'student' } = req.body;

    // Check if user already exists
    const existingUser = await prisma.account.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email already registered',
        code: 'EMAIL_EXISTS'
      });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user account
    const user = await prisma.account.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`, // Computed display name
        role,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        role: true,
        createdAt: true
      }
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user);

    // Set access token as secure httpOnly cookie
    res.cookie('accessToken', accessToken, getAccessTokenCookieOptions());
    
    // Set refresh token as secure httpOnly cookie
    res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());
    
    // Set user role in a secure cookie for middleware access
    res.cookie('userRole', user.role, getUserRoleCookieOptions());

    logger.info(`New user registered: ${email} with role ${role}`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
      code: 'REGISTRATION_ERROR'
    });
  }
};

/**
 * Login with email and password
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.account.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
      return;
    }

    // Check if account is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
      return;
    }

    // Update last login time
    await prisma.account.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user);

    // Set access token as secure httpOnly cookie
    res.cookie('accessToken', accessToken, getAccessTokenCookieOptions());
    
    // Set refresh token as secure httpOnly cookie
    res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());
    
    // Set user role in a secure cookie for middleware access
    res.cookie('userRole', user.role, getUserRoleCookieOptions());

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login',
      code: 'LOGIN_ERROR'
    });
  }
};

/**
 * Refresh access token using refresh token from httpOnly cookie
 */
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: 'Refresh token not found',
        code: 'MISSING_REFRESH_TOKEN'
      });
      return;
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Get current user data
    const user = await prisma.account.findUnique({
      where: { id: payload.userId }
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User not found or inactive',
        code: 'INVALID_USER'
      });
      return;
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(user);

    // Set new access token as secure httpOnly cookie
    res.cookie('accessToken', accessToken, getAccessTokenCookieOptions());
    
    // Set new refresh token as secure httpOnly cookie
    res.cookie('refreshToken', newRefreshToken, getRefreshTokenCookieOptions());
    
    // Update user role cookie (in case role changed)
    res.cookie('userRole', user.role, getUserRoleCookieOptions());

    logger.info(`Token refreshed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      }
    });

  } catch (error) {
    logger.error('Token refresh error:', error);
    
    // Clear invalid refresh token
    res.clearCookie('refreshToken');
    
    res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
      code: 'INVALID_REFRESH_TOKEN'
    });
  }
};

/**
 * Logout - clear refresh token cookie
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as AccessTokenPayload;

    // Clear access token cookie with matching options
    res.clearCookie('accessToken', getAccessTokenClearOptions());
    
    // Clear refresh token cookie with matching options
    res.clearCookie('refreshToken', getRefreshTokenClearOptions());
    
    // Clear user role cookie with matching options
    res.clearCookie('userRole', getUserRoleClearOptions());

    logger.info(`User logged out: ${user?.email || 'unknown'}`);

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout',
      code: 'LOGOUT_ERROR'
    });
  }
};

/**
 * Get current user profile
 */
export const profile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as AccessTokenPayload;

    // Get fresh user data from database
    const userData = await prisma.account.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true
      }
    });

    if (!userData) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { user: userData }
    });

  } catch (error) {
    logger.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error retrieving profile',
      code: 'PROFILE_ERROR'
    });
  }
};

/**
 * Change password for authenticated user
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as AccessTokenPayload;
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const userData = await prisma.account.findUnique({
      where: { id: user.userId }
    });

    if (!userData) {
      res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
      return;
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userData.password);

    if (!isCurrentPasswordValid) {
      res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      });
      return;
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await prisma.account.update({
      where: { id: user.userId },
      data: { password: hashedNewPassword }
    });

    logger.info(`Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error changing password',
      code: 'CHANGE_PASSWORD_ERROR'
    });
  }
};
