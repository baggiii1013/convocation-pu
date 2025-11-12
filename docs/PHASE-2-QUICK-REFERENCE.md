# Phase 2 Quick Reference - Server Auth Utilities

## 🎯 What Changed?

### Before Phase 2:
```typescript
// Had to do auth in client components
'use client';
export default function DashboardPage() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) redirect('/login');
  return <div>Dashboard</div>;
}
```

### After Phase 2:
```typescript
// Clean server-side auth
import { requireAuth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await requireAuth();
  return <div>Welcome, {session.user.name}!</div>;
}
```

---

## 📁 Files Created

### ✅ New Files:
- `apps/web/src/lib/auth/session.ts` - Session management (145 lines)
- `apps/web/src/lib/auth/protection.ts` - Auth protection (280 lines)
- `apps/web/src/lib/auth/index.ts` - Module exports (33 lines)

---

## 🚀 Quick Start

### 1. Basic Protected Page

```typescript
// app/dashboard/page.tsx
import { requireAuth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await requireAuth();
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
```

### 2. Admin-Only Page

```typescript
// app/admin/page.tsx
import { requireAdmin } from '@/lib/auth';

export default async function AdminPage() {
  const session = await requireAdmin();
  
  return <div>Admin Dashboard</div>;
}
```

### 3. Staff or Admin Page

```typescript
// app/management/page.tsx
import { requireStaff } from '@/lib/auth';

export default async function ManagementPage() {
  const session = await requireStaff();
  
  return <div>Management Console</div>;
}
```

### 4. Optional Auth (Public Page)

