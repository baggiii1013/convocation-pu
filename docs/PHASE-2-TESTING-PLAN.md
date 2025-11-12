# Phase 2 Testing Plan

## Overview
This document outlines comprehensive testing procedures for the Phase 2 server-side auth utilities.

---

## Manual Testing

### Test 1: Basic Session Reading

**File**: Test in any Server Component

```typescript
import { getServerSession } from '@/lib/auth';

export default async function TestPage() {
  const session = await getServerSession();
  
  return (
    <div>
      <h1>Session Test</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
```

**Expected Results**:
- ✅ With valid login: Shows session object with user data
- ✅ Without login: Shows `null`
- ✅ With expired token: Shows `null`
- ✅ With invalid token: Shows `null`

---

### Test 2: requireAuth() Function

**File**: Create `app/test-auth/page.tsx`

```typescript
import { requireAuth } from '@/lib/auth';

export default async function TestAuthPage() {
  const session = await requireAuth();
  
  return (
    <div>
      <h1>Protected Page</h1>
      <p>User: {session.user.name}</p>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
    </div>
  );
}
```

**Test Cases**:

1. **Unauthenticated User**:
   - Action: Visit `/test-auth` without logging in
   - Expected: Redirect to `/login?redirect_url=/test-auth`
   
2. **Authenticated User**:
   - Action: Login, then visit `/test-auth`
   - Expected: Page renders with user information
   
3. **Expired Token**:
   - Action: Wait for token to expire (15 min), visit `/test-auth`
   - Expected: Redirect to `/login?redirect_url=/test-auth&error=session_expired`

---

### Test 3: requireAdmin() Function

**File**: Create `app/test-admin/page.tsx`

```typescript
import { requireAdmin } from '@/lib/auth';

export default async function TestAdminPage() {
  const session = await requireAdmin();
  
  return (
    <div>
      <h1>Admin Only Page</h1>
      <p>Admin: {session.user.email}</p>
    </div>
  );
}
```

**Test Cases**:

1. **Admin User**:
   - Action: Login as ADMIN, visit `/test-admin`
   - Expected: Page renders successfully
   
2. **Staff User**:
   - Action: Login as STAFF, visit `/test-admin`
   - Expected: Redirect to `/dashboard?error=unauthorized`
   
3. **Student User**:
   - Action: Login as STUDENT, visit `/test-admin`
   - Expected: Redirect to `/dashboard?error=unauthorized`
   
4. **Unauthenticated**:
   - Action: Visit `/test-admin` without login
   - Expected: Redirect to `/login?redirect_url=/test-admin`

---

### Test 4: requireStaff() Function

**File**: Create `app/test-staff/page.tsx`

```typescript
import { requireStaff } from '@/lib/auth';

export default async function TestStaffPage() {
  const session = await requireStaff();
  
  return (
    <div>
      <h1>Staff/Admin Page</h1>
      <p>Your role: {session.user.role}</p>
    </div>
  );
}
```

**Test Cases**:

1. **Admin User**:
   - Action: Login as ADMIN, visit `/test-staff`
   - Expected: Page renders ✅
   
2. **Staff User**:
   - Action: Login as STAFF, visit `/test-staff`
   - Expected: Page renders ✅
   
3. **Student User**:
   - Action: Login as STUDENT, visit `/test-staff`
   - Expected: Redirect to `/dashboard?error=unauthorized`

---

### Test 5: requireRole() with Multiple Roles

**File**: Create `app/test-multi-role/page.tsx`

```typescript
import { requireRole } from '@/lib/auth';

export default async function TestMultiRolePage() {
  const session = await requireRole(['ADMIN', 'STUDENT']);
  
  return (
    <div>
      <h1>Admin or Student Only</h1>
      <p>Role: {session.user.role}</p>
    </div>
  );
}
```

**Test Cases**:

1. **Admin User**: ✅ Access granted
2. **Student User**: ✅ Access granted
3. **Staff User**: ❌ Redirect to unauthorized

---

### Test 6: getOptionalSession() Function

**File**: Create `app/test-optional/page.tsx`

```typescript
import { getOptionalSession } from '@/lib/auth';

export default async function TestOptionalPage() {
  const session = await getOptionalSession();
  
  return (
    <div>
      <h1>Public Page</h1>
      {session ? (
        <p>Logged in as: {session.user.email}</p>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}
```

**Test Cases**:

1. **With Login**: Shows "Logged in as: [email]"
2. **Without Login**: Shows "Not logged in"
3. **No Redirects**: Never redirects, always renders

---

### Test 7: checkRole() Function

**File**: Create `app/test-check-role/page.tsx`

