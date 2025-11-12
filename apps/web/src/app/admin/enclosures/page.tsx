import { requireAdmin } from '@/lib/auth';
import { EnclosuresClient } from './enclosures-client';

/**
 * Enclosure Management Page (Server Component)
 * 
 * This page handles:
 * - Server-side admin authentication
 * - Initial data fetching for enclosures
 * - Rendering the interactive enclosures management client component
 * 
 * Benefits of Server Component:
 * - Faster initial load (data fetched on server)
 * - Server-side auth protection (cannot bypass)
 * - No loading states needed (data ready before render)
 * - Smaller bundle size (less client JS)
 */

interface Row {
  letter: string;
  startSeat: number;
  endSeat: number;
  reservedSeats: string;
  displayOrder?: number;
}

interface Enclosure {
  id?: string;
  letter: string;
  name?: string;
  allocatedFor: string;
  entryDirection: string;
  displayOrder: number;
  rows: Row[];
  totalSeats?: number;
  allocatedSeats?: number;
}

async function fetchEnclosures(): Promise<Enclosure[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures`, {
      credentials: 'include',
      cache: 'no-store', // Always fetch fresh data
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch enclosures');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching enclosures:', error);
    return [];
  }
}

export default async function EnclosureManagementPage() {
  // 1. Server-side auth check (redirects if not admin)
  await requireAdmin();

  // 2. Fetch initial data on the server
  const initialEnclosures = await fetchEnclosures();

  // 3. Render client component with server-fetched data
  return <EnclosuresClient initialEnclosures={initialEnclosures} />;
}
