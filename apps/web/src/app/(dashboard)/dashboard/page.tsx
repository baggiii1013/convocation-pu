import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import {
  BarChart3,
  Calendar,
  Upload,
  UserPlus,
} from "lucide-react";
import { Suspense } from "react";

// This would come from your API
async function getDashboardStats() {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/dashboard/stats');
  // return await response.json();
  
  return {
    totalAttendees: 1234,
    totalAttendeesChange: "+12.5%",
    totalAttendeesTrend: "up" as const,
    
    upcomingEvents: 3,
    upcomingEventsChange: "2 this week",
    upcomingEventsTrend: "neutral" as const,
    
    checkedIn: 856,
    checkedInChange: "+8.2%",
    checkedInTrend: "up" as const,
    
    venues: 5,
    venuesChange: "2 active",
    venuesTrend: "neutral" as const,
  };
}

function DashboardSkeleton() {
  return (
    <>
      {/* Welcome Banner Skeleton */}
      <div className="h-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800 mb-6" />
      
      {/* Stats Cards Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"
          />
        ))}
      </div>
    </>
  );
}

async function DashboardContent() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Stats Grid */}
      <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <StatsCard
            title="Total Attendees"
            value={stats.totalAttendees.toLocaleString()}
            change={stats.totalAttendeesChange}
            trend={stats.totalAttendeesTrend}
            iconName="Users"
            iconColor="text-primary-600"
            iconBgColor="bg-primary-100 dark:bg-primary-900/30"
          />
        </StaggerItem>

        <StaggerItem>
          <StatsCard
            title="Upcoming Events"
            value={stats.upcomingEvents}
            change={stats.upcomingEventsChange}
            trend={stats.upcomingEventsTrend}
            iconName="Calendar"
            iconColor="text-accent-blue"
            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          />
        </StaggerItem>

        <StaggerItem>
          <StatsCard
            title="Checked In"
            value={stats.checkedIn.toLocaleString()}
            change={stats.checkedInChange}
            trend={stats.checkedInTrend}
            iconName="CheckCircle2"
            iconColor="text-green-600"
            iconBgColor="bg-green-100 dark:bg-green-900/30"
          />
        </StaggerItem>

        <StaggerItem>
          <StatsCard
            title="Active Venues"
            value={stats.venues}
            change={stats.venuesChange}
            trend={stats.venuesTrend}
            iconName="MapPin"
            iconColor="text-orange-600"
            iconBgColor="bg-orange-100 dark:bg-orange-900/30"
          />
        </StaggerItem>
      </StaggerChildren>

      {/* Quick Actions and Activity Feed */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <QuickActionCard
              title="Register Attendee"
              description="Add new attendees to upcoming events"
              icon={UserPlus}
              href="/dashboard/attendees/new"
            />
            <QuickActionCard
              title="Upload Attendance"
              description="Bulk upload attendance data via Excel"
              icon={Upload}
              href="/dashboard/attendance/upload"
            />
            <QuickActionCard
              title="Manage Events"
              description="Create and configure convocation events"
              icon={Calendar}
              href="/dashboard/events"
            />
            <QuickActionCard
              title="View Reports"
              description="Access analytics and attendance reports"
              icon={BarChart3}
              href="/dashboard/reports"
            />
          </div>
        </div>

        {/* Activity Feed */}
        <ActivityFeed />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

