# Phase 1 Quick Reference - Enhanced Middleware

## 🎯 What Changed?

### Before:
```typescript
// Old middleware - just checked cookie existence
const refreshToken = request.cookies.get('refreshToken')?.value;
if (!refreshToken) {
  redirect('/login');
}
```

### After:
```typescript
// New middleware - validates JWT signature, expiration, role
const token = extractTokenFromCookie(cookieHeader, 'accessToken');
const payload = await verifyAccessToken(token); // Cryptographic verification
if (!hasRequiredRole(payload.role, ['ADMIN'])) {
  redirect('/dashboard?error=unauthorized');
}
```

---

## 📁 Files Changed

### ✅ New Files:
- `apps/web/src/lib/jwt.ts` - JWT utilities (120 lines)

### ✏️ Modified Files:
- `apps/web/src/middleware.ts` - Enhanced validation (155 lines)
- `apps/web/.env.example` - Added JWT secrets
- `apps/web/package.json` - Added jose@6.1.1

---

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
cd apps/web
bun add jose
```

### 2. Environment Variables
Create `apps/web/.env.local`:
```bash
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

⚠️ **Must match API secrets exactly!**

### 3. Restart Dev Server
```bash
cd apps/web
bun run dev
```

---

## 🧪 Quick Test

```bash
# Test 1: Unauthenticated access to protected route
curl -I http://localhost:3000/dashboard
# Expected: 307 Redirect to /login?redirect_url=/dashboard

# Test 2: Unauthenticated access to admin
curl -I http://localhost:3000/admin
# Expected: 307 Redirect to /login?redirect_url=/admin

# Test 3: Access login page (should work)
curl -I http://localhost:3000/login
# Expected: 200 OK
```

---

## 🔐 How It Works

### Route Protection Flow:

```
User → Request /dashboard
  ↓
Middleware (Edge)
  ↓
Extract accessToken from cookie
  ↓
Verify JWT (signature, expiration, structure)
  ↓
  ├─ Valid? → Add user headers → Allow
  ├─ Invalid? → Clear cookies → Redirect to /login
  └─ No token? → Redirect to /login
```

### Admin Route Protection:

```
User → Request /admin
  ↓
Middleware (Edge)
  ↓
Extract & Verify Token
  ↓
Valid Token?
  ↓
Check Role == 'ADMIN'?
  ├─ Yes → Allow access
  └─ No → Redirect to /dashboard?error=unauthorized
```

---

## 🛡️ Security Features

✅ **Token Signature Verification** - Prevents token tampering  
✅ **Expiration Checks** - 15-minute access token expiry  
✅ **Role Extraction from Token** - No client-side role storage  
✅ **Automatic Cookie Cleanup** - Invalid tokens removed  
✅ **Edge-Level Protection** - Before page render  
✅ **HttpOnly Cookies** - XSS prevention  
✅ **SameSite Strict** - CSRF prevention  

---

## 🎨 Developer API

### Import JWT Utils:
```typescript
import { 
  verifyAccessToken, 
  verifyRefreshToken,
  extractTokenFromCookie,
  hasRequiredRole 
} from '@/lib/jwt';
```

### Verify Token:
```typescript
try {
  const payload = await verifyAccessToken(token);
  console.log(payload.userId, payload.role, payload.email);
} catch (error) {
  // Token invalid or expired
  console.error('Token verification failed:', error);
}
```

### Check Role:
```typescript
const canAccess = hasRequiredRole(user.role, ['ADMIN', 'STAFF']);
```

### Extract from Cookie:
```typescript
const token = extractTokenFromCookie(request.headers.get('cookie'), 'accessToken');
```

---

## 🐛 Troubleshooting

### Issue: "Token verification failed"
**Cause**: JWT secrets don't match between web and API  
**Fix**: Ensure `.env.local` secrets match `apps/api/.env`

### Issue: Infinite redirects
**Cause**: `/login` not in publicRoutes  
**Fix**: Verify `publicRoutes` array in middleware.ts

### Issue: Static assets not loading
**Cause**: Middleware running on asset paths  
**Fix**: Check matcher excludes `_next/static`, images, fonts

### Issue: 401 on valid token
**Cause**: Token algorithm mismatch  
**Fix**: Ensure API uses HS256 algorithm

---

## 📊 Performance

- **Token Verification**: ~1-2ms overhead
- **Edge Execution**: Runs on edge network (fast)
- **No Database Calls**: Pure cryptographic validation
- **Redirect Speed**: Faster than client-side (no render)

---

## 🔄 Next Steps

After Phase 1, proceed to:

1. **Phase 2**: Convert pages to Server Components
2. **Phase 3**: Simplify AuthContext to UI only
3. **Phase 4**: Implement server-to-API communication
4. **Phase 5**: Testing & validation

See `docs/AUTH-MIGRATION-GUIDE.md` for full roadmap.

---

## 📝 Common Patterns

### Middleware Role Check:
```typescript
if (isAdminRoute) {
  const payload = await verifyAccessToken(accessToken);
  if (!hasRequiredRole(payload.role, ['ADMIN'])) {
    return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
  }
}
```

### Clear Invalid Tokens:
```typescript
const response = NextResponse.redirect(new URL('/login', request.url));
response.cookies.delete('accessToken');
response.cookies.delete('refreshToken');
response.cookies.delete('userRole');
return response;
```

### Add User Headers:
```typescript
const requestHeaders = new Headers(request.headers);
requestHeaders.set('x-user-id', payload.userId);
requestHeaders.set('x-user-role', payload.role);

return NextResponse.next({
  request: { headers: requestHeaders }
});
```

---

## ⚡ Pro Tips

1. **Token Expiry**: Access tokens expire in 15 minutes. Refresh tokens last 7 days.

2. **Middleware Matcher**: Be specific! Exclude what you don't need.

3. **Logging**: Add console.warn for unauthorized attempts to track security issues.

4. **Error Messages**: Use query params for better UX (`?error=session_expired`).

5. **Headers**: Pass user context via headers for Server Components.

6. **Testing**: Use curl to test without browser caching issues.

---

## 🔗 Related Files

- `apps/web/src/middleware.ts` - Main middleware file
- `apps/web/src/lib/jwt.ts` - JWT utilities
- `apps/api/src/utils/auth.ts` - API auth utilities (reference)
- `apps/api/src/middleware/auth.ts` - API middleware (reference)

---

## 📚 Documentation

- Full Documentation: `docs/PHASE-1-MIDDLEWARE-COMPLETE.md`
- Migration Guide: `docs/AUTH-MIGRATION-GUIDE.md`
- API Reference: `apps/web/src/lib/jwt.ts` (inline comments)

---

**Phase 1 Status**: ✅ Complete  
**Ready for**: Phase 2 - Server Components  
**Date**: November 12, 2025
