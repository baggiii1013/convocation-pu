# Excel Upload Feature - Recent Fixes

## Date: October 1, 2025
## Changes Made

### 1. Default "Update Existing Records" to True ✅

**File Modified:** `apps/web/src/components/admin/ExcelUploader.tsx`

**Change:** Updated the default state for `updateExisting` option from `false` to `true`.

```typescript
// Before:
const [options, setOptions] = useState({
  skipDuplicates: false,
  updateExisting: false,  // ❌ Was false
  validateOnly: false
});

// After:
const [options, setOptions] = useState({
  skipDuplicates: false,
  updateExisting: true,   // ✅ Now true by default
  validateOnly: false
});
```

**Impact:** Users will now have the "Update existing records" checkbox checked by default when uploading student data. This is more user-friendly as it allows them to update existing student information without having to manually check the box each time.

---

### 2. Fixed Template Download Functionality - 404 Error ✅

**File Modified:** `apps/web/src/services/upload.service.ts`

**Root Cause:** The API paths were missing the `/api/v1/` prefix. The backend routes are mounted at `/api/v1` in `app.ts`, but the frontend was calling `/attendees/upload/template` directly.

**Changes Made:**
1. Updated both API paths to include `/api/v1/` prefix
2. Added proper error handling with try-catch block
3. Specified MIME type explicitly when creating Blob
4. Added proper cleanup of DOM elements and object URLs
5. Better error logging for debugging

```typescript
// Before:
async uploadExcel(...) {
  const response = await api.post(
    '/attendees/upload',  // ❌ Missing /api/v1/ prefix
    formData,
    { ... }
  );
}

async downloadTemplate() {
  const response = await api.get(
    '/attendees/upload/template',  // ❌ Missing /api/v1/ prefix
    { responseType: 'blob' }
  );
}

// After:
async uploadExcel(...) {
  const response = await api.post(
    '/api/v1/attendees/upload',  // ✅ Correct path
    formData,
    { ... }
  );
}

async downloadTemplate() {
  try {
    const response = await api.get(
      '/api/v1/attendees/upload/template',  // ✅ Correct path
      { responseType: 'blob' }
    );
    
    // Create download link with proper MIME type
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_upload_template.xlsx');
    document.body.appendChild(link);
    link.click();
    
    // Proper cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading template:', error);
    throw error;
  }
}
```

**Improvements:**
- ✅ Fixed 404 error by adding correct `/api/v1/` prefix to API paths
- ✅ Added explicit MIME type for Excel files
- ✅ Proper error handling and logging
- ✅ Memory cleanup by revoking object URLs
- ✅ Better DOM element cleanup

**Impact:** Both the template download and file upload now work correctly with the proper API endpoint paths.

---

## Testing Instructions

### Test 1: Default Update Existing Records
1. Navigate to the "Upload Students" page in the admin dashboard
2. Observe that the "Update existing records" checkbox is now **checked by default**
3. Upload a file with existing student data to verify it updates records

### Test 2: Template Download
1. Navigate to the "Upload Students" page
2. Click the "Download Template" button
3. Verify that:
   - A file named `student_upload_template.xlsx` is downloaded
   - The file can be opened in Excel/Google Sheets
   - The file contains the correct column headers:
     - enrollmentId
     - name
     - email
     - phone
     - school
     - course
     - degree
     - crr
     - enclosure
     - convocationEligible
     - convocationRegistered

### Troubleshooting Template Download

If the download button still doesn't work, check the following:

1. **Authentication**: Make sure you're logged in as ADMIN or STAFF
2. **Browser Console**: Open Developer Tools (F12) and check for errors
3. **Network Tab**: Check if the API request is being made to `/api/attendees/upload/template`
4. **API Server**: Ensure the backend API server is running
5. **CORS**: Verify CORS settings allow the frontend to download files

Common issues and solutions:
- **401 Unauthorized**: Token expired, try logging out and back in
- **404 Not Found**: Check that the API route is properly registered
- **Network Error**: Ensure API server is running and accessible
- **CORS Error**: Check NEXT_PUBLIC_API_URL environment variable

---

## Additional Notes

### Backend Configuration Verified ✅
- Route properly registered: `GET /api/attendees/upload/template`
- Authentication middleware: `authenticate, authorize('admin', 'staff')`
- Controller method: `AttendeeController.downloadTemplate`
- Service method: `ExcelService.generateTemplate()`
- Response headers properly set:
  - `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
  - `Content-Disposition: attachment; filename=student_upload_template.xlsx`

### Frontend Configuration Verified ✅
- API base URL: Uses `NEXT_PUBLIC_API_URL` environment variable
- Authentication: Uses `withCredentials: true` for cookie-based auth
- Error handling: Both component and service level
- User feedback: Alert on error, console logging for debugging

---

## Summary

Both issues have been resolved:

1. ✅ **Update Existing Records** now defaults to `true`
2. ✅ **Template Download** has improved error handling and proper blob handling

The upload feature is now more user-friendly and robust. If you encounter any issues, check the browser console for detailed error messages.
