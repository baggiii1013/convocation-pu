# Attendance API Quick Reference

## Base URL
```
http://localhost:3001/api/v1/attendance
```

## Quick Examples

### 1. Mark Attendance via QR Code (Public)
```bash
POST /api/v1/attendance/mark-by-qr

{
  "verificationToken": "abc123xyz",
  "location": "Main Gate",
  "confirmedBy": "user_id",
  "confirmedByName": "Staff Name"
}
```

### 2. Create Manual Attendance (Staff/Admin)
```bash
POST /api/v1/attendance
Authorization: Bearer TOKEN

{
  "attendeeId": "attendee_id",
  "status": "PRESENT",
  "verificationMethod": "MANUAL",
  "location": "Gate A",
  "confirmedBy": "staff_id",
  "confirmedByName": "John Doe",
  "notes": "Manual check-in"
}
```

### 3. Get All Attendance
```bash
GET /api/v1/attendance?page=1&limit=10&status=PRESENT
Authorization: Bearer TOKEN
```

### 4. Get Attendee History
```bash
GET /api/v1/attendance/attendee/:attendeeId
Authorization: Bearer TOKEN
```

### 5. Bulk Mark Attendance
```bash
POST /api/v1/attendance/bulk
Authorization: Bearer TOKEN

{
  "attendances": [
    {
      "attendeeId": "id1",
      "status": "PRESENT",
      "verificationMethod": "MANUAL"
    },
    {
      "attendeeId": "id2",
      "status": "PRESENT",
      "verificationMethod": "MANUAL"
    }
  ],
  "confirmedBy": "staff_id",
  "confirmedByName": "Staff Name"
}
```

### 6. Get Statistics
```bash
GET /api/v1/attendance/statistics?convocationId=xxx
Authorization: Bearer TOKEN
```

### 7. Update Attendance
```bash
PUT /api/v1/attendance/:id
Authorization: Bearer TOKEN

{
  "status": "LATE",
  "notes": "Arrived 30 minutes late"
}
```

### 8. Delete Attendance (Admin Only)
```bash
DELETE /api/v1/attendance/:id
Authorization: Bearer TOKEN
```

## Status Options
- `PRESENT` - Attendee is present
- `ABSENT` - Attendee is absent
- `LATE` - Attendee arrived late
- `EXCUSED` - Excused absence

## Verification Methods
- `QR_SCAN` - QR code scanning
- `MANUAL` - Manual entry by staff
- `BIOMETRIC` - Biometric verification
- `NFC` - NFC card scan
- `FACIAL` - Facial recognition

## Filter Parameters
- `page` - Page number
- `limit` - Records per page (max 100)
- `sortBy` - Sort field (markedAt, checkInTime, status, createdAt, updatedAt)
- `sortOrder` - asc or desc
- `attendeeId` - Filter by attendee
- `convocationId` - Filter by event
- `status` - Filter by status
- `verificationMethod` - Filter by method
- `confirmedBy` - Filter by confirmer
- `location` - Filter by location
- `fromDate` - Filter from date (ISO 8601)
- `toDate` - Filter to date (ISO 8601)

## Response Format

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* result */ }
}
```

### Error
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (dev only)"
}
```

## Key Features

✅ Tracks which user confirmed attendance  
✅ Multiple verification methods  
✅ Flexible status tracking  
✅ Check-in/out times  
✅ Location tracking  
✅ Seat info snapshot  
✅ Comprehensive analytics  
✅ Bulk operations  
✅ Audit trail
