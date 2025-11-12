/**
 * Example Server Components using Phase 2 Auth Utilities
 * 
 * This file demonstrates how to use the new server-side auth utilities
 * in various scenarios. These are example patterns you can copy to your pages.
 * 
 * ⚠️ This is a documentation file, not meant to be run directly.
 */

import {
  checkRole,
  getOptionalSession,
  requireAdmin,
  requireAuth,
  requireRole,
  requireStaff,
  type UserSession
} from '@/lib/auth';

// ============================================================================
// Example 1: Basic Protected Page
// ============================================================================

export async function Example1_BasicProtectedPage() {
  // This ensures the user is authenticated
  // If not, they'll be redirected to /login
  const session = await requireAuth();
  
  return (
    <div>
      <h1>Protected Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
      <p>User ID: {session.user.id}</p>
    </div>
  );
}

// ============================================================================
// Example 2: Admin-Only Page
// ============================================================================

export async function Example2_AdminOnlyPage() {
  // Only ADMIN users can access this
  // Others will be redirected to /dashboard?error=unauthorized
  const session = await requireAdmin();
  
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Admin user: {session.user.email}</p>
      <AdminPanel />
    </div>
  );
}

// ============================================================================
// Example 3: Staff or Admin Page
// ============================================================================

export async function Example3_StaffOrAdminPage() {
  // Both ADMIN and STAFF can access this
  // STUDENT users will be redirected
  const session = await requireStaff();
  
  return (
    <div>
      <h1>Management Console</h1>
      <p>Your role: {session.user.role}</p>
      <ManagementTools />
    </div>
  );
}

// ============================================================================
// Example 4: Multiple Specific Roles
// ============================================================================

export async function Example4_MultipleRoles() {
  // Allow ADMIN and STUDENT, but not STAFF
  const session = await requireRole(['ADMIN', 'STUDENT']);
  
  return (
    <div>
      <h1>Student Portal</h1>
      <p>Accessible by: {session.user.role}</p>
    </div>
  );
}

// ============================================================================
// Example 5: Public Page with Optional Auth
// ============================================================================

