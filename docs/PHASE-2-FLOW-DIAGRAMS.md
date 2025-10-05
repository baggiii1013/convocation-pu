# Phase 2: Seat Allocation Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Admin Panel  │  │  Student App │  │   Staff App  │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          │ HTTP/REST API    │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Route Handlers                           │  │
│  │  POST /allocations/allocate-seats  (Admin)              │  │
│  │  GET  /allocations/:enrollmentId   (Public)             │  │
│  │  GET  /allocations/stats           (Admin/Staff)        │  │
│  │  GET  /allocations/enclosure/:id   (Admin/Staff)        │  │
│  │  DELETE /allocations/clear         (Admin)              │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼─────────────────────────────────────┐  │
│  │              Allocation Controller                        │  │
│  │  • Validate requests                                     │  │
│  │  • Authenticate users                                    │  │
│  │  • Authorize actions                                     │  │
│  │  • Call service methods                                  │  │
│  │  • Format responses                                      │  │
│  └────────────────────┬─────────────────────────────────────┘  │
└────────────────────────┼──────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           SeatAllocationService                           │  │
│  │                                                           │  │
│  │  Main Methods:                                           │  │
│  │  • allocateSeats()          ← Main algorithm            │  │
│  │  • getTotalSeats()          ← Calculate capacity        │  │
│  │  • getAllocationStats()     ← Generate reports          │  │
│  │  • clearAllAllocations()    ← Reset system             │  │
│  │  • getAttendeeAllocation()  ← Lookup specific seat     │  │
│  │                                                           │  │
│  │  Helper Methods:                                         │  │
│  │  • groupByEnclosure()       ← Group attendees           │  │
│  │  • allocateForEnclosure()   ← Per-enclosure logic      │  │
│  │  • parseReservedSeats()     ← Parse reservations       │  │
│  └────────────────────┬─────────────────────────────────────┘  │
└────────────────────────┼──────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER (MongoDB)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Attendee    │  │  Enclosure   │  │     Row      │         │
│  │  Collection  │  │  Collection  │  │  Collection  │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                  │                  │
│  ┌──────▼─────────────────▼──────────────────▼───────────┐    │
│  │              SeatAllocation Collection                 │    │
│  │  • enclosureLetter, rowLetter, seatNumber             │    │
│  │  • attendeeId (unique)                                │    │
│  │  • Indexes: (enclosure+row), (enclosure+row+seat)    │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            SeatReservation Collection                     │  │
│  │  • Admin-reserved seats                                  │  │
│  │  • Unique constraint: (enclosure+row+seat)              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Complete Algorithm Flow

This diagram shows the complete step-by-step flow of the seat allocation algorithm with all decision points and operations.

