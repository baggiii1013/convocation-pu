"use client";

import DashboardBento from "@/components/DashboardBento";
// import { Button } from "@/components/ui/Button";
// import {
//   RefreshCw,
// } from "lucide-react";
import React from "react";

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

export function DashboardClient() {
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
        {/* <div className="flex items-center gap-3">
          <Button 
            onClick={fetchStats} 
            disabled={refreshing}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div> */}
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
