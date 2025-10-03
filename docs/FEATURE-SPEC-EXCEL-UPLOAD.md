# Feature Specification: Excel Upload for Student Data

## Overview
This feature allows authorized users (Admin, Staff) to bulk upload student/attendee data via Excel files through the dashboard interface. Users will see an "Upload Students" option in the sidebar navigation that opens a dedicated upload interface.

---

## 1. User Interface (Frontend)

### 1.1 Sidebar Navigation
**Location:** `/apps/web/src/components/shared/Sidebar.tsx`

**Changes Required:**
- Add a new navigation item in the admin navigation section:
  ```typescript
  {
    name: 'Upload Students',
    href: '/admin/upload-students',
    icon: <UploadIcon /> // Upload/Document icon
  }
  ```
- Position: After "Manage Users" and before "Manage Ceremonies"
- Visibility: Only for users with ADMIN or STAFF roles
- Icon: Document upload icon (cloud upload with document)

### 1.2 Upload Page
**Location:** `/apps/web/src/app/(dashboard)/admin/upload-students/page.tsx` (new file)

**Components:**

#### Main Upload Interface
```
┌─────────────────────────────────────────────────────────┐
│  Upload Student Data                                     │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  📥 Drag and drop Excel file here                │  │
│  │     or click to browse                           │  │
│  │                                                   │  │
│  │  Supported formats: .xlsx, .xls                  │  │
│  │  Maximum file size: 10MB                         │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  📄 Download Template                                    │
│  ↓ Download sample Excel template with required format  │
│                                                          │
│  ⚙️ Upload Options                                       │
│  ☐ Skip duplicates (based on enrollment ID)             │
│  ☐ Update existing records                              │
│  ☐ Validate only (don't save)                           │
│                                                          │
│  [Upload and Process]                                    │
└─────────────────────────────────────────────────────────┘
```

#### Features:
1. **File Upload Area**
   - Drag-and-drop zone
   - File picker button
   - File type validation (only .xlsx, .xls)
   - File size validation (max 10MB)
   - Visual feedback on file selection

2. **Template Download**
   - Button to download Excel template
   - Template includes:
     - Header row with all required fields
     - Sample data row (2-3 examples)
     - Field descriptions/notes

3. **Upload Options**
   - Skip duplicates checkbox
   - Update existing records checkbox
   - Validation-only mode (preview without saving)

4. **Progress Indicator**
   - Upload progress bar
   - Processing status
   - Real-time validation feedback

5. **Results Display**
   ```
   ┌─────────────────────────────────────────────────────┐
   │  Upload Results                                      │
   │                                                      │
   │  ✓ Successfully imported: 150 records               │
   │  ⚠ Skipped (duplicates): 5 records                  │
   │  ✗ Failed validation: 3 records                     │
   │                                                      │
   │  [Download Error Report] [View Imported Data]       │
   │                                                      │
   │  Validation Errors:                                 │
   │  Row 12: Invalid email format for john@doe          │
   │  Row 25: Missing required field 'course'            │
   │  Row 47: Enrollment ID already exists (PU2024001)   │
   └─────────────────────────────────────────────────────┘
   ```

### 1.3 Components to Create

**File Structure:**
```
apps/web/src/
├── app/(dashboard)/admin/upload-students/
│   └── page.tsx                    # Main upload page
├── components/admin/
│   ├── ExcelUploader.tsx          # Upload component
│   ├── UploadProgress.tsx         # Progress indicator
│   ├── UploadResults.tsx          # Results display
│   └── TemplateDownloader.tsx     # Template download button
└── services/
    └── upload.service.ts          # API calls for upload
```

---

## 2. Excel Template Structure

### 2.1 Required Columns
Based on the Attendee model in `schema.prisma`:

| Column Name | Data Type | Required | Validation | Example |
|------------|-----------|----------|------------|---------|
| enrollmentId | String | Yes | Unique, max 50 chars | PU2024001234 |
| name | String | Yes | Min 1, max 100 chars | John Doe |
| email | String | Yes | Valid email format | john.doe@example.com |
| phone | String | No | 10-15 digits | +919876543210 |
| school | String | Yes | Max 100 chars | School of Engineering |
| course | String | Yes | Max 100 chars | Computer Science |
| degree | String | Yes | Max 50 chars | B.Tech |
| crr | String | Yes | Valid ObjectId reference | 507f1f77bcf86cd799439011 |
| enclosure | String | Yes | Valid enclosure code | A, B, C, etc. |
| convocationEligible | Boolean | No | true/false or 1/0 | true |
| convocationRegistered | Boolean | No | true/false or 1/0 | false |

