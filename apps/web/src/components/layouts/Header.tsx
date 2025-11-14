'use client';

import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  className?: string;
}

export function Header({ 
  className 
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user } = useAuth();

  // Determine the correct dashboard URL based on user role
  const dashboardUrl = React.useMemo(() => {
    if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
      return '/admin/dashboard';
    }
    return '/dashboard';
  }, [user?.role]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        isScrolled
          ? 'bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-lg shadow-md'
          : 'bg-light-bg dark:bg-dark-bg',
        className
      )}
    >
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link href={dashboardUrl} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-glow-sm">
            <span className="text-lg font-bold text-white">PU</span>
          </div>
          <span className="hidden font-bold text-foreground sm:inline-block">
            PU Convocation
          </span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </motion.header>
  );
}
