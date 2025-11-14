'use client';

import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Calendar, Home, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Determine the correct dashboard URL based on user role
  const dashboardUrl = React.useMemo(() => {
    if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
      return '/admin/dashboard';
    }
    return '/dashboard';
  }, [user?.role]);

  const navItems: NavItem[] = [
    { title: 'Home', href: dashboardUrl, icon: Home },
    { title: 'Events', href: '/events', icon: Calendar },
    { title: 'Attendees', href: '/attendees', icon: Users },
    { title: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 lg:hidden',
        'border-t border-light-border dark:border-dark-border',
        'bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-lg',
        'safe-area-inset-bottom'
      )}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex min-w-[60px] flex-col items-center gap-1 rounded-lg px-3 py-2',
                'transition-colors duration-200',
                isActive
                  ? 'text-primary-500'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 rounded-lg bg-primary-50 dark:bg-primary-900/20"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon */}
              <div className="relative">
                <Icon
                  className={cn(
                    'h-6 w-6 transition-transform',
                    isActive && 'scale-110'
                  )}
                />
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -inset-2 -z-10 rounded-full bg-primary-500/20 blur-sm"
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'relative text-xs font-medium',
                  isActive ? 'text-primary-600 dark:text-primary-400' : ''
                )}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