```
START
  ↓
[Admin triggers POST /api/allocations/allocate-seats]
  ↓
┌────────────────────────────────────────┐
│ 1. Fetch Eligible Attendees            │
│ ───────────────────────────────────── │
│ Query Attendee collection WHERE:       │
│  • assignedEnclosure != null           │
│  • allocation == null                  │
│  • convocationEligible == true         │
│  • convocationRegistered == true       │
└───────────────┬────────────────────────┘
                ↓
         ┌──────────────┐
         │ Attendees > 0?│
         └──┬─────────┬──┘
      Yes   │         │ No
            ↓         └──→ [Return: 0 allocated, 0 failed]
┌────────────────────────────────────────┐
│ 2. Group Attendees by Enclosure        │
│ ───────────────────────────────────── │
│ Create Map:                            │
│  {                                     │
│    "A": [att1, att2, ...],            │
│    "B": [att50, att51, ...],          │
│    "C": [att100, ...]                 │
│  }                                     │
└───────────────┬────────────────────────┘
                ↓
        [For Each Enclosure]
                ↓
┌────────────────────────────────────────┐
│ 3. Load Enclosure Configuration        │
│ ───────────────────────────────────── │
│ FROM: Enclosure + Row collections      │
│  • Get all rows (ordered by display)  │
│  • startSeat, endSeat per row          │
│  • reservedSeats (comma-separated)     │
│  • entryDirection                      │
└───────────────┬────────────────────────┘
                ↓
       ┌─────────────────┐
       │ Enclosure exists?│
       └──┬──────────┬────┘
     Yes  │          │ No
          ↓          └──→ [Throw Error: Enclosure not found]
┌────────────────────────────────────────┐
│ 4. Load Admin Reservations             │
│ ───────────────────────────────────── │
│ FROM: SeatReservation collection       │
│ WHERE: enclosureLetter == current      │
│ Build Set: {"A-5", "B-10", "A-15"}    │
│ Log: "Admin reserved X seats"          │
└───────────────┬────────────────────────┘
                ↓
┌────────────────────────────────────────┐
│ 5. Load Existing Allocations           │
│ ───────────────────────────────────── │
│ FROM: SeatAllocation collection        │
│ WHERE: enclosureLetter == current      │
│ Build Set: {"A-1", "A-2", "B-3"}      │
└───────────────┬────────────────────────┘
                ↓
    [Initialize: attendeeIndex = 0]
    [Initialize: allocations = []]
                ↓
        [For Each Row in Enclosure]
                ↓
┌────────────────────────────────────────┐
│ 6. Parse Row Reserved Seats            │
│ ───────────────────────────────────── │
│ Input: "1,5,10"                        │
│ Output: [1, 5, 10]                     │
│ Build Set: {1, 5, 10}                  │
└───────────────┬────────────────────────┘
                ↓
    [For seat = startSeat to endSeat]
                ↓
┌────────────────────────────────────────┐
│ 7. Check Seat Availability             │
│ ───────────────────────────────────── │
│ seatKey = "RowLetter-seatNumber"       │
│                                        │
│ IF seat in adminReservedSet:           │
│   → Log: "Skip admin-reserved"         │
│   → CONTINUE to next seat              │
│                                        │
│ IF seat in rowReservedSet:             │
│   → Log: "Skip row-reserved"           │
│   → CONTINUE to next seat              │
│                                        │
│ IF seat in allocatedSet:               │
│   → Log: "Skip already-allocated"      │
│   → CONTINUE to next seat              │
│                                        │
│ IF attendeeIndex >= attendees.length:  │
│   → BREAK (no more attendees)          │
└───────────────┬────────────────────────┘
                ↓ (Seat is available!)
┌────────────────────────────────────────┐
│ 8. Assign Seat to Next Attendee        │
│ ───────────────────────────────────── │
│ attendee = attendees[attendeeIndex]    │
│ allocation = {                         │
│   enclosureId: enclosure.id,           │
│   enclosureLetter: enclosure.letter,   │
│   rowLetter: row.letter,               │
│   seatNumber: seat,                    │
│   attendeeId: attendee.id              │
│ }                                      │
│ allocations.push(allocation)           │
│ Log: "Allocated seat X to attendee Y"  │
│ attendeeIndex++                        │
└───────────────┬────────────────────────┘
                ↓
        [Next Seat]
                ↓
        [Next Row]
                ↓
    [All Rows Processed]
                ↓
┌────────────────────────────────────────┐
│ 9. Bulk Insert to Database             │
│ ───────────────────────────────────── │
│ IF allocations.length > 0:             │
│   SeatAllocation.createMany({          │
│     data: allocations                  │
│   })                                   │
│ Log: "Created X allocations"           │
└───────────────┬────────────────────────┘
                ↓
┌────────────────────────────────────────┐
│ 10. Check for Unallocated Attendees   │
│ ───────────────────────────────────── │
│ IF attendeeIndex < attendees.length:   │
│   unallocated = length - attendeeIndex │
│   Log: "Could not allocate X"          │
│   Add to errors array                  │
│   failed = unallocated                 │
│ ELSE:                                  │
│   failed = 0                           │
└───────────────┬────────────────────────┘
                ↓
        [Next Enclosure]
                ↓
    [All Enclosures Processed]
                ↓
┌────────────────────────────────────────┐
│ 11. Return Results                     │
│ ───────────────────────────────────── │
│ {                                      │
│   success: failed == 0,                │
│   allocated: totalAllocated,           │
│   failed: totalFailed,                 │
│   errors: [                            │
│     {                                  │
│       attendeeId: "...",               │
│       error: "Not enough seats"        │
│     }                                  │
│   ]                                    │
│ }                                      │
└───────────────┬────────────────────────┘
                ↓
              END
```

---

## Data Flow Example

### Scenario: Allocate 35 Attendees to Enclosure A

