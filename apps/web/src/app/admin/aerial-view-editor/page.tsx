import { requireAdmin } from '@/lib/auth';
import { cookies } from 'next/headers';
import { AerialViewEditorClient } from './aerial-view-editor-client';

interface Enclosure {
  id: string;
  letter: string;
  name?: string;
  allocatedFor: string;
  entryDirection: string;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  color?: string;
  totalSeats?: number;
  rows: Array<{
    letter: string;
    startSeat: number;
    endSeat: number;
    reservedSeats: string;
    displayOrder: number;
  }>;
}

/**
 * Server Component: Aerial View Editor Page
 * 
 * This page provides an interactive canvas editor for managing the
 * convocation ground layout and enclosure positions.
 * 
 * Server Responsibilities:
 * - Enforce admin-only access via requireAdmin()
 * - Fetch initial enclosures data with positions
 * - Pass data to client component for interactive editing
 * 
 * Flow:
 * 1. User navigates to /admin/aerial-view-editor
 * 2. Server checks admin authentication
 * 3. Server fetches all enclosures with layout data
 * 4. Server renders AerialViewEditorClient with initial data
 * 5. Client handles drag-and-drop, position updates, and saves
 * 
 * @returns The aerial view editor page with admin protection and initial data
 */
export default async function AerialViewEditorPage() {
  // Enforce admin-only access
  await requireAdmin();

  // Get auth token from cookies
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  // Fetch initial enclosures with layout data
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures`, {
    headers: accessToken ? {
      'Cookie': `accessToken=${accessToken}`,
    } : {},
    cache: 'no-store', // Don't cache to ensure fresh data
  });

  if (!res.ok) {
    console.error('Failed to fetch enclosures:', res.status, res.statusText);
    // Return empty array on error
    return <AerialViewEditorClient initialEnclosures={[]} />;
  }

  const data = await res.json();
  const enclosures: Enclosure[] = data.data || data || [];

  // Render the client component with initial data
  return <AerialViewEditorClient initialEnclosures={enclosures} />;
}
