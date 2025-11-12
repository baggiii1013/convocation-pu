/**
 * Server-Side Auth Protection Utilities
 * 
 * This file provides wrapper functions for protecting Server Components
 * and Server Actions with authentication and role-based access control.
 * 
 * ⚠️ SERVER-ONLY: These functions MUST NOT be imported in client components.
 */

import { notFound, redirect } from 'next/navigation';
import 'server-only';
import { getServerSession, type UserSession } from './session';

/**
 * Require authentication for a Server Component or Server Action
 * 
 * This function:
 * 1. Gets the current user session
 * 2. If no valid session, redirects to login
 * 3. If valid session, returns the session data
 * 
 * Use this at the top of any Server Component or layout that requires authentication.
 * 
 * @param redirectUrl - Optional URL to redirect to after login (defaults to current path)
 * @returns UserSession object
 * 
 * @example
 * ```typescript
 * // In a Server Component
 * import { requireAuth } from '@/lib/auth/protection';
 * 
 * export default async function DashboardPage() {
 *   const session = await requireAuth();
 *   
 *   return <div>Welcome, {session.user.email}!</div>;
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // With custom redirect URL
 * export default async function ProfilePage() {
 *   const session = await requireAuth('/profile');
 *   
 *   return <div>Profile: {session.user.name}</div>;
 * }
 * ```
 */
export async function requireAuth(redirectUrl?: string): Promise<UserSession> {
  const session = await getServerSession();

  if (!session) {
    // Build login URL with redirect parameter
    const loginUrl = redirectUrl 
      ? `/login?redirect_url=${encodeURIComponent(redirectUrl)}`
      : '/login';
    
    redirect(loginUrl);
  }

  return session;
}

/**
 * Require a specific role for a Server Component or Server Action
 * 
 * This function:
 * 1. Gets the current user session (redirects to login if not authenticated)
 * 2. Checks if user has one of the required roles
 * 3. If role doesn't match, redirects to unauthorized page or 404
 * 4. If role matches, returns the session data
 * 
 * @param allowedRoles - Array of roles that can access this resource
 * @param options - Optional configuration
 * @returns UserSession object
 * 
 * @example
 * ```typescript
 * // Admin-only page
 * import { requireRole } from '@/lib/auth/protection';
 * 
 * export default async function AdminPage() {
 *   const session = await requireRole(['ADMIN']);
 *   
 *   return <div>Admin Dashboard</div>;
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Admin or Staff page
 * export default async function ManagementPage() {
 *   const session = await requireRole(['ADMIN', 'STAFF']);
 *   
 *   return <div>Management Console</div>;
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Custom unauthorized behavior (404 instead of redirect)
 * export default async function SecretPage() {
 *   const session = await requireRole(['ADMIN'], { 
 *     notFoundOnUnauthorized: true 
 *   });
 *   
 *   return <div>Secret Content</div>;
 * }
 * ```
 */
export async function requireRole(
  allowedRoles: Array<'ADMIN' | 'STAFF' | 'STUDENT'>,
  options: {
    redirectUrl?: string;
    notFoundOnUnauthorized?: boolean;
    unauthorizedRedirect?: string;
  } = {}
): Promise<UserSession> {
  // First, ensure user is authenticated
  const session = await requireAuth(options.redirectUrl);

  // Check if user has one of the allowed roles
  const hasPermission = allowedRoles.includes(session.user.role);

  if (!hasPermission) {
    // Log unauthorized access attempt for security monitoring
    console.warn(
      `[Auth] Unauthorized access attempt:`,
      `User ${session.user.email} (${session.user.role}) tried to access resource requiring roles: ${allowedRoles.join(', ')}`
    );

    // Return 404 if configured (hides existence of protected resource)
    if (options.notFoundOnUnauthorized) {
      notFound();
    }

    // Redirect to custom unauthorized page or default dashboard
    const unauthorizedUrl = options.unauthorizedRedirect || '/dashboard?error=unauthorized';
    redirect(unauthorizedUrl);
  }

  return session;
}

/**
 * Require admin role (convenience wrapper for requireRole)
 * 
 * @param options - Optional configuration
 * @returns UserSession object with ADMIN role
 * 
 * @example
 * ```typescript
 * import { requireAdmin } from '@/lib/auth/protection';
 * 
 * export default async function AdminSettingsPage() {
 *   const session = await requireAdmin();
 *   
 *   return <div>Admin Settings</div>;
 * }
 * ```
 */
export async function requireAdmin(
  options?: {
    redirectUrl?: string;
    notFoundOnUnauthorized?: boolean;
  }
): Promise<UserSession> {
  return requireRole(['ADMIN'], options);
}

/**
 * Require admin or staff role (convenience wrapper for requireRole)
 * 
 * @param options - Optional configuration
 * @returns UserSession object with ADMIN or STAFF role
 * 
 * @example
 * ```typescript
 * import { requireStaff } from '@/lib/auth/protection';
 * 
 * export default async function EventManagementPage() {
 *   const session = await requireStaff();
 *   
 *   return <div>Event Management</div>;
 * }
 * ```
 */
export async function requireStaff(
  options?: {
    redirectUrl?: string;
    notFoundOnUnauthorized?: boolean;
  }
): Promise<UserSession> {
  return requireRole(['ADMIN', 'STAFF'], options);
}

/**
 * Get the current session without requiring authentication
 * Useful for pages that show different content based on auth status
 * 
 * @returns UserSession object or null
 * 
 * @example
 * ```typescript
 * import { getOptionalSession } from '@/lib/auth/protection';
 * 
 * export default async function HomePage() {
 *   const session = await getOptionalSession();
 *   
 *   return (
 *     <div>
 *       {session ? (
 *         <div>Welcome back, {session.user.name}!</div>
 *       ) : (
 *         <div>Please log in</div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export async function getOptionalSession(): Promise<UserSession | null> {
  return getServerSession();
}

/**
 * Check if current user has a specific role
 * Returns true/false without throwing or redirecting
 * 
 * @param requiredRoles - Array of roles to check
 * @returns true if user has one of the required roles
 * 
 * @example
 * ```typescript
 * import { checkRole } from '@/lib/auth/protection';
 * 
 * export default async function DashboardPage() {
 *   const isAdmin = await checkRole(['ADMIN']);
 *   
 *   return (
 *     <div>
 *       Dashboard
 *       {isAdmin && <AdminPanel />}
 *     </div>
 *   );
 * }
 * ```
 */
export async function checkRole(
  requiredRoles: Array<'ADMIN' | 'STAFF' | 'STUDENT'>
): Promise<boolean> {
  const session = await getServerSession();
  if (!session) return false;
  return requiredRoles.includes(session.user.role);
}

/**
 * Type guard to check if session has admin role
 * 
 * @param session - User session object
 * @returns true if user is an admin
 */
export function isAdmin(session: UserSession | null): boolean {
  return session?.user.role === 'ADMIN';
}

/**
 * Type guard to check if session has staff role
 * 
 * @param session - User session object
 * @returns true if user is staff
 */
export function isStaff(session: UserSession | null): boolean {
  return session?.user.role === 'STAFF';
}

/**
 * Type guard to check if session has student role
 * 
 * @param session - User session object
 * @returns true if user is a student
 */
export function isStudent(session: UserSession | null): boolean {
  return session?.user.role === 'STUDENT';
}
