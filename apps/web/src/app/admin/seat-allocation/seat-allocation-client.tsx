'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { AlertCircle, CheckCircle, PlayCircle, RotateCcw, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

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

interface AllocationStats {
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
}

interface SeatAllocationClientProps {
  initialEnclosures: Enclosure[];
  initialStats: AllocationStats;
}

export function SeatAllocationClient({ initialEnclosures, initialStats }: SeatAllocationClientProps) {
  const router = useRouter();
  const [enclosures, setEnclosures] = useState<Enclosure[]>(initialEnclosures);
  const [stats, setStats] = useState<AllocationStats>({
    totalAttendees: initialStats?.totalAttendees || 0,
    totalAllocated: initialStats?.totalAllocated || 0,
    totalUnallocated: initialStats?.totalUnallocated || 0,
    byEnclosure: initialStats?.byEnclosure || {}
  });
  const [loading, setLoading] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/allocations/stats`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to fetch stats');

      const data = await res.json();
      const statsData = data.data || data;
      setStats({
        totalAttendees: statsData?.totalAttendees || 0,
        totalAllocated: statsData?.totalAllocated || 0,
        totalUnallocated: statsData?.totalUnallocated || 0,
        byEnclosure: statsData?.byEnclosure || {}
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchEnclosures = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to fetch enclosures');

      const data = await res.json();
      setEnclosures(data);
    } catch (error) {
      console.error('Error fetching enclosures:', error);
    }
  };

  const handleAllocateEnclosure = async (enclosureLetter: string) => {
    if (!confirm(`Run seat allocation algorithm for Enclosure ${enclosureLetter}?\n\nThis will assign seats to all eligible attendees in this enclosure who don't have seats yet.`)) {
      return;
    }

    setLoading(`allocate-${enclosureLetter}`);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/allocations/allocate-enclosure/${enclosureLetter}`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      const data = await res.json();
      
      console.log('Allocation response:', { status: res.status, data });

      if (!res.ok) {
        const errorMsg = data.message || data.error || 'Failed to allocate seats';
        console.error('Allocation failed:', { status: res.status, code: data.code, error: errorMsg });
        throw new Error(errorMsg);
      }

      toast.success(data.message || `Successfully allocated ${data.data.allocated} seats in Enclosure ${enclosureLetter}`);
      
      // Refresh data
      await Promise.all([fetchStats(), fetchEnclosures()]);
      router.refresh();
    } catch (error) {
      console.error('Allocation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to allocate seats');
    } finally {
      setLoading(null);
    }
  };

  const handleResetEnclosure = async (enclosureLetter: string) => {
    if (!confirm(`Reset all seat allocations for Enclosure ${enclosureLetter}?\n\nThis will clear all seat assignments in this enclosure. Reserved seats will NOT be affected.\n\nThis action cannot be undone.`)) {
      return;
    }

    setLoading(`reset-${enclosureLetter}`);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/allocations/clear-enclosure/${enclosureLetter}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset allocations');
      }

      toast.success(data.message || `Successfully cleared ${data.data.count} allocations from Enclosure ${enclosureLetter}`);
      
      // Refresh data
      await Promise.all([fetchStats(), fetchEnclosures()]);
      router.refresh();
    } catch (error) {
      console.error('Reset error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to reset allocations');
    } finally {
      setLoading(null);
    }
  };

  const handleAllocateAll = async () => {
    if (!confirm('Run seat allocation algorithm for ALL enclosures?\n\nThis will assign seats to all eligible attendees across all enclosures who don\'t have seats yet.')) {
      return;
    }

    setLoading('allocate-all');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/allocations/allocate-seats`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to allocate seats');
      }

      toast.success(data.message || `Successfully allocated ${data.data.allocated} seats across all enclosures`);
      
      // Refresh data
      await Promise.all([fetchStats(), fetchEnclosures()]);
      router.refresh();
    } catch (error) {
      console.error('Allocation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to allocate seats');
    } finally {
      setLoading(null);
    }
  };

  const handleResetAll = async () => {
    if (!confirm('Reset ALL seat allocations across all enclosures?\n\nThis will clear ALL seat assignments. Reserved seats will NOT be affected.\n\nThis action cannot be undone.')) {
      return;
    }

    setLoading('reset-all');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/allocations/clear`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset allocations');
      }

      toast.success(data.message || `Successfully cleared ${data.data.count} allocations`);
      
      // Refresh data
      await Promise.all([fetchStats(), fetchEnclosures()]);
      router.refresh();
    } catch (error) {
      console.error('Reset error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to reset allocations');
    } finally {
      setLoading(null);
    }
  };

  const calculateTotalSeats = (enclosure: Enclosure): number => {
    return enclosure.rows.reduce((total, row) => {
      return total + (row.endSeat - row.startSeat + 1);
    }, 0);
  };

  const calculateReservedSeats = (enclosure: Enclosure): number => {
    // First try to get from API stats (includes admin + row reserved)
    const reservedFromAPI = stats.byEnclosure?.[enclosure.letter]?.reserved;
    if (reservedFromAPI !== undefined) {
      return reservedFromAPI;
    }
    
    // Fallback to calculating row-level reserved seats only
    return enclosure.rows.reduce((total, row) => {
      const reserved = row.reservedSeats
        ? row.reservedSeats.split(',').filter(s => s.trim()).length
        : 0;
      return total + reserved;
    }, 0);
  };

  const getAllocatedSeats = (enclosureLetter: string): number => {
    return stats.byEnclosure?.[enclosureLetter]?.allocated || 0;
  };

  const getAvailableSeats = (enclosureLetter: string): number => {
    return stats.byEnclosure?.[enclosureLetter]?.available || 0;
  };

  const getTotalCapacity = (enclosureLetter: string): number => {
    return stats.byEnclosure?.[enclosureLetter]?.totalCapacity || 0;
  };

  return (
    <div className="min-h-screen p-8 bg-dark-surface">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Seat Allocation Management
          </h1>
          <p className="text-gray-600">
            Run seat allocation algorithm or reset allocations for any enclosure. Reserved seats are automatically skipped.
          </p>
        </div>

        {/* Global Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Total Attendees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.totalAttendees}</p>
              <p className="text-blue-100 text-sm mt-1">Eligible for allocation</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Allocated Seats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.totalAllocated}</p>
              <p className="text-green-100 text-sm mt-1">
                {stats.totalAttendees > 0 
                  ? `${((stats.totalAllocated / stats.totalAttendees) * 100).toFixed(1)}% complete`
                  : '0% complete'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Unallocated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.totalUnallocated}</p>
              <p className="text-orange-100 text-sm mt-1">Pending allocation</p>
            </CardContent>
          </Card>
        </div>

        {/* Global Actions */}
        <Card className="mb-8 border-2 bg-dark-bg">
          <CardHeader>
            <CardTitle className="text-purple-900">Global Actions</CardTitle>
            <CardDescription className="text-purple-700">
              Manage seat allocations across all enclosures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mt-3">
              <Button
                onClick={handleAllocateAll}
                disabled={loading !== null}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                {loading === 'allocate-all' ? 'Allocating...' : 'Allocate All Enclosures'}
              </Button>
              <Button
                onClick={handleResetAll}
                disabled={loading !== null}
                variant="danger"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {loading === 'reset-all' ? 'Resetting...' : 'Reset All Allocations'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enclosures Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {enclosures.map((enclosure) => {
            const totalSeats = calculateTotalSeats(enclosure);
            const reservedSeats = calculateReservedSeats(enclosure);
            const allocatedSeats = getAllocatedSeats(enclosure.letter);
            const availableSeats = getAvailableSeats(enclosure.letter);
            const utilizationPercent = totalSeats > 0 
              ? ((allocatedSeats / (totalSeats - reservedSeats)) * 100).toFixed(1)
              : 0;

            return (
              <Card 
                key={enclosure.id} 
                className="hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
              >
                <CardHeader className="bg-dark-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl text-blue-400">
                        Enclosure {enclosure.letter}
                      </CardTitle>
                      <CardDescription className="text-blue-700 mt-1">
                        {enclosure.name || enclosure.allocatedFor}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Utilization</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {utilizationPercent}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className=" bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-lg">
                      <div className="text-sm text-white mb-1">Total Seats</div>
                      <div className="text-2xl font-bold text-gray-900">{totalSeats}</div>
                    </div>
                    <div className="bg-accent-red p-4 rounded-lg">
                      <div className="text-sm text-white mb-1">Reserved</div>
                      <div className="text-2xl font-bold text-white">{reservedSeats}</div>
                    </div>
                    <div className="bg-accent-green p-4 rounded-lg">
                      <div className="text-sm text-black mb-1">Allocated</div>
                      <div className="text-2xl font-bold text-black">{allocatedSeats}</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-blue-600 mb-1">Available</div>
                      <div className="text-2xl font-bold text-blue-600">{availableSeats}</div>
                    </div>
                  </div>

                  {/* Row Information */}
                  <div className="mb-6 p-4 bg-dark-surface rounded-lg">
                    <div className="text-sm font-semibold text-white mb-2">
                      Rows Configuration
                    </div>
                    <div className="text-sm text-white">
                      {enclosure.rows.length} rows (
                      {enclosure.rows.map(r => r.letter).join(', ')})
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => handleAllocateEnclosure(enclosure.letter)}
                      disabled={loading !== null}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      {loading === `allocate-${enclosure.letter}` 
                        ? 'Allocating...' 
                        : 'Run Allocation'
                      }
                    </Button>
                    <Button
                      onClick={() => handleResetEnclosure(enclosure.letter)}
                      disabled={loading !== null || allocatedSeats === 0}
                      variant="danger"
                      className="flex-1"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {loading === `reset-${enclosure.letter}` 
                        ? 'Resetting...' 
                        : 'Reset'
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Information Box */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 space-y-2">
            <p>
              <strong>Allocation Algorithm:</strong> Automatically assigns seats to eligible attendees row by row, 
              skipping reserved seats (both admin-reserved and row-level reserved seats).
            </p>
            <p>
              <strong>Reserved Seats:</strong> Any seats marked as reserved (either through admin seat reservation 
              or in row configuration) will be skipped during allocation.
            </p>
            <p>
              <strong>Reset:</strong> Clearing allocations only removes seat assignments. Reserved seats remain 
              intact and can be managed separately.
            </p>
            <p>
              <strong>Per-Enclosure Control:</strong> Run allocation or reset for specific enclosures without 
              affecting others, or use global actions to manage all enclosures at once.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
