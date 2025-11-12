import { requireAdmin } from '@/lib/auth';
import { ReserveSeatsClient } from './reserve-seats-client';

interface Enclosure {
  id: string;
  letter: string;
  name?: string;
  rows: Array<{
    letter: string;
    startSeat: number;
    endSeat: number;
    reservedSeats: string;
  }>;
}

interface Reservation {
  id: string;
  enclosureLetter: string;
  rowLetter: string;
  seatNumber: number;
  reservedFor?: string;
  reservedBy?: string;
  createdAt: string;
}

/**
 * Server Component: Reserve Seats Page
 * 
 * This page allows administrators to reserve specific seats in enclosures.
 * 
 * Server Responsibilities:
 * - Enforce admin-only access via requireAdmin()
 * - Fetch initial enclosures data
 * - Fetch initial reservations data
 * - Pass data to client component for interaction
 * 
 * Flow:
 * 1. User navigates to /admin/reserve-seats
 * 2. Server checks admin authentication
 * 3. Server fetches enclosures and current reservations
 * 4. Server renders ReserveSeatsClient with initial data
 * 5. Client handles seat reservation workflow
 * 
 * @returns The reserve seats page with admin protection and initial data
 */
export default async function ReserveSeatsPage() {
  // Enforce admin-only access
  await requireAdmin();

  // Fetch initial enclosures
  const enclosuresRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures`, {
    credentials: 'include',
    cache: 'no-store', // Don't cache to ensure fresh data
  });
  const enclosuresData = await enclosuresRes.json();
  // Handle both array response and wrapped object response
  const enclosures: Enclosure[] = Array.isArray(enclosuresData) 
    ? enclosuresData 
    : (enclosuresData.data || enclosuresData || []);

  // Fetch initial reservations
  const reservationsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/reservations`, {
    credentials: 'include',
    cache: 'no-store', // Don't cache to ensure fresh data
  });
  const reservationsData = await reservationsRes.json();
  const reservations: Reservation[] = reservationsData.reservations || [];

  // Render the client component with initial data
  return <ReserveSeatsClient initialEnclosures={enclosures} initialReservations={reservations} />;
}