### 2.2 Template File
**Filename:** `student_upload_template.xlsx`

**Sheet Structure:**
- Sheet 1: "Student Data"
  - Row 1: Column headers (bold, colored background)
  - Row 2: Data type hints in comments
  - Rows 3-5: Example data
  
- Sheet 2: "Instructions"
  - Field descriptions
  - Data format guidelines
  - Common errors to avoid
  - Upload process steps

### 2.3 Template Generation Endpoint
**Endpoint:** `GET /api/attendees/upload/template`

**Implementation:**
- Generate Excel file dynamically using a library (e.g., `exceljs`)
- Include headers and sample data
- Return as downloadable file

---

## 3. Backend API

### 3.1 New Endpoints

#### 3.1.1 Upload Excel File
```
POST /api/attendees/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Request:**
```typescript
{
  file: File,              // Excel file
  options: {
    skipDuplicates: boolean,
    updateExisting: boolean,
    validateOnly: boolean
  }
}
```

**Response:**
```typescript
{
  success: boolean,
  message: string,
  data: {
    summary: {
      totalRows: number,
      successful: number,
      skipped: number,
      failed: number
    },
    results: {
      imported: Attendee[],
      errors: {
        row: number,
        data: any,
        error: string
      }[]
    }
  }
}
```

#### 3.1.2 Download Template
```
GET /api/attendees/upload/template
Authorization: Bearer <token>
```

**Response:**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- File: `student_upload_template.xlsx`

#### 3.1.3 Validate Excel Data
```
POST /api/attendees/upload/validate
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Request:**
```typescript
{
  file: File
}
```

**Response:**
```typescript
{
  success: boolean,
  data: {
    valid: boolean,
    rowCount: number,
    validRows: number,
    errors: {
      row: number,
      field: string,
      value: any,
      error: string
    }[]
  }
}
```

### 3.2 File Structure

```
apps/api/src/
├── controllers/
│   └── attendee.controller.ts     # Add upload methods
├── services/
│   ├── attendee.service.ts        # Add bulk create/update
│   └── excel.service.ts           # New: Excel parsing/generation
├── routes/
│   └── attendee.routes.ts         # Add upload routes
├── middleware/
│   └── upload.ts                  # New: File upload middleware
├── utils/
│   ├── excel-parser.ts            # New: Parse Excel files
│   └── excel-validator.ts         # New: Validate Excel data
└── types/
    └── upload.types.ts            # New: Upload-related types
```

### 3.3 Implementation Details

#### 3.3.1 Dependencies to Add
```json
{
  "dependencies": {
    "multer": "^1.4.5-lts.1",      // File upload handling
    "exceljs": "^4.4.0",            // Excel file generation/parsing
    "xlsx": "^0.18.5"               // Alternative: Excel parsing
  },
  "devDependencies": {
    "@types/multer": "^1.4.11"
  }
}
```

#### 3.3.2 File Upload Middleware
**File:** `apps/api/src/middleware/upload.ts`

```typescript
import multer from 'multer';
import path from 'path';

// Configure multer for file upload
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedExtensions = ['.xlsx', '.xls'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files (.xlsx, .xls) are allowed'), false);
  }
};

export const uploadExcel = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  }
});
```

#### 3.3.3 Excel Parser Utility
**File:** `apps/api/src/utils/excel-parser.ts`