```typescript
// app/page.tsx
import { getOptionalSession } from '@/lib/auth';

export default async function HomePage() {
  const session = await getOptionalSession();
  
  return (
    <div>
      {session ? (
        <p>Hello, {session.user.name}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### 5. Conditional Content by Role

```typescript
// app/dashboard/page.tsx
import { requireAuth, checkRole } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await requireAuth();
  const isAdmin = await checkRole(['ADMIN']);
  
  return (
    <div>
      <h1>Dashboard</h1>
      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

### 6. Protected Server Action

```typescript
// app/actions/update-profile.ts
'use server';

import { requireAuth } from '@/lib/auth';

export async function updateProfile(formData: FormData) {
  const session = await requireAuth();
  
  // Update database with session.user.id
  await db.user.update({
    where: { id: session.user.id },
    data: { name: formData.get('name') as string },
  });
  
  return { success: true };
}
```

---

## 📚 API Reference

### Core Functions

#### `requireAuth(redirectUrl?)`
Require authentication, redirect to login if not authenticated.

```typescript
const session = await requireAuth('/dashboard');
```

#### `requireRole(allowedRoles, options?)`
Require specific role(s), redirect if unauthorized.

```typescript
const session = await requireRole(['ADMIN', 'STAFF']);
```

#### `requireAdmin(options?)`
Shorthand for requiring ADMIN role.

```typescript
const session = await requireAdmin();
```

#### `requireStaff(options?)`
Shorthand for requiring ADMIN or STAFF role.

```typescript
const session = await requireStaff();
```

#### `getOptionalSession()`
Get session without requiring auth (for public pages).

```typescript
const session = await getOptionalSession();
```

#### `checkRole(requiredRoles)`
Check role without throwing/redirecting.

```typescript
const isAdmin = await checkRole(['ADMIN']);
```

#### `getServerSession()`
Direct session access (lower-level API).

```typescript
const session = await getServerSession();
```

---

## 🔐 Session Object Structure

```typescript
interface UserSession {
  user: {
    id: string;
    email: string;
    role: 'ADMIN' | 'STAFF' | 'STUDENT';
    name: string;
  };
  expiresAt: number; // Unix timestamp
}
```

---

## 🎨 Advanced Usage

### Custom Redirect on Unauthorized

```typescript
const session = await requireRole(['ADMIN'], {
  unauthorizedRedirect: '/access-denied'
});
```

### Return 404 for Hidden Resources

```typescript
const session = await requireRole(['ADMIN'], {
  notFoundOnUnauthorized: true // Returns 404 instead of redirect
});
```

### Check Multiple Roles

```typescript
const session = await requireRole(['ADMIN', 'STAFF', 'STUDENT']);
```

---

## 🧪 Testing

### Test in Browser:

1. **Protected Page**: Navigate to `/dashboard` without login
   - Should redirect to `/login?redirect_url=/dashboard`

2. **Admin Page**: Login as non-admin, navigate to `/admin`
   - Should redirect to `/dashboard?error=unauthorized`

3. **Optional Session**: Visit homepage without login
   - Should show public content (no redirect)

### Test with curl:

```bash
# Should redirect to login
curl -I http://localhost:3000/dashboard

# Should redirect to login
curl -I http://localhost:3000/admin

# Should work (public page)
curl -I http://localhost:3000
```

---

## 🐛 Troubleshooting

### Issue: "server-only module imported in client"
**Fix**: Only use in Server Components (no 'use client' directive)

### Issue: Session is null with valid token
**Fix**: Check JWT secrets match between web and API

### Issue: Infinite redirect loop
**Fix**: Don't use `requireAuth()` in login page

### Issue: TypeScript errors
**Fix**: Import types: `import type { UserSession } from '@/lib/auth'`

---

## ⚡ Pro Tips

1. **Use at Top of Page**: Call `requireAuth()` at the very top of your Server Component

2. **Protected Layouts**: Use `requireAuth()` in layout.tsx to protect entire sections

3. **Granular Permissions**: Use `checkRole()` for conditional UI, `requireRole()` for full protection

4. **Server Actions**: Always use `requireAuth()` or `requireRole()` in Server Actions

5. **Type Safety**: Session object is fully typed, use TypeScript autocomplete

6. **Performance**: Session reads are fast (~1-2ms), don't worry about multiple calls

---

## 🔗 Import Patterns

### Single Import:
```typescript
import { requireAuth } from '@/lib/auth';
```

### Multiple Imports:
```typescript
import { requireAuth, requireAdmin, getOptionalSession } from '@/lib/auth';
```

### With Types:
```typescript
import { requireAuth, type UserSession } from '@/lib/auth';
```

---

## 📊 Comparison: Before vs After

| Aspect | Before (Client) | After (Server) |
|--------|----------------|----------------|
| **Auth Check** | Client-side hook | Server-side function |
| **Performance** | Slow (client render) | Fast (server-side) |
| **Security** | Client can bypass | Server enforced |
| **Code** | ~20 lines | ~1 line |
| **Loading State** | Manual handling | None needed |
| **SEO** | Poor (client render) | Good (server render) |

---

## 🎯 Common Patterns

### Pattern 1: Dashboard with User Info
```typescript
import { requireAuth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await requireAuth();
  
  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Role: {session.user.role}</p>
    </div>
  );
}
```

### Pattern 2: Admin Section
```typescript
import { requireAdmin } from '@/lib/auth';

export default async function AdminLayout({ children }) {
  await requireAdmin();
  
  return (
    <div>
      <AdminSidebar />
      <main>{children}</main>
    </div>
  );
}
```

### Pattern 3: Conditional Features
```typescript
import { requireAuth, isAdmin } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await requireAuth();
  
  return (
    <div>
      <Dashboard />
      {isAdmin(session) && <AdminTools />}
    </div>
  );
}
```

---

## 🔄 Migration from Client to Server

### Before (Client Component):
```typescript
'use client';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  
  if (loading) return <Spinner />;
  if (!user) redirect('/login');
  
  return <div>Profile: {user.email}</div>;
}
```

### After (Server Component):
```typescript
import { requireAuth } from '@/lib/auth';

export default async function ProfilePage() {
  const session = await requireAuth();
  
  return <div>Profile: {session.user.email}</div>;
}
```

**Benefits:**
- ✅ No loading state needed
- ✅ No client-side JS required
- ✅ Better SEO
- ✅ Faster initial load
- ✅ More secure

---

## 📝 Next Steps

After Phase 2, you can:

1. **Convert existing pages** to use server auth utilities
2. **Remove client-side auth logic** from components
3. **Simplify AuthContext** to UI-only functionality
4. **Add server-to-API** communication with session context

See `docs/PHASE-2-SERVER-AUTH-UTILITIES-COMPLETE.md` for full documentation.

---

**Phase 2 Status**: ✅ Complete  
**Ready for**: Phase 3 - Page Migration  
**Date**: November 12, 2025
