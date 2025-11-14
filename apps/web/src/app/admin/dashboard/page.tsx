import { requireAdmin } from '@/lib/auth';
import { DashboardClient } from './dashboard-client';

/**
 * Admin Dashboard Page (Server Component)
 * 
 * This page handles:
 * - Server-side admin authentication
 * - Rendering the interactive dashboard client component
 * 
 * Benefits of Server Component:
 * - Faster initial load
 * - Server-side auth protection (cannot bypass)
 * - No loading states needed
 * - Smaller bundle size (less client JS)
 */

export default async function DashboardPage() {
  // Server-side auth check (redirects if not admin)
  await requireAdmin();

  return <DashboardClient />;
}
