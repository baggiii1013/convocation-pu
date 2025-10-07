# Phase 3: Layout Components - Detailed Implementation Guide

## 📋 Overview

**Timeline**: 1-2 weeks (7-10 working days)
**Focus**: Building responsive layout components with navigation
**Prerequisites**: Phase 1 (Foundation) and Phase 2 (Core UI Components) must be completed

---

## 🎯 Goals

- ✅ Create responsive Header with navigation
- ✅ Build collapsible Sidebar for desktop
- ✅ Implement Bottom Navigation for mobile
- ✅ Add Breadcrumb navigation
- ✅ Create Dashboard Layout wrapper
- ✅ Implement dark mode toggle
- ✅ Add user menu with dropdown
- ✅ Ensure mobile-first responsive design
- ✅ Test across all breakpoints

---

## 📦 Components to Build

1. **Header** - Top navigation bar
2. **Sidebar** - Side navigation menu (desktop)
3. **Bottom Navigation** - Fixed bottom nav (mobile)
4. **Breadcrumb** - Page location indicator
5. **Dashboard Layout** - Main layout wrapper
6. **UserMenu** - Profile dropdown
7. **ThemeToggle** - Dark/light mode switch
8. **MobileMenu** - Hamburger menu for mobile

---

## 📅 Day-by-Day Implementation

### **DAY 1-2: Header Component**

#### Step 1: Create Header Component

**File**: `/apps/web/src/components/layouts/Header.tsx`

```tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { UserMenu } from './UserMenu';
import { ThemeToggle } from './ThemeToggle';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick?: () => void;
  showSearch?: boolean;
  className?: string;
}

export function Header({ onMenuClick, showSearch = true, className }: HeaderProps) {
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
      transition={{ duration: 0.3 }}
      className={cn(
        'sticky top-0 z-50 w-full border-b border-gray-200 dark:border-dark-border transition-all duration-300',
        isScrolled
          ? 'bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg shadow-md'
          : 'bg-white dark:bg-dark-bg',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="hidden md:inline font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
                PU Convocation
              </span>
            </Link>
          </div>

          {/* Center Section - Search */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-md">
              <Input
                type="search"
                placeholder="Search..."
                leftIcon={<Search className="h-4 w-4" />}
                className="w-full"
              />
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search (Mobile) */}
            {showSearch && (
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Badge
                variant="error"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                3
              </Badge>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
```

#### Step 2: Create Theme Toggle Component

**File**: `/apps/web/src/components/layouts/ThemeToggle.tsx`

```tsx
'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    // Get initial theme from localStorage or system preference
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const initialTheme = storedTheme || systemTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'light' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

#### Step 3: Create User Menu Component

**File**: `/apps/web/src/components/layouts/UserMenu.tsx`

```tsx
'use client';

import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

export function UserMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface p-2 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline text-sm font-medium">John Doe</span>
          <ChevronDown className="h-4 w-4 hidden md:inline" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border shadow-lg p-1 animate-fade-in"
          sideOffset={5}
          align="end"
        >
          {/* User Info */}
          <div className="px-3 py-2 border-b border-gray-200 dark:border-dark-border">
            <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">john@example.com</p>
          </div>

          {/* Menu Items */}
          <DropdownMenu.Item
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer outline-none hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
            asChild
          >
            <a href="/profile">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </a>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer outline-none hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
            asChild
          >
            <a href="/settings">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </a>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-dark-border my-1" />

          <DropdownMenu.Item
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer outline-none hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors"
            asChild
          >
            <button>
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
```

---

### **DAY 3-4: Sidebar Component**

#### Step 1: Create Sidebar Component

**File**: `/apps/web/src/components/layouts/Sidebar.tsx`

```tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  Users,
  Settings,
  FileText,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

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
  { title: 'Venues', href: '/venues', icon: MapPin },
  { title: 'Reports', href: '/reports', icon: FileText },
  { title: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ isOpen = true, onClose, className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border transition-all duration-300',
          collapsed ? 'w-20' : 'w-64',
          'lg:translate-x-0',
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-dark-border">
            {!collapsed && (
              <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                  PU Conv
                </span>
              </Link>
            )}
            
            {/* Collapse Button (Desktop only) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative',
                    isActive
                      ? 'bg-gradient-primary text-white shadow-md shadow-primary-500/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface',
                    collapsed && 'justify-center'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 font-medium">{item.title}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500 text-white">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                      {item.title}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-border">
            {!collapsed ? (
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100 dark:bg-dark-surface">
                <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    Admin
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                  JD
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
```

---

### **DAY 5-6: Bottom Navigation (Mobile)**

#### Step 1: Create Bottom Navigation Component

**File**: `/apps/web/src/components/layouts/BottomNav.tsx`

```tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { title: 'Home', href: '/dashboard', icon: Home },
  { title: 'Events', href: '/events', icon: Calendar },
  { title: 'Attendees', href: '/attendees', icon: Users },
  { title: 'Settings', href: '/settings', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-gray-200 dark:border-dark-border bg-white/80 dark:bg-dark-card/80 backdrop-blur-lg"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full gap-1 relative"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'flex flex-col items-center gap-1',
                  isActive ? 'text-primary-500' : 'text-gray-600 dark:text-gray-400'
                )}
              >
                <div className={cn(
                  'relative p-2 rounded-xl transition-all duration-200',
                  isActive && 'bg-primary-500/10'
                )}>
                  <Icon className="h-5 w-5" />
                  {isActive && (
                    <motion.div
                      layoutId="bottomNav"
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary-500"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </div>
                <span className="text-xs font-medium">{item.title}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
```

---

### **DAY 7: Breadcrumb Component**

#### Step 1: Create Breadcrumb Component

**File**: `/apps/web/src/components/layouts/Breadcrumb.tsx`

```tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      className={cn('flex items-center text-sm', className)}
    >
      <ol className="flex items-center gap-2">
        {/* Home */}
        <li>
          <Link
            href="/dashboard"
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>

        {/* Breadcrumb Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  {item.title}
                </Link>
              ) : (
                <span className="text-gray-900 dark:text-white font-medium">
                  {item.title}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```

---

### **DAY 8-9: Dashboard Layout**

#### Step 1: Create Dashboard Layout Component

**File**: `/apps/web/src/components/layouts/DashboardLayout.tsx`

```tsx
'use client';

import * as React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Breadcrumb } from './Breadcrumb';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function DashboardLayout({
  children,
  breadcrumbs,
  title,
  actions,
  className,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 py-6"
          >
            {/* Breadcrumb */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumb items={breadcrumbs} className="mb-4" />
            )}

            {/* Page Header */}
            {(title || actions) && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                {title && (
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </h1>
                )}
                {actions && <div className="flex items-center gap-2">{actions}</div>}
              </div>
            )}

            {/* Content */}
            <div className={cn('space-y-6', className)}>{children}</div>
          </motion.div>
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav />
    </div>
  );
}
```

---

### **DAY 10: Testing & Documentation**

#### Step 1: Create Test Page

**File**: `/apps/web/src/app/test/layouts/page.tsx`

```tsx
'use client';

