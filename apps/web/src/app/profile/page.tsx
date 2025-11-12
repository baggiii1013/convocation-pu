import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';

/**
 * Profile Redirect Page (Server Component)
 * 
 * This page ensures the user is authenticated and immediately
 * redirects them to the dashboard profile page.
 * 
 * Benefits of Server Component:
 * - Instant redirect (no flash/loading message)
 * - Server-side auth protection (cannot bypass)
 * - Smaller bundle size (no client-side JS)
 */
export default async function ProfileRedirectPage() {
  // Ensure user is authenticated before redirecting
  await requireAuth();
  
  // Server-side redirect (instant, no flash)
  redirect('/dashboard/profile');
}