import { requireAdmin } from '@/lib/auth';
import { AccountService } from '@/services/account.service';
import { ManageUsersClient } from './users-client';

/**
 * Server Component: Manage Users Page
 * 
 * This page allows administrators to view and manage all user accounts.
 * 
 * Server Responsibilities:
 * - Enforce admin-only access via requireAdmin()
 * - Fetch initial user accounts with pagination
 * - Pass data to client component for interactivity
 * 
 * Flow:
 * 1. User navigates to /admin/users
 * 2. Server checks admin authentication
 * 3. Server fetches initial list of user accounts
 * 4. Server renders ManageUsersClient with initial data
 * 5. Client handles filtering, pagination, and CRUD operations
 * 
 * @returns The manage users page with admin protection and initial data
 */
export default async function ManageUsersPage() {
  // Enforce admin-only access
  await requireAdmin();

  // Fetch initial accounts (first page, default filters)
  const { accounts, pagination } = await AccountService.getAll({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Render the client component with initial data
  return <ManageUsersClient initialAccounts={accounts} initialPagination={pagination} />;
}