```typescript
import * as XLSX from 'xlsx';

interface ParsedRow {
  enrollmentId: string;
  name: string;
  email?: string;
  phone?: string;
  school: string;
  course: string;
  degree: string;
  crr: string;
  enclosure: string;
  convocationEligible?: boolean;
  convocationRegistered?: boolean;
}

export class ExcelParser {
  static parse(buffer: Buffer): ParsedRow[] {
    // Read workbook from buffer
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(sheet, {
      raw: false,
      defval: undefined
    });
    
    // Map to expected format
    return data.map((row: any) => ({
      enrollmentId: row['enrollmentId'] || row['Enrollment ID'],
      name: row['name'] || row['Name'],
      email: row['email'] || row['Email'],
      phone: row['phone'] || row['Phone'],
      school: row['school'] || row['School'],
      course: row['course'] || row['Course'],
      degree: row['degree'] || row['Degree'],
      crr: row['crr'] || row['CRR'],
      enclosure: row['enclosure'] || row['Enclosure'],
      convocationEligible: parseBoolean(row['convocationEligible']),
      convocationRegistered: parseBoolean(row['convocationRegistered'])
    }));
  }
}

function parseBoolean(value: any): boolean | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower === 'true' || lower === 'yes' || lower === '1') return true;
    if (lower === 'false' || lower === 'no' || lower === '0') return false;
  }
  if (typeof value === 'number') {
    return value === 1;
  }
  return undefined;
}
```

#### 3.3.4 Excel Validator Utility
**File:** `apps/api/src/utils/excel-validator.ts`

```typescript
import { z } from 'zod';

const attendeeRowSchema = z.object({
  enrollmentId: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(10).max(15).optional().or(z.literal('')),
  school: z.string().min(1).max(100),
  course: z.string().min(1).max(100),
  degree: z.string().min(1).max(50),
  crr: z.string().length(24), // MongoDB ObjectId length
  enclosure: z.string().min(1),
  convocationEligible: z.boolean().optional(),
  convocationRegistered: z.boolean().optional()
});

export interface ValidationError {
  row: number;
  field: string;
  value: any;
  error: string;
}

export class ExcelValidator {
  static validate(data: any[]): {
    valid: boolean;
    errors: ValidationError[];
  } {
    const errors: ValidationError[] = [];
    
    data.forEach((row, index) => {
      const rowNumber = index + 2; // +2 for header row and 0-indexing
      
      try {
        attendeeRowSchema.parse(row);
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach(err => {
            errors.push({
              row: rowNumber,
              field: err.path.join('.'),
              value: row[err.path[0]],
              error: err.message
            });
          });
        }
      }
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  static checkDuplicates(data: any[]): {
    duplicates: number[];
  } {
    const enrollmentIds = new Set();
    const duplicates: number[] = [];
    
    data.forEach((row, index) => {
      if (enrollmentIds.has(row.enrollmentId)) {
        duplicates.push(index + 2);
      } else {
        enrollmentIds.add(row.enrollmentId);
      }
    });
    
    return { duplicates };
  }
}
```

#### 3.3.5 Excel Service
**File:** `apps/api/src/services/excel.service.ts`

