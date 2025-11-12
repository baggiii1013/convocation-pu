import { requireAdmin } from '@/lib/auth';
import { CreateAccountClient } from './create-account-client';

/**
 * Server Component: Create Account Page
 * 
 * This page allows administrators to create new user accounts.
 * 
 * Server Responsibilities:
 * - Enforce admin-only access via requireAdmin()
 * - No data fetching needed (form-only page)
 * 
 * Flow:
 * 1. User navigates to /admin/create-account
 * 2. Server checks admin authentication
 * 3. Server renders the CreateAccountClient component
 * 4. Client handles all form interactivity
 * 
 * @returns The create account page with admin protection
 */
export default async function CreateAccountPage() {
  // Enforce admin-only access
  await requireAdmin();

  // Render the client component with the form
  return <CreateAccountClient />;
}
