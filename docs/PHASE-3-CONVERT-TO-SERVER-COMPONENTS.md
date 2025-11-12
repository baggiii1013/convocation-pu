# Phase 3: Convert Pages to Server Components

## 📋 Quick Start

**New to this phase?** Start here:
1. Read the [Overview](#overview) below
2. Follow the [First Conversion Guide](./PHASE-3-FIRST-CONVERSION-GUIDE.md) (30 min tutorial)
3. Use the [Quick Reference](./PHASE-3-QUICK-REFERENCE.md) while working
4. Come back here for detailed patterns and troubleshooting

**Status**: 📋 PLANNED  
**Estimated Time**: 1-2 weeks  
**Prerequisites**: Phase 1 (Middleware) ✅ & Phase 2 (Server Auth Utilities) ✅

---

## Overview

Phase 3 systematically migrates all protected pages from Client Components to Server Components, moving authentication checks and data fetching to the server. This builds on the Phase 2 server-side auth utilities and provides better performance, security, and user experience.

## Why Convert to Server Components?

### Before (Client Components):
```tsx
'use client';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Client-side data fetching
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return <div>Loading...</div>;
  return <div>{data}</div>;
}
```

**Problems:**
- ❌ Waterfall loading (HTML → JS → Data)
- ❌ Loading states needed
- ❌ Client-side API calls
- ❌ Larger bundle size
- ❌ No SSR benefits
- ❌ Auth checked on client

### After (Server Components):
```tsx
import { requireAuth } from '@/lib/auth';

export default async function DashboardPage() {
  // Server-side auth (runs before render)
  const session = await requireAuth();
  
  // Server-side data fetching (parallel with auth)
  const data = await db.posts.findMany({
    where: { userId: session.user.id }
  });
  
  return <div>{data}</div>;
}
```

**Benefits:**
- ✅ Faster initial load
- ✅ No loading states needed
- ✅ Direct database access
- ✅ Smaller bundle size
- ✅ Better SEO
- ✅ Auth on server

## Current State Analysis

### Pages Requiring Conversion (14 total):

#### Admin Pages (8):
1. `/admin/users` - User management ⚠️ Complex
2. `/admin/upload-students` - Excel upload ⚠️ Complex
3. `/admin/create-account` - Account creation ⚠️ Complex
4. `/admin/enclosures` - Enclosure management ⚠️ Complex
5. `/admin/reserve-seats` - Seat reservation ⚠️ Complex
6. `/admin/aerial-view-editor` - Aerial view editor ⚠️ Complex
7. `/admin/aerial-view` - Aerial view display (needs inspection)
8. `/admin/dashboard` - Admin dashboard (needs inspection)

#### User Pages (2):
9. `/profile` - Profile redirect ✅ Simple
10. `/settings` - User settings ⚠️ Medium

#### Auth Pages (3):
11. `/login` - Login form ⚠️ Special (keep as client)
12. `/forgot-password` - Password reset request ⚠️ Special (keep as client)
13. `/reset-password` - Password reset form ⚠️ Special (keep as client)

#### Test Pages (1):
14. Various test pages - Can be ignored or deleted

**Note**: Auth pages (`/login`, `/forgot-password`, `/reset-password`) should remain as Client Components since they don't require authentication and are form-heavy.

## Conversion Strategy

### Priority Order:

**Week 1: High Priority (Admin Pages)**
1. Day 1-2: `/admin/dashboard` - Simple, good starting point
2. Day 2-3: `/admin/enclosures` - Moderate complexity
3. Day 3-4: `/admin/users` - Complex but critical
4. Day 4-5: `/admin/create-account` - Form-heavy

**Week 2: Medium Priority**
5. Day 6-7: `/admin/upload-students` - Complex Excel handling
6. Day 7-8: `/admin/reserve-seats` - Seat management
7. Day 8-9: `/admin/aerial-view-editor` - Complex UI
8. Day 9-10: `/settings` - User settings
9. Day 10: `/profile` - Simple redirect

**Low Priority (As needed)**
- Test pages can be deleted or left as-is

## Conversion Process (Step-by-Step)

### Step 1: Analysis Phase

Before touching any code, analyze the page:

```bash
# Questions to answer:
1. What auth level is required? (requireAuth, requireAdmin, requireStaff)
2. What data does it fetch? (API calls, database queries)
3. What's interactive? (forms, buttons, modals, state)
4. What can move to server? (data fetching, auth checks)
5. What must stay client? (onClick, useState, forms with validation)
```

### Step 2: Create Server Component

```tsx
// BEFORE: apps/web/src/app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);
  
  const handleDelete = (id) => { /* ... */ };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          {user.name}
          <button onClick={() => handleDelete(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

```tsx
// AFTER: apps/web/src/app/admin/users/page.tsx (Server Component)
import { requireAdmin } from '@/lib/auth';
import { UsersTable } from './users-table.client';

// Direct DB import (server-side only)
import { db } from '@/lib/db';

export default async function UsersPage() {
  // 1. Server-side auth check
  const session = await requireAdmin();
  
  // 2. Server-side data fetching
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' }
  });
  
  // 3. Render with client component for interactivity
  return (
    <div>
      <h1>Manage Users</h1>
      <UsersTable users={users} />
    </div>
  );
}
```

### Step 3: Extract Client Component

```tsx
// NEW: apps/web/src/app/admin/users/users-table.client.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [localUsers, setLocalUsers] = useState(users);
  
  const handleDelete = async (id: string) => {
    // Client-side interaction
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    setLocalUsers(prev => prev.filter(u => u.id !== id));
  };
  
  return (
    <table>
      <tbody>
        {localUsers.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              <Button onClick={() => handleDelete(user.id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Step 4: Update Imports

```tsx
// Server Component can import:
✅ Other Server Components
✅ Database utilities (Prisma)
✅ Server-only libraries
✅ Auth utilities from @/lib/auth
✅ Client Components (as children)

// Server Component CANNOT import:
❌ React hooks (useState, useEffect, etc.)
❌ Browser APIs (window, document, localStorage)
❌ Client-side libraries (axios on client)
❌ Event handlers directly
```

## Detailed Conversion Templates

### Template 1: Simple Page (Profile Redirect)

**Complexity**: ✅ Low  
**Time**: 30 minutes  

```tsx
// BEFORE
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/dashboard/profile');
  }, [router]);
  
  return <div>Redirecting...</div>;
}
```

```tsx
// AFTER
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';

export default async function ProfilePage() {
  await requireAuth();
  redirect('/dashboard/profile');
}
```

**Changes:**
1. ✅ Removed `'use client'`
2. ✅ Added `requireAuth()` for protection
3. ✅ Used server-side `redirect()` instead of router
4. ✅ No loading state needed

---

### Template 2: Data Display Page (Admin Dashboard)

**Complexity**: ⚠️ Medium  
**Time**: 2-4 hours  

```tsx
// BEFORE
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </Card>
        <Card>
          <h3>Active Sessions</h3>
          <p>{stats.activeSessions}</p>
        </Card>
        <Card>
          <h3>Revenue</h3>
          <p>${stats.revenue}</p>
        </Card>
      </div>
    </div>
  );
}
```

```tsx
// AFTER: page.tsx (Server Component)
import { requireAdmin } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { db } from '@/lib/db';

async function getStats() {
  const [totalUsers, activeSessions, revenue] = await Promise.all([
    db.user.count(),
    db.session.count({ where: { expiresAt: { gt: new Date() } } }),
    db.order.aggregate({ _sum: { amount: true } })
  ]);
  
  return {
    totalUsers,
    activeSessions,
    revenue: revenue._sum.amount || 0
  };
}

export default async function AdminDashboard() {
  // Auth check
  const session = await requireAdmin();
  
  // Parallel data fetching
  const stats = await getStats();
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p className="text-sm text-muted-foreground">
        Welcome back, {session.user.name}
      </p>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <Card>
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </Card>
        <Card>
          <h3>Active Sessions</h3>
          <p>{stats.activeSessions}</p>
        </Card>
        <Card>
          <h3>Revenue</h3>
          <p>${stats.revenue}</p>
        </Card>
      </div>
    </div>
  );
}
```

**Changes:**
1. ✅ Removed `'use client'` and all hooks
2. ✅ Added `requireAdmin()` at top
3. ✅ Direct database queries instead of API calls
4. ✅ No loading state (faster initial render)
5. ✅ Parallel fetching with `Promise.all()`
6. ✅ Session data available for personalization

---

### Template 3: CRUD Page with Forms (Users Management)

**Complexity**: ⚠️⚠️ High  
**Time**: 4-8 hours  

This is the most complex pattern. The strategy is:

1. **Server Component (page.tsx)**: Handles auth + initial data fetch
2. **Client Component (users-manager.client.tsx)**: Handles all interactivity
3. **Server Actions (actions.ts)**: Handles mutations

```tsx
// STEP 1: Server Component (page.tsx)
import { requireAdmin } from '@/lib/auth';
import { UsersManager } from './users-manager.client';
import { db } from '@/lib/db';

export default async function ManageUsersPage() {
  await requireAdmin();
  
  // Initial data fetch
  const accounts = await db.account.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20
  });
  
  return <UsersManager initialAccounts={accounts} />;
}
```

```tsx
// STEP 2: Client Component (users-manager.client.tsx)
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { deleteUser, updateUser } from './actions';
import toast from 'react-hot-toast';

interface Account {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface UsersManagerProps {
  initialAccounts: Account[];
}

export function UsersManager({ initialAccounts }: UsersManagerProps) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [loading, setLoading] = useState(false);
  
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteUser(id);
      setAccounts(prev => prev.filter(a => a.id !== id));
      toast.success('User deleted');
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleActive = async (id: string) => {
    setLoading(true);
    try {
      const account = accounts.find(a => a.id === id);
      if (!account) return;
      
      await updateUser(id, { isActive: !account.isActive });
      
      setAccounts(prev =>
        prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a)
      );
      
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h1>Manage Users</h1>
      
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id}>
              <td>{account.email}</td>
              <td>{account.role}</td>
              <td>{account.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                <Button
                  onClick={() => handleToggleActive(account.id)}
                  disabled={loading}
                >
                  Toggle Status
                </Button>
                <Button
                  onClick={() => handleDelete(account.id)}
                  disabled={loading}
                  variant="destructive"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

```tsx
// STEP 3: Server Actions (actions.ts)
'use server';

import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteUser(userId: string) {
  // Always verify auth in server actions
  await requireAdmin();
  
  await db.account.delete({
    where: { id: userId }
  });
  
  revalidatePath('/admin/users');
  
  return { success: true };
}

export async function updateUser(
  userId: string,
  data: { isActive?: boolean; role?: string }
) {
  await requireAdmin();
  
  await db.account.update({
    where: { id: userId },
    data
  });
  
  revalidatePath('/admin/users');
  
  return { success: true };
}
```

**File Structure:**
```
apps/web/src/app/admin/users/
├── page.tsx                    # Server Component (auth + data)
├── users-manager.client.tsx    # Client Component (UI + state)
└── actions.ts                  # Server Actions (mutations)
```

---

### Template 4: Form-Heavy Page (Create Account)

**Complexity**: ⚠️⚠️ High  
**Time**: 3-5 hours  

```tsx
// Server Component (page.tsx)
import { requireAdmin } from '@/lib/auth';
import { CreateAccountForm } from './create-account-form.client';

export default async function CreateAccountPage() {
  await requireAdmin();
  
  return (
    <div className="container max-w-2xl mx-auto py-10">
      <h1>Create New Account</h1>
      <CreateAccountForm />
    </div>
  );
}
```

```tsx
// Client Component (create-account-form.client.tsx)
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { createAccount } from './actions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function CreateAccountForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'STUDENT' as const
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await createAccount(formData);
      
      if (result.success) {
        toast.success('Account created successfully');
        router.push('/admin/users');
      } else {
        toast.error(result.error || 'Failed to create account');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      
      <Input
        label="First Name"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        required
      />
      
      <Input
        label="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        required
      />
      
      <Select
        label="Role"
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
      >
        <option value="STUDENT">Student</option>
        <option value="STAFF">Staff</option>
        <option value="ADMIN">Admin</option>
      </Select>
      
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Account'}
      </Button>
    </form>
  );
}
```

```tsx
// Server Action (actions.ts)
'use server';

import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';

interface CreateAccountInput {
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'STAFF' | 'STUDENT';
}

export async function createAccount(data: CreateAccountInput) {
  try {
    await requireAdmin();
    
    // Check if email exists
    const existing = await db.account.findUnique({
      where: { email: data.email }
    });
    
    if (existing) {
      return { success: false, error: 'Email already exists' };
    }
    
    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    // Create account
    await db.account.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        isActive: true
      }
    });
    
    // TODO: Send email with temporary password
    
    return { success: true };
  } catch (error) {
    console.error('Create account error:', error);
    return { success: false, error: 'Failed to create account' };
  }
}
```

---

## Common Patterns & Solutions

### Pattern 1: Pagination

```tsx
// Server Component with search params
import { requireAdmin } from '@/lib/auth';
import { UsersList } from './users-list.client';
import { db } from '@/lib/db';

