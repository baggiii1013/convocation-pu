# Phase 3: Troubleshooting Guide

## Common Errors & Solutions

This guide covers all common errors you might encounter when converting Client Components to Server Components, with step-by-step solutions.

---

## Error 1: "You're importing a component that needs useState"

### Full Error Message
```
Error: You're importing a component that needs useState. It only works in a Client Component but none of its parents are marked with "use client", so they're Server Components by default.
```

### Cause
You're using a React hook (`useState`, `useEffect`, etc.) in a Server Component.

### Solution

**Option A: Extract to Client Component**

```tsx
// ❌ BEFORE (Error)
// page.tsx
export default async function Page() {
  const [count, setCount] = useState(0); // ERROR!
  
  return <div>{count}</div>;
}
```

```tsx
// ✅ AFTER (Fixed)
// page.tsx (Server Component)
export default async function Page() {
  const data = await fetchData();
  return <Counter initialData={data} />;
}

// counter.client.tsx (Client Component)
'use client';

export function Counter({ initialData }) {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

**Option B: Keep as Client Component** (if truly needed)

```tsx
// If the entire page MUST be client-side
'use client';

export default function Page() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

---

## Error 2: "async/await is not yet supported in Client Components"

### Full Error Message
```
Error: async/await is not yet supported in Client Components, only Server Components. This error is often caused by accidentally adding 'use client' to a module that was originally written for the server.
```

### Cause
You have `'use client'` but also `async function`.

### Solution

```tsx
// ❌ WRONG
'use client';

export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

```tsx
// ✅ CORRECT - Remove 'use client'
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

---

## Error 3: "Cannot import server-only module in Client Component"

### Full Error Message
```
Error: You cannot import 'lib/auth' in a Client Component. This module is marked as server-only.
```

### Cause
Trying to import server-side utilities (`requireAuth`, `db`, etc.) in a Client Component.

### Solution

```tsx
// ❌ WRONG
'use client';

import { requireAuth } from '@/lib/auth'; // ERROR!

export default function Page() {
  // ...
}
```

```tsx
// ✅ CORRECT
import { requireAuth } from '@/lib/auth';

export default async function Page() {
  await requireAuth();
  return <ClientComponent />;
}

// client-component.tsx
'use client';

export function ClientComponent() {
  // Interactive code here
}
```

---

## Error 4: "Cannot read cookies in Client Component"

### Full Error Message
```
Error: cookies() can only be called in Server Components
```

### Cause
Trying to use Next.js `cookies()` in a Client Component.

### Solution

```tsx
// ❌ WRONG
'use client';

import { cookies } from 'next/headers';

export default function Page() {
  const cookieStore = cookies(); // ERROR!
}
```

```tsx
// ✅ CORRECT
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = cookies(); // Works in Server Component
  const token = cookieStore.get('accessToken');
  
  return <div>Token: {token?.value}</div>;
}
```

---

## Error 5: "Functions cannot be passed directly to Client Components"

### Full Error Message
```
Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server".
```

### Cause
Passing a function defined in a Server Component to a Client Component.

### Solution

**Option A: Use Server Action**

```tsx
// ❌ WRONG
// page.tsx (Server Component)
export default async function Page() {
  const handleClick = () => { console.log('clicked'); };
  
  return <ClientButton onClick={handleClick} />; // ERROR!
}
```

```tsx
// ✅ CORRECT with Server Action
// page.tsx (Server Component)
import { myAction } from './actions';

export default async function Page() {
  return <ClientButton action={myAction} />;
}

// actions.ts
'use server';

export async function myAction() {
  console.log('clicked');
}

// client-button.tsx
'use client';

export function ClientButton({ action }) {
  return <button onClick={() => action()}>Click</button>;
}
```

**Option B: Define function in Client Component**

```tsx
// ✅ CORRECT with Client Function
// page.tsx (Server Component)
export default async function Page() {
  return <ClientButton />;
}

// client-button.tsx
'use client';

export function ClientButton() {
  const handleClick = () => { console.log('clicked'); };
  return <button onClick={handleClick}>Click</button>;
}
```

---

## Error 6: "redirect() cannot be called in try/catch"

### Full Error Message
```
Error: NEXT_REDIRECT cannot be called inside a try/catch block
```

### Cause
Wrapping `requireAuth()` or `redirect()` in a try/catch block. These functions throw internally to trigger redirects.

### Solution

```tsx
// ❌ WRONG
export default async function Page() {
  try {
    await requireAuth();
  } catch (error) {
    redirect('/login'); // ERROR!
  }
}
```

