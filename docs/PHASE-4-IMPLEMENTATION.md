# Phase 4 Implementation: Client Context Simplification

> **Status**: Ready for Execution  
> **Date**: January 2025  
> **Goal**: Strip client-side context of authentication logic, making it a simple data holder seeded by server-side data

---

## 📊 Before & After Comparison

### Before: Heavy Client Context (Current State)

The current `AuthContext.tsx` is doing too much on the client side:

```tsx
'use client';

import api from '@/lib/axios';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// ❌ PROBLEM: Heavy type with too many fields
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: 'ADMIN' | 'STAFF' | 'STUDENT';
  profileImageURL?: string;
  accountState: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  isActive: boolean;
}

// ❌ PROBLEM: Too many responsibilities in context
export interface AuthContextType {
  user: User | null;
  loading: boolean;                                    // ❌ Remove
  login: (email: string, password: string) => Promise<void>;  // ❌ Remove
  logout: () => void;                                  // ✅ Keep
  isAuthenticated: boolean;                            // ❌ Remove
  hasRole: (roles: string | string[]) => boolean;     // ❌ Remove
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);  // ❌ Causes hydration issues
  const router = useRouter();

  // ❌ PROBLEM: Client-side derived state
  const isAuthenticated = !!user;

  // ❌ PROBLEM: Client-side role checking (should be server-side)
  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  // ❌ PROBLEM: Client-side login logic (should be Server Action)
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.post('/api/v1/auth/login', {
        email,
        password,
      });
      const { user: userData } = response.data.data;
      setUser({
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        displayName: userData.displayName || `${userData.firstName} ${userData.lastName}`,
        role: userData.role.toUpperCase() as 'ADMIN' | 'STAFF' | 'STUDENT',
        profileImageURL: userData.profileImageURL,
        accountState: userData.accountState || 'ACTIVE',
        isActive: userData.isActive !== false,
      });
    } catch (error: unknown) {
      console.error('Login error:', error);
      setUser(null);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Login failed. Please try again.'
        );
      }
      throw new Error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ KEEP: Logout is reasonable on client
  const logout = async () => {
    try {
      await api.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/');
    }
  };

  // ❌ PROBLEM: Client-side auth check causes race conditions and extra API calls
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          const publicPaths = ['/', '/login', '/register', '/forgot-password'];
          const isPublicPath = publicPaths.includes(window.location.pathname);
          const hasRefreshToken = document.cookie.includes('refreshToken=');
          
          if (isPublicPath && !hasRefreshToken) {
            setLoading(false);
            return;
          }
        }
        
        const response = await api.get('/api/v1/auth/profile');
        const userData = response.data.data;

        setUser({
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          displayName: userData.displayName,
          role: userData.role,
          profileImageURL: userData.profileImageURL,
          accountState: userData.accountState,
          isActive: userData.isActive,
        });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status !== 401) {
          console.error('Auth check error:', error);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### Problems with Current Implementation

| Issue | Impact | Solution |
|-------|--------|----------|
| **Client-side auth check in useEffect** | Extra API call on every page load, race conditions with server redirects | Seed context with server data |
| **Loading state** | Hydration mismatches, UI flicker | Remove - use React Suspense |
| **isAuthenticated** | Redundant client-side check | Remove - use server-side `requireAuth()` |
| **hasRole()** | Security risk if used for authorization | Remove - use server-side `requireRole()` |
| **login()** | Tightly couples auth logic to context | Move to Server Action |
| **Complex User type** | Unnecessary data in client state | Simplify to display-only fields |

---

## ✅ After: Lite Client Context (Target State)

### New AuthContext.tsx

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useState } from 'react';

/**
 * ✅ SIMPLIFIED: Minimal user info for display purposes only
 * No sensitive data, no authentication state, no role checking
 */
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STAFF' | 'STUDENT';
  profileImageURL?: string;
}

/**
 * ✅ SIMPLIFIED: Context only provides user data and logout
 * All authentication logic moved to server-side
 */
export interface AuthContextType {
  user: UserInfo | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: UserInfo | null; // 🔑 KEY CHANGE: Seeded from server
}

/**
 * Lightweight Auth Provider
 * 
 * This provider:
 * ✅ Accepts initial user data from the server (via layout.tsx)
 * ✅ Provides logout functionality
 * ❌ Does NOT handle authentication, loading states, or role checks
 * 
 * All auth logic happens server-side using Phase 2 utilities:
 * - getServerSession() - Get current session
 * - requireAuth() - Redirect if not authenticated  
 * - requireRole() - Redirect if wrong role
 */
export function AuthProvider({ children, initialUser = null }: AuthProviderProps) {
  // ✅ SIMPLE: Single state, initialized with server data
  const [user, setUser] = useState<UserInfo | null>(initialUser);
  const router = useRouter();

  /**
   * ✅ SIMPLIFIED: Logout only clears state and calls API
   * No complex error handling, no loading states
   */
  const logout = async () => {
    try {
      // Call logout API to clear httpOnly cookies
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
      // Always clear user state
      setUser(null);
      
      // Redirect to home and refresh to clear server state
      router.push('/');
      router.refresh();
    }
  };

  // ✅ MINIMAL: Only user and logout
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
 * ✅ SIMPLIFIED: Returns only user info and logout
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
```

