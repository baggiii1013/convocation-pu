# Phase 2 Implementation Complete: Backend Seat Assignment Algorithm

## Overview

Phase 2 of the seat assignment system has been successfully implemented. This phase focuses on the backend seat allocation algorithm that automatically assigns seats to attendees based on their assigned enclosure, while respecting both admin-reserved and row-reserved seats.

## What Was Implemented

### 1. **Seat Allocation Service** (`apps/api/src/services/seatAllocation.service.ts`)

A comprehensive service that handles all seat allocation logic:

#### Key Features:
- **Automatic Seat Allocation**: Reads attendees from the database (with assigned enclosures) and allocates available seats
- **Admin Reservation Handling**: Skips seats that are reserved by admins via the `SeatReservation` model
- **Row Reservation Handling**: Skips seats marked as reserved in the enclosure/row configuration
- **Enclosure-based Processing**: Groups attendees by enclosure and processes each enclosure sequentially
- **Smart Seat Assignment**: Fills seats row by row, respecting display order
- **Conflict Prevention**: Checks for existing allocations to avoid double-booking

#### Key Methods:
```typescript
// Main allocation method - processes all eligible attendees
allocateSeats(): Promise<AllocationResult>

// Get total available seats in an enclosure (excluding reservations)
getTotalSeats(enclosureLetter: string): Promise<number>

// Get allocation statistics across all enclosures
getAllocationStats(): Promise<Stats>

// Clear all allocations (for re-running the algorithm)
clearAllAllocations(): Promise<number>

// Get seat allocation for a specific attendee
getAttendeeAllocation(enrollmentId: string): Promise<AllocationData>
```

### 2. **Allocation Controller** (`apps/api/src/controllers/allocation.controller.ts`)

REST API endpoints for managing seat allocations:

#### Endpoints:

**POST /api/allocations/allocate-seats** (Admin only)
- Triggers the seat allocation algorithm
- Processes all attendees with `assignedEnclosure` who don't have allocations yet
- Returns statistics on allocated/failed seats

**DELETE /api/allocations/clear** (Admin only)
- Clears all seat allocations
- Useful for re-running the algorithm with updated data

**GET /api/allocations/:enrollmentId** (Public)
- Retrieves seat allocation for a specific attendee
- Returns attendee details, seat info, and enclosure configuration
- No authentication required (students can view their own seats)

**GET /api/allocations/stats** (Admin/Staff)
- Returns comprehensive allocation statistics
- Includes total attendees, allocated seats, utilization rates per enclosure
- Breakdown by category and enclosure

**GET /api/allocations/enclosure/:enclosureLetter** (Admin/Staff)
- Returns all attendees and their seats in a specific enclosure
- Grouped by row for easy visualization
- Used for aerial view and admin management

### 3. **Updated Attendee Controller** (`apps/api/src/controllers/attendee.controller.ts`)

Added search functionality:

**GET /api/attendees/search?q=<query>** (Admin/Staff)
- Search attendees by enrollment ID or name
- Returns matching attendees with their seat allocations
- Case-insensitive search

### 4. **Updated Attendee Service** (`apps/api/src/services/attendee.service.ts`)

Added search method that queries the database and returns attendee details with allocation information.

### 5. **API Routes** (`apps/api/src/routes/`)

Created new route files and updated existing ones:

- **allocation.routes.ts**: New file with all allocation-related routes
- **attendee.routes.ts**: Added search endpoint
- **index.ts**: Registered allocation routes in the main router

## How the Algorithm Works

### Step-by-Step Process:

1. **Fetch Eligible Attendees**
   ```typescript
   // Criteria:
   - assignedEnclosure is not null
   - No existing seat allocation
   - convocationEligible = true
   - convocationRegistered = true
   ```

2. **Group by Enclosure**
   - Attendees are grouped by their `assignedEnclosure` field
   - Each enclosure is processed independently

