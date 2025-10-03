# Quick Start Guide: Excel Upload Feature

## 🚀 Getting Started

### Prerequisites
- Make sure both API and Web servers are running
- Login with ADMIN or STAFF role credentials

### Start the Servers

**Terminal 1 - API Server:**
```bash
cd apps/api
bun run dev
```

**Terminal 2 - Web Server:**
```bash
cd apps/web
bun run dev
```

---

## 📝 Quick Test Steps

### 1. Access the Upload Page
1. Open browser: `http://localhost:3000`
2. Login with admin credentials
3. Click **"Upload Students"** in the sidebar (between Manage Users and Manage Ceremonies)

### 2. Download Template
1. Click **"Download Template"** button
2. Open the downloaded `student_upload_template.xlsx`
3. Review the sample data in "Student Data" sheet
4. Read instructions in "Instructions" sheet

### 3. Prepare Your Data
Edit the "Student Data" sheet with your student information:

**Required Fields:**
- `enrollmentId` - Unique ID (e.g., PU2024001234)
- `name` - Full name
- `school` - School/Department name
- `course` - Course name
- `degree` - Degree type (B.Tech, MBA, etc.)
- `crr` - 24-character MongoDB ObjectId
- `enclosure` - Enclosure code (A, B, C, etc.)

**Optional Fields:**
- `email` - Valid email address
- `phone` - Phone number with country code
- `convocationEligible` - true/false
- `convocationRegistered` - true/false

### 4. Upload the File
1. Drag and drop the Excel file onto the upload area, OR
2. Click the upload area to browse and select file

### 5. Configure Options
Select your preferred options:
- ☑️ **Skip duplicates** - Recommended for first upload
- ☐ **Update existing records** - Use when updating data
- ☐ **Validate only** - Test without saving

### 6. Process Upload
1. Click **"Upload and Process"** button
2. Wait for progress bar to complete
3. Review the results

---

## 📊 Understanding Results

### Success Indicators (Green)
- Number of records successfully imported
- Shows in "Successful" box

### Skipped Records (Yellow)
- Duplicate enrollment IDs (when "Skip duplicates" is checked)
- Shows in "Skipped" box

### Failed Records (Red)
- Validation errors
- Invalid data format
- Shows in "Failed" box with error details

### Error Table
If there are errors, you'll see:
- **Row number** in Excel file
- **Enrollment ID** of the record
- **Error message** explaining the issue

---

## 🧪 Test Scenarios

### Scenario 1: Fresh Import
```
1. Download template
2. Add 5-10 new student records
3. Check "Skip duplicates"
4. Upload
5. Expect: All successful
```

### Scenario 2: Duplicate Handling
```
1. Upload same file again
2. Keep "Skip duplicates" checked
3. Upload
4. Expect: All skipped (duplicates)
```

### Scenario 3: Update Existing
```
1. Modify some records in Excel
2. Check "Update existing records"
3. Upload
4. Expect: Records updated successfully
```

### Scenario 4: Validation
```
1. Add invalid data (e.g., invalid email)
2. Upload
3. Expect: Validation errors shown
4. Fix errors in Excel
5. Upload again
```

### Scenario 5: Large Upload
```
1. Add 100+ records to template
2. Upload
3. Verify all processed correctly
```

---

## ❌ Common Errors & Solutions

### Error: "No file uploaded"
**Solution:** Make sure you've selected a file before clicking upload

### Error: "Only Excel files (.xlsx, .xls) are allowed"
**Solution:** Convert your file to Excel format (.xlsx or .xls)

### Error: "File size exceeds limit"
**Solution:** File must be under 10MB. Split into multiple files if needed

### Error: "Invalid email format"
**Solution:** Check email addresses follow format: name@domain.com

### Error: "Expected string, received undefined"
**Solution:** Make sure all required fields are filled

### Error: "Duplicate enrollment ID"
**Solution:** 
- If updating: Check "Update existing records"
- If skipping: Check "Skip duplicates"
- If new: Change the enrollment ID to be unique

### Error: "String must contain exactly 24 character(s)"
**Solution:** The `crr` field must be a valid 24-character MongoDB ObjectId

---

## 🎯 Sample Data

Here's a quick sample you can use for testing:

```
enrollmentId: PU2024TEST001
name: Test Student One
email: test1@example.com
phone: +919876543210
school: School of Engineering
course: Computer Science
degree: B.Tech
crr: 507f1f77bcf86cd799439011
enclosure: A
convocationEligible: true
convocationRegistered: false
```

---

## 🔍 Troubleshooting

### Upload doesn't work
1. Check if API server is running
2. Check browser console for errors
3. Verify you're logged in as Admin/Staff

### Template download fails
1. Check API server logs
2. Verify authentication token is valid
3. Try refreshing the page

### Results not showing
1. Check if upload completed
2. Look for error messages
3. Check browser console

---

## 📞 Support

If you encounter issues:
1. Check error messages in the UI
2. Review API server logs in terminal
3. Check browser console (F12)
4. Refer to the full specification document:
   `docs/FEATURE-SPEC-EXCEL-UPLOAD.md`

---

## ✅ Verification Checklist

After implementation, verify:
- [ ] Can access upload page from sidebar
- [ ] Template downloads successfully
- [ ] Can upload valid Excel file
- [ ] Progress bar shows during upload
- [ ] Results display correctly
- [ ] Errors show with row numbers
- [ ] Duplicate handling works
- [ ] Update existing records works
- [ ] Validate-only mode works
- [ ] Success message appears

---

**Happy Uploading! 🎉**
