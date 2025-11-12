'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export function Header({ 
  onMenuClick, 
  className 
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);

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
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
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