```
INPUT CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Attendees to Allocate: 35
  • enrollmentIds: 210101001 - 210101035
  • All assigned to Enclosure A
  • All eligible and registered
  • No existing allocations

Enclosure A:
  Row A: Seats 1-20
    • Reserved: "1,10,20" (3 seats)
    • Available: 17 seats
  Row B: Seats 1-20
    • Reserved: "5,15" (2 seats)
    • Available: 18 seats
  
  Total Physical Seats: 40
  Row-Reserved: 5
  Net Available: 35 seats

Admin Reservations:
  • A-5 (reserved for VIP)
  • B-10 (reserved for Special Guest)
  Total: 2 seats

EFFECTIVE AVAILABLE: 40 - 5 (row) - 2 (admin) = 33 seats

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROCESSING FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ROW A (Seats 1-20):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Seat 1:  ⊗ SKIP (row-reserved: in config "1,10,20")
Seat 2:  ✓ ASSIGN to Attendee #1 (210101001)
Seat 3:  ✓ ASSIGN to Attendee #2 (210101002)
Seat 4:  ✓ ASSIGN to Attendee #3 (210101003)
Seat 5:  ⊗ SKIP (admin-reserved: A-5 in reservations)
Seat 6:  ✓ ASSIGN to Attendee #4 (210101004)
Seat 7:  ✓ ASSIGN to Attendee #5 (210101005)
Seat 8:  ✓ ASSIGN to Attendee #6 (210101006)
Seat 9:  ✓ ASSIGN to Attendee #7 (210101007)
Seat 10: ⊗ SKIP (row-reserved: in config "1,10,20")
Seat 11: ✓ ASSIGN to Attendee #8 (210101008)
Seat 12: ✓ ASSIGN to Attendee #9 (210101009)
Seat 13: ✓ ASSIGN to Attendee #10 (210101010)
Seat 14: ✓ ASSIGN to Attendee #11 (210101011)
Seat 15: ✓ ASSIGN to Attendee #12 (210101012)
Seat 16: ✓ ASSIGN to Attendee #13 (210101013)
Seat 17: ✓ ASSIGN to Attendee #14 (210101014)
Seat 18: ✓ ASSIGN to Attendee #15 (210101015)
Seat 19: ✓ ASSIGN to Attendee #16 (210101016)
Seat 20: ⊗ SKIP (row-reserved: in config "1,10,20")

ROW A SUMMARY: 16 seats allocated, 4 skipped

ROW B (Seats 1-20):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Seat 1:  ✓ ASSIGN to Attendee #17 (210101017)
Seat 2:  ✓ ASSIGN to Attendee #18 (210101018)
Seat 3:  ✓ ASSIGN to Attendee #19 (210101019)
Seat 4:  ✓ ASSIGN to Attendee #20 (210101020)
Seat 5:  ⊗ SKIP (row-reserved: in config "5,15")
Seat 6:  ✓ ASSIGN to Attendee #21 (210101021)
Seat 7:  ✓ ASSIGN to Attendee #22 (210101022)
Seat 8:  ✓ ASSIGN to Attendee #23 (210101023)
Seat 9:  ✓ ASSIGN to Attendee #24 (210101024)
Seat 10: ⊗ SKIP (admin-reserved: B-10 in reservations)
Seat 11: ✓ ASSIGN to Attendee #25 (210101025)
Seat 12: ✓ ASSIGN to Attendee #26 (210101026)
Seat 13: ✓ ASSIGN to Attendee #27 (210101027)
Seat 14: ✓ ASSIGN to Attendee #28 (210101028)
Seat 15: ⊗ SKIP (row-reserved: in config "5,15")
Seat 16: ✓ ASSIGN to Attendee #29 (210101029)
Seat 17: ✓ ASSIGN to Attendee #30 (210101030)
Seat 18: ✓ ASSIGN to Attendee #31 (210101031)
Seat 19: ✓ ASSIGN to Attendee #32 (210101032)
Seat 20: ✓ ASSIGN to Attendee #33 (210101033)

ROW B SUMMARY: 17 seats allocated, 3 skipped

TOTAL ALLOCATED: 33 attendees (16 + 17)
REMAINING UNALLOCATED: 2 attendees (210101034, 210101035)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DATABASE OPERATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Bulk Insert (SeatAllocation.createMany):
   Creates 33 records:
   {
     enclosureId: "...",
     enclosureLetter: "A",
     rowLetter: "A" or "B",
     seatNumber: 2-19 (various),
     attendeeId: "..." (unique)
   }

2. Database Constraints Enforced:
   ✓ Unique (enclosureLetter, rowLetter, seatNumber)
   ✓ Unique (attendeeId)
   ✓ Foreign keys validated

3. Transaction Complete: Committed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OUTPUT RESPONSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HTTP 200 OK
{
  "success": false,
  "message": "Seat allocation completed: 33 allocated, 2 failed",
  "data": {
    "allocated": 33,
    "failed": 2,
    "errors": [
      {
        "attendeeId": "210101034",
        "error": "Not enough available seats in enclosure"
      },
      {
        "attendeeId": "210101035",
        "error": "Not enough available seats in enclosure"
      }
    ]
  }
}

LOGS:
[INFO] Starting seat allocation process...
[INFO] Found 35 attendees to allocate
[INFO] Admin reserved 2 seats in enclosure A
[INFO] Allocating 35 seats in enclosure A
[DEBUG] Skipping admin-reserved seat: A-5
[DEBUG] Skipping row-reserved seat: A-1
[DEBUG] Allocated seat A-2 to 210101001 (Student Name)
... (33 allocations logged)
[INFO] Successfully created 33 seat allocations in enclosure A
[WARN] Could not allocate 2 attendees in enclosure A - not enough seats
[INFO] Allocation complete: 33 allocated, 2 failed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

This comprehensive flow diagram documentation provides visual understanding of the complete seat allocation system at every level of detail.