```typescript
import ExcelJS from 'exceljs';

export class ExcelService {
  static async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    
    // Create data sheet
    const dataSheet = workbook.addWorksheet('Student Data');
    
    // Define columns
    dataSheet.columns = [
      { header: 'enrollmentId', key: 'enrollmentId', width: 20 },
      { header: 'name', key: 'name', width: 30 },
      { header: 'email', key: 'email', width: 30 },
      { header: 'phone', key: 'phone', width: 15 },
      { header: 'school', key: 'school', width: 30 },
      { header: 'course', key: 'course', width: 30 },
      { header: 'degree', key: 'degree', width: 15 },
      { header: 'crr', key: 'crr', width: 25 },
      { header: 'enclosure', key: 'enclosure', width: 12 },
      { header: 'convocationEligible', key: 'convocationEligible', width: 20 },
      { header: 'convocationRegistered', key: 'convocationRegistered', width: 22 }
    ];
    
    // Style header row
    dataSheet.getRow(1).font = { bold: true };
    dataSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Add sample data
    dataSheet.addRows([
      {
        enrollmentId: 'PU2024001234',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+919876543210',
        school: 'School of Engineering',
        course: 'Computer Science',
        degree: 'B.Tech',
        crr: '507f1f77bcf86cd799439011',
        enclosure: 'A',
        convocationEligible: true,
        convocationRegistered: false
      },
      {
        enrollmentId: 'PU2024001235',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+919876543211',
        school: 'School of Business',
        course: 'Business Administration',
        degree: 'MBA',
        crr: '507f1f77bcf86cd799439012',
        enclosure: 'B',
        convocationEligible: true,
        convocationRegistered: false
      }
    ]);
    
    // Create instructions sheet
    const instructionSheet = workbook.addWorksheet('Instructions');
    instructionSheet.addRows([
      ['Student Data Upload Template'],
      [''],
      ['Required Fields:'],
      ['- enrollmentId: Unique student enrollment ID'],
      ['- name: Full name of the student'],
      ['- school: Name of the school/department'],
      ['- course: Course name'],
      ['- degree: Degree type (B.Tech, MBA, etc.)'],
      ['- crr: Reference ID (24-character MongoDB ObjectId)'],
      ['- enclosure: Allocated enclosure code'],
      [''],
      ['Optional Fields:'],
      ['- email: Student email address'],
      ['- phone: Contact number'],
      ['- convocationEligible: true/false'],
      ['- convocationRegistered: true/false'],
      [''],
      ['Data Format Guidelines:'],
      ['- enrollmentId must be unique'],
      ['- email must be in valid format'],
      ['- phone should include country code'],
      ['- Boolean fields accept: true/false, yes/no, 1/0'],
      [''],
      ['Upload Process:'],
      ['1. Fill the Student Data sheet with your data'],
      ['2. Save the file'],
      ['3. Upload through the admin dashboard'],
      ['4. Review validation results'],
      ['5. Confirm import']
    ]);
    
    // Generate buffer
    return await workbook.xlsx.writeBuffer() as Buffer;
  }
}
```

#### 3.3.6 Controller Methods
**File:** `apps/api/src/controllers/attendee.controller.ts`

Add these methods:

```typescript
/**
 * Upload Excel file with attendee data
 * POST /api/attendees/upload
 */
static async uploadExcel(req: Request, res: Response): Promise<void> {
  try {
    const user = req.user as AccessTokenPayload;
    const file = req.file;
    const options = {
      skipDuplicates: req.body.skipDuplicates === 'true',
      updateExisting: req.body.updateExisting === 'true',
      validateOnly: req.body.validateOnly === 'true'
    };
    
    if (!file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded',
        code: 'NO_FILE'
      });
      return;
    }
    
    // Parse Excel file
    const parsedData = ExcelParser.parse(file.buffer);
    
    // Validate data
    const validation = ExcelValidator.validate(parsedData);
    
    if (!validation.valid) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        data: { errors: validation.errors }
      });
      return;
    }
    
    // If validation only, return here
    if (options.validateOnly) {
      res.json({
        success: true,
        message: 'Validation successful',
        data: {
          rowCount: parsedData.length,
          validRows: parsedData.length - validation.errors.length
        }
      });
      return;
    }
    
    // Process upload
    const result = await AttendeeService.bulkCreate(
      parsedData,
      options
    );
    
    logger.info(
      `Bulk upload by ${user.email}: ${result.successful} successful, ${result.failed} failed`
    );
    
    res.json({
      success: true,
      message: 'Upload processed successfully',
      data: result
    });
  } catch (error) {
    logger.error('Error in AttendeeController.uploadExcel:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process upload',
      code: 'UPLOAD_ERROR'
    });
  }
}

/**
 * Download Excel template
 * GET /api/attendees/upload/template
 */
static async downloadTemplate(req: Request, res: Response): Promise<void> {
  try {
    const buffer = await ExcelService.generateTemplate();
    
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=student_upload_template.xlsx'
    );
    
    res.send(buffer);
  } catch (error) {
    logger.error('Error in AttendeeController.downloadTemplate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate template',
      code: 'TEMPLATE_ERROR'
    });
  }
}
```

#### 3.3.7 Service Methods
**File:** `apps/api/src/services/attendee.service.ts`

Add this method:

```typescript
/**
 * Bulk create attendees from Excel upload
 */
static async bulkCreate(
  data: AttendeeCreateInput[],
  options: {
    skipDuplicates: boolean;
    updateExisting: boolean;
  }
): Promise<{
  summary: {
    totalRows: number;
    successful: number;
    skipped: number;
    failed: number;
  };
  results: {
    imported: Attendee[];
    errors: {
      row: number;
      data: any;
      error: string;
    }[];
  };
}> {
  const results = {
    summary: {
      totalRows: data.length,
      successful: 0,
      skipped: 0,
      failed: 0
    },
    results: {
      imported: [] as Attendee[],
      errors: [] as any[]
    }
  };
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNumber = i + 2; // +2 for header and 0-indexing
    
    try {
      // Check for existing attendee
      const existing = await prisma.attendee.findUnique({
        where: { enrollmentId: row.enrollmentId }
      });
      
      if (existing) {
        if (options.updateExisting) {
          // Update existing record
          const updated = await prisma.attendee.update({
            where: { enrollmentId: row.enrollmentId },
            data: row,
            include: {
              account: true,
              allocation: true
            }
          });
          results.results.imported.push(updated);
          results.summary.successful++;
        } else if (options.skipDuplicates) {
          // Skip duplicate
          results.summary.skipped++;
        } else {
          // Report as error
          results.results.errors.push({
            row: rowNumber,
            data: row,
            error: `Duplicate enrollment ID: ${row.enrollmentId}`
          });
          results.summary.failed++;
        }
      } else {
        // Create new record
        const created = await prisma.attendee.create({
          data: row,
          include: {
            account: true,
            allocation: true
          }
        });
        results.results.imported.push(created);
        results.summary.successful++;
      }
    } catch (error) {
      results.results.errors.push({
        row: rowNumber,
        data: row,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      results.summary.failed++;
    }
  }
  
  logger.info(`Bulk create completed: ${JSON.stringify(results.summary)}`);
  return results;
}
```

#### 3.3.8 Routes
**File:** `apps/api/src/routes/attendee.routes.ts`

Add these routes:

```typescript
import { uploadExcel } from '../middleware/upload.js';

// Excel upload routes
router.post(
  '/upload',
  authenticate,
  authorize(['ADMIN', 'STAFF']),
  uploadExcel.single('file'),
  AttendeeController.uploadExcel
);

router.get(
  '/upload/template',
  authenticate,
  authorize(['ADMIN', 'STAFF']),
  AttendeeController.downloadTemplate
);

router.post(
  '/upload/validate',
  authenticate,
  authorize(['ADMIN', 'STAFF']),
  uploadExcel.single('file'),
  AttendeeController.validateExcel
);
```

---

## 4. Frontend Implementation

### 4.1 Upload Page Component
**File:** `apps/web/src/app/(dashboard)/admin/upload-students/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { ExcelUploader } from '@/components/admin/ExcelUploader';
import { UploadResults } from '@/components/admin/UploadResults';
import { TemplateDownloader } from '@/components/admin/TemplateDownloader';

export default function UploadStudentsPage() {
  const [uploadResults, setUploadResults] = useState(null);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Upload Student Data
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Bulk import student records using an Excel file
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Template Download Section */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold mb-4">
              Step 1: Download Template
            </h2>
            <TemplateDownloader />
          </div>
          
          {/* Upload Section */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold mb-4">
              Step 2: Upload Excel File
            </h2>
            <ExcelUploader onUploadComplete={setUploadResults} />
          </div>
          
          {/* Results Section */}
          {uploadResults && (
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold mb-4">
                Upload Results
              </h2>
              <UploadResults results={uploadResults} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### 4.2 Excel Uploader Component
**File:** `apps/web/src/components/admin/ExcelUploader.tsx`

```typescript
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadService } from '@/services/upload.service';
import { UploadProgress } from './UploadProgress';

