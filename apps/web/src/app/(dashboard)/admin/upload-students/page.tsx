import { requireAdmin } from '@/lib/auth';
import { UploadStudentsClient } from './upload-students-client';

/**
 * Server Component: Upload Students Page
 * 
 * This page allows administrators to bulk upload student records via Excel files.
 * 
 * Server Responsibilities:
 * - Enforce admin-only access via requireAdmin()
 * - No data fetching needed (upload is handled client-side)
 * 
 * Flow:
 * 1. User navigates to /admin/upload-students
 * 2. Server checks admin authentication
 * 3. Server renders UploadStudentsClient component
 * 4. Client handles file upload workflow
 * 
 * @returns The upload students page with admin protection
 */
export default async function UploadStudentsPage() {
  // Enforce admin-only access
  await requireAdmin();

  // Render the client component
  return <UploadStudentsClient />;
}