interface PageProps {
  searchParams: { page?: string; limit?: string };
}

export default async function UsersPage({ searchParams }: PageProps) {
  await requireAdmin();
  
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '20');
  const skip = (page - 1) * limit;
  
  const [users, total] = await Promise.all([
    db.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    db.user.count()
  ]);
  
  return (
    <UsersList
      users={users}
      page={page}
      limit={limit}
      total={total}
    />
  );
}
```

### Pattern 2: Filtering & Search

```tsx
// Server Component
interface PageProps {
  searchParams: {
    search?: string;
    role?: string;
    status?: string;
  };
}

export default async function UsersPage({ searchParams }: PageProps) {
  await requireAdmin();
  
  const where: any = {};
  
  if (searchParams.search) {
    where.OR = [
      { email: { contains: searchParams.search, mode: 'insensitive' } },
      { firstName: { contains: searchParams.search, mode: 'insensitive' } }
    ];
  }
  
  if (searchParams.role) {
    where.role = searchParams.role;
  }
  
  if (searchParams.status) {
    where.isActive = searchParams.status === 'active';
  }
  
  const users = await db.user.findMany({ where });
  
  return <UsersTable users={users} />;
}
```

### Pattern 3: Modal Dialogs

```tsx
// Client Component with modals
'use client';

import { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';

export function UsersTable({ users }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };
  
  return (
    <>
      <table>
        {/* table content */}
        <button onClick={() => openDeleteDialog(user)}>Delete</button>
      </table>
      
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete {selectedUser?.email}?</p>
        <button onClick={handleConfirmDelete}>Yes, delete</button>
      </Dialog>
    </>
  );
}
```

### Pattern 4: Real-time Updates

```tsx
// Client Component with polling or websockets
'use client';

import { useEffect, useState } from 'react';

export function LiveStats({ initialStats }) {
  const [stats, setStats] = useState(initialStats);
  
  useEffect(() => {
    // Poll every 30 seconds
    const interval = setInterval(async () => {
      const response = await fetch('/api/stats');
      const newStats = await response.json();
      setStats(newStats);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return <div>Active Users: {stats.activeUsers}</div>;
}
```

## Checklist Per Page

Use this checklist for each page conversion:

### Pre-Conversion:
- [ ] Analyze page complexity (Simple/Medium/Complex)
- [ ] Identify all data fetching points
- [ ] List all interactive elements
- [ ] Determine auth requirements
- [ ] Estimate time needed

### During Conversion:
- [ ] Remove `'use client'` from page.tsx
- [ ] Add appropriate auth check (`requireAuth`, `requireAdmin`, etc.)
- [ ] Move data fetching to server
- [ ] Extract interactive parts to client components
- [ ] Create server actions for mutations
- [ ] Update imports (remove hooks, add auth)
- [ ] Add proper TypeScript types

### Post-Conversion:
- [ ] Test auth protection (logged out should redirect)
- [ ] Test role requirements (wrong role should redirect)
- [ ] Test data loading (no loading spinners)
- [ ] Test all interactions (buttons, forms work)
- [ ] Test error handling (network errors, validation)
- [ ] Check bundle size reduction
- [ ] Verify no console errors
- [ ] Test on mobile

## Testing Strategy

### Manual Testing:

For each converted page:

1. **Auth Testing**:
   ```bash
   # Test as unauthenticated
   - Clear cookies
   - Visit page
   - Should redirect to /login
   
   # Test as wrong role
   - Login as STUDENT
   - Visit admin page
   - Should redirect to /unauthorized
   
   # Test as correct role
   - Login as ADMIN
   - Visit admin page
   - Should load correctly
   ```

2. **Functionality Testing**:
   ```bash
   # Test all CRUD operations
   - Create new item
   - Read/view items
   - Update item
   - Delete item
   
   # Test search/filter
   - Enter search query
   - Select filters
   - Verify results
   
   # Test pagination
   - Navigate to page 2
   - Navigate back to page 1
   - Change page size
   ```

3. **Performance Testing**:
   ```bash
   # Measure load times
   - Open DevTools Network tab
   - Hard refresh page
   - Record time to interactive
   - Compare with client component version
   ```

### Automated Testing (Optional):

```tsx
// Example E2E test with Playwright
import { test, expect } from '@playwright/test';

test('admin users page requires authentication', async ({ page }) => {
  await page.goto('/admin/users');
  await expect(page).toHaveURL('/login');
});

test('admin users page loads data', async ({ page, context }) => {
  // Login as admin
  await context.addCookies([
    { name: 'accessToken', value: 'valid-admin-token', domain: 'localhost', path: '/' }
  ]);
  
  await page.goto('/admin/users');
  
  // Should see users table
  await expect(page.locator('table')).toBeVisible();
  await expect(page.locator('tbody tr')).toHaveCount(20);
});
```

## Migration Order & Timeline

### Week 1: Foundation + Simple Pages

**Day 1 (4 hours):**
- ✅ Review Phase 2 auth utilities
- ✅ Set up testing environment
- ⚠️ Convert `/profile` (30 min - simple redirect)
- ⚠️ Convert `/admin/dashboard` (3 hours - data display)

**Day 2 (6 hours):**
- ⚠️ Convert `/admin/enclosures` (6 hours - medium complexity)

**Day 3 (8 hours):**
- ⚠️ Convert `/admin/users` Part 1 (4 hours - setup)
- ⚠️ Convert `/admin/users` Part 2 (4 hours - complete)

**Day 4 (8 hours):**
- ⚠️ Convert `/admin/create-account` (6 hours - forms)
- ⚠️ Testing and bug fixes (2 hours)

**Day 5 (8 hours):**
- ⚠️ Convert `/settings` (4 hours - user settings)
- ⚠️ Comprehensive testing (4 hours)

### Week 2: Complex Pages

**Day 6 (8 hours):**
- ⚠️ Convert `/admin/upload-students` Part 1 (4 hours - setup)
- ⚠️ Convert `/admin/upload-students` Part 2 (4 hours - Excel logic)

**Day 7 (8 hours):**
- ⚠️ Convert `/admin/reserve-seats` (8 hours - complex seat logic)

**Day 8 (8 hours):**
- ⚠️ Convert `/admin/aerial-view-editor` Part 1 (4 hours - setup)
- ⚠️ Convert `/admin/aerial-view-editor` Part 2 (4 hours - editor logic)

**Day 9 (8 hours):**
- ⚠️ Convert `/admin/aerial-view` (4 hours - view display)
- ⚠️ Integration testing (4 hours)

**Day 10 (8 hours):**
- ⚠️ Bug fixes and polish (4 hours)
- ⚠️ Performance optimization (2 hours)
- ⚠️ Final testing and documentation (2 hours)

## Common Pitfalls & Solutions

### Pitfall 1: Async Component Confusion

```tsx
❌ WRONG
export default function MyPage() {
  await requireAuth(); // Error: await in non-async function
}

✅ CORRECT
export default async function MyPage() {
  await requireAuth();
}
```

### Pitfall 2: Mixing Server and Client Code

```tsx
❌ WRONG
import { requireAuth } from '@/lib/auth';

'use client';

export default async function MyPage() {
  await requireAuth(); // Error: server-only module in client component
}

✅ CORRECT
// page.tsx (Server Component)
import { requireAuth } from '@/lib/auth';

export default async function MyPage() {
  await requireAuth();
  return <MyClientComponent />;
}

// my-client-component.tsx
'use client';

export function MyClientComponent() {
  // Client-side code
}
```

### Pitfall 3: Event Handlers in Server Components

```tsx
❌ WRONG
export default async function MyPage() {
  const handleClick = () => { console.log('clicked'); };
  
  return <button onClick={handleClick}>Click</button>;
  // Error: Event handlers can't be passed to client components from server
}

✅ CORRECT
// page.tsx
export default async function MyPage() {
  return <MyButton />;
}

// my-button.tsx
'use client';

export function MyButton() {
  const handleClick = () => { console.log('clicked'); };
  return <button onClick={handleClick}>Click</button>;
}
```

### Pitfall 4: useEffect for Data Fetching

```tsx
❌ WRONG (Old way)
'use client';

export default function MyPage() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(setData);
  }, []);
}

✅ CORRECT (New way)
export default async function MyPage() {
  const data = await fetch('/api/data').then(res => res.json());
  
  return <MyClientComponent data={data} />;
}
```

### Pitfall 5: Forgetting to Revalidate

```tsx
❌ WRONG
'use server';

export async function deleteUser(id: string) {
  await db.user.delete({ where: { id } });
  // Page won't update!
}

✅ CORRECT
'use server';

import { revalidatePath } from 'next/cache';

export async function deleteUser(id: string) {
  await db.user.delete({ where: { id } });
  revalidatePath('/admin/users'); // Refresh the page data
}
```

## Performance Improvements Expected

### Before (Client Components):

```
Browser Request
  ↓ (50ms)
Server: Send HTML skeleton
  ↓ (200ms - download JS)
Browser: Parse React
  ↓ (100ms - execute)
Browser: Fetch API
  ↓ (300ms - network + DB)
Browser: Render with data

Total: ~650ms
Bundle: 150KB JS
```

### After (Server Components):

```
Browser Request
  ↓ (50ms)
Server: Auth check (2ms)
Server: Fetch data (50ms)
Server: Render HTML
  ↓ (100ms - download HTML)
Browser: Display

Total: ~200ms
Bundle: 50KB JS
```

**Improvements:**
- ⚡ 3x faster page load
- 📦 66% smaller bundle size
- 🚀 No loading states
- ♿ Better accessibility (works without JS)
- 🔍 Better SEO

## Rollback Plan

If something goes wrong during conversion:

```bash
# 1. Commit before each page conversion
git add .
git commit -m "Convert /admin/users to server component"

# 2. If issues arise, revert specific file
git checkout HEAD~1 -- apps/web/src/app/admin/users/page.tsx

# 3. Or revert entire commit
git revert HEAD

# 4. Test thoroughly before moving to next page
```

## Documentation Updates

After each conversion, update:

1. **This document**: Mark page as ✅ Complete
2. **API docs**: Document any new server actions
3. **Testing docs**: Add test cases for the page
4. **Performance log**: Record before/after metrics

## Success Criteria

Phase 3 is complete when:

- ✅ All admin pages converted to server components
- ✅ All user pages converted (except auth pages)
- ✅ All pages use server-side auth checks
- ✅ No client-side data fetching for initial load
- ✅ Interactive elements extracted to client components
- ✅ All mutations use server actions
- ✅ All tests passing
- ✅ No console errors
- ✅ Bundle size reduced by >50%
- ✅ Page load time improved by >2x

## Next Phase Preview

**Phase 4**: Simplify AuthContext
- Remove auth logic from context
- Keep only UI state
- Single logout function
- Smaller client bundle

---

**Status**: 📋 PLANNED  
**Estimated Start**: After Phase 2 approval  
**Estimated End**: 2 weeks from start  
**Priority**: HIGH  
**Dependencies**: Phase 1 ✅ & Phase 2 ✅  
**Blockers**: None
