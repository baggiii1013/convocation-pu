"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
    AlertCircle,
    BarChart3,
    CheckCircle,
    MapPin,
    RefreshCw,
    Users
} from "lucide-react";
import React, { useEffect, useState } from "react";

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

export default function DashboardPage() {
  const [stats, setStats] = useState<AllocationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

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
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-gray-600">Failed to load statistics</p>
          <Button onClick={fetchStats} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
              Seat Allocation Dashboard
            </h1>
            <p className="text-gray-600">
              Overview of seat assignments across all enclosures
            </p>
          </div>
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
