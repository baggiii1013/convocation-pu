# Fixing 403 Forbidden Error for Template Download

## Date: October 1, 2025

## Issue Summary
After fixing the 404 error by adding the correct API path (`/api/v1/attendees/upload/template`), users are now encountering a **403 Forbidden** error when trying to download the Excel template.

## Root Cause
The 403 error indicates an **authorization issue**. The backend route requires:
1. **Authentication**: User must be logged in with a valid access token
2. **Authorization**: User must have either `admin` or `staff` role

From `apps/api/src/routes/attendee.routes.ts`:
```typescript
router.get(
  '/upload/template',
  authenticate,              // ← Must be authenticated
  authorize('admin', 'staff'), // ← Must have admin or staff role
  AttendeeController.downloadTemplate
);
```

## Changes Made

### 1. Improved Error Handling in TemplateDownloader Component ✅

**File Modified:** `apps/web/src/components/admin/TemplateDownloader.tsx`

**Changes:**
- Added loading state (`isDownloading`)
- Added specific error messages for different status codes
- Disabled button while downloading
- Better user feedback

```typescript
// Before:
const handleDownload = async () => {
  try {
    await uploadService.downloadTemplate();
  } catch (error) {
    console.error('Failed to download template:', error);
    alert('Failed to download template. Please try again.');
  }
};

// After:
const [isDownloading, setIsDownloading] = useState(false);

const handleDownload = async () => {
  setIsDownloading(true);
  try {
    await uploadService.downloadTemplate();
  } catch (error: any) {
    console.error('Failed to download template:', error);
    
    let errorMessage = 'Failed to download template. Please try again.';
    
    if (error?.response?.status === 403) {
      errorMessage = 'Access denied. You need admin or staff privileges to download the template. Please ensure you are logged in with the correct role.';
    } else if (error?.response?.status === 401) {
      errorMessage = 'Authentication required. Please log in again.';
    } else if (error?.response?.status === 404) {
      errorMessage = 'Template endpoint not found. Please contact support.';
    }
    
    alert(errorMessage);
  } finally {
    setIsDownloading(false);
  }
};
```

## Troubleshooting Steps

### Step 1: Verify You're Logged In
1. Check if you see your profile/username in the navigation bar
2. Try accessing other admin features to confirm you're authenticated
3. If not logged in, go to `/login` and log in again

### Step 2: Verify Your User Role
The 403 error typically means you're logged in but don't have the required role. You need to be either:
- **admin** role, OR
- **staff** role

To check your role:
1. Open browser DevTools (F12)
2. Go to the **Application** tab
3. Look at **Cookies** → `http://localhost:3001`
4. Find the `accessToken` cookie
5. Decode the JWT token at [jwt.io](https://jwt.io) to see your role

### Step 3: Check Access Token Cookie
1. Open DevTools (F12) → Application tab → Cookies
2. Check if `accessToken` cookie exists for `localhost:3001`
3. If missing or expired, log out and log back in

### Step 4: Verify CORS and Credentials
The axios instance is configured with `withCredentials: true`, which should send cookies. Verify:
1. In Network tab, click on the failed request
2. Check **Request Headers** - should include `Cookie: accessToken=...`
3. If cookie is not being sent, there might be a CORS issue

### Step 5: Check Backend Logs
On the backend terminal, you should see logs like:
```
User authenticated: user@example.com (admin)
Access granted for user user@example.com with role 'admin'
```

If you see:
```
Access denied for user user@example.com: required roles [admin, staff], user has 'student'
```
Then your account doesn't have the required role.

## Solution Options

### Option A: Update User Role in Database (Recommended)
If you have access to the database, update your user's role:

1. Connect to MongoDB
2. Find your account in the `accounts` collection
3. Update the role field:
```javascript
db.accounts.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```
4. Log out and log back in

### Option B: Create a New Admin Account
Use the seeder or create an admin account:
```bash
cd apps/api
bun run seed
```

This should create test accounts including an admin account. Check the seeder output for credentials.

### Option C: Make Template Download Public (Not Recommended)
If you want to allow any authenticated user to download the template, modify the route:

**File:** `apps/api/src/routes/attendee.routes.ts`
```typescript
// Change from:
router.get(
  '/upload/template',
  authenticate,
  authorize('admin', 'staff'),
  AttendeeController.downloadTemplate
);

// To (any authenticated user):
router.get(
  '/upload/template',
  authenticate,
  AttendeeController.downloadTemplate
);

// Or (no authentication required - NOT RECOMMENDED):
router.get(
  '/upload/template',
  AttendeeController.downloadTemplate
);
```

## Testing After Fix

1. **Log out** of the application
2. **Log back in** with an admin or staff account
3. Navigate to Upload Students page
4. Click "Download Template" button
5. You should now see:
   - Button changes to "Downloading..."
   - File downloads successfully
   - No error messages

## Expected Behavior

### Success (200 OK)
- File `student_upload_template.xlsx` downloads automatically
- Browser console shows no errors
- Network tab shows successful request

### Failure Scenarios

#### 401 Unauthorized
- **Message:** "Authentication required. Please log in again."
- **Cause:** Access token expired or missing
- **Fix:** Log out and log back in

#### 403 Forbidden
- **Message:** "Access denied. You need admin or staff privileges..."
- **Cause:** User role is not 'admin' or 'staff'
- **Fix:** Update user role in database or use admin account

#### 404 Not Found
- **Message:** "Template endpoint not found. Please contact support."
- **Cause:** API route not properly configured
- **Fix:** Verify backend is running and routes are registered

## Backend Route Configuration

### Current Setup ✅
```typescript
// app.ts
app.use('/api/v1', routes);

// routes/index.ts
router.use('/attendees', attendeeRoutes);

// routes/attendee.routes.ts
router.get(
  '/upload/template',
  authenticate,
  authorize('admin', 'staff'),
  AttendeeController.downloadTemplate
);
```

**Final URL:** `GET http://localhost:3001/api/v1/attendees/upload/template`

**Requirements:**
- ✅ User must be authenticated (valid access token in cookie)
- ✅ User role must be 'admin' or 'staff'

## Summary

The 403 error is an **authentication/authorization issue**, not a code bug. The fix requires:

1. ✅ **Code Fix Applied:** Improved error messages to help users understand what's wrong
2. ⚠️ **User Action Required:** Ensure you're logged in with admin or staff role

The most common solution is to **log in with an admin account** or **update your account role in the database**.
