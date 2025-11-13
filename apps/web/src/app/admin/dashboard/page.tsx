import { requireAdmin } from '@/lib/auth';
import { cookies } from 'next/headers';
import { DashboardClient } from './dashboard-client';

/**
 * Admin Dashboard Page (Server Component)
 * 
 * This page handles:
 * - Server-side admin authentication
 * - Initial data fetching for allocation statistics
 * - Rendering the interactive dashboard client component
 * 
 * Benefits of Server Component:
 * - Faster initial load (data fetched on server)
 * - Server-side auth protection (cannot bypass)
 * - No loading states needed (data ready before render)
 * - Smaller bundle size (less client JS)
 */

interface AllocationStats {
  totalAttendees: number;
  totalAllocated: number;
  totalUnallocated: number;
  totalEnclosures: number;
  byCategory: Record<string, number>;
  enclosureStats: Array<{
    letter: string;
    name: string;
    allocatedFor: string;
    totalSeats: number;
    allocatedSeats: number;
    availableSeats: number;
    utilizationRate: number;
  }>;
}

async function fetchAllocationStats(): Promise<AllocationStats> {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      console.error('No access token found');
      return {
        totalAttendees: 0,
        totalAllocated: 0,
        totalUnallocated: 0,
        totalEnclosures: 0,
        byCategory: {},
        enclosureStats: [],
      };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/allocations/stats`, {
      headers: {
        'Cookie': `accessToken=${accessToken}`,
      },
      cache: 'no-store', // Always fetch fresh data
    });
    
    if (!res.ok) {
      console.error('Failed to fetch statistics:', res.status, res.statusText);
      return {
        totalAttendees: 0,
        totalAllocated: 0,
        totalUnallocated: 0,
        totalEnclosures: 0,
        byCategory: {},
        enclosureStats: [],
      };
    }
    
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    // Return empty stats if fetch fails
    return {
      totalAttendees: 0,
      totalAllocated: 0,
      totalUnallocated: 0,
      totalEnclosures: 0,
      byCategory: {},
      enclosureStats: [],
    };
  }
}

export default async function DashboardPage() {
  // 1. Server-side auth check (redirects if not admin)
  await requireAdmin();

  // 2. Fetch initial data on the server
  const initialStats = await fetchAllocationStats();

  // 3. Render client component with server-fetched data
  return <DashboardClient initialStats={initialStats} />;
}