### Key Improvements

| Change | Before | After |
|--------|--------|-------|
| **User Type** | 9 fields (firstName, lastName, accountState, etc.) | 5 fields (id, email, name, role, profileImageURL) |
| **Context Props** | 6 (user, loading, login, logout, isAuthenticated, hasRole) | 2 (user, logout) |
| **Initialization** | useEffect + API call | Props from server |
| **Loading State** | Client-side boolean | ❌ Removed (use Suspense) |
| **Auth Check** | Client-side | ✅ Server-side |
| **Role Check** | Client-side function | ✅ Server-side utility |
| **Login** | Context method | ✅ Server Action |

---

## 🔄 Server-Side Data Flow

### Updated Root Layout

```tsx
// apps/web/src/app/layout.tsx
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
  description: "Digital platform for managing convocation ceremonies at Parul University.",
  keywords: "Parul University, Convocation, Graduation, Ceremony, Registration",
  authors: [{ name: "Kaustubh Bagale" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0F",
};

/**
 * 🔑 KEY CHANGE: Root Layout is now async and fetches user data server-side
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1️⃣ Get session from server (Phase 2 utility)
  const session = await getServerSession();

  // 2️⃣ Transform session to UserInfo format (if exists)
  const initialUser = session ? {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name || 'User',
    role: session.user.role,
    profileImageURL: undefined, // Add if available in your session
  } : null;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-dark-bg text-foreground">
        {/* 3️⃣ Seed AuthProvider with server data */}
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

### Data Flow Visualization

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Browser Request                                           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Next.js Server (layout.tsx - Server Component)           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ const session = await getServerSession()           │    │
│  │   ↓                                                │    │
│  │ • Read accessToken from cookies                    │    │
│  │ • Verify JWT signature & expiration                │    │
│  │ • Extract user: { id, email, role, name }          │    │
│  └────────────────────────────────────────────────────┘    │
│                               │                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Transform to UserInfo                              │    │
│  │   ↓                                                │    │
│  │ const initialUser = {                              │    │
│  │   id: session.user.id,                             │    │
│  │   email: session.user.email,                       │    │
│  │   name: session.user.name,                         │    │
│  │   role: session.user.role,                         │    │
│  │ }                                                  │    │
│  └────────────────────────────────────────────────────┘    │
│                               │                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ <AuthProvider initialUser={initialUser}>           │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Client (Browser)                                          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ AuthProvider (Client Component)                    │    │
│  │                                                     │    │
│  │ const [user, setUser] = useState(initialUser)      │    │
│  │                                                     │    │
│  │ ✅ User state pre-populated with server data       │    │
│  │ ✅ No loading state needed                         │    │
│  │ ✅ No useEffect auth check                         │    │
│  │ ✅ No hydration mismatch                           │    │
│  │ ✅ No extra API call                               │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Benefits of This Approach

1. **No Client-Side Fetch**: User data comes from props, not API calls
2. **No Loading State**: Data available immediately on hydration
3. **No Hydration Mismatch**: Server and client have same initial state
4. **Single Source of Truth**: Server session is authoritative
5. **Better Performance**: Eliminates extra API request on page load
6. **Simpler Code**: Context has one job - hold display data

---

## 🚀 Implementation Steps

### Step 1: Backup Current Files

```bash
# Create backup
cp apps/web/src/contexts/AuthContext.tsx apps/web/src/contexts/AuthContext.tsx.backup
cp apps/web/src/app/layout.tsx apps/web/src/app/layout.tsx.backup
```

### Step 2: Update AuthContext.tsx

Replace the entire file with the new simplified version shown above.

### Step 3: Update layout.tsx

Make it async and add session fetching as shown above.

### Step 4: Update Components Using useAuth()

Find and update all components that use the old auth context:

```tsx
// ❌ OLD USAGE
const { user, loading, isAuthenticated, hasRole } = useAuth();

if (loading) return <Loading />;
if (!isAuthenticated) return <LoginPrompt />;
if (!hasRole(['ADMIN'])) return <Forbidden />;

