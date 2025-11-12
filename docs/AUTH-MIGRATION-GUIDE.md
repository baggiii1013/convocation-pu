# Hybrid Server-Centric Auth Migration Guide

## 🎯 Migration Phases Overview

This document outlines the complete 5-phase migration plan for transitioning from a client-heavy authentication model to a robust server-centric hybrid approach.

---

## ✅ Phase 1: Enhanced Middleware (COMPLETE)

**Status**: ✅ Completed  
**Duration**: Completed on November 12, 2025  
**Documentation**: See `PHASE-1-MIDDLEWARE-COMPLETE.md`

### What Was Achieved:
- ✅ Installed `jose` library for JWT validation
- ✅ Created JWT utility functions (`apps/web/src/lib/jwt.ts`)
- ✅ Enhanced middleware with proper token validation
- ✅ Implemented role-based redirects
- ✅ Configured middleware matcher for optimal performance
- ✅ Added JWT secrets to environment configuration

### Key Features:
- Token signature and expiration verification at the edge
- Automatic invalid token cleanup
- Role-based access control (RBAC)
- Fast edge-level redirects
- Secure cookie handling

---

## 📋 Phase 2: Server Component Migration

**Status**: 🔄 Next Phase  
**Estimated Duration**: 2-3 days  
**Complexity**: High

### Objective:
Convert all dashboard and protected pages to Server Components, moving authentication and data fetching to the server.

### Tasks:

#### 2.1 Convert Dashboard Pages to Server Components
- [ ] Convert `apps/web/src/app/dashboard/page.tsx` to Server Component
- [ ] Convert `apps/web/src/app/admin/dashboard/page.tsx` to Server Component
- [ ] Remove `'use client'` directives from layout files where possible
- [ ] Move data fetching from `useEffect` to server-side data fetching

#### 2.2 Create Server-Side Auth Utilities
- [ ] Create `apps/web/src/lib/server-auth.ts`
- [ ] Implement `getAuthUser()` function to extract user from cookies on server
- [ ] Implement `requireAuth()` function for protected pages
- [ ] Implement `requireRole(roles: string[])` for role-based pages

#### 2.3 Migrate Data Fetching
- [ ] Create server-side API client (`apps/web/src/lib/api-server.ts`)
- [ ] Move dashboard data fetching to server
- [ ] Pass user context from middleware headers to server components
- [ ] Implement proper error boundaries for server components

#### 2.4 Update Page Components
- [ ] Dashboard pages render data from server props
- [ ] Remove client-side auth checks (`useAuth`, `hasRole`)
- [ ] Keep interactivity with Client Components for UI only
- [ ] Use React Server Components patterns (async components, suspense)

### Example Server Component Pattern:

```typescript
// apps/web/src/app/dashboard/page.tsx
import { getAuthUser } from '@/lib/server-auth';
import { fetchDashboardData } from '@/lib/api-server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  // Get authenticated user from server
  const user = await getAuthUser();
  
  if (!user) {
    redirect('/login?redirect_url=/dashboard');
  }
  
  // Fetch data on server with user context
  const dashboardData = await fetchDashboardData(user.userId);
  
  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      {/* Render server data */}
    </div>
  );
}
```

### Files to Create:
- `apps/web/src/lib/server-auth.ts` - Server-side auth utilities
- `apps/web/src/lib/api-server.ts` - Server-side API client

### Files to Modify:
- `apps/web/src/app/dashboard/page.tsx`
- `apps/web/src/app/admin/dashboard/page.tsx`
- `apps/web/src/app/profile/page.tsx`
- `apps/web/src/app/settings/page.tsx`
- All other protected page components

### Testing Checklist:
- [ ] Server Components render correctly with user data
- [ ] Unauthorized access properly redirected
- [ ] Data fetching happens on server (check Network tab)
- [ ] No client-side auth checks in Server Components
- [ ] Proper error handling for failed auth/data fetch

---

## 📋 Phase 3: AuthContext Simplification

**Status**: ⏳ Pending Phase 2  
**Estimated Duration**: 1 day  
**Complexity**: Medium

### Objective:
Strip AuthContext of all access-control logic. Make it purely UI/UX focused.

### Tasks:

#### 3.1 Simplify AuthContext
- [ ] Remove `hasRole()` function
- [ ] Remove `isAuthenticated` computed property
- [ ] Remove server-side auth checks from `checkAuth()`
- [ ] Keep only display properties: `user` object with name, email, avatar
- [ ] Keep `logout()` function only

#### 3.2 Update AuthContext Interface
```typescript
export interface User {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  profileImageURL?: string;
}

export interface AuthContextType {
  user: User | null;  // Display info only
  logout: () => void; // Single action
}
```

