'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import * as React from 'react';
import { PageTransition } from '../animations/PageTransition';
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
  className?: string;
}

export function DashboardLayout({
  children,
  breadcrumbs,
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
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
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
          <PageTransition>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'container mx-auto px-4 py-8 md:px-6 md:py-10',
                'pb-24 lg:pb-10', // Extra padding for mobile bottom nav
                className
              )}
            >
              {children}
            </motion.div>
          </PageTransition>
        </main>

        {/* Bottom Navigation (Mobile) */}
        <BottomNav />
      </div>
    </div>
  );
}
