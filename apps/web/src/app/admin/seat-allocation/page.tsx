import { getServerApiUrl } from '@/lib/api-server';
import { requireAdmin } from '@/lib/auth';
import { cookies } from 'next/headers';
import { SeatAllocationClient } from './seat-allocation-client';

/**
 * Seat Allocation Management Page (Server Component)
 * 
 * This page allows administrators to:
 * - Run seat allocation algorithm on any enclosure
 * - Reset seat allocations for specific enclosures
 * - View allocation statistics per enclosure
 * 
 * Server Responsibilities:
 * - Enforce admin-only access via requireAdmin()
 * - Fetch initial enclosures data with stats
 * - Pass data to client component for interaction
 * 
 * Flow:
 * 1. User navigates to /admin/seat-allocation
 * 2. Server checks admin authentication
 * 3. Server fetches enclosures with allocation stats
 * 4. Server renders SeatAllocationClient with initial data
 * 5. Client handles allocation/reset operations
 */

interface Row {
  id: string;
  letter: string;
  startSeat: number;
  endSeat: number;
  reservedSeats: string;
  displayOrder: number;
}

interface Enclosure {
  id: string;
  letter: string;
  name: string | null;
  allocatedFor: string;
  entryDirection: string;
  displayOrder: number;
  rows: Row[];
  totalSeats?: number;
  allocatedSeats?: number;
  _count?: {
    seatAllocations: number;
  };
}

async function fetchEnclosures(): Promise<Enclosure[]> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      console.error('No access token found');
      return [];
    }

    const res = await fetch(`${getServerApiUrl()}/api/v1/enclosures`, {
      headers: {
        'Cookie': `accessToken=${accessToken}`,
      },
      cache: 'no-store',
    });
    
    if (!res.ok) {
      console.error('Failed to fetch enclosures:', res.status, res.statusText);
      return [];
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching enclosures:', error);
    return [];
  }
}

async function fetchAllocationStats(): Promise<{
  totalAttendees: number;
  totalAllocated: number;
  totalUnallocated: number;
  byEnclosure: Record<string, { 
    total: number; 
    allocated: number; 
    available: number;
    reserved?: number;
    totalCapacity?: number;
  }>;
}> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      console.error('No access token found');
      return {
        totalAttendees: 0,
        totalAllocated: 0,
        totalUnallocated: 0,
        byEnclosure: {}
      };
    }

    const res = await fetch(`${getServerApiUrl()}/api/v1/allocations/stats`, {
      headers: {
        'Cookie': `accessToken=${accessToken}`,
      },
      cache: 'no-store',
    });
    
    if (!res.ok) {
      console.error('Failed to fetch stats:', res.status, res.statusText);
      return {
        totalAttendees: 0,
        totalAllocated: 0,
        totalUnallocated: 0,
        byEnclosure: {}
      };
    }
    
    const data = await res.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching allocation stats:', error);
    return {
      totalAttendees: 0,
      totalAllocated: 0,
      totalUnallocated: 0,
      byEnclosure: {}
    };
  }
}

export default async function SeatAllocationPage() {
  await requireAdmin();

  const [initialEnclosures, initialStats] = await Promise.all([
    fetchEnclosures(),
    fetchAllocationStats()
  ]);

  return (
    <SeatAllocationClient 
      initialEnclosures={initialEnclosures} 
      initialStats={initialStats}
    />
  );
}