#### 3.3 Remove Auth Checks from Components
- [ ] Remove all `hasRole()` calls from client components
- [ ] Remove all `isAuthenticated` checks
- [ ] Replace with server-side checks where needed
- [ ] Keep only UI state (showing user name, avatar in nav)

#### 3.4 Update Login Flow
- [ ] Login still sets user display data in context
- [ ] Logout clears user and redirects
- [ ] No client-side access control decisions

### Example Simplified AuthContext:

```typescript
// apps/web/src/contexts/AuthContext.tsx
'use client';

export interface User {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  profileImageURL?: string;
}

export interface AuthContextType {
  user: User | null;
  logout: () => void;
}

// Only handles display state and logout
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  
  const logout = async () => {
    await api.post('/api/v1/auth/logout');
    setUser(null);
    router.push('/');
  };
  
  // Only loads display info, no access control
  useEffect(() => {
    const loadUserDisplay = async () => {
      try {
        const response = await api.get('/api/v1/auth/profile');
        setUser({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          displayName: response.data.displayName,
          email: response.data.email,
          profileImageURL: response.data.profileImageURL,
        });
      } catch {
        setUser(null);
      }
    };
    
    loadUserDisplay();
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Files to Modify:
- `apps/web/src/contexts/AuthContext.tsx` - Simplify to UI only
- All components using `hasRole()` or `isAuthenticated`
- Navigation components (keep user display)

### Testing Checklist:
- [ ] User display info shown in navigation
- [ ] Logout works correctly
- [ ] No client-side access control remains
- [ ] All protection handled by middleware/server

---

## 📋 Phase 4: API Integration & Token Management

**Status**: ⏳ Pending Phase 3  
**Estimated Duration**: 2 days  
**Complexity**: Medium

### Objective:
Implement proper server-to-API communication with user context and token refresh logic.

### Tasks:

#### 4.1 Server-Side API Client
- [ ] Create authenticated API client for server components
- [ ] Pass user context from middleware headers
- [ ] Implement error handling for 401/403
- [ ] Add retry logic for expired tokens

#### 4.2 Token Refresh Implementation
- [ ] Implement refresh token logic in middleware
- [ ] Automatic token refresh when access token expires
- [ ] Update both cookies on successful refresh
- [ ] Clear all tokens on refresh failure

#### 4.3 API Route Handlers
- [ ] Create Next.js API routes as proxy to backend API (if needed)
- [ ] Pass authenticated user context to API
- [ ] Handle token refresh in API routes
- [ ] Proper error responses

#### 4.4 Remove Client-Side API Auth
- [ ] Remove token handling from client-side axios interceptors
- [ ] Remove refresh token logic from client code
- [ ] Keep only basic API client for public endpoints

### Example Server API Client:

```typescript
// apps/web/src/lib/api-server.ts
import { cookies, headers } from 'next/headers';

export async function fetchWithAuth(endpoint: string) {
  const headersList = headers();
  const userId = headersList.get('x-user-id');
  const userEmail = headersList.get('x-user-email');
  
  const response = await fetch(`${process.env.API_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${cookies().get('accessToken')?.value}`,
      'X-User-Id': userId || '',
      'X-User-Email': userEmail || '',
    },
  });
  
  if (!response.ok) {
    throw new Error('API request failed');
  }
  
  return response.json();
}
```

### Files to Create:
- `apps/web/src/lib/api-server.ts` - Server-side API client
- `apps/web/src/app/api/refresh/route.ts` - Token refresh endpoint (if needed)

### Files to Modify:
- `apps/web/src/middleware.ts` - Add token refresh logic
- `apps/web/src/lib/axios.ts` - Simplify client-side API client
- All server components making API calls

### Testing Checklist:
- [ ] Server Components fetch data with user context
- [ ] Token refresh works automatically
- [ ] Expired tokens handled gracefully
- [ ] No token management on client side
- [ ] API errors properly handled

---

## 📋 Phase 5: Testing & Validation

**Status**: ⏳ Pending Phase 4  
**Estimated Duration**: 1-2 days  
**Complexity**: Medium

### Objective:
Comprehensive testing of the entire auth system and final validation.

### Tasks:

#### 5.1 Security Testing
- [ ] Test token tampering attempts
- [ ] Test expired token handling
- [ ] Test role-based access control
- [ ] Test unauthorized access attempts
- [ ] Test XSS prevention (httpOnly cookies)
- [ ] Test CSRF prevention (sameSite strict)

#### 5.2 Functional Testing
- [ ] Login flow end-to-end
- [ ] Logout flow end-to-end
- [ ] Protected routes access
- [ ] Admin routes access
- [ ] Token refresh flow
- [ ] Session persistence across page reloads
- [ ] Redirect after login

#### 5.3 Performance Testing
- [ ] Middleware execution time
- [ ] Server Component render time
- [ ] API response times
- [ ] Token verification overhead
- [ ] Page load times

#### 5.4 User Experience Testing
- [ ] Smooth navigation between routes
- [ ] Proper error messages
- [ ] Loading states
- [ ] Redirect UX (with redirect_url)
- [ ] Session expiration UX

#### 5.5 Code Quality
- [ ] Remove unused code
- [ ] Update documentation
- [ ] Add inline comments
- [ ] Type safety verification
- [ ] ESLint compliance

### Testing Scenarios:

#### Security Test Cases:
```bash
# Test 1: Unauthorized access to admin
curl -I http://localhost:3000/admin
# Expected: 307 Redirect to /login