3. **For Each Enclosure:**
   
   a. **Fetch Enclosure Configuration**
      - Get all rows with their start/end seats and reserved seats
      - Sort rows by `displayOrder`
   
   b. **Load Reservations**
      - Admin-reserved seats from `SeatReservation` table
      - Row-reserved seats from enclosure configuration
      - Create a Set for fast lookup (e.g., "A-5", "B-10")
   
   c. **Allocate Seats**
      - Iterate through rows in order
      - For each seat in the row:
        * Skip if admin-reserved
        * Skip if row-reserved
        * Skip if already allocated
        * Otherwise, assign to next attendee
   
   d. **Bulk Insert**
      - Create all allocations in a single database operation
      - Prevents duplicate allocations with unique constraint

4. **Handle Errors**
   - If not enough seats, log unallocated attendees
   - Return detailed error information

### Example Flow:

```
Enclosure A: 100 attendees
Row A: Seats 1-50 (Reserved: 1,25,50)
Row B: Seats 1-50 (Reserved: 10,20)
Admin Reserved: A-5, B-15

Allocation:
- Row A, Seat 2 → Attendee 1 (skip 1, reserved)
- Row A, Seat 3 → Attendee 2
- Row A, Seat 4 → Attendee 3
- Row A, Seat 5 → SKIP (admin reserved)
- Row A, Seat 6 → Attendee 4
...
- Row B, Seat 1 → Attendee 48
...
```

## API Usage Examples

### 1. Trigger Seat Allocation

```bash
POST /api/allocations/allocate-seats
Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "message": "Seat allocation completed: 450 allocated, 0 failed",
  "data": {
    "allocated": 450,
    "failed": 0,
    "errors": []
  }
}
```

### 2. Get Attendee Seat

```bash
GET /api/allocations/210101001

Response:
{
  "success": true,
  "message": "Seat allocation retrieved successfully",
  "data": {
    "attendee": {
      "enrollmentId": "210101001",
      "name": "John Doe",
      "course": "Computer Science",
      "school": "Engineering",
      "degree": "B.Tech"
    },
    "allocation": {
      "enclosure": "A",
      "row": "B",
      "seat": 15
    },
    "enclosure": {
      "letter": "A",
      "name": "Main Hall",
      "entryDirection": "NORTH",
      "rows": [...]
    }
  }
}
```

### 3. View Statistics

```bash
GET /api/allocations/stats
Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "data": {
    "totalAttendees": 500,
    "totalAllocated": 450,
    "totalUnallocated": 50,
    "totalEnclosures": 4,
    "byCategory": {
      "A": 150,
      "B": 150,
      "C": 100,
      "D": 100
    },
    "enclosureStats": [
      {
        "letter": "A",
        "name": "Main Hall",
        "allocatedFor": "STUDENTS",
        "totalSeats": 200,
        "allocatedSeats": 150,
        "availableSeats": 50,
        "utilizationRate": 75.00
      }
    ]
  }
}
```

### 4. Clear Allocations (for re-running)

```bash
DELETE /api/allocations/clear
Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "message": "Cleared 450 seat allocations",
  "data": {
    "count": 450
  }
}
```

### 5. Search Attendees

```bash
GET /api/attendees/search?q=John
Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "message": "Found 3 attendee(s)",
  "data": {
    "results": [
      {
        "id": "...",
        "enrollmentId": "210101001",
        "name": "John Doe",
        "course": "Computer Science",
        "school": "Engineering",
        "degree": "B.Tech",
        "assignedEnclosure": "A",
        "allocation": {
          "row": "B",
          "seat": 15
        }
      }
    ]
  }
}
```

## Database Schema Used

### SeatAllocation Model
```prisma
model SeatAllocation {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  enclosureLetter String   // For easy querying
  rowLetter       String   // Row letter (A, B, C)
  seatNumber      Int      // Actual seat number
  allocatedAt     DateTime @default(now())

  enclosureId String    @db.ObjectId
  attendeeId  String    @unique @db.ObjectId

  @@unique([enclosureLetter, rowLetter, seatNumber]) // Prevent double allocation
  @@index([enclosureLetter, rowLetter])
}
```

