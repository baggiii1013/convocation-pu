'use client';

import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-1 text-sm', className)}
    >
      {/* Home Link */}
      <Link
        href="/dashboard"
        className={cn(
          'flex items-center gap-1 rounded-md px-2 py-1 transition-colors',
          'text-muted-foreground hover:text-foreground hover:bg-primary-50 dark:hover:bg-primary-900/20'
        )}
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>

      {/* Breadcrumb Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {/* Separator */}
            <ChevronRight className="h-4 w-4 text-muted-foreground" />

            {/* Item */}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className={cn(
                  'rounded-md px-2 py-1 transition-colors',
                  'text-muted-foreground hover:text-foreground hover:bg-primary-50 dark:hover:bg-primary-900/20'
                )}
              >
                {item.title}
              </Link>
            ) : (
              <span
                className={cn(
                  'rounded-md px-2 py-1',
                  isLast
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground'
                )}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.title}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
