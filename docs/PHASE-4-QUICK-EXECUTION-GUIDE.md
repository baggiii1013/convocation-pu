# Phase 4: Quick Execution Guide

> **Goal**: Execute Phase 4 client context simplification step-by-step

---

## 🎯 What We're Doing

**Transforming** the heavy client-side AuthContext into a lightweight data holder:

- **Remove**: loading, isAuthenticated, hasRole, login, useEffect auth check
- **Keep**: user state (simplified) and logout function
- **Add**: Server-side data seeding via props

---

## ⚡ Quick Steps

### Step 1: Backup Current Files

```bash
cd /mnt/240GB_SATA/Development/Parul/convocation-pu

# Backup current files
cp apps/web/src/contexts/AuthContext.tsx apps/web/src/contexts/AuthContext.tsx.backup
cp apps/web/src/app/layout.tsx apps/web/src/app/layout.tsx.backup

echo "✅ Backups created"
```

### Step 2: Replace AuthContext.tsx

Replace the entire content of `apps/web/src/contexts/AuthContext.tsx` with:

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useState } from 'react';

/**
 * Minimal user information for client-side display
 * No sensitive data or auth tokens
 */
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STAFF' | 'STUDENT';
  profileImageURL?: string;
}

/**
 * Simplified auth context - only for displaying user info
 * Authentication logic lives server-side
 */
export interface AuthContextType {
  user: UserInfo | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: UserInfo | null;
}

/**
 * Lightweight Auth Provider
 * 
 * This provider:
 * - Accepts initial user data from the server (via layout.tsx)
 * - Provides logout functionality
 * - Does NOT handle authentication, loading states, or role checks
 * 
 * All auth logic happens server-side using Phase 2 utilities
 */
