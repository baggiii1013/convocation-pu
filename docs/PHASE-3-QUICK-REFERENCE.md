# Phase 3: Quick Reference Guide

## TL;DR

Converting Client Components → Server Components for better performance, security, and UX.

**Goal**: Move auth checks and data fetching to the server, extract interactivity to client components.

## Quick Conversion Checklist

```bash
□ 1. Remove 'use client'
□ 2. Make function async: async function Page()
□ 3. Add auth: await requireAuth() or await requireAdmin()
□ 4. Move data fetching to server: const data = await db...
□ 5. Extract interactive parts to .client.tsx files
□ 6. Create actions.ts for mutations
□ 7. Test thoroughly
```

## File Structure Pattern

```
page/
├── page.tsx              # Server Component (auth + data)
├── component.client.tsx  # Client Component (interactivity)
└── actions.ts            # Server Actions (mutations)
```

## Basic Template

### Server Component (page.tsx)
```tsx
import { requireAdmin } from '@/lib/auth';
import { MyClientComponent } from './component.client';

export default async function MyPage() {
  const session = await requireAdmin();
  const data = await db.getData();
  
  return <MyClientComponent data={data} />;
}
```

### Client Component (component.client.tsx)
```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function MyClientComponent({ data }) {
  const [state, setState] = useState(data);
  
  return (
    <div>
      <Button onClick={() => setState('new')}>Click</Button>
    </div>
  );
}
```

### Server Action (actions.ts)
```tsx
'use server';

import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function myAction(formData: FormData) {
  await requireAdmin();
  
  // Do something
  await db.update(...);
  
  revalidatePath('/my-page');
  return { success: true };
}
```

## Auth Functions Quick Ref

```tsx
// Require any authenticated user
await requireAuth();

// Require admin only
await requireAdmin();

// Require admin or staff
await requireStaff();

// Require specific roles
await requireRole(['ADMIN', 'STAFF']);

// Get session without requiring auth
const session = await getOptionalSession();

// Check role without throwing
const isAdmin = await checkRole(['ADMIN']);
```

## Common Patterns

### Pattern: Simple Data Display
```tsx
export default async function Page() {
  await requireAuth();
  const data = await db.getData();
  return <div>{data}</div>;
}
```

### Pattern: With Pagination
```tsx
interface Props {
  searchParams: { page?: string };
}

export default async function Page({ searchParams }: Props) {
  await requireAuth();
  
  const page = parseInt(searchParams.page || '1');
  const data = await db.getData({ page });
  
  return <List data={data} page={page} />;
}
```

### Pattern: With Search/Filter
```tsx
interface Props {
  searchParams: { search?: string; filter?: string };
}

export default async function Page({ searchParams }: Props) {
  await requireAuth();
  
  const where: any = {};
  if (searchParams.search) {
    where.name = { contains: searchParams.search };
  }
  if (searchParams.filter) {
    where.category = searchParams.filter;
  }
  
  const data = await db.getData({ where });
  
  return <List data={data} />;
}
```

### Pattern: CRUD Operations
```tsx
// page.tsx
export default async function Page() {
  await requireAdmin();
  const items = await db.item.findMany();
  return <ItemsManager items={items} />;
}

// items-manager.client.tsx
'use client';
export function ItemsManager({ items }) {
  return (
    <div>
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

// actions.ts
'use server';
export async function deleteItem(id: string) {
  await requireAdmin();
  await db.item.delete({ where: { id } });
  revalidatePath('/items');
}
```

## What Goes Where?

### Server Component (page.tsx):
✅ Auth checks (`requireAuth`, `requireAdmin`)  
✅ Database queries  
✅ Static content  
✅ SEO meta tags  
✅ Layouts  

❌ Event handlers (`onClick`, `onChange`)  
❌ React hooks (`useState`, `useEffect`)  
❌ Browser APIs (`window`, `localStorage`)  

### Client Component (.client.tsx):
✅ Event handlers  
✅ React hooks  
✅ Browser APIs  
✅ Forms with validation  
✅ Interactive UI  

❌ Direct database access  
❌ Server-only imports  

### Server Actions (actions.ts):
✅ Mutations (create, update, delete)  
✅ Form submissions  
✅ Auth checks  
✅ Database operations  

❌ GET requests (use server components)  
❌ Client state  

## Migration Priority

**Week 1:**
1. ✅ `/profile` - Simple redirect
2. ⚠️ `/admin/dashboard` - Data display
3. ⚠️ `/admin/enclosures` - Medium complexity
4. ⚠️ `/admin/users` - Complex CRUD
5. ⚠️ `/admin/create-account` - Forms

