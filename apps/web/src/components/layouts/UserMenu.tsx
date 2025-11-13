'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Use actual user data or fallback to defaults
  const userName = user?.name || 'Guest User';
  const userEmail = user?.email || 'guest@example.com';
  const userImage = user?.profileImageURL;

  const handleLogout = async () => {
    await logout();
  };

  const handleProfile = () => {
    router.push('/dashboard/profile');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-2 transition-colors',
            'hover:bg-light-surface dark:hover:bg-dark-surface',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
          )}
        >
          <Avatar size="sm">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback>
              {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            'min-w-[200px] rounded-lg border border-light-border dark:border-dark-border',
            'bg-light-card dark:bg-dark-card shadow-lg',
            'p-1 animate-fade-in',
            'z-50'
          )}
          sideOffset={5}
        >
          <DropdownMenu.Item
            onClick={handleProfile}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer',
              'text-sm text-foreground transition-colors',
              'hover:bg-primary-50 dark:hover:bg-primary-900/20',
              'focus:outline-none focus:bg-primary-50 dark:focus:bg-primary-900/20'
            )}
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={handleSettings}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer',
              'text-sm text-foreground transition-colors',
              'hover:bg-primary-50 dark:hover:bg-primary-900/20',
              'focus:outline-none focus:bg-primary-50 dark:focus:bg-primary-900/20'
            )}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-light-border dark:bg-dark-border my-1" />

          <DropdownMenu.Item
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer',
              'text-sm text-red-600 dark:text-red-400 transition-colors',
              'hover:bg-red-50 dark:hover:bg-red-900/20',
              'focus:outline-none focus:bg-red-50 dark:focus:bg-red-900/20'
            )}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