```typescript
import { requireAuth, checkRole } from '@/lib/auth';

export default async function TestCheckRolePage() {
  const session = await requireAuth();
  const isAdmin = await checkRole(['ADMIN']);
  const isStaff = await checkRole(['STAFF']);
  
  return (
    <div>
      <h1>Role Checker</h1>
      <p>Your role: {session.user.role}</p>
      <p>Is Admin: {isAdmin ? 'Yes' : 'No'}</p>
      <p>Is Staff: {isStaff ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

**Test Cases**:

1. **Admin Login**: isAdmin=Yes, isStaff=No
2. **Staff Login**: isAdmin=No, isStaff=Yes
3. **Student Login**: isAdmin=No, isStaff=No

---

### Test 8: Protected Server Action

**File**: Create `app/test-action/page.tsx` and `app/test-action/actions.ts`

**actions.ts**:
```typescript
'use server';

import { requireAuth } from '@/lib/auth';

export async function testAction() {
  const session = await requireAuth();
  
  return {
    success: true,
    message: `Action executed by ${session.user.email}`,
  };
}
```

**page.tsx**:
```typescript
import { testAction } from './actions';

export default function TestActionPage() {
  async function handleSubmit() {
    'use server';
    const result = await testAction();
    console.log(result);
  }
  
  return (
    <form action={handleSubmit}>
      <button type="submit">Test Action</button>
    </form>
  );
}
```

**Test Cases**:

1. **Logged In**: Action executes successfully
2. **Not Logged In**: Action redirects to login

---

### Test 9: notFoundOnUnauthorized Option

**File**: Create `app/test-hidden/page.tsx`

```typescript
import { requireRole } from '@/lib/auth';

export default async function TestHiddenPage() {
  const session = await requireRole(['ADMIN'], {
    notFoundOnUnauthorized: true
  });
  
  return (
    <div>
      <h1>Secret Page</h1>
      <p>Only admins know this exists</p>
    </div>
  );
}
```

**Test Cases**:

1. **Admin User**: Page renders
2. **Non-Admin User**: 404 error (not redirect!)

---

### Test 10: Custom Unauthorized Redirect

**File**: Create `app/test-custom-redirect/page.tsx`

```typescript
import { requireRole } from '@/lib/auth';

export default async function TestCustomRedirectPage() {
  const session = await requireRole(['ADMIN'], {
    unauthorizedRedirect: '/custom-unauthorized'
  });
  
  return <div>Admin Page</div>;
}
```

**Test Cases**:

1. **Admin User**: Page renders
2. **Non-Admin User**: Redirects to `/custom-unauthorized`

---

## Automated Testing

### Unit Tests (Jest/Vitest)

**File**: `lib/auth/__tests__/session.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getServerSession } from '../session';

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

describe('getServerSession', () => {
  it('should return null when no token is present', async () => {
    // TODO: Implement test
  });
  
  it('should return session with valid token', async () => {
    // TODO: Implement test
  });
  
  it('should return null with expired token', async () => {
    // TODO: Implement test
  });
});
```

---

## Integration Testing Checklist

### Session Management
- [ ] `getServerSession()` returns valid session with valid token
- [ ] `getServerSession()` returns null with no token
- [ ] `getServerSession()` returns null with expired token
- [ ] `getServerSession()` returns null with invalid signature
- [ ] `hasRole()` correctly validates single role
- [ ] `hasRole()` correctly validates multiple roles
- [ ] `getUserId()` extracts correct user ID
- [ ] `getUserRole()` extracts correct role
- [ ] `isSessionExpired()` detects expired sessions
- [ ] `getSessionTimeRemaining()` calculates correctly

### Auth Protection
- [ ] `requireAuth()` allows authenticated users
- [ ] `requireAuth()` redirects unauthenticated to login
- [ ] `requireAuth()` preserves redirect URL
- [ ] `requireRole(['ADMIN'])` allows admin users
- [ ] `requireRole(['ADMIN'])` blocks non-admin users
- [ ] `requireRole(['ADMIN', 'STAFF'])` allows both roles
- [ ] `requireAdmin()` allows only admin users
- [ ] `requireStaff()` allows admin and staff users
- [ ] `getOptionalSession()` works without auth
- [ ] `checkRole()` returns boolean without throwing
- [ ] `notFoundOnUnauthorized` returns 404
- [ ] Custom unauthorized redirect works

### Server Actions
- [ ] Server Actions can use `requireAuth()`
- [ ] Server Actions can use `requireAdmin()`
- [ ] Protected actions block unauthenticated requests
- [ ] Protected actions preserve session data

### Error Handling
- [ ] Invalid token format handled gracefully
- [ ] Expired token handled gracefully
- [ ] Missing JWT secret logs error
- [ ] Unauthorized access logs warning
- [ ] Missing cookie handled gracefully

---

## Performance Testing

### Metrics to Monitor

1. **Session Read Time**:
   - Target: < 2ms per call
   - Test: Measure `getServerSession()` execution time

2. **Token Verification Time**:
   - Target: < 1ms per verification
   - Test: Measure JWT verification overhead

3. **Multiple Role Checks**:
   - Target: < 5ms for 5 parallel checks
   - Test: Parallel `checkRole()` calls

### Performance Test Script

```typescript
// performance-test.ts
import { performance } from 'perf_hooks';
import { getServerSession } from '@/lib/auth';

