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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage convocation system with powerful tools
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
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Access
        </h2>
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
    </div>
  );
}
