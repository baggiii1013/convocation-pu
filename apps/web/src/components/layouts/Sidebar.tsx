'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    FileText,
    Home,
    Settings,
    Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: Home },
  { title: 'Events', href: '/events', icon: Calendar },
  { title: 'Attendees', href: '/attendees', icon: Users },
  { title: 'Reports', href: '/reports', icon: FileText },
  { title: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ isOpen = true, onClose, className }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ 
          x: isOpen ? 0 : -280,
          width: isCollapsed ? 80 : 280 
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'fixed left-0 top-0 z-50 h-screen border-r border-light-border dark:border-dark-border',
          'bg-light-card dark:bg-dark-card',
          'lg:sticky lg:block',
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Area */}
          <div className="flex h-16 items-center justify-between border-b border-light-border dark:border-dark-border px-4">
            {!isCollapsed && (
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-glow-sm">
                  <span className="text-lg font-bold text-white">PU</span>
                </div>
                <span className="font-bold text-foreground">
                  PU Convocation
                </span>
              </Link>
            )}
            
            {/* Collapse Button (Desktop) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>

            {/* Close Button (Mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    // Close mobile sidebar on navigation
                    if (window.innerWidth < 1024 && onClose) {
                      onClose();
                    }
                  }}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all',
                    'hover:bg-primary-50 dark:hover:bg-primary-900/20',
                    isActive
                      ? 'bg-primary-500 text-white shadow-glow-sm hover:bg-primary-600'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg bg-primary-500"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Content */}
                  <Icon className={cn('relative h-5 w-5 flex-shrink-0', isActive && 'text-white')} />
                  
                  {!isCollapsed && (
                    <>
                      <span className={cn('relative flex-1 text-sm font-medium', isActive && 'text-white')}>
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className={cn(
                          'relative rounded-full px-2 py-0.5 text-xs font-medium',
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400'
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-light-border dark:border-dark-border p-4">
            {!isCollapsed && (
              <div className="rounded-lg bg-primary-50 dark:bg-primary-900/20 p-4">
                <p className="text-sm font-medium text-foreground">Need Help?</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Contact support for assistance
                </p>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  Get Support
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
