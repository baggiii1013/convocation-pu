import { requireAdmin } from '@/lib/auth';
import { EmailDashboardClient } from './email-dashboard-client';

/**
 * Admin Email Dashboard Page (Server Component)
 * 
 * This page handles:
 * - Server-side admin authentication
 * - Rendering the email sender component (which fetches enclosures client-side)
 */

export default async function EmailDashboardPage() {
  // Server-side auth check (redirects if not admin)
  await requireAdmin();

  return <EmailDashboardClient />;
}
