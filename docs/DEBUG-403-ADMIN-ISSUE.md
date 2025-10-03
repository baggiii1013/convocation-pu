# Debugging 403 Error - Admin Account Issue

## Date: October 2, 2025

## Current Status
User has admin account but still getting 403 Forbidden error when downloading template.

## Changes Made for Debugging

### 1. Added Explicit `withCredentials` to Download Request ✅
**File:** `apps/web/src/services/upload.service.ts`

Added explicit `withCredentials: true` to the template download request (even though axios instance already has it globally):

```typescript
async downloadTemplate() {
  try {
    const response = await api.get(
      '/api/v1/attendees/upload/template',
      { 
        responseType: 'blob',
        withCredentials: true // Explicitly ensure credentials are sent
      }
    );
```

### 2. Enhanced Backend Authentication Logging ✅
**File:** `apps/api/src/middleware/auth.ts`

Added detailed logging to both `authenticate` and `authorize` middleware:

```typescript
// Authentication middleware now logs:
- Request method and path
- Available cookies
- Authorization header presence
- Where token was found (header vs cookie)
- Success/failure details

// Authorization middleware now logs:
- Request method and path
- Required roles
- Current user and their role
- Authorization success/failure
```

## Next Steps: Restart Backend and Test

### Step 1: Restart the Backend Server
The enhanced logging requires backend restart:

```bash
cd apps/api
# Stop current server (Ctrl+C if running)
bun run dev
```

### Step 2: Test the Download Again
1. In browser, go to Upload Students page
2. Click "Download Template" button
3. Watch the backend terminal for logs

### Step 3: Check Backend Logs
You should see detailed logs like:

**Successful Authentication:**
```
Authentication attempt for: GET /api/v1/attendees/upload/template
Cookies available: accessToken, refreshToken
Token found in accessToken cookie
User authenticated: user@example.com (admin)
Authorization check for: GET /api/v1/attendees/upload/template
Required roles: [admin, staff]
User: user@example.com (admin)
Access granted for user user@example.com with role 'admin'
```

**Failed Authentication (No Cookie):**
```
Authentication attempt for: GET /api/v1/attendees/upload/template
Cookies available: 
Authorization header: Missing
No token found in cookies or header
Access token required but not found
```

**Failed Authorization (Wrong Role):**
```
Authentication attempt for: GET /api/v1/attendees/upload/template
User authenticated: student@example.com (student)
Authorization check for: GET /api/v1/attendees/upload/template
Required roles: [admin, staff]
User: student@example.com (student)
Access denied for user student@example.com: required roles [admin, staff], user has 'student'
```

## Common Issues and Solutions

### Issue 1: No Cookies Being Sent
**Log shows:** "Cookies available: " (empty)

**Possible causes:**
1. Frontend and backend on different origins without proper CORS
2. Cookies not being set during login
3. Browser blocking third-party cookies

**Solution:**
```bash
# Check browser DevTools → Application → Cookies
# Look for cookies under http://localhost:3001
# Should see: accessToken, refreshToken

# If missing, log out and log back in
```

### Issue 2: Token in Cookie But Not Read
**Log shows:** "Cookies available: accessToken" but "No token found in cookies or header"

**Possible cause:** Cookie parser middleware not working

**Solution:** Check `apps/api/src/app.ts` has:
```typescript
import cookieParser from 'cookie-parser';
app.use(cookieParser());
```

### Issue 3: Wrong Role
**Log shows:** User has role 'student' but needs 'admin' or 'staff'

**Solution:** Update role in database:
```javascript
// In MongoDB
db.accounts.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```
Then log out and log back in.

### Issue 4: Token Expired
**Log shows:** "Authentication failed: Access token has expired"

**Solution:** Simple - log out and log back in to get fresh tokens.

### Issue 5: CORS Blocking Credentials
**Browser console shows:** CORS error or credentials warning

**Check CORS config in** `apps/api/src/app.ts`:
```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',  // Frontend URL must be here
    config.FRONTEND_URL,
  ],
  credentials: true,  // Must be true
  optionsSuccessStatus: 200,
}));
```

## Expected Terminal Output

### Backend Terminal (when testing):
```
Authentication attempt for: GET /api/v1/attendees/upload/template
Cookies available: accessToken, refreshToken
Token found in accessToken cookie
User authenticated: admin@example.com (admin)
Authorization check for: GET /api/v1/attendees/upload/template
Required roles: [admin, staff]
User: admin@example.com (admin)
Access granted for user admin@example.com with role 'admin'
```

### Browser Console (on success):
```
(No errors - file downloads automatically)
```

### Browser Console (on failure):
```
Error downloading template: [detailed error object]
Failed to download template: [alert with specific message]
```

## Testing Checklist

- [ ] Backend server restarted with new logging
- [ ] Logged out and logged back in with admin account
- [ ] Verified accessToken cookie exists in DevTools → Application → Cookies
- [ ] Decoded JWT token at jwt.io to verify role is "admin"
- [ ] Clicked Download Template button
- [ ] Checked backend terminal for authentication logs
- [ ] Checked browser console for errors

## What to Share

If still not working, please share:

1. **Backend terminal logs** (copy the authentication-related lines)
2. **Browser DevTools screenshot**:
   - Application tab → Cookies → http://localhost:3001
   - Show accessToken cookie
3. **JWT payload** (decode at jwt.io):
   - Copy the decoded payload showing your role
4. **Browser console error** (if any new errors)

This will help us identify exactly where the authentication is failing.
