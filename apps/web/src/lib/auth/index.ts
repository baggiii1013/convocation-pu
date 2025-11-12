/**
 * Server-Side Auth Module
 * 
 * This module provides all server-side authentication utilities.
 * 
 * ⚠️ SERVER-ONLY: This module MUST NOT be imported in client components.
 * 
 * @module lib/auth
 */

// Session Management
export {
    getServerSession, getSessionTimeRemaining, getUserId,
    getUserRole, hasRole, isSessionExpired, type UserSession
} from './session';

// Auth Protection
export {
    checkRole, getOptionalSession, isAdmin,
    isStaff,
    isStudent, requireAdmin, requireAuth,
    requireRole, requireStaff
} from './protection';