// ✅ NEW USAGE - Just display user info
const { user, logout } = useAuth();

return (
  <div>
    {user && (
      <div>
        <p>Welcome, {user.name}!</p>
        <p>Role: {user.role}</p>
        <button onClick={logout}>Logout</button>
      </div>
    )}
  </div>
);
```

### Step 5: Move Authentication to Server Components

For protected pages, use server-side checks:

```tsx
// app/admin/page.tsx
import { requireRole } from '@/lib/auth';

export default async function AdminPage() {
  // This redirects to /login if not authenticated or not ADMIN
  const session = await requireRole(['ADMIN']);
  
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
    </div>
  );
}
```

### Step 6: Create Login Page with Server Action

Since we removed `login()` from context, create a dedicated login page:

```tsx
// app/login/page.tsx
import { getServerSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  // Redirect if already logged in
  const session = await getServerSession();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
}
```

```tsx
// app/login/LoginForm.tsx
'use client';

import { useState } from 'react';
import { loginAction } from './actions';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await loginAction({ email, password });
    
    if (!result.success) {
      setError(result.error || 'Login failed');
      setLoading(false);
    }
    // On success, server action redirects
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

```tsx
// app/login/actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface LoginResult {
  success: boolean;
  error?: string;
}

export async function loginAction(data: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  try {
    const response = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Login failed',
      };
    }

    const result = await response.json();
    const cookieStore = await cookies();
    
    // Set auth cookies
    if (result.data.accessToken) {
      cookieStore.set('accessToken', result.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60, // 15 minutes
      });
    }
    
    if (result.data.refreshToken) {
      cookieStore.set('refreshToken', result.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    redirect('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
```

---

## 📝 Migration Checklist

### Phase 4A: Simplify Context ✅

- [ ] Backup current `AuthContext.tsx`
- [ ] Create new `UserInfo` interface (5 fields only)
- [ ] Update `AuthContextType` (remove loading, login, isAuthenticated, hasRole)
- [ ] Add `initialUser` prop to `AuthProviderProps`
- [ ] Remove all client-side auth logic from `AuthProvider`
- [ ] Simplify `logout()` to use fetch API
- [ ] Remove `useEffect` auth check
- [ ] Update `useAuth()` hook documentation

### Phase 4B: Update Layout ✅

- [ ] Backup current `layout.tsx`
- [ ] Import `getServerSession` from `@/lib/auth/session`
- [ ] Make `RootLayout` async
- [ ] Call `await getServerSession()` at top of component
- [ ] Transform session to `UserInfo` format
- [ ] Pass `initialUser` prop to `AuthProvider`
- [ ] Test server-side rendering

### Phase 4C: Update Components ✅

- [ ] Find all files using `useAuth()` (use grep/search)
- [ ] Remove usage of `loading` state
- [ ] Remove usage of `isAuthenticated`
- [ ] Remove usage of `hasRole()`
- [ ] Remove usage of `login()`
- [ ] Update to only use `user` and `logout`
- [ ] Add server-side auth checks where needed

### Phase 4D: Create Login Flow ✅

- [ ] Create `app/login/page.tsx` (Server Component)
- [ ] Create `app/login/LoginForm.tsx` (Client Component)
- [ ] Create `app/login/actions.ts` (Server Actions)
- [ ] Implement `loginAction` with cookie setting
- [ ] Test login flow end-to-end
- [ ] Handle error cases

### Phase 4E: Testing ✅

- [ ] Test page load with logged-in user
- [ ] Test page load with logged-out user
- [ ] Test logout functionality
- [ ] Verify no hydration warnings
- [ ] Check no client-side auth API calls
- [ ] Verify server redirects work
- [ ] Test protected pages
- [ ] Test role-based pages

---

## 🎯 Expected Outcomes

After Phase 4 completion:

✅ **AuthContext is 70% smaller** (from ~170 lines to ~50 lines)  
✅ **No client-side API calls** on page load  
✅ **No hydration mismatches** (server and client in sync)  
✅ **No loading states** (data available immediately)  
✅ **Single source of truth** (server session)  
✅ **Better security** (auth logic server-side only)  
✅ **Better performance** (one less API call per page)  
✅ **Simpler code** (context has one job)  

---

## 📚 References

- **Phase 2 Utilities**: `/mnt/240GB_SATA/Development/Parul/convocation-pu/apps/web/src/lib/auth/session.ts`
- **Server Components**: Next.js App Router documentation
- **Server Actions**: Next.js Server Actions guide
- **Cookie Management**: Next.js cookies() API

---

**Ready to execute Phase 4!** 🚀
