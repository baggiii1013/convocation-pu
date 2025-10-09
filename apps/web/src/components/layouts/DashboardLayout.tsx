'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import * as React from 'react';
import { BottomNav } from './BottomNav';
import { Breadcrumb } from './Breadcrumb';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  showSearch?: boolean;
  notificationCount?: number;
  className?: string;
}

export function DashboardLayout({
  children,
  breadcrumbs,
  showSearch = true,
  notificationCount = 0,
  className,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Close sidebar on route change (for mobile)
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [breadcrumbs]);

  return (
    <div className="relative flex min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:ml-0">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          showSearch={showSearch}
          notificationCount={notificationCount}
        />

        {/* Main Content */}
        <main className="flex-1">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="border-b border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card">
              <div className="container mx-auto px-4 py-3 md:px-6">
                <Breadcrumb items={breadcrumbs} />
              </div>
            </div>
          )}

          {/* Page Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'container mx-auto px-4 py-6 md:px-6',
              'pb-24 lg:pb-6', // Extra padding for mobile bottom nav
              className
            )}
          >
            {children}
          </motion.div>
        </main>

        {/* Bottom Navigation (Mobile) */}
        <BottomNav />
      </div>
    </div>
  );
}