export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  const [user, setUser] = useState<UserInfo | null>(initialUser);
  const router = useRouter();

  /**
   * Logout function
   * Calls the server logout endpoint and clears local state
   */
  const logout = async () => {
    try {
      const response = await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Logout failed:', await response.text());
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/');
      router.refresh();
    }
  };

  const value: AuthContextType = {
    user,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 * Only provides user info and logout - no auth logic
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
```

### Step 3: Update layout.tsx

Replace `apps/web/src/app/layout.tsx` with:

```tsx
import { AuthProvider } from '@/contexts/AuthContext';
import { getServerSession } from '@/lib/auth/session';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import type { Metadata, Viewport } from "next";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

export const metadata: Metadata = {
  title: "PU Convocation - Parul University Convocation Platform",
  description: "Digital platform for managing convocation ceremonies at Parul University. Streamlining registration, seat allocation, and ceremonial processes.",
  keywords: "Parul University, Convocation, Graduation, Ceremony, Registration",
  authors: [{ name: "Kaustubh Bagale" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0F",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get session from server
  const session = await getServerSession();

  // Transform to UserInfo format
  const initialUser = session ? {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name || 'User',
    role: session.user.role,
    profileImageURL: undefined,
  } : null;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-dark-bg text-foreground">
        <AuthProvider initialUser={initialUser}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              },
              success: {
                iconTheme: {
                  primary: 'var(--gold)',
                  secondary: 'var(--card)',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: 'var(--card)',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Step 4: Find Components Using Old Auth Context

```bash
# Search for files using useAuth
cd /mnt/240GB_SATA/Development/Parul/convocation-pu
grep -r "useAuth" apps/web/src --include="*.tsx" --include="*.ts" | grep -v "node_modules"

# Look for specific old properties
grep -r "loading" apps/web/src --include="*.tsx" | grep useAuth
grep -r "isAuthenticated" apps/web/src --include="*.tsx"
grep -r "hasRole" apps/web/src --include="*.tsx"
grep -r "\.login(" apps/web/src --include="*.tsx"
```

### Step 5: Update Component Usage

For each component using the old context:

**Before:**
```tsx
const { user, loading, isAuthenticated, hasRole } = useAuth();

if (loading) return <Loading />;
if (!isAuthenticated) return <LoginPrompt />;
if (!hasRole(['ADMIN'])) return <Forbidden />;
```

**After:**
```tsx
const { user, logout } = useAuth();

// Remove loading, isAuthenticated, hasRole checks
// Add server-side checks in page.tsx if needed
```

### Step 6: Test the Changes

```bash
# Start the development server
cd /mnt/240GB_SATA/Development/Parul/convocation-pu
npm run dev --workspace=apps/web

# Test checklist:
# ✅ Page loads without errors
# ✅ No hydration warnings in console
# ✅ User info displays correctly (if logged in)
# ✅ Logout button works
# ✅ No loading spinner on page load
```

---

## 🔍 What to Check

### Console Checks

Open browser DevTools and verify:

1. ✅ No "Hydration failed" errors
2. ✅ No "useAuth must be used within" errors
3. ✅ No API call to `/api/v1/auth/profile` on page load
4. ✅ User data appears immediately (no delay)

### Network Tab Checks

In DevTools Network tab:

1. ✅ Only ONE request for the HTML (no extra auth API call)
2. ✅ Logout request to `/api/v1/auth/logout` when clicking logout

### Visual Checks

1. ✅ No loading spinner on initial page load
2. ✅ User name/info displays immediately
3. ✅ Logout button works and redirects to home

---

## 🚨 Troubleshooting

### Error: "getServerSession is not defined"

**Fix**: Make sure the import is correct in `layout.tsx`:
```tsx
import { getServerSession } from '@/lib/auth/session';
```

### Error: "Cannot use await in non-async function"

**Fix**: Make sure `RootLayout` is declared as `async`:
```tsx
export default async function RootLayout({ ... }) {
```

### Error: "useAuth must be used within an AuthProvider"

**Fix**: Make sure `AuthProvider` wraps all children in `layout.tsx`:
```tsx
<AuthProvider initialUser={initialUser}>
  {children}
</AuthProvider>
```

### Components still using old properties

**Fix**: Update them one by one:
```tsx
// Remove these:
const { loading, isAuthenticated, hasRole } = useAuth();

// Use only:
const { user, logout } = useAuth();
```

---

## 📊 Expected Results

### Before Phase 4

- 📄 AuthContext.tsx: **~170 lines**
- 🔄 API calls per page: **2** (HTML + profile)
- ⏱️ Loading state: **Visible**
- 🐛 Hydration issues: **Possible**

### After Phase 4

- 📄 AuthContext.tsx: **~60 lines** (↓65%)
- 🔄 API calls per page: **1** (HTML only) (↓50%)
- ⏱️ Loading state: **None** ✅
- 🐛 Hydration issues: **Fixed** ✅

---

## 🎯 Success Criteria

Phase 4 is complete when:

- [x] ✅ AuthContext.tsx has only `UserInfo` and `logout`
- [x] ✅ layout.tsx is async and calls `getServerSession()`
- [x] ✅ No `loading` state in context
- [x] ✅ No `isAuthenticated` check in context
- [x] ✅ No `hasRole()` function in context
- [x] ✅ No `login()` function in context
- [x] ✅ No `useEffect` auth check in context
- [x] ✅ User data comes from props, not API
- [x] ✅ No hydration warnings in console
- [x] ✅ No extra API call on page load

---

## 📚 Next Steps

After completing Phase 4:

1. **Phase 5**: Convert all protected pages to Server Components
2. **Phase 6**: Implement role-based UI using server-side checks
3. **Phase 7**: Create Server Actions for all mutations
4. **Phase 8**: Clean up old API routes and middleware

---

## 🆘 Need Help?

Refer to these documents:

- **Detailed Implementation**: `PHASE-4-IMPLEMENTATION.md`
- **Before/After Comparison**: `PHASE-4-BEFORE-AFTER-COMPARISON.md`
- **Original Spec**: `PHASE-4-CLIENT-CONTEXT-SIMPLIFICATION.md`

---

**Ready to simplify!** 🚀