### Key Relationships:
- `Attendee.allocation` → One-to-one with `SeatAllocation`
- `SeatAllocation.enclosure` → Many-to-one with `Enclosure`
- `SeatAllocation.attendee` → One-to-one with `Attendee`

## Testing the Implementation

### Manual Testing Steps:

1. **Setup Enclosures** (if not done in Phase 1)
   ```bash
   POST /api/enclosures
   {
     "letter": "A",
     "name": "Main Hall",
     "allocatedFor": "STUDENTS",
     "entryDirection": "NORTH",
     "displayOrder": 0,
     "rows": [
       { "letter": "A", "startSeat": 1, "endSeat": 50, "reservedSeats": "1,25,50", "displayOrder": 0 },
       { "letter": "B", "startSeat": 1, "endSeat": 50, "reservedSeats": "10,20", "displayOrder": 1 }
     ]
   }
   ```

2. **Create Test Attendees**
   ```bash
   # Upload attendees via Excel or create manually
   # Ensure they have assignedEnclosure set
   ```

3. **Reserve Some Seats** (optional)
   ```bash
   POST /api/admin/reserve-seats
   {
     "reservations": [
       { "enclosureLetter": "A", "rowLetter": "A", "seatNumber": 5, "reservedFor": "VIP" }
     ]
   }
   ```

4. **Run Allocation**
   ```bash
   POST /api/allocations/allocate-seats
   ```

5. **Verify Allocations**
   ```bash
   # Check specific attendee
   GET /api/allocations/210101001
   
   # Check statistics
   GET /api/allocations/stats
   
   # Check enclosure
   GET /api/allocations/enclosure/A
   ```

6. **Test Re-allocation**
   ```bash
   # Clear allocations
   DELETE /api/allocations/clear
   
   # Run again
   POST /api/allocations/allocate-seats
   ```

## Error Handling

The service handles various error scenarios:

1. **No Attendees to Allocate**: Returns success with 0 allocated
2. **Enclosure Not Found**: Throws error with specific message
3. **Not Enough Seats**: Logs warning, returns failed count with error details
4. **Database Errors**: Catches and logs, returns error response

## Performance Considerations

1. **Bulk Operations**: Uses `createMany` for efficient database writes
2. **Set Data Structures**: Fast O(1) lookups for reserved seats
3. **Single Query per Enclosure**: Minimizes database round trips
4. **Indexing**: Database indexes on `enclosureLetter`, `rowLetter` for fast queries

## Next Steps (Phase 3)

With Phase 2 complete, you can now move on to:

1. **Frontend Seat Visualization**: Theater-style seat map components
2. **Attendee Seat View Page**: Show students their assigned seats
3. **Admin Aerial View**: Visualize all allocations in an enclosure
4. **Mobile-Responsive UI**: Ensure works on all devices

## Files Created/Modified

### Created:
- ✅ `apps/api/src/services/seatAllocation.service.ts` (460 lines)
- ✅ `apps/api/src/controllers/allocation.controller.ts` (308 lines)
- ✅ `apps/api/src/routes/allocation.routes.ts` (80 lines)

### Modified:
- ✅ `apps/api/src/controllers/attendee.controller.ts` (added search method)
- ✅ `apps/api/src/services/attendee.service.ts` (added search method)
- ✅ `apps/api/src/routes/attendee.routes.ts` (added search route)
- ✅ `apps/api/src/routes/index.ts` (registered allocation routes)

## Summary

Phase 2 is now **100% complete**! The backend seat allocation algorithm is fully functional and ready for use. The system can:

- ✅ Automatically allocate seats to attendees based on their assigned enclosure
- ✅ Skip admin-reserved and row-reserved seats
- ✅ Handle multiple enclosures independently
- ✅ Provide comprehensive statistics and reporting
- ✅ Support re-allocation by clearing and re-running
- ✅ Search and retrieve seat allocations efficiently

You can now proceed with Phase 3 (Frontend) or test the current implementation thoroughly before moving forward.

---

**Phase 2 Status**: ✅ COMPLETED
**Next Phase**: Phase 3 - Frontend Theater-Style Seat View Components
**Estimated Time for Phase 3**: 7-10 days