```tsx
// ✅ CORRECT
export default async function Page() {
  // Let requireAuth() handle redirects internally
  await requireAuth();
  
  // This code only runs if auth succeeds
  return <div>Authorized content</div>;
}
```

---

## Error 7: "Module not found: Can't resolve 'server-only'"

### Full Error Message
```
Module not found: Can't resolve 'server-only'
```

### Cause
Missing `server-only` package.

### Solution

```bash
cd apps/web
bun add server-only
```

---

## Error 8: "useRouter can only be used in Client Components"

### Full Error Message
```
Error: useRouter() should be used in a Client Component
```

### Cause
Trying to use `useRouter` from `next/navigation` in a Server Component.

### Solution

```tsx
// ❌ WRONG
import { useRouter } from 'next/navigation';

export default async function Page() {
  const router = useRouter(); // ERROR!
  router.push('/somewhere');
}
```

```tsx
// ✅ CORRECT - Use server-side redirect
import { redirect } from 'next/navigation';

export default async function Page() {
  redirect('/somewhere');
}
```

```tsx
// ✅ CORRECT - Or extract to client component
// page.tsx (Server Component)
export default async function Page() {
  return <RedirectButton />;
}

// redirect-button.tsx (Client Component)
'use client';

import { useRouter } from 'next/navigation';

export function RedirectButton() {
  const router = useRouter();
  
  return (
    <button onClick={() => router.push('/somewhere')}>
      Go somewhere
    </button>
  );
}
```

---

## Error 9: "Cannot access 'db' before initialization"

### Full Error Message
```
ReferenceError: Cannot access 'db' before initialization
```

### Cause
Circular import or incorrect Prisma client setup.

### Solution

**Check your Prisma client export:**

```tsx
// ❌ WRONG
// lib/db.ts
export const db = new PrismaClient();
import { db } from './db'; // Circular import!
```

```tsx
// ✅ CORRECT
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
```

---

## Error 10: "Cannot use import statement outside a module"

### Full Error Message
```
SyntaxError: Cannot use import statement outside a module
```

### Cause
Importing ES modules in a file that expects CommonJS, or vice versa.

### Solution

**Check your package.json:**

```json
{
  "type": "module"
}
```

**Or use correct import syntax:**

```tsx
// ✅ ES Module
import { something } from './file';

// ✅ CommonJS
const { something } = require('./file');
```

---

## Error 11: "Property 'user' does not exist on type 'never'"

### Full Error Message
```
Property 'user' does not exist on type 'never'
```

### Cause
TypeScript can't infer the type of the session object.

### Solution

```tsx
// ❌ WRONG
export default async function Page() {
  const session = await getServerSession();
  console.log(session.user.email); // ERROR!
}
```

```tsx
// ✅ CORRECT
import type { UserSession } from '@/lib/auth';

export default async function Page() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }
  
  // Now TypeScript knows session is not null
  console.log(session.user.email); // Works!
}
```

---

## Error 12: "revalidatePath is not defined"

### Full Error Message
```
ReferenceError: revalidatePath is not defined
```

### Cause
Forgot to import `revalidatePath` from `next/cache`.

### Solution

```tsx
// ❌ WRONG
'use server';

export async function deleteUser(id: string) {
  await db.user.delete({ where: { id } });
  revalidatePath('/users'); // ERROR!
}
```

```tsx
// ✅ CORRECT
'use server';

import { revalidatePath } from 'next/cache';

export async function deleteUser(id: string) {
  await db.user.delete({ where: { id } });
  revalidatePath('/users'); // Works!
}
```

---

## Error 13: "Hydration failed because the initial UI does not match"

### Full Error Message
```
Error: Hydration failed because the initial UI does not match what was rendered on the server.
```

### Cause
Server and client render different HTML, often due to:
- Using `new Date()` or `Math.random()` directly in render
- Accessing `window` or `localStorage` during render
- Conditional rendering based on client-side state

### Solution

**Option A: Use suppressHydrationWarning (for date/time)**

```tsx
// ✅ For timestamps
export default function Page() {
  return (
    <div suppressHydrationWarning>
      {new Date().toLocaleString()}
    </div>
  );
}
```

**Option B: Render on client only**

```tsx
// ✅ For client-specific content
'use client';

import { useEffect, useState } from 'react';

export function ClientOnlyComponent() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return <div>{localStorage.getItem('key')}</div>;
}
```

---

## Error 14: "Cannot find module '@/lib/db'"

### Full Error Message
```
Module not found: Cannot find module '@/lib/db'
```

