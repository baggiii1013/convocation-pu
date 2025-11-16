# Attendance Tracking System - Complete Documentation

## Overview

A comprehensive attendance tracking system for the PU Convocation application that records which attendees are present, tracks who confirmed their attendance, and provides detailed analytics.

## Features

✅ **Multiple Verification Methods**
- QR Code Scanning
- Manual Entry by Staff
- Biometric (Future)
- NFC Card Scan (Future)
- Facial Recognition (Future)

✅ **Attendance Status Tracking**
- Present
- Absent
- Late
- Excused

✅ **User Confirmation Tracking**
- Records which staff/admin confirmed attendance
- Stores confirmer's name and account details
- Audit trail for all attendance records

✅ **Detailed Metadata**
- Check-in and check-out times
- Location/gate information
- Seat allocation snapshot
- Notes and remarks

✅ **Analytics & Reporting**
- Total attendance counts
- Status breakdown (present/absent/late/excused)
- Verification method statistics
- Attendee history tracking

## Database Schema

### Attendance Model

```prisma
model Attendance {
  id                 String          @id @default(auto()) @map("_id") @db.ObjectId
  attendeeId         String          @db.ObjectId
  convocationId      String?         @db.ObjectId
  status             AttendanceStatus @default(PRESENT)
  markedAt           DateTime        @default(now())
  verificationMethod VerificationMethod
  
  // Check-in details
  checkInTime        DateTime?
  checkOutTime       DateTime?
  location           String?
  
  // Confirmation tracking
  confirmedBy        String?         @db.ObjectId
  confirmedByName    String?
  
  // Additional metadata
  notes              String?
  seatInfo           Json?
  
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt

  // Relations
  attendee           Attendee        @relation(fields: [attendeeId], references: [id])
  convocation        Convocation?    @relation(fields: [convocationId], references: [id])
  confirmer          Account?        @relation("AttendanceConfirmedBy", fields: [confirmedBy], references: [id])

  @@index([attendeeId, markedAt])
  @@index([convocationId])
  @@index([confirmedBy])
  @@map("attendances")
}
```

### Enums

```prisma
enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  EXCUSED
}

enum VerificationMethod {
  QR_SCAN
  MANUAL
  BIOMETRIC
  NFC
  FACIAL
}
```

### Updated Models

#### Attendee Model
Added attendance tracking fields:
```prisma
model Attendee {
  // ... existing fields
  verificationToken     String?
  attendanceMarked      Boolean   @default(false)
  attendanceMarkedAt    DateTime?
  
  // Relations
  attendances           Attendance[]
}
```

#### Account Model
Added relation to track confirmed attendances:
```prisma
model Account {
  // ... existing fields
  confirmedAttendances  Attendance[] @relation("AttendanceConfirmedBy")
}
```

#### Convocation Model
Added relation to attendance records:
```prisma
model Convocation {
  // ... existing fields
  attendances           Attendance[]
}
```

## API Endpoints

### Public Endpoints

#### Mark Attendance by QR Code
```
POST /api/v1/attendance/mark-by-qr
```

**Request Body:**
```json
{
  "verificationToken": "unique-token-from-qr",
  "location": "Gate A",
  "confirmedBy": "account_id",
  "confirmedByName": "John Doe",
  "convocationId": "convocation_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "data": {
    "id": "attendance_id",
    "attendeeId": "attendee_id",
    "status": "PRESENT",
    "verificationMethod": "QR_SCAN",
    "checkInTime": "2025-11-16T10:30:00Z",
    "location": "Gate A",
    "confirmedByName": "John Doe",
    "attendee": { /* attendee details */ }
  }
}
```

### Protected Endpoints (Staff/Admin)

#### 1. Create Attendance Record
```
POST /api/v1/attendance
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "attendeeId": "attendee_id",
  "convocationId": "convocation_id",
  "status": "PRESENT",
  "verificationMethod": "MANUAL",
  "checkInTime": "2025-11-16T10:30:00Z",
  "location": "Gate B",
  "confirmedBy": "account_id",
  "confirmedByName": "Jane Smith",
  "notes": "Student arrived with ID card"
}
```

