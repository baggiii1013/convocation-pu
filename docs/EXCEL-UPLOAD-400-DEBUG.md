# Debugging Excel Upload 400 Error

## Date: October 2, 2025

## Status Update
✅ **Authentication/Authorization Working!** The logs show:
```
INFO: User authenticated: 2203051050776@paruluniversity.ac.in (ADMIN)
INFO: Access granted for user with role 'ADMIN'
POST /api/v1/attendees/upload 400
```

❌ **400 Bad Request Error** - This means the request format or data is invalid.

## Changes Made - Enhanced Logging

**File Modified:** `apps/api/src/controllers/attendee.controller.ts`

Added detailed logging to the `uploadExcel` controller to help identify the exact issue:

### New Logs Will Show:
1. **File presence check:**
   ```
   Excel upload attempt by user@example.com
   File present: true/false
   ```

2. **Upload options:**
   ```
   Options: {"skipDuplicates":false,"updateExisting":true,"validateOnly":false}
   ```

3. **File details:**
   ```
   Processing file: students.xlsx, size: 12345 bytes
   ```

4. **Parsing results:**
   ```
   Parsed 50 rows from Excel
   ```

5. **Validation results:**
   ```
   Validation result: valid/invalid, errors: 0
   ```

6. **Validation errors (if any):**
   ```
   Validation failed with 5 errors
   ```

## Common Causes of 400 Error

### 1. No File Uploaded
**Log will show:** "No file uploaded in request"

**Possible causes:**
- File input not working in frontend
- FormData not constructed properly
- Multer middleware not processing the file

### 2. Validation Failed
**Log will show:** "Validation failed with X errors"

**Possible causes:**
- Excel file has incorrect column headers
- Required fields are missing
- Data format doesn't match expected format (e.g., email format, phone format)

### 3. Parse Error
**Error in catch block with details**

**Possible causes:**
- File is corrupted
- File is not a valid Excel file (.xlsx/.xls)
- Excel structure doesn't match expected format

## Next Steps

### Step 1: Restart Backend Server
```bash
cd apps/api
# Stop current server (Ctrl+C)
bun run dev
```

### Step 2: Try Uploading Again
1. Go to Upload Students page
2. Select an Excel file
3. Click upload

### Step 3: Check Backend Logs
Watch for the detailed logs. You should see something like:

**Scenario A: No File (most likely):**
```
Excel upload attempt by 2203051050776@paruluniversity.ac.in
File present: false
No file uploaded in request
POST /api/v1/attendees/upload 400
```

**Scenario B: Validation Failed:**
```
Excel upload attempt by 2203051050776@paruluniversity.ac.in
File present: true
Processing file: students.xlsx, size: 15234 bytes
Parsed 25 rows from Excel
Validation result: invalid, errors: 10
Validation failed with 10 errors
POST /api/v1/attendees/upload 400
```

**Scenario C: Success:**
```
Excel upload attempt by 2203051050776@paruluniversity.ac.in
File present: true
Processing file: students.xlsx, size: 15234 bytes
Parsed 25 rows from Excel
Validation result: valid, errors: 0
Bulk upload by user: 25 successful, 0 failed
POST /api/v1/attendees/upload 200
```

## If No File Is Uploaded

This is likely a frontend issue. Check:

### Frontend File Upload Configuration

**File:** `apps/web/src/services/upload.service.ts`
```typescript
const formData = new FormData();
formData.append('file', file);  // Key must be 'file'
formData.append('skipDuplicates', String(options.skipDuplicates));
formData.append('updateExisting', String(options.updateExisting));
formData.append('validateOnly', String(options.validateOnly));
```

### Multer Configuration

**File:** `apps/api/src/middleware/upload.ts`
```typescript
export const uploadExcel = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Check file extension
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
```

### Route Configuration

**File:** `apps/api/src/routes/attendee.routes.ts`
```typescript
router.post(
  '/upload',
  authenticate,
  authorize('admin', 'staff'),
  uploadExcel.single('file'),  // Key must match FormData key
  AttendeeController.uploadExcel
);
```

## If Validation Failed

The Excel file format might be incorrect. Required columns:
1. `enrollmentId` (required, string)
2. `name` (required, string)
3. `email` (required, valid email)
4. `phone` (optional, string)
5. `school` (required, string)
6. `course` (required, string)
7. `degree` (required, string)
8. `crr` (optional, string)
9. `enclosure` (optional, string)
10. `convocationEligible` (optional, true/false/yes/no)
11. `convocationRegistered` (optional, true/false/yes/no)

**Solution:** Download the template first and use that format!

## Browser Console Check

Also check the browser console for any frontend errors:
1. Open DevTools (F12)
2. Go to Console tab
3. Look for any error messages when uploading

## What to Share

Please share:
1. **Backend terminal logs** after restarting and trying to upload
2. **Browser console logs** (any errors?)
3. **File details**: What type of file are you uploading? Size?
4. **Screenshot** of the upload UI showing the file selected

This will help us pinpoint the exact issue!