**Week 2:**
6. ⚠️ `/admin/upload-students` - Excel upload
7. ⚠️ `/admin/reserve-seats` - Seat management
8. ⚠️ `/admin/aerial-view-editor` - Complex UI
9. ⚠️ `/settings` - User settings

## Common Mistakes

### ❌ Mistake 1: Forgetting async
```tsx
export default function Page() {
  await requireAuth(); // ERROR!
}
```
✅ Fix: `export default async function Page()`

### ❌ Mistake 2: Using hooks in server component
```tsx
export default async function Page() {
  const [state, setState] = useState(); // ERROR!
}
```
✅ Fix: Extract to client component

### ❌ Mistake 3: Event handlers in server component
```tsx
export default async function Page() {
  return <button onClick={() => {}}>Click</button>; // ERROR!
}
```
✅ Fix: Extract button to client component

### ❌ Mistake 4: Importing server utils in client
```tsx
'use client';
import { requireAuth } from '@/lib/auth'; // ERROR!
```
✅ Fix: Only use auth in server components

### ❌ Mistake 5: Not revalidating after mutations
```tsx
'use server';
export async function deleteItem(id: string) {
  await db.item.delete({ where: { id } });
  // Missing revalidatePath!
}
```
✅ Fix: Add `revalidatePath('/items')`

## Testing Commands

```bash
# Clear cookies (test auth)
# In browser: DevTools → Application → Cookies → Clear

# Test as different roles
# 1. Login as STUDENT at /login
# 2. Try to access /admin/users
# 3. Should redirect to /unauthorized

# Test data loading
# 1. Visit page
# 2. Should load instantly (no spinner)
# 3. Check Network tab (no API calls)

# Test interactions
# 1. Click all buttons
# 2. Submit all forms
# 3. Check console for errors
```

## Performance Expectations

### Before:
- Initial load: ~650ms
- JS bundle: 150KB
- Loading states: Yes
- SEO: Limited

### After:
- Initial load: ~200ms (3x faster)
- JS bundle: 50KB (66% smaller)
- Loading states: No
- SEO: Full support

## Git Workflow

```bash
# Before starting a page
git checkout -b convert/admin-users

# After completing a page
git add .
git commit -m "Convert /admin/users to server component"

# If something breaks
git revert HEAD
# or
git checkout HEAD~1 -- path/to/file

# After testing thoroughly
git push origin convert/admin-users
# Create PR for review
```

## Page Status Tracker

| Page | Status | Priority | Est. Time | Notes |
|------|--------|----------|-----------|-------|
| `/profile` | 📋 TODO | Low | 30min | Simple redirect |
| `/admin/dashboard` | 📋 TODO | High | 3hrs | Good starting point |
| `/admin/enclosures` | 📋 TODO | High | 6hrs | Medium complexity |
| `/admin/users` | 📋 TODO | High | 8hrs | Complex CRUD |
| `/admin/create-account` | 📋 TODO | High | 6hrs | Form-heavy |
| `/admin/upload-students` | 📋 TODO | Medium | 8hrs | Excel handling |
| `/admin/reserve-seats` | 📋 TODO | Medium | 8hrs | Seat logic |
| `/admin/aerial-view-editor` | 📋 TODO | Medium | 8hrs | Complex UI |
| `/admin/aerial-view` | 📋 TODO | Low | 4hrs | Display only |
| `/settings` | 📋 TODO | Low | 4hrs | User settings |
| `/login` | ⏭️ SKIP | - | - | Keep as client |
| `/forgot-password` | ⏭️ SKIP | - | - | Keep as client |
| `/reset-password` | ⏭️ SKIP | - | - | Keep as client |

**Legend:**
- 📋 TODO - Not started
- 🚧 IN PROGRESS - Currently working
- ✅ DONE - Completed and tested
- ⏭️ SKIP - Intentionally not converting

## Help & Resources

- Full docs: `docs/PHASE-3-CONVERT-TO-SERVER-COMPONENTS.md`
- Auth utilities: `apps/web/src/lib/auth/`
- Examples: `apps/web/src/lib/auth/examples.tsx`
- Phase 2 docs: `docs/PHASE-2-SERVER-AUTH-UTILITIES-COMPLETE.md`

## Quick Commands

```bash
# Find all pages with 'use client'
grep -r "'use client'" apps/web/src/app/**/page.tsx

# Count total pages
find apps/web/src/app -name "page.tsx" | wc -l

# Check bundle size
npm run build
# Check .next/analyze/client.html

# Run dev server
bun run dev

# Run tests
bun test
```

---

**Remember**: Server Components are the default. Only add `'use client'` when you need interactivity!

**Key Principle**: Render on the server, hydrate on the client.

**When in doubt**: Start with Server Component, extract client components as needed.