import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function LayoutTest() {
  return (
    <DashboardLayout
      breadcrumbs={[
        { title: 'Settings', href: '/settings' },
        { title: 'Profile' },
      ]}
      title="Layout Test Page"
      actions={
        <>
          <Button variant="outline">Cancel</Button>
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Create New
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Card {i}</CardTitle>
              <CardDescription>Test card content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                This is a test card to demonstrate the layout system.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
```

#### Step 2: Test Responsive Behavior

Open browser dev tools and test:

1. **Desktop (>1024px)**:
   - ✅ Sidebar visible on the left
   - ✅ Header at the top
   - ✅ No bottom navigation
   - ✅ Content has proper spacing

2. **Tablet (768px - 1024px)**:
   - ✅ Sidebar hidden by default
   - ✅ Hamburger menu shows sidebar
   - ✅ Header responsive
   - ✅ Bottom nav appears

3. **Mobile (<768px)**:
   - ✅ Sidebar opens as overlay
   - ✅ Bottom navigation fixed
   - ✅ Header compact
   - ✅ Content full width

---

## ✅ Phase 3 Checklist

By the end of this phase, you should have:

- [ ] Responsive Header component
- [ ] Collapsible Sidebar for desktop
- [ ] Bottom Navigation for mobile
- [ ] Breadcrumb navigation
- [ ] Dashboard Layout wrapper
- [ ] Theme toggle (dark/light mode)
- [ ] User menu with dropdown
- [ ] Mobile menu overlay
- [ ] Tested across all breakpoints
- [ ] Smooth animations and transitions
- [ ] Keyboard navigation support

---

## 🎨 Design Features Applied

### 1. **Glassmorphism**
- Header uses backdrop blur when scrolled
- Bottom nav has semi-transparent background

### 2. **Smooth Animations**
- Framer Motion for page transitions
- Sidebar slide animation
- Active state indicators

### 3. **Responsive Design**
- Mobile-first approach
- Breakpoint-specific layouts
- Touch-friendly targets (48px min)

### 4. **Accessibility**
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus visible states

---

## 🔧 Troubleshooting

### Issue: Sidebar not opening on mobile

**Solution:**
```tsx
// Make sure state is managed correctly
const [sidebarOpen, setSidebarOpen] = useState(false);

// And passed to both Header and Sidebar
<Header onMenuClick={() => setSidebarOpen(true)} />
<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
```

### Issue: Bottom nav covering content

**Solution:**
```css
/* Add padding to main content */
main {
  padding-bottom: calc(4rem + env(safe-area-inset-bottom));
}
```

### Issue: Theme not persisting

**Solution:**
```tsx
// Check localStorage is working
useEffect(() => {
  const theme = localStorage.getItem('theme');
  console.log('Stored theme:', theme);
}, []);
```

---

## 📚 Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Radix UI Dropdown Menu](https://www.radix-ui.com/docs/primitives/components/dropdown-menu)
- [CSS Safe Area](https://developer.mozilla.org/en-US/docs/Web/CSS/env)

---

## 🚀 Next Steps

Once Phase 3 is complete, proceed to **Phase 4: Landing Page Redesign** where you'll redesign:
- Hero section with animations
- Event information cards
- About section
- VIP guests showcase
- Footer with links

---

**Phase 3 Timeline**: 1-2 weeks
**Status**: Ready to implement
**Dependencies**: Phase 1 & 2 must be complete

Good luck! 🎉