### Cause
- Path alias not configured
- File doesn't exist
- Wrong path

### Solution

**Check tsconfig.json:**

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Check file exists:**

```bash
ls apps/web/src/lib/db.ts
# or
ls apps/web/src/lib/db/index.ts
```

**Use correct import:**

```tsx
// If file is at: apps/web/src/lib/db.ts
import { db } from '@/lib/db';

// If file is at: apps/web/src/lib/db/index.ts
import { db } from '@/lib/db';
```

---

## Error 15: "headers() expects the second argument to be an object"

### Full Error Message
```
Error: headers() expects the second argument to be an object
```

### Cause
Incorrect usage of `headers()` from `next/headers`.

### Solution

```tsx
// ❌ WRONG
import { headers } from 'next/headers';

export default async function Page() {
  const headersList = headers('authorization'); // ERROR!
}
```

```tsx
// ✅ CORRECT
import { headers } from 'next/headers';

export default async function Page() {
  const headersList = headers();
  const authorization = headersList.get('authorization');
}
```

---

## Performance Issues

### Issue 1: Page loads slowly

**Symptom**: Page takes > 1 second to load

**Diagnosis:**

```tsx
// Add timing logs
export default async function Page() {
  console.time('auth');
  await requireAuth();
  console.timeEnd('auth');
  
  console.time('data');
  const data = await fetchData();
  console.timeEnd('data');
  
  console.time('render');
  return <Component data={data} />;
  console.timeEnd('render');
}
```

**Solutions:**

```tsx
// ✅ Parallel fetching
const [auth, data1, data2] = await Promise.all([
  requireAuth(),
  fetchData1(),
  fetchData2()
]);

// ✅ Use database indexes
await db.user.findMany({
  where: { email: 'test@example.com' } // Make sure 'email' is indexed
});

// ✅ Limit data fetching
await db.user.findMany({
  take: 20, // Paginate
  select: { id: true, name: true } // Only needed fields
});
```

### Issue 2: Large bundle size

**Symptom**: JS bundle > 100KB after conversion

**Diagnosis:**

```bash
# Analyze bundle
npm run build
# Check .next/analyze/client.html
```

**Solutions:**

```tsx
// ✅ Dynamic imports
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./heavy-component'), {
  loading: () => <div>Loading...</div>
});

// ✅ Extract more to server components
// Move non-interactive parts to server components

// ✅ Remove unused dependencies
# Check package.json and remove unused packages
```

---

## Debugging Tips

### Tip 1: Check if component is Server or Client

```tsx
// Add this at the top of any component
console.log('Running on:', typeof window === 'undefined' ? 'server' : 'client');
```

### Tip 2: Verify auth is working

```tsx
export default async function Page() {
  const session = await requireAuth();
  console.log('Session:', session); // Check server logs
  
  return <div>User ID: {session.user.id}</div>;
}
```

### Tip 3: Debug database queries

```tsx
// Enable Prisma query logging
// In .env
DATABASE_URL="..."
PRISMA_LOG_LEVEL="info"

// In code
const db = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});
```

### Tip 4: Check which components are client/server

```bash
# After build, check .next folder
npm run build

# Look for these files:
# .next/server/ - Server Components
# .next/static/ - Client Components
```

---

## Checklist: Before Asking for Help

Use this checklist before posting questions:

- [ ] Did you remove `'use client'` from the page?
- [ ] Is your function `async`?
- [ ] Are you using `requireAuth()` or `requireAdmin()`?
- [ ] Did you import from correct paths?
- [ ] Are all interactive parts in `.client.tsx` files?
- [ ] Did you check the server logs (terminal)?
- [ ] Did you check the browser console?
- [ ] Did you clear cookies and test as logged-out?
- [ ] Did you test as different roles (admin/staff/student)?
- [ ] Did you restart the dev server?

---

## Getting Help

If you're still stuck after trying these solutions:

1. **Check the docs:**
   - Phase 3 main doc: `docs/PHASE-3-CONVERT-TO-SERVER-COMPONENTS.md`
   - Quick reference: `docs/PHASE-3-QUICK-REFERENCE.md`
   - First conversion: `docs/PHASE-3-FIRST-CONVERSION-GUIDE.md`

2. **Search for similar issues:**
   - GitHub Issues for Next.js
   - Stack Overflow

3. **Ask for help:**
   - Provide error message
   - Show your code
   - Explain what you tried
   - Include relevant logs

---

**Remember**: Most errors are simple to fix once you understand Server vs Client Components!

**Key principle**: When in doubt, start with Server Component, only add `'use client'` when needed.