# Test 2: Tampered token
# Set invalid token in cookie
# Expected: 307 Redirect to /login with error

# Test 3: Expired token
# Wait for token to expire
# Expected: Automatic refresh or redirect to login

# Test 4: Role escalation attempt
# STUDENT trying to access /admin
# Expected: 307 Redirect to /dashboard?error=unauthorized
```

#### Functional Test Cases:
- [ ] User can login successfully
- [ ] User sees their dashboard
- [ ] User can access their profile
- [ ] Admin can access admin panel
- [ ] Student cannot access admin panel
- [ ] User can logout successfully
- [ ] Session persists on page reload
- [ ] After logout, cannot access protected routes

### Files to Create:
- `docs/TESTING-GUIDE.md` - Comprehensive testing guide
- `docs/SECURITY-AUDIT.md` - Security audit report

### Final Validation Checklist:
- [ ] All phases complete
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Code reviewed
- [ ] Performance acceptable
- [ ] Security validated
- [ ] Ready for production

---

## 🚀 Getting Started

### Prerequisites:
- Node.js 18+ or Bun runtime
- MongoDB running
- API server running on port 3001
- Web server running on port 3000

### Environment Setup:

1. **API Environment** (`apps/api/.env`):
```bash
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
DATABASE_URL="mongodb://localhost:27017/pu_convocation"
```

2. **Web Environment** (`apps/web/.env.local`):
```bash
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

⚠️ **Critical**: JWT secrets must match between API and Web!

### Running the Migration:

```bash
# Start API server
cd apps/api
bun run dev

# Start Web server (in separate terminal)
cd apps/web
bun run dev

# Test Phase 1
curl -I http://localhost:3000/dashboard
# Should redirect to /login
```

---

## 📊 Progress Tracker

| Phase | Status | Completion | Duration | 
|-------|--------|------------|----------|
| Phase 1: Middleware | ✅ Complete | 100% | Completed |
| Phase 2: Server Components | 🔄 Next | 0% | Est. 2-3 days |
| Phase 3: AuthContext | ⏳ Pending | 0% | Est. 1 day |
| Phase 4: API Integration | ⏳ Pending | 0% | Est. 2 days |
| Phase 5: Testing | ⏳ Pending | 0% | Est. 1-2 days |

**Total Estimated Time**: 6-8 days  
**Current Progress**: 20% (1 of 5 phases)

---

## 📚 Documentation Files

- `PHASE-1-MIDDLEWARE-COMPLETE.md` - Phase 1 detailed documentation ✅
- `MIGRATION-GUIDE.md` - This file (overview) ✅
- `PHASE-2-SERVER-COMPONENTS.md` - To be created in Phase 2
- `PHASE-3-AUTHCONTEXT.md` - To be created in Phase 3
- `PHASE-4-API-INTEGRATION.md` - To be created in Phase 4
- `PHASE-5-TESTING.md` - To be created in Phase 5
- `SECURITY-AUDIT.md` - Final security audit

---

## 🎓 Learning Resources

### Next.js Server Components:
- [Next.js Server Components Documentation](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Server Actions and Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

### JWT & Security:
- [jose Documentation](https://github.com/panva/jose)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

### Next.js Middleware:
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Edge Runtime](https://nextjs.org/docs/app/api-reference/edge)

---

## ⚠️ Important Notes

1. **Backward Compatibility**: Each phase should maintain backward compatibility until the next phase is complete.

2. **Testing Between Phases**: Thoroughly test after each phase before proceeding to the next.

3. **Rollback Plan**: Keep the ability to rollback to previous phase if issues arise.

4. **Production Deployment**: Do not deploy partial migration to production. Complete all phases in staging first.

5. **JWT Secrets**: Never commit secrets to version control. Use environment variables.

6. **Performance Monitoring**: Monitor performance metrics throughout migration.

---

**Last Updated**: November 12, 2025  
**Migration Lead**: GitHub Copilot  
**Status**: Phase 1 Complete, Ready for Phase 2