async function testPerformance() {
  const iterations = 1000;
  const start = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    await getServerSession();
  }
  
  const end = performance.now();
  const avg = (end - start) / iterations;
  
  console.log(`Average time per call: ${avg.toFixed(2)}ms`);
}
```

---

## Security Testing

### Security Checklist

- [ ] Cannot import auth utils in client components (server-only)
- [ ] JWT secrets not exposed to client
- [ ] Cookies marked HttpOnly (from Phase 1)
- [ ] Cookies marked Secure in production (from Phase 1)
- [ ] Invalid tokens don't expose internal errors
- [ ] Role checks are server-side only
- [ ] Session data not cached inappropriately
- [ ] Unauthorized access logged for monitoring

### Security Test Cases

1. **Client-Side Import Test**:
   - Try importing auth utils in 'use client' component
   - Expected: Build error

2. **Token Tampering Test**:
   - Modify token signature
   - Expected: Session returns null

3. **Role Tampering Test**:
   - Try to modify role in cookie
   - Expected: No effect (role from JWT)

4. **Replay Attack Test**:
   - Use old expired token
   - Expected: Session returns null

---

## Browser Testing

### Browsers to Test

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Test Scenarios per Browser

1. Login flow with redirect
2. Admin page access control
3. Token expiration handling
4. Cookie handling
5. Server Action authentication

---

## Regression Testing

After implementing Phase 2, verify:

- [ ] Existing middleware (Phase 1) still works
- [ ] Login/logout flow unchanged
- [ ] Cookie handling unchanged
- [ ] No breaking changes to existing pages

---

## Load Testing

### Scenarios

1. **Concurrent Users**:
   - 100 concurrent requests to protected pages
   - Measure: Response time, error rate

2. **Token Verification Load**:
   - 1000 token verifications per second
   - Measure: CPU usage, memory usage

3. **Role Check Load**:
   - 500 role checks per second
   - Measure: Latency, throughput

---

## Test Data

### Test Users

Create test users with different roles:

```typescript
// Test user accounts
const testUsers = [
  {
    email: 'admin@test.com',
    password: 'AdminPass123!',
    role: 'ADMIN',
  },
  {
    email: 'staff@test.com',
    password: 'StaffPass123!',
    role: 'STAFF',
  },
  {
    email: 'student@test.com',
    password: 'StudentPass123!',
    role: 'STUDENT',
  },
];
```

---

## Success Criteria

Phase 2 is considered successful when:

- ✅ All manual tests pass
- ✅ No TypeScript errors
- ✅ Session reads < 2ms average
- ✅ No security vulnerabilities found
- ✅ Works in all major browsers
- ✅ No regression in Phase 1 functionality
- ✅ Server-only enforcement works
- ✅ Documentation complete
- ✅ Example code provided

---

## Known Issues / Limitations

Document any known issues found during testing:

1. None yet

---

## Test Reports

### Test Execution Log

| Test ID | Test Name | Status | Date | Notes |
|---------|-----------|--------|------|-------|
| T1 | Basic Session Reading | ⏳ | - | Pending |
| T2 | requireAuth() | ⏳ | - | Pending |
| T3 | requireAdmin() | ⏳ | - | Pending |
| T4 | requireStaff() | ⏳ | - | Pending |
| T5 | requireRole() Multiple | ⏳ | - | Pending |
| T6 | getOptionalSession() | ⏳ | - | Pending |
| T7 | checkRole() | ⏳ | - | Pending |
| T8 | Protected Server Action | ⏳ | - | Pending |
| T9 | notFoundOnUnauthorized | ⏳ | - | Pending |
| T10 | Custom Redirect | ⏳ | - | Pending |

---

**Status**: Ready for Testing  
**Date**: November 12, 2025  
**Phase**: 2 - Server Auth Utilities
