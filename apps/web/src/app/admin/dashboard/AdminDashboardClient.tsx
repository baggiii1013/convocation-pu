'use client';

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
    AlertCircle,
    BarChart3,
    CheckCircle,
    Loader2,
    MapPin,
    Play,
    RefreshCw,
    Trash2,
    Users
} from "lucide-react";
import React, { useState } from "react";

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

interface AdminDashboardClientProps {
  initialStats: AllocationStats;
}

export function AdminDashboardClient({ initialStats }: AdminDashboardClientProps) {
  const [stats, setStats] = useState<AllocationStats>(initialStats);
  const [refreshing, setRefreshing] = useState(false);
  const [allocating, setAllocating] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [allocationMessage, setAllocationMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/allocations/stats`, {
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch statistics");
      }
      
      const data = await res.json();
      setStats(data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAllocateSeats = async () => {
    if (!confirm('Are you sure you want to run seat allocation? This will assign seats to all unallocated attendees.')) {
      return;
    }

    setAllocating(true);
    setAllocationMessage(null);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/allocations/allocate-seats`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to allocate seats');
      }

      setAllocationMessage({
        type: 'success',
        text: `Success! ${data.data.allocated} seats allocated${data.data.failed > 0 ? `, ${data.data.failed} failed` : ''}`,
      });

      await fetchStats();
    } catch (error) {
      console.error('Allocation error:', error);
      setAllocationMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to allocate seats',
      });
    } finally {
      setAllocating(false);
    }
  };

  const handleClearAllocations = async () => {
    if (!confirm('WARNING: This will clear ALL seat allocations! This action cannot be undone. Are you sure?')) {
      return;
    }

    setClearing(true);
    setAllocationMessage(null);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/allocations/clear`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to clear allocations');
      }

      setAllocationMessage({
        type: 'success',
        text: `Cleared ${data.data.count} seat allocations`,
      });

      await fetchStats();
    } catch (error) {
      console.error('Clear error:', error);
      setAllocationMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to clear allocations',
      });
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage seat allocations and view statistics
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchStats}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Alert Message */}
      {allocationMessage && (
        <Card className={allocationMessage.type === 'success' ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {allocationMessage.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <p className={allocationMessage.type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                {allocationMessage.text}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Allocate Seats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-blue-500" />
              Allocate Seats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Run the automatic seat allocation algorithm to assign seats to all unallocated attendees.
            </p>
            <Button
              onClick={handleAllocateSeats}
              disabled={allocating || clearing}
              className="w-full gap-2"
            >
              {allocating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Allocating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Allocation
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Clear Allocations Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Clear Allocations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Remove all seat allocations. This action cannot be undone.
            </p>
            <Button
              onClick={handleClearAllocations}
              disabled={allocating || clearing}
              variant="danger"
              className="w-full gap-2"
            >
              {clearing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttendees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Registered participants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Allocated</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.totalAllocated.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalAttendees > 0 
                ? `${((stats.totalAllocated / stats.totalAttendees) * 100).toFixed(1)}% of total`
                : '0% of total'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unallocated</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stats.totalUnallocated.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting allocation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enclosures</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnclosures}</div>
            <p className="text-xs text-muted-foreground">Available sections</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      {Object.keys(stats.byCategory).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Allocation by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div
                  key={category}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <span className="text-sm font-medium">{category || 'Uncategorized'}</span>
                  <span className="text-sm text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enclosure Statistics */}
      {stats.enclosureStats && stats.enclosureStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Enclosure Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.enclosureStats.map((enclosure) => (
                <div key={enclosure.letter} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{enclosure.letter}</span>
                      <span className="text-muted-foreground">{enclosure.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({enclosure.allocatedFor})
                      </span>
                    </div>
                    <span className="font-medium">
                      {enclosure.allocatedSeats} / {enclosure.totalSeats}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-all"
                      data-width={enclosure.utilizationRate}
                      style={{ width: `${enclosure.utilizationRate}%` } as React.CSSProperties}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{enclosure.utilizationRate.toFixed(1)}% utilized</span>
                    <span>{enclosure.availableSeats} available</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
