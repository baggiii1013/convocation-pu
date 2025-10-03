# User Session Persistence Fix

## Problem
When users refresh the page after logging in, their user information (username, roles, etc.) was being lost, causing the application to behave as if they were logged out.

## Root Cause Analysis

### Issue 1: Missing Fields in API Responses
The `/api/v1/auth/profile` endpoint was not returning all the fields that the frontend `AuthContext` expected:

**Missing fields:**
- `profileImageURL`
- `accountState`

**Frontend expected fields:**
```typescript
{
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
```

### Issue 2: Inconsistent Response Structure
The profile endpoint returned the data nested as `data: { user: userData }`, but this caused an extra level of nesting that wasn't handled properly in the frontend.

## Solution

### Backend Changes (API)

Updated the following endpoints in `/apps/api/src/controllers/auth.controller.ts`:

1. **Profile Endpoint** (`GET /api/v1/auth/profile`)
   - Added `profileImageURL` and `accountState` to the select clause
   - Changed response structure from `data: { user: userData }` to `data: userData`

2. **Login Endpoint** (`POST /api/v1/auth/login`)
   - Added `displayName`, `profileImageURL`, `accountState`, and `isActive` to response

3. **Refresh Token Endpoint** (`POST /api/v1/auth/refresh`)
   - Added `displayName`, `profileImageURL`, `accountState`, and `isActive` to response

4. **Register Endpoint** (`POST /api/v1/auth/register`)
   - Added `profileImageURL`, `accountState`, and `isActive` to the select clause

### Code Changes

#### Profile Endpoint
```typescript
// Before
const userData = await prisma.account.findUnique({
  where: { id: user.userId },
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    displayName: true,
    role: true,
    isActive: true,
    createdAt: true,
    lastLoginAt: true
  }
});

res.json({
  success: true,
  message: 'Profile retrieved successfully',
  data: { user: userData }
});

// After
const userData = await prisma.account.findUnique({
  where: { id: user.userId },
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    displayName: true,
    role: true,
    profileImageURL: true,
    accountState: true,
    isActive: true,
    createdAt: true,
    lastLoginAt: true
  }
});

res.json({
  success: true,
  message: 'Profile retrieved successfully',
  data: userData  // Direct data without extra nesting
});
```

## How It Works Now

1. **Initial Login:**
   - User logs in → backend sets httpOnly cookies (accessToken, refreshToken, userRole)
   - Backend returns complete user data including all required fields
   - Frontend stores user data in `AuthContext` state

2. **Page Refresh:**
   - `AuthContext` useEffect runs on mount
   - Calls `/api/v1/auth/profile` with cookies automatically included
   - Backend verifies accessToken from cookie
   - Returns complete user profile with all fields
   - Frontend restores user state from the response

3. **Token Refresh:**
   - When accessToken expires (15 minutes), axios interceptor catches 401 error
   - Automatically calls `/api/v1/auth/refresh` using refreshToken cookie
   - Backend generates new tokens and sets them as cookies
   - Original request is retried with new tokens

## Authentication Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ POST /api/v1/auth/login
       │ { email, password }
       ▼
┌─────────────────┐
│   API Server    │
│  (auth.login)   │
└──────┬──────────┘
       │ Set Cookies:
       │ - accessToken (httpOnly, 15min)
       │ - refreshToken (httpOnly, 7days)
       │ - userRole (accessible, 24h)
       │
       │ Return: Complete user data
       ▼
┌─────────────┐
│ AuthContext │
│ (setUser)   │
└─────────────┘

--- PAGE REFRESH ---

┌─────────────┐
│   Browser   │
│  (refresh)  │
└──────┬──────┘
       │ AuthContext useEffect
       │ GET /api/v1/auth/profile
       │ (cookies sent automatically)
       ▼
┌─────────────────┐
│   API Server    │
│ (auth.profile)  │
│ verify cookie   │
└──────┬──────────┘
       │ Return: Complete user data
       ▼
┌─────────────┐
│ AuthContext │
│ (setUser)   │
└─────────────┘
```

## Testing

To verify the fix:

1. **Test Login:**
   ```bash
   curl -X POST http://localhost:4000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"admin123"}' \
     -c cookies.txt
   ```

2. **Test Profile (with cookies):**
   ```bash
   curl -X GET http://localhost:4000/api/v1/auth/profile \
     -b cookies.txt
   ```

3. **Manual Testing:**
   - Login to the application
   - Open browser DevTools → Application → Cookies
   - Verify cookies are set: `accessToken`, `refreshToken`, `userRole`
   - Refresh the page (F5)
   - Verify user information persists (check navbar/dashboard)

## Security Notes

- Tokens are stored in **httpOnly cookies** to prevent XSS attacks
- Cookies use **sameSite: 'strict'** to prevent CSRF attacks
- Cookies are **secure** in production (HTTPS only)
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- The `userRole` cookie is readable by middleware for route protection

## Files Modified

1. `/apps/api/src/controllers/auth.controller.ts` - Fixed all auth endpoints
2. `/docs/USER-SESSION-PERSISTENCE-FIX.md` - This documentation

## Related Files (No Changes Needed)

- `/apps/web/src/contexts/AuthContext.tsx` - Already correctly implemented
- `/apps/web/src/lib/axios.ts` - Token refresh logic working correctly
- `/apps/api/src/middleware/auth.ts` - Authentication middleware working correctly
- `/apps/api/src/utils/auth.ts` - Token generation/verification working correctly

## Date
October 3, 2025
