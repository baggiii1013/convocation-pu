import type { NextFunction, Request, Response } from 'express';
import {
  extractBearerToken,
  extractTokenFromCookie,
  verifyAccessToken,
  type AccessTokenPayload
} from '../utils/auth.js';
import { logger } from '../utils/logger.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

/**
 * Authentication middleware - verifies JWT token and sets req.user
 * Checks for token in Authorization header (Bearer) or httpOnly cookies
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Try to extract token from Authorization header first
    let token = extractBearerToken(req.headers.authorization);
    
    // If not found in header, try httpOnly cookie
    if (!token) {
      token = extractTokenFromCookie(req.cookies, 'accessToken');
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required',
        code: 'MISSING_TOKEN'
      });
      return;
    }

    // Verify and decode the token
    const payload = verifyAccessToken(token);
    
    // Add user info to request object
    req.user = payload;
    
    next();
    
  } catch (error) {
    logger.warn(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    res.status(401).json({
      success: false,
      message: 'Invalid or expired access token',
      code: 'INVALID_TOKEN'
    });
  }
};/**
 * Role-based authorization middleware
 * @param allowedRoles - Array of roles that can access the route
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'NOT_AUTHENTICATED'
      });
      return;
    }

    const userRole = req.user.role;
    
    // Case-insensitive role comparison - convert to uppercase
    const userRoleUpper = userRole.toUpperCase();
    const allowedRolesUpper = allowedRoles.map(role => role.toUpperCase());
    
    if (!allowedRolesUpper.includes(userRoleUpper)) {
      logger.warn(`Access denied for user ${req.user.email}: required roles [${allowedRoles.join(', ')}], user has '${userRole}'`);
      
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        details: {
          userRole,
          requiredRoles: allowedRoles
        }
      });
      return;
    }

    next();
  };
};

/**
 * Optional authentication middleware - sets req.user if token is valid but doesn't require it
 * Useful for routes that work differently for authenticated vs anonymous users
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Try to extract token from Authorization header first
    let token = extractBearerToken(req.headers.authorization);
    
    // If not found in header, try httpOnly cookie
    if (!token) {
      token = extractTokenFromCookie(req.cookies, 'accessToken');
    }

    if (token) {
      try {
        // Verify and decode the token if present
        const payload = verifyAccessToken(token);
        req.user = payload;
        logger.info(`Optional auth: User identified as ${payload.email}`);
      } catch (error) {
        // Token is invalid, but that's okay for optional auth
        logger.debug(`Optional auth: Invalid token ignored - ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    next();
    
  } catch (error) {
    // For optional auth, we continue even if there's an error
    logger.debug(`Optional auth error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    next();
  }
};

/**
 * Admin-only authorization middleware
 * Convenience wrapper for authorize(['admin'])
 */
export const requireAdmin = authorize('admin');

/**
 * Staff authorization middleware (admin or staff)
 * Convenience wrapper for authorize(['admin', 'staff'])
 */
export const requireStaff = authorize('admin', 'staff');

/**
 * Student authorization middleware (any authenticated user)
 * Convenience wrapper for authorize(['admin', 'staff', 'student'])
 */
export const requireAuth = authorize('admin', 'staff', 'student');
