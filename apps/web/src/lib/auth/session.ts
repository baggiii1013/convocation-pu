/**
 * Server-Side Session Management
 * 
 * This file provides utilities for reading and validating user sessions
 * in Next.js Server Components and Server Actions.
 * 
 * ⚠️ SERVER-ONLY: These functions MUST NOT be imported in client components.
 */

import { verifyAccessToken, type AccessTokenPayload } from '@/lib/jwt';
import { cookies } from 'next/headers';
import 'server-only';

/**
 * User session data structure
 */
export interface UserSession {
  user: {
    id: string;
    email: string;
    role: 'ADMIN' | 'STAFF' | 'STUDENT';
    name?: string;
  };
  expiresAt: number;
}

/**
 * Get the current user session from cookies
 * 
 * This function:
 * 1. Reads the accessToken cookie
 * 2. Verifies the JWT signature and expiration
 * 3. Returns the session data or null if invalid
 * 
 * @returns UserSession object if valid, null otherwise
 * 
 * @example
 * ```typescript
 * // In a Server Component
 * import { getServerSession } from '@/lib/auth/session';
 * 
 * export default async function DashboardPage() {
 *   const session = await getServerSession();
 *   
 *   if (!session) {
 *     redirect('/login');
 *   }
 *   
 *   return <div>Welcome, {session.user.email}!</div>;
 * }
 * ```
 */
export async function getServerSession(): Promise<UserSession | null> {
  try {
    // Get cookies from Next.js headers
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    // No token found
    if (!accessToken) {
      return null;
    }

    // Verify and decode the JWT
    const payload = await verifyAccessToken(accessToken);

    // Construct session object
    const session: UserSession = {
      user: {
        id: payload.userId,
        email: payload.email,
        role: payload.role as 'ADMIN' | 'STAFF' | 'STUDENT',
        name: `${payload.firstName} ${payload.lastName}`.trim(),
      },
      expiresAt: payload.exp || 0,
    };

    return session;
  } catch (error) {
    // Log verification failures (could be expired token, invalid signature, etc.)
    if (error instanceof Error) {
      console.warn('[Session] Token verification failed:', error.message);
    }
    return null;
  }
}

/**
 * Check if the user session has a specific role
 * 
 * @param session - User session object
 * @param allowedRoles - Array of allowed roles
 * @returns true if user has one of the allowed roles
 * 
 * @example
 * ```typescript
 * const session = await getServerSession();
 * if (session && hasRole(session, ['ADMIN', 'STAFF'])) {
 *   // User can access admin features
 * }
 * ```
 */
export function hasRole(
  session: UserSession | null,
  allowedRoles: Array<'ADMIN' | 'STAFF' | 'STUDENT'>
): boolean {
  if (!session) return false;
  return allowedRoles.includes(session.user.role);
}

/**
 * Get user ID from session (convenience function)
 * 
 * @param session - User session object
 * @returns User ID or null
 */
export function getUserId(session: UserSession | null): string | null {
  return session?.user.id || null;
}

/**
 * Get user role from session (convenience function)
 * 
 * @param session - User session object
 * @returns User role or null
 */
export function getUserRole(
  session: UserSession | null
): 'ADMIN' | 'STAFF' | 'STUDENT' | null {
  return session?.user.role || null;
}

/**
 * Check if session is expired
 * 
 * @param session - User session object
 * @returns true if session is expired
 */
export function isSessionExpired(session: UserSession | null): boolean {
  if (!session) return true;
  const now = Math.floor(Date.now() / 1000);
  return session.expiresAt < now;
}

/**
 * Get time remaining until session expires (in seconds)
 * 
 * @param session - User session object
 * @returns Seconds until expiration, or 0 if expired/invalid
 */
export function getSessionTimeRemaining(session: UserSession | null): number {
  if (!session) return 0;
  const now = Math.floor(Date.now() / 1000);
  const remaining = session.expiresAt - now;
  return remaining > 0 ? remaining : 0;
}
