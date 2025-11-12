import { requireAuth } from '@/lib/auth';
import { SettingsClient } from './settings-client';

/**
 * Settings Page (Server Component)
 * 
 * This page handles:
 * - Server-side user authentication
 * - Fetching user session data
 * - Rendering the settings UI
 * 
 * Benefits of Server Component:
 * - Faster initial load (session data on server)
 * - Server-side auth protection
 * - No loading states needed
 * - Smaller bundle size
 */

export default async function SettingsPage() {
  // 1. Server-side auth check and get user session
  const session = await requireAuth();

  // 2. Render client component with user data
  return <SettingsClient user={session.user} />;
}
