import { requireAdmin } from '@/lib/auth';
import { AttendanceStatsClient } from './attendance-stats-client';

/**
 * Attendance Statistics Page (Server Component)
 * 
 * This page handles:
 * - Server-side admin authentication
 * - Rendering the interactive attendance statistics dashboard
 * 
 * Benefits of Server Component:
 * - Faster initial load
 * - Server-side auth protection (cannot bypass)
 * - No loading states needed
 * - Smaller bundle size (less client JS)
 */

export default async function AttendanceStatsPage() {
  // Server-side auth check (redirects if not admin)
  await requireAdmin();

  return <AttendanceStatsClient />;
}
