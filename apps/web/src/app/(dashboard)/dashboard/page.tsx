'use client';

import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Upcoming Ceremonies',
      value: '3',
      description: 'Ceremonies you can register for',
      href: '/dashboard/ceremonies',
    },
    {
      title: 'My Registrations',
      value: '1',
      description: 'Active registrations',
      href: '/dashboard/registrations',
    },
    {
      title: 'Attendance Records',
      value: '2',
      description: 'Ceremonies attended',
      href: '/dashboard/attendance',
    },
    {
      title: 'Profile Completion',
      value: '85%',
      description: 'Complete your profile',
      href: '/dashboard/profile',
    },
  ];

  const quickActions = [
    {
      title: 'Register for Ceremony',
      description: 'Browse and register for upcoming convocation ceremonies',
      href: '/dashboard/ceremonies',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: 'Update Profile',
      description: 'Keep your information up to date',
      href: '/dashboard/profile',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      title: 'View Registrations',
      description: 'Check status of your ceremony registrations',
      href: '/dashboard/registrations',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Welcome back, {user?.displayName}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Here's what's happening with your convocation activities.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription>{stat.title}</CardDescription>
                <CardTitle className="text-2xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  {stat.description}
                </p>
                <Link href={stat.href}>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <Card key={action.title} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="text-slate-600 dark:text-slate-400">
                      {action.icon}
                    </div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </div>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={action.href}>
                    <Button size="sm" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest convocation-related activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    Registered for Spring 2024 Convocation
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    2 days ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    Profile updated
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    1 week ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    Attended Fall 2023 Convocation
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    3 months ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