export function ExcelUploader({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState({
    skipDuplicates: true,
    updateExisting: false,
    validateOnly: false
  });
  
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });
  
  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    
    try {
      const result = await uploadService.uploadExcel(file, options, (progress) => {
        setProgress(progress);
      });
      
      onUploadComplete(result);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <svg className="h-12 w-12 text-slate-400 mb-4" /* Upload icon */ />
          {file ? (
            <p className="text-lg font-medium text-slate-900 dark:text-slate-50">
              {file.name}
            </p>
          ) : (
            <>
              <p className="text-lg font-medium text-slate-900 dark:text-slate-50">
                {isDragActive 
                  ? 'Drop the file here' 
                  : 'Drag and drop Excel file here'
                }
              </p>
              <p className="text-sm text-slate-500 mt-2">
                or click to browse
              </p>
            </>
          )}
          <p className="text-xs text-slate-400 mt-4">
            Supported formats: .xlsx, .xls (Max 10MB)
          </p>
        </div>
      </div>
      
      {/* Options */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={options.skipDuplicates}
            onChange={(e) => setOptions({...options, skipDuplicates: e.target.checked})}
            className="rounded"
          />
          <span className="text-sm">Skip duplicates (based on enrollment ID)</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={options.updateExisting}
            onChange={(e) => setOptions({...options, updateExisting: e.target.checked})}
            className="rounded"
          />
          <span className="text-sm">Update existing records</span>
        </label>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={options.validateOnly}
            onChange={(e) => setOptions({...options, validateOnly: e.target.checked})}
            className="rounded"
          />
          <span className="text-sm">Validate only (don't save)</span>
        </label>
      </div>
      
      {/* Progress */}
      {uploading && <UploadProgress progress={progress} />}
      
      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg
                   hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Processing...' : 'Upload and Process'}
      </button>
    </div>
  );
}
```

### 4.3 Upload Service
**File:** `apps/web/src/services/upload.service.ts`

```typescript
import { axiosInstance } from '@/lib/axios';

export const uploadService = {
  async uploadExcel(
    file: File,
    options: {
      skipDuplicates: boolean;
      updateExisting: boolean;
      validateOnly: boolean;
    },
    onProgress?: (progress: number) => void
  ) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('skipDuplicates', String(options.skipDuplicates));
    formData.append('updateExisting', String(options.updateExisting));
    formData.append('validateOnly', String(options.validateOnly));
    
    const response = await axiosInstance.post(
      '/attendees/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        }
      }
    );
    
    return response.data;
  },
  
  async downloadTemplate() {
    const response = await axiosInstance.get(
      '/attendees/upload/template',
      { responseType: 'blob' }
    );
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_upload_template.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
```

---

## 5. Security & Permissions

### 5.1 Authorization
- Only users with `ADMIN` or `STAFF` roles can access upload feature
- Validate user permissions on both frontend and backend
- Implement IAM policy checks if needed

### 5.2 File Validation
- Accept only `.xlsx` and `.xls` files
- Maximum file size: 10MB
- Validate MIME type on server-side
- Sanitize file contents

### 5.3 Data Validation
- Validate all fields according to schema
- Check for SQL injection attempts
- Validate MongoDB ObjectId format for `crr` field
- Prevent duplicate enrollment IDs (configurable)

### 5.4 Rate Limiting
- Implement rate limiting on upload endpoint
- Limit: 5 uploads per hour per user
- Prevent abuse and DDoS attacks

---

## 6. Error Handling

### 6.1 Frontend Errors
- File size exceeded
- Invalid file format
- Network errors
- Upload timeout
- Validation errors

### 6.2 Backend Errors
- File parsing errors
- Validation errors
- Database errors
- Duplicate entries
- Invalid references

### 6.3 User Feedback
- Clear error messages
- Row-specific error details
- Downloadable error report
- Suggested fixes

---

## 7. Testing Requirements

### 7.1 Unit Tests
- Excel parser utility
- Excel validator utility
- Service methods (bulkCreate)
- Controller methods

### 7.2 Integration Tests
- Upload API endpoint
- Template download endpoint
- File validation
- Database operations

### 7.3 E2E Tests
- Complete upload flow
- Template download
- Error handling scenarios
- Duplicate handling
- Update existing records

### 7.4 Test Data
- Valid Excel files
- Invalid Excel files
- Large files (>10MB)
- Malformed data
- Duplicate records

---

## 8. Performance Considerations

### 8.1 Large File Handling
- Process files in batches (e.g., 100 records at a time)
- Implement streaming for large files
- Show progress indicators
- Allow cancellation

### 8.2 Database Optimization
- Use bulk insert operations
- Implement transactions
- Index on enrollmentId
- Connection pooling

### 8.3 Frontend Optimization
- Lazy load components
- Debounce file operations
- Show skeleton loaders
- Implement pagination for results

---

## 9. Monitoring & Logging

### 9.1 Metrics to Track
- Upload success rate
- Processing time
- Error rate by type
- File sizes
- Records processed

### 9.2 Logging
- Upload attempts
- Validation errors
- Processing errors
- User actions
- Performance metrics

---

## 10. Future Enhancements

### Phase 2 Features
- CSV file support
- Drag-and-drop reordering
- Bulk edit interface
- Data mapping tool
- Preview before upload
- Scheduled imports
- Import history
- Rollback functionality

### Phase 3 Features
- API integration for external systems
- Real-time collaboration
- Advanced data transformation
- Custom field mapping
- Data cleansing suggestions
- Machine learning validation

---

## 11. Documentation

### 11.1 User Guide
- How to download template
- How to fill Excel sheet
- How to upload file
- Understanding results
- Troubleshooting common errors

### 11.2 Admin Guide
- Setting up permissions
- Monitoring uploads
- Handling errors
- Data validation rules
- Backup and recovery

### 11.3 Developer Guide
- API documentation
- Code examples
- Architecture overview
- Extending functionality
- Testing guidelines

---

## 12. Acceptance Criteria

### Must Have
- ✅ Sidebar navigation shows "Upload Students" for admin/staff
- ✅ Upload page with drag-and-drop interface
- ✅ Excel template download functionality
- ✅ File validation (type, size)
- ✅ Data validation against schema
- ✅ Bulk insert to database
- ✅ Success/error reporting
- ✅ Row-specific error details

### Should Have
- ✅ Progress indicator during upload
- ✅ Duplicate handling options
- ✅ Update existing records option
- ✅ Validation-only mode
- ✅ Download error report
- ✅ Mobile-responsive interface

### Nice to Have
- ⭕ Upload history
- ⭕ Batch processing status
- ⭕ Email notifications
- ⭕ Auto-retry failed records
- ⭕ Import scheduling

---

## 13. Implementation Checklist

### Backend
- [ ] Install dependencies (multer, exceljs)
- [ ] Create upload middleware
- [ ] Create ExcelParser utility
- [ ] Create ExcelValidator utility
- [ ] Create ExcelService for template generation
- [ ] Add controller methods (uploadExcel, downloadTemplate)
- [ ] Add service method (bulkCreate)
- [ ] Add routes for upload endpoints
- [ ] Implement authorization checks
- [ ] Add error handling
- [ ] Write unit tests
- [ ] Write integration tests

### Frontend
- [ ] Install dependencies (react-dropzone)
- [ ] Update Sidebar component
- [ ] Create upload page
- [ ] Create ExcelUploader component
- [ ] Create UploadProgress component
- [ ] Create UploadResults component
- [ ] Create TemplateDownloader component
- [ ] Create upload service
- [ ] Add error handling
- [ ] Add loading states
- [ ] Implement responsive design
- [ ] Write component tests

### Testing & Deployment
- [ ] Create test Excel files
- [ ] Test upload flow end-to-end
- [ ] Test error scenarios
- [ ] Test with large files
- [ ] Performance testing
- [ ] Security testing
- [ ] UAT with admin users
- [ ] Deploy to staging
- [ ] Final QA
- [ ] Deploy to production

---

## 14. Timeline Estimate

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1 | Backend setup & utilities | 2-3 days |
| Phase 2 | API endpoints & services | 2-3 days |
| Phase 3 | Frontend components | 3-4 days |
| Phase 4 | Integration & testing | 2-3 days |
| Phase 5 | Bug fixes & polish | 1-2 days |
| **Total** | | **10-15 days** |

---

## 15. Dependencies

### NPM Packages
```json
{
  "backend": {
    "multer": "^1.4.5-lts.1",
    "@types/multer": "^1.4.11",
    "exceljs": "^4.4.0",
    "xlsx": "^0.18.5"
  },
  "frontend": {
    "react-dropzone": "^14.2.3"
  }
}
```

### System Requirements
- Node.js 18+
- MongoDB 6+
- 10MB file upload limit
- Browser with File API support

---

This specification provides a complete blueprint for implementing the Excel upload feature. Follow each section systematically to ensure all requirements are met.
