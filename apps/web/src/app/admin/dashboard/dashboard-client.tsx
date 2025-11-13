'use client';

import DashboardBento from "@/components/DashboardBento";
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

interface DashboardClientProps {
  initialStats: AllocationStats;
}

export function DashboardClient({ initialStats }: DashboardClientProps) {
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

      // Refresh stats after allocation
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

      // Refresh stats after clearing
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

  const allocationRate = stats.totalAttendees > 0 
    ? ((stats.totalAllocated / stats.totalAttendees) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Quick access to all system features
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={fetchStats} 
              disabled={refreshing}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Dashboard Bento - Quick Navigation */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
          <DashboardBento 
            userRole="admin"
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={false}
            clickEffect={true}
            enableMagnetism={true}
            spotlightRadius={300}
            particleCount={8}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Seat Allocation Overview
          </h2>
          <p className="text-gray-600">
            Overview of seat assignments across all enclosures
          </p>
        </div>

        {/* Allocation Actions */}
        <Card className="mb-8 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Seat Allocation Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Status Message */}
              {allocationMessage && (
                <div className={`p-4 rounded-lg ${
                  allocationMessage.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  <p className="font-medium">{allocationMessage.text}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Button
                    onClick={handleAllocateSeats}
                    disabled={allocating || clearing}
                    className="w-full gap-2 bg-green-600 hover:bg-green-700"
                  >
                    {allocating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Allocating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Run Seat Allocation
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Automatically assign seats to all unallocated attendees
                  </p>
                </div>

                <div className="flex-1">
                  <Button
                    onClick={handleClearAllocations}
                    disabled={allocating || clearing}
                    variant="outline"
                    className="w-full gap-2 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    {clearing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Clearing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Clear All Allocations
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Remove all seat assignments (cannot be undone)
                  </p>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">How Seat Allocation Works:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>Attendees must have an assigned enclosure in the database</li>
                      <li>Seats are assigned sequentially within each enclosure</li>
                      <li>Reserved seats (admin + row reservations) are automatically skipped</li>
                      <li>Only attendees with convocationEligible = true are processed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Attendees */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Attendees
              </CardTitle>
              <Users className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {stats.totalAttendees.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Registered for convocation
              </p>
            </CardContent>
          </Card>

          {/* Allocated Seats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Allocated Seats
              </CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats.totalAllocated.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {allocationRate}% allocation rate
              </p>
            </CardContent>
          </Card>

          {/* Unallocated */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Unallocated
              </CardTitle>
              <AlertCircle className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {stats.totalUnallocated.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Awaiting assignment
              </p>
            </CardContent>
          </Card>

          {/* Total Enclosures */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Enclosures
              </CardTitle>
              <MapPin className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {stats.totalEnclosures}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Active venues
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Allocation by Category */}
        {Object.keys(stats.byCategory).length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Allocation by Enclosure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Object.entries(stats.byCategory).map(([enclosure, count]) => (
                  <div 
                    key={enclosure} 
                    className="bg-gray-50 rounded-lg p-4 text-center"
                  >
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {count}
                    </div>
                    <div className="text-sm text-gray-600">
                      Enclosure {enclosure}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enclosure Statistics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Enclosure Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Enclosure
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Total Seats
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Allocated
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Available
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Utilization
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.enclosureStats.map((enclosure) => (
                    <tr 
                      key={enclosure.letter} 
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                            {enclosure.letter}
                          </div>
                          <span className="font-medium">{enclosure.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {enclosure.allocatedFor}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {enclosure.totalSeats.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-green-600 font-medium">
                        {enclosure.allocatedSeats.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        {enclosure.availableSeats.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                              style={{ width: `${Math.min(enclosure.utilizationRate, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700 w-12 text-right">
                            {enclosure.utilizationRate.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
