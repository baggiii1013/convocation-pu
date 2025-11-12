# Phase 4: Simplify Client Context

> **Goal**: Strip the client-side context of its power by removing authentication logic, role checks, and loading states. The context becomes a simple data holder seeded by server-side data.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Before: Heavy Client Context](#before-heavy-client-context)
3. [After: Lite Context](#after-lite-context)
4. [Server-Side Data Flow](#server-side-data-flow)
5. [Implementation Steps](#implementation-steps)
6. [Migration Checklist](#migration-checklist)

---

## Overview

In Phase 3, we converted pages to Server Components that handle authentication server-side. Now in Phase 4, we simplify the client context to reflect this new architecture.

### Key Changes

- **Remove**: `isLoading`, `isAuthenticated`, `checkAuth()`, `hasPermission()`, `hasRole()`, `login()`
- **Keep**: `user` state and `logout()` function
- **Add**: Server-side data seeding via props

### Why?

- Authentication is now handled server-side (Phase 2 utilities)
- Role checks happen in Server Components using `requireAuth()` and `requireRole()`
- No need for client-side loading states when using Server Components
- Simpler, more predictable client state

---

## Before: Heavy Client Context

### Old AuthContext.tsx (Client-Heavy)

```tsx
"use client";

import api from "@/lib/axios";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// ❌ Heavy interface with authentication logic
export interface AuthContextType {
  user: User | null;
  loading: boolean; // ❌ Remove
  login: (email: string, password: string) => Promise<void>; // ❌ Remove
  logout: () => void; // ✅ Keep
  isAuthenticated: boolean; // ❌ Remove
  hasRole: (roles: string | string[]) => boolean; // ❌ Remove
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // ❌ Remove
  const router = useRouter();

  // ❌ Remove: Client-side authentication check
  const isAuthenticated = !!user;

  // ❌ Remove: Client-side role checking
  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  // ❌ Remove: Client-side login (move to dedicated login page with Server Action)
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.post("/api/v1/auth/login", {
        email,
        password,
      });
      const { user: userData } = response.data.data;
      setUser({
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        displayName: userData.displayName,
        role: userData.role.toUpperCase(),
        profileImageURL: userData.profileImageURL,
        accountState: userData.accountState,
        isActive: userData.isActive,
      });
    } catch (error) {
      console.error("Login error:", error);
      setUser(null);
      throw new Error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Keep: Logout function
  const logout = async () => {
    try {
      await api.post("/api/v1/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      router.push("/");
    }
  };

  // ❌ Remove: Client-side auth check on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/api/v1/auth/profile");
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
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // ❌ Heavy value object
  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

### Problems with Old Approach

1. **Redundant Loading States**: Server Components already handle auth checks
2. **Client-Side Auth Logic**: Duplicates server-side validation
3. **Race Conditions**: `useEffect` auth check can conflict with server redirects
4. **Hydration Mismatches**: Client state may differ from server state
5. **Unnecessary Complexity**: Too many responsibilities in one context

---

## After: Lite Context

### New AuthContext.tsx (Simplified)

```tsx
"use client";

import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useState } from "react";

/**
 * Minimal user information for client-side display
 * No sensitive data or auth tokens
 */
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF" | "STUDENT";
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
  initialUser?: UserInfo | null; // 🔑 Seeded from server
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
export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  // Simple state - seeded with server data
  const [user, setUser] = useState<UserInfo | null>(initialUser);
  const router = useRouter();

  /**
   * Logout function
   * Calls the server logout endpoint and clears local state
   */
  const logout = async () => {
    try {
      // Call logout API to clear cookies
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Logout failed:", await response.text());
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear user state regardless of API result
      setUser(null);

      // Redirect to home and refresh to clear server state
      router.push("/");
      router.refresh();
    }
  };

  const value: AuthContextType = {
    user,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * Only provides user info and logout - no auth logic
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
```

### What Changed?

| Feature            | Before                              | After                                        |
| ------------------ | ----------------------------------- | -------------------------------------------- |
| **User State**     | Complex `User` type with all fields | Simple `UserInfo` with display data only     |
| **Loading State**  | `loading: boolean`                  | ❌ Removed (handled by React Suspense)       |
| **Authentication** | `isAuthenticated`, `checkAuth()`    | ❌ Removed (handled server-side)             |
| **Role Checks**    | `hasRole()` function                | ❌ Removed (use server-side `requireRole()`) |
| **Login**          | `login()` function                  | ❌ Removed (use Server Actions)              |
| **Logout**         | `logout()` function                 | ✅ Kept (simple API call)                    |
| **Initialization** | `useEffect` + API call              | ✅ Props from server                         |

---

## Server-Side Data Flow

### Updated Root Layout (apps/web/src/app/layout.tsx)

```tsx
import { AuthProvider } from "@/contexts/AuthContext";
import { getServerSession } from "@/lib/auth/session";
import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "PU Convocation - Parul University",
  description: "Digital platform for managing convocation ceremonies",
};

/**
 * Root Layout - Server Component
 *
 * This component:
 * 1. Calls getServerSession() to get user data (Phase 2 utility)
 * 2. Transforms session data into UserInfo format
 * 3. Passes user data as initialUser prop to AuthProvider
 *
 * This eliminates the need for client-side auth checks
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Get session from server (Phase 2 utility)
  const session = await getServerSession();

  // 2. Transform session into UserInfo format (if exists)
  const initialUser = session
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || "User",
        role: session.user.role,
        profileImageURL: undefined, // Add if available in session
      }
    : null;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-dark-bg text-foreground">
        {/* 3. Seed AuthProvider with server data */}
        <AuthProvider initialUser={initialUser}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "var(--card)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Browser Request                                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ Next.js Server                                               │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ layout.tsx (Server Component)                      │    │
│  │                                                     │    │
│  │  1. const session = await getServerSession()       │    │
│  │     ↓                                              │    │
│  │  2. Read accessToken cookie                        │    │
│  │     ↓                                              │    │
│  │  3. Verify JWT signature                           │    │
│  │     ↓                                              │    │
│  │  4. Extract user data from token                   │    │
│  │     ↓                                              │    │
│  │  5. Transform to UserInfo format                   │    │
│  │     ↓                                              │    │
│  │  6. <AuthProvider initialUser={userInfo}>          │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ Client (Browser)                                             │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ AuthProvider (Client Component)                    │    │
│  │                                                     │    │
│  │  const [user, setUser] = useState(initialUser)     │    │
│  │                                                     │    │
│  │  ✅ User state hydrated with server data           │    │
│  │  ✅ No loading state needed                        │    │
│  │  ✅ No client-side auth check                      │    │
│  │  ✅ No hydration mismatch                          │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Key Benefits

1. **No Client-Side Fetch**: User data comes from props, not API calls
2. **No Loading State**: Data is available immediately on hydration
3. **No Hydration Mismatch**: Server and client have same initial state
4. **Single Source of Truth**: Server session is authoritative
5. **Better Performance**: Eliminates extra API request on page load

---

## Implementation Steps

### Step 1: Update Type Definitions

```tsx
// ❌ Remove old User interface with all fields
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: "ADMIN" | "STAFF" | "STUDENT";
  profileImageURL?: string;
  accountState: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
  isActive: boolean;
}

// ✅ Add simple UserInfo interface
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF" | "STUDENT";
  profileImageURL?: string;
}
```

### Step 2: Simplify AuthContextType

```tsx
// ❌ Remove heavy interface
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: string | string[]) => boolean;
}

// ✅ Add lite interface
export interface AuthContextType {
  user: UserInfo | null;
  logout: () => Promise<void>;
}
```

### Step 3: Update AuthProvider Props

```tsx
interface AuthProviderProps {
  children: ReactNode;
  initialUser?: UserInfo | null; // Add this prop
}
```

### Step 4: Remove Client-Side Auth Logic

```tsx
export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  // ✅ Simple state initialization
  const [user, setUser] = useState<UserInfo | null>(initialUser);
  const router = useRouter();

  // ❌ Remove these:
  // - const [loading, setLoading] = useState(true);
  // - const isAuthenticated = !!user;
  // - const hasRole = ...
  // - const login = ...
  // - useEffect(() => { checkAuth(); }, []);

  // ✅ Keep only logout
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Step 5: Update Root Layout

```tsx
// apps/web/src/app/layout.tsx
import { getServerSession } from "@/lib/auth/session";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session from server
  const session = await getServerSession();

  // Transform to UserInfo
  const initialUser = session
    ? {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || "User",
        role: session.user.role,
      }
    : null;

  return (
    <html lang="en">
      <body>
        <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

### Step 6: Update Client Components

```tsx
// ❌ Old usage
const { user, loading, isAuthenticated, hasRole } = useAuth();

if (loading) return <Loading />;
if (!isAuthenticated) return <LoginPrompt />;
if (!hasRole(["ADMIN"])) return <Forbidden />;

// ✅ New usage - just display user info
const { user, logout } = useAuth();

return (
  <div>
    {user ? (
      <>
        <p>Welcome, {user.name}!</p>
        <button onClick={logout}>Logout</button>
      </>
    ) : (
      <p>Not logged in</p>
    )}
  </div>
);
```

---

## Migration Checklist

### Phase 4A: Simplify Context

- [ ] Create new `UserInfo` interface
- [ ] Update `AuthContextType` to remove heavy features
- [ ] Add `initialUser` prop to `AuthProvider`
- [ ] Remove `loading`, `isAuthenticated`, `hasRole` from state
- [ ] Remove `login()` function (move to Server Action)
- [ ] Remove `useEffect` auth check
- [ ] Simplify `logout()` to use fetch API
- [ ] Update `useAuth()` hook return type

### Phase 4B: Update Layout

- [ ] Import `getServerSession` from Phase 2
- [ ] Make `layout.tsx` an async Server Component
- [ ] Call `getServerSession()` at the top
- [ ] Transform session data to `UserInfo` format
- [ ] Pass `initialUser` prop to `AuthProvider`
- [ ] Test that user state is correctly seeded

### Phase 4C: Update Client Components

- [ ] Find all components using `useAuth()`
- [ ] Remove usage of `loading` state
- [ ] Remove usage of `isAuthenticated`
- [ ] Remove usage of `hasRole()`
- [ ] Replace with server-side auth checks if needed
- [ ] Update to use only `user` and `logout`

### Phase 4D: Create Login Page

- [ ] Create `app/login/page.tsx` as Server Component
- [ ] Redirect if already authenticated (server-side check)
- [ ] Create login form as Client Component
- [ ] Create Server Action for login (in `app/login/actions.ts`)
- [ ] Use `cookies().set()` to set auth tokens
- [ ] Redirect on success using `redirect()`

### Phase 4E: Testing

- [ ] Test initial page load with logged-in user
- [ ] Test initial page load with logged-out user
- [ ] Test logout functionality
- [ ] Verify no hydration warnings in console
- [ ] Check that no client-side auth API calls are made
- [ ] Verify proper server-side redirects
- [ ] Test protected pages still work correctly

---

## Example: Login Page with Server Action

Since we removed `login()` from the context, here's how to implement login:

### app/login/page.tsx (Server Component)

```tsx
import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  // Server-side check: redirect if already logged in
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
}
```

### app/login/LoginForm.tsx (Client Component)

```tsx
"use client";

import { useState } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginAction({ email, password });

      if (!result.success) {
        setError(result.error || "Login failed");
      }
      // On success, server action redirects to dashboard
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
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
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

### app/login/actions.ts (Server Action)

```tsx
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface LoginResult {
  success: boolean;
  error?: string;
}

export async function loginAction(data: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  try {
    // Call your API to login
    const response = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Login failed",
      };
    }

    const result = await response.json();

    // Set cookies from server
    const cookieStore = await cookies();

    // Assuming your API returns tokens
    if (result.data.accessToken) {
      cookieStore.set("accessToken", result.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 15 * 60, // 15 minutes
      });
    }

    if (result.data.refreshToken) {
      cookieStore.set("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    // Redirect to dashboard
    redirect("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
```

---

## Summary

### What We Accomplished

✅ **Removed** all client-side authentication logic  
✅ **Simplified** context to only hold display data  
✅ **Eliminated** loading states and race conditions  
✅ **Implemented** server-side data seeding  
✅ **Moved** login to Server Actions  
✅ **Improved** performance by removing client-side API calls

### The New Flow

1. **Server**: `layout.tsx` calls `getServerSession()`
2. **Server**: Transforms session to `UserInfo` format
3. **Server**: Passes data as `initialUser` prop
4. **Client**: `AuthProvider` initializes state with prop
5. **Client**: Components access `user` via `useAuth()`
6. **Client**: No loading, no auth checks, just display

### Next Steps

- **Phase 5**: Implement all protected pages as Server Components
- **Phase 6**: Add role-based UI customization using server-side checks
- **Phase 7**: Implement Server Actions for all mutations
- **Phase 8**: Clean up old API routes and middleware

---

## Reference: Phase 2 Server Utilities

Remember, all authentication logic now uses these Phase 2 utilities:

```tsx
import {
  getServerSession, // Get current session
  requireAuth, // Redirect if not authenticated
  requireRole, // Redirect if wrong role
  getCurrentUser, // Shorthand for requireAuth
} from "@/lib/auth";

// Example in a page
export default async function AdminPage() {
  const session = await requireRole(["ADMIN"]);

  return <div>Admin content for {session.user.name}</div>;
}
```

---

**Phase 4 Complete!** 🎉

The client context is now a lightweight data holder, with all authentication logic living server-side where it belongs.