#### 2. Get All Attendance Records
```
GET /api/v1/attendance?page=1&limit=10&status=PRESENT&sortBy=markedAt
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 10, max: 100)
- `sortBy` (optional): Sort field (markedAt, checkInTime, status, createdAt, updatedAt)
- `sortOrder` (optional): asc or desc (default: desc)
- `attendeeId` (optional): Filter by attendee
- `convocationId` (optional): Filter by convocation event
- `status` (optional): Filter by status (PRESENT, ABSENT, LATE, EXCUSED)
- `verificationMethod` (optional): Filter by method
- `confirmedBy` (optional): Filter by confirmer
- `location` (optional): Filter by location
- `fromDate` (optional): Filter from date (ISO 8601)
- `toDate` (optional): Filter to date (ISO 8601)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "attendance_id",
      "attendeeId": "attendee_id",
      "status": "PRESENT",
      "markedAt": "2025-11-16T10:30:00Z",
      "verificationMethod": "QR_SCAN",
      "attendee": {
        "enrollmentId": "CS20240001",
        "name": "John Doe",
        "school": "Engineering"
      },
      "confirmedByName": "Staff Member"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### 3. Get Attendance by ID
```
GET /api/v1/attendance/:id
Authorization: Bearer <token>
```

#### 4. Update Attendance Record
```
PUT /api/v1/attendance/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "LATE",
  "notes": "Student arrived 30 minutes late",
  "checkInTime": "2025-11-16T11:00:00Z"
}
```

#### 5. Delete Attendance Record (Admin Only)
```
DELETE /api/v1/attendance/:id
Authorization: Bearer <token>
```

#### 6. Get Attendee History
```
GET /api/v1/attendance/attendee/:attendeeId?page=1&limit=10&convocationId=xxx
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "attendance_id",
      "status": "PRESENT",
      "markedAt": "2025-11-16T10:30:00Z",
      "verificationMethod": "QR_SCAN",
      "location": "Gate A",
      "convocation": {
        "title": "Winter 2025 Convocation",
        "eventDate": "2025-11-16",
        "venue": "Main Auditorium"
      }
    }
  ],
  "pagination": { /* ... */ }
}
```

#### 7. Bulk Mark Attendance
```
POST /api/v1/attendance/bulk
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "attendances": [
    {
      "attendeeId": "attendee_id_1",
      "status": "PRESENT",
      "verificationMethod": "MANUAL",
      "location": "Gate A"
    },
    {
      "attendeeId": "attendee_id_2",
      "status": "PRESENT",
      "verificationMethod": "MANUAL",
      "location": "Gate A"
    }
  ],
  "convocationId": "convocation_id",
  "confirmedBy": "account_id",
  "confirmedByName": "Staff Name"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk attendance marking completed",
  "data": {
    "successCount": 2,
    "failedCount": 0,
    "success": ["attendance_id_1", "attendance_id_2"],
    "failed": []
  }
}
```

#### 8. Get Attendance Statistics
```
GET /api/v1/attendance/statistics?convocationId=xxx&fromDate=2025-11-01&toDate=2025-11-30
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "byStatus": {
      "present": 140,
      "absent": 5,
      "late": 3,
      "excused": 2
    },
    "byVerificationMethod": {
      "QR_SCAN": 120,
      "MANUAL": 30
    }
  }
}
```

## Implementation Files

### Backend Files Created

1. **Validation Schema**
   - `apps/api/src/validations/attendance.validation.ts`
   - Zod validation for all endpoints

2. **Service Layer**
   - `apps/api/src/services/attendance.service.ts`
   - Business logic and database operations

3. **Controller Layer**
   - `apps/api/src/controllers/attendance.controller.ts`
   - Request/response handling

4. **Routes**
   - `apps/api/src/routes/attendance.routes.ts`
   - API endpoint definitions

### Database Migration

Run Prisma migration to create the attendance table:

```bash
cd apps/api
npx prisma generate
npx prisma db push
```

Or with migration:
```bash
npx prisma migrate dev --name add-attendance-tracking
```

## Usage Examples

### Example 1: Mark Attendance via QR Code

When an attendee scans their QR code at the gate:

```typescript
// Frontend component
const handleQRScan = async (qrData: string) => {
  try {
    const response = await fetch('/api/v1/attendance/mark-by-qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        verificationToken: qrData,
        location: 'Main Entrance',
        confirmedBy: currentUser.id,
        confirmedByName: currentUser.displayName
      })
    });
    
    const data = await response.json();
    if (data.success) {
      showSuccess('Attendance marked successfully!');
    }
  } catch (error) {
    showError('Failed to mark attendance');
  }
};
```

### Example 2: Manual Attendance Marking

Staff manually marking attendance:

```typescript
const markManualAttendance = async (attendeeId: string) => {
  const response = await fetch('/api/v1/attendance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      attendeeId,
      status: 'PRESENT',
      verificationMethod: 'MANUAL',
      location: 'Registration Desk',
      confirmedBy: staffId,
      confirmedByName: staffName,
      notes: 'Manual check-in at registration'
    })
  });
  
  return response.json();
};
```

### Example 3: View Attendance Report

Admin viewing attendance statistics:

```typescript
const getAttendanceReport = async (convocationId: string) => {
  const response = await fetch(
    `/api/v1/attendance/statistics?convocationId=${convocationId}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  const { data } = await response.json();
  console.log(`Total Attendance: ${data.total}`);
  console.log(`Present: ${data.byStatus.present}`);
  console.log(`Absent: ${data.byStatus.absent}`);
};
```

## Security Considerations

1. **Authentication**: Most endpoints require authentication
2. **Authorization**: Role-based access control (ADMIN, STAFF)
3. **Rate Limiting**: Applied to prevent abuse
4. **Input Validation**: All inputs validated using Zod schemas
5. **Audit Trail**: All attendance records track who confirmed them

## Future Enhancements

- [ ] Real-time attendance dashboard
- [ ] Export attendance reports to Excel/PDF
- [ ] SMS/Email notifications for attendance
- [ ] Biometric integration
- [ ] Facial recognition integration
- [ ] NFC card scanning support
- [ ] Geolocation verification
- [ ] Attendance prediction using ML

## Testing

### Test Attendance Creation
```bash
curl -X POST http://localhost:3001/api/v1/attendance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "attendeeId": "ATTENDEE_ID",
    "status": "PRESENT",
    "verificationMethod": "MANUAL",
    "location": "Gate A"
  }'
```

### Test QR Code Scanning
```bash
curl -X POST http://localhost:3001/api/v1/attendance/mark-by-qr \
  -H "Content-Type: application/json" \
  -d '{
    "verificationToken": "VERIFICATION_TOKEN",
    "location": "Main Gate"
  }'
```

## Support

For issues or questions:
- Check the API documentation
- Review validation schemas
- Check server logs for errors
- Ensure database migrations are run

---

**Created**: November 16, 2025  
**Status**: ✅ Complete and Ready for Production
