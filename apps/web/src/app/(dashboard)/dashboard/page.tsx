'use client';

import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { type DashboardData } from '@/services/dashboard.service';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Skeleton component for loading states
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/2"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-1/2"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // For now, we'll use mock data since the backend endpoint might not exist yet
        // const data = await dashboardService.getDashboardData();
        
        // Mock data for development
        const mockData: DashboardData = {
          stats: {
            upcomingCeremonies: 2,
            myRegistrations: 1,
            attendanceRecords: 3,
            profileCompletion: 85,
          },
          recentConvocations: [
            {
              id: '1',
              title: 'Spring 2024 Graduation',
              date: '2024-05-15',
              venue: 'University Auditorium',
              status: 'UPCOMING',
              isRegistered: true,
              registrationDeadline: '2024-05-01',
            },
            {
              id: '2',
              title: 'Winter 2024 Graduation',
              date: '2024-12-15',
              venue: 'Main Campus',
              status: 'UPCOMING',
              isRegistered: false,
              registrationDeadline: '2024-12-01',
            },
          ],
          notifications: [
            {
              id: '1',
              title: 'Registration Reminder',
              message: 'Spring 2024 graduation registration deadline is approaching',
              type: 'WARNING',
              createdAt: '2024-04-15',
              read: false,
            },
            {
              id: '2',
              title: 'Profile Update',
              message: 'Please complete your profile for better experience',
              type: 'INFO',
              createdAt: '2024-04-10',
              read: true,
            },
          ],
        };
        
        setDashboardData(mockData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here&apos;s your convocation overview.</p>
          </div>
          <DashboardSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !dashboardData) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load dashboard</h3>
          <p className="text-muted-foreground mb-4">{error || 'An unexpected error occurred'}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s your convocation overview and latest updates.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-card to-card/50 border-border hover:border-gold/20 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upcoming Ceremonies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {dashboardData.stats.upcomingCeremonies}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Available for registration
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-border hover:border-gold/20 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                My Registrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {dashboardData.stats.myRegistrations}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active registrations
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-border hover:border-gold/20 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Attendance Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {dashboardData.stats.attendanceRecords}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ceremonies attended
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-border hover:border-gold/20 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Profile Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {dashboardData.stats.profileCompletion}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Complete your profile
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Convocations */}
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Upcoming Convocations</CardTitle>
              <CardDescription>
                Convocation ceremonies you can register for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.recentConvocations.map((convocation) => (
                <div
                  key={convocation.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-gold/20 transition-all duration-300"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">
                      {convocation.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(convocation.date).toLocaleDateString()} • {convocation.venue}
                    </p>
                    {convocation.registrationDeadline && (
                      <p className="text-xs text-gold">
                        Deadline: {new Date(convocation.registrationDeadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {convocation.isRegistered ? (
                      <span className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                        Registered
                      </span>
                    ) : (
                      <Button size="sm" className="bg-gradient-gold text-black">
                        Register
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {dashboardData.recentConvocations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No upcoming convocations available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Notifications</CardTitle>
              <CardDescription>
                Important updates and announcements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read
                      ? 'border-border bg-muted/20'
                      : 'border-gold/20 bg-gradient-gold-subtle'
                  } transition-all duration-300`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <h4 className="font-medium text-foreground">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-gold rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
              {dashboardData.notifications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent notifications</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/dashboard/ceremonies">
                <Card className="border-border hover:border-gold/20 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:shadow-gold-intense transition-all duration-300">
                      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-foreground mb-1">Register</h4>
                    <p className="text-xs text-muted-foreground">For ceremonies</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/profile">
                <Card className="border-border hover:border-gold/20 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:shadow-glow transition-all duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-foreground mb-1">Profile</h4>
                    <p className="text-xs text-muted-foreground">Update details</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/attendance">
                <Card className="border-border hover:border-gold/20 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:border-gold/40 transition-all duration-300">
                      <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-foreground mb-1">Attendance</h4>
                    <p className="text-xs text-muted-foreground">View records</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard/certificates">
                <Card className="border-border hover:border-gold/20 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-gradient-gold group-hover:text-black transition-all duration-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-foreground mb-1">Certificates</h4>
                    <p className="text-xs text-muted-foreground">Download</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