export async function Example5_PublicPageWithOptionalAuth() {
  // This page works for both authenticated and unauthenticated users
  const session = await getOptionalSession();
  
  return (
    <div>
      <h1>Welcome to Convocation Portal</h1>
      
      {session ? (
        <div>
          <p>Hello, {session.user.name}!</p>
          <a href="/dashboard">Go to Dashboard</a>
        </div>
      ) : (
        <div>
          <p>Please log in to continue</p>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 6: Conditional Content Based on Role
// ============================================================================

export async function Example6_ConditionalContentByRole() {
  const session = await requireAuth();
  const isAdmin = await checkRole(['ADMIN']);
  const isStaff = await checkRole(['STAFF']);
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Everyone sees this */}
      <UserDashboard user={session.user} />
      
      {/* Only staff and admin see this */}
      {(isAdmin || isStaff) && (
        <StaffTools />
      )}
      
      {/* Only admin sees this */}
      {isAdmin && (
        <AdminPanel />
      )}
    </div>
  );
}

// ============================================================================
// Example 7: Protected Layout
// ============================================================================

export async function Example7_ProtectedLayout({ children }: { children: React.ReactNode }) {
  // This protects all pages under this layout
  const session = await requireAuth();
  
  return (
    <div>
      <nav>
        <p>Logged in as: {session.user.email}</p>
        <a href="/dashboard">Dashboard</a>
        <a href="/profile">Profile</a>
        <a href="/settings">Settings</a>
      </nav>
      
      <main>{children}</main>
      
      <footer>
        <p>© 2025 Convocation Portal</p>
      </footer>
    </div>
  );
}

// ============================================================================
// Example 8: Admin Layout
// ============================================================================

export async function Example8_AdminLayout({ children }: { children: React.ReactNode }) {
  // This protects all admin pages
  const session = await requireAdmin();
  
  return (
    <div className="admin-layout">
      <AdminSidebar user={session.user} />
      
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}

// ============================================================================
// Example 9: Protected Server Action
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function Example9_ProtectedServerAction(formData: FormData) {
  'use server';
  
  // Ensure user is authenticated before processing
  const session = await requireAuth();
  
  const name = formData.get('name') as string;
  
  // Update user profile in database
  await db.user.update({
    where: { id: session.user.id },
    data: { name },
  });
  
  return { success: true, message: 'Profile updated' };
}

// ============================================================================
// Example 10: Admin-Only Server Action
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function Example10_AdminOnlyServerAction(userId: string) {
  'use server';
  
  // Only admins can delete users
  const session = await requireAdmin();
  
  // Log admin action for audit trail
  console.log(`Admin ${session.user.email} deleting user ${userId}`);
  
  await db.user.delete({
    where: { id: userId },
  });
  
  return { success: true };
}

// ============================================================================
// Example 11: Role-Based Server Action
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function Example11_RoleBasedServerAction(eventId: string, data: Record<string, unknown>) {
  'use server';
  
  // Only ADMIN and STAFF can manage events
  const session = await requireStaff();
  
  await db.event.update({
    where: { id: eventId },
    data,
  });
  
  console.log('Session:', session); // Use session to avoid warning
  
  return { success: true };
}

// ============================================================================
// Example 12: Hidden Admin Resource (404 for non-admins)
// ============================================================================

export async function Example12_HiddenAdminResource() {
  // Returns 404 for non-admins (hides existence of page)
  const session = await requireRole(['ADMIN'], {
    notFoundOnUnauthorized: true
  });
  
  return (
    <div>
      <h1>Secret Admin Page</h1>
      <p>Non-admins don&apos;t even know this page exists</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}

// ============================================================================
// Example 13: Custom Unauthorized Redirect
// ============================================================================

export async function Example13_CustomUnauthorizedRedirect() {
  // Redirect to custom page on unauthorized
  const session = await requireRole(['ADMIN'], {
    unauthorizedRedirect: '/access-denied'
  });
  
  return (
    <div>
      <h1>Admin Panel</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}

// ============================================================================
// Example 14: Preserving Redirect URL
// ============================================================================

export async function Example14_PreservingRedirectUrl() {
  // After login, user will be redirected back to /admin/settings
  const session = await requireAuth('/admin/settings');
  
  return (
    <div>
      <h1>Admin Settings</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}

// ============================================================================
// Example 15: Session Data in API Route Handler
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

export async function Example15_APIRouteWithAuth(request: NextRequest) {
  // Get session in API route (works in route handlers too!)
  const session = await getOptionalSession();
  
  console.log('Request:', request); // Use request to avoid warning
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Use session data
  const data = await fetchUserData(session.user.id);
  
  return NextResponse.json({ data });
}

// ============================================================================
// Example 16: Nested Role Checks
// ============================================================================

export async function Example16_NestedRoleChecks() {
  const session = await requireAuth();
  
  console.log('Session user:', session.user.id); // Use session to avoid warning
  
  // Check multiple roles for different sections
  const canManageUsers = await checkRole(['ADMIN']);
  const canManageEvents = await checkRole(['ADMIN', 'STAFF']);
  const canViewReports = await checkRole(['ADMIN', 'STAFF', 'STUDENT']);
  
  return (
    <div>
      <h1>Portal</h1>
      
      {canManageUsers && <UserManagement />}
      {canManageEvents && <EventManagement />}
      {canViewReports && <Reports />}
    </div>
  );
}

// ============================================================================
// Example 17: Type-Safe Session Usage
// ============================================================================

export async function Example17_TypeSafeSession() {
  const session = await requireAuth();
  
  // TypeScript knows the exact structure of session
  const userId: string = session.user.id;
  const userRole: 'ADMIN' | 'STAFF' | 'STUDENT' = session.user.role;
  const userEmail: string = session.user.email;
  
  // All properly typed!
  console.log('User info:', { userId, userRole, userEmail });
  
  // Type checking prevents errors
  if (session.user.role === 'ADMIN') {
    // TypeScript knows this is safe
    return <AdminDashboard />;
  }
  
  return (
    <div>
      <h1>Welcome {userEmail}</h1>
      <p>Role: {userRole}</p>
    </div>
  );
}

// ============================================================================
// Example 18: Combining Multiple Auth Checks
// ============================================================================

export async function Example18_CombiningAuthChecks() {
  // First ensure authenticated
  const session = await requireAuth();
  
  // Then check additional permissions
  const hasSpecialAccess = await checkRole(['ADMIN', 'STAFF']);
  
  // Also check session expiry
  const expiresIn = session.expiresAt - Math.floor(Date.now() / 1000);
  const isExpiringSoon = expiresIn < 300; // Less than 5 minutes
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {isExpiringSoon && (
        <Banner>Your session will expire soon</Banner>
      )}
      
      {hasSpecialAccess && <AdvancedFeatures />}
    </div>
  );
}

// ============================================================================
// Example 19: Error Handling Pattern
// ============================================================================

export async function Example19_ErrorHandlingPattern() {
  // requireAuth() redirects automatically, but you can handle other errors
  const session = await requireAuth();
  
  try {
    const data = await fetchUserData(session.user.id);
    
    return (
      <div>
        <h1>User Data</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    
    return (
      <div>
        <h1>Error</h1>
        <p>Failed to load user data</p>
      </div>
    );
  }
}

// ============================================================================
// Example 20: Parallel Role Checks
// ============================================================================

export async function Example20_ParallelRoleChecks() {
  const session = await requireAuth();
  
  console.log('Session user:', session.user.id); // Use session to avoid warning
  
  // Check multiple roles in parallel for better performance
  const [isAdmin, isStaff, isStudent] = await Promise.all([
    checkRole(['ADMIN']),
    checkRole(['STAFF']),
    checkRole(['STUDENT'])
  ]);
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {isAdmin && <AdminSection />}
      {isStaff && <StaffSection />}
      {isStudent && <StudentSection />}
    </div>
  );
}

// ============================================================================
// Dummy Components for Examples
// ============================================================================

function AdminPanel() { return <div>Admin Panel</div>; }
function ManagementTools() { return <div>Management Tools</div>; }
function UserDashboard({ user }: { user: UserSession['user'] }) { 
  return <div>User Dashboard for {user.name}</div>; 
}
function StaffTools() { return <div>Staff Tools</div>; }
function AdminSidebar({ user }: { user: UserSession['user'] }) { 
  return <aside>Admin Sidebar - {user.email}</aside>; 
}
function UserManagement() { return <div>User Management</div>; }
function EventManagement() { return <div>Event Management</div>; }
function Reports() { return <div>Reports</div>; }
function AdvancedFeatures() { return <div>Advanced Features</div>; }
function Banner({ children }: { children: React.ReactNode }) { 
  return <div className="banner">{children}</div>; 
}
function AdminSection() { return <div>Admin Section</div>; }
function StaffSection() { return <div>Staff Section</div>; }
function StudentSection() { return <div>Student Section</div>; }
function AdminDashboard() { return <div>Admin Dashboard</div>; }

// Dummy database
const db = {
  user: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update: async (_args: Record<string, unknown>) => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    delete: async (_args: Record<string, unknown>) => {},
  },
  event: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update: async (_args: Record<string, unknown>) => {},
  },
};

async function fetchUserData(userId: string) {
  return { id: userId, name: 'Test User' };
}
