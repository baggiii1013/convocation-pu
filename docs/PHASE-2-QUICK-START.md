# Phase 2 Quick Start Guide

## Testing the Seat Allocation System

This guide will help you quickly test the Phase 2 seat allocation implementation.

## Prerequisites

1. MongoDB running and connected
2. API server running (`bun run dev` in `apps/api`)
3. At least one enclosure created (Phase 1)
4. Some attendees in the database with `assignedEnclosure` field set

## Quick Test Steps

### Step 1: Verify Setup

```bash
# Check API health
curl http://localhost:3000/api/health

# Check enclosures exist
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:3000/api/enclosures
```

### Step 2: Create Test Data (if needed)

#### Create an Enclosure
```bash
curl -X POST http://localhost:3000/api/enclosures \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "letter": "A",
    "name": "Main Hall",
    "allocatedFor": "STUDENTS",
    "entryDirection": "NORTH",
    "displayOrder": 0,
    "rows": [
      {
        "letter": "A",
        "startSeat": 1,
        "endSeat": 20,
        "reservedSeats": "1,10,20",
        "displayOrder": 0
      },
      {
        "letter": "B",
        "startSeat": 1,
        "endSeat": 20,
        "reservedSeats": "5,15",
        "displayOrder": 1
      }
    ]
  }'
```

#### Create Test Attendees
```bash
# You can upload via Excel or create manually via Prisma Studio
# Make sure they have:
# - enrollmentId
# - name
# - assignedEnclosure: "A"
# - convocationEligible: true
# - convocationRegistered: true
```

### Step 3: Reserve Some Seats (Optional)

```bash
curl -X POST http://localhost:3000/api/admin/reserve-seats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reservations": [
      {
        "enclosureLetter": "A",
        "rowLetter": "A",
        "seatNumber": 5,
        "reservedFor": "VIP Guest",
        "reservedBy": "admin@example.com"
      },
      {
        "enclosureLetter": "A",
        "rowLetter": "B",
        "seatNumber": 10,
        "reservedFor": "Special Guest",
        "reservedBy": "admin@example.com"
      }
    ]
  }'
```

### Step 4: Run Seat Allocation

```bash
curl -X POST http://localhost:3000/api/allocations/allocate-seats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Seat allocation completed: 35 allocated, 0 failed",
  "data": {
    "allocated": 35,
    "failed": 0,
    "errors": []
  }
}
```

### Step 5: Verify Allocations

#### Check Specific Attendee
```bash
curl http://localhost:3000/api/allocations/210101001
```

**Expected Response:**
```json
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
      "row": "A",
      "seat": 2
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

#### Check Statistics
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:3000/api/allocations/stats
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalAttendees": 35,
    "totalAllocated": 35,
    "totalUnallocated": 0,
    "totalEnclosures": 1,
    "byCategory": {
      "A": 35
    },
    "enclosureStats": [
      {
        "letter": "A",
        "name": "Main Hall",
        "allocatedFor": "STUDENTS",
        "totalSeats": 40,
        "allocatedSeats": 35,
        "availableSeats": 5,
        "utilizationRate": 87.50
      }
    ]
  }
}
```

#### Check Enclosure View
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  http://localhost:3000/api/allocations/enclosure/A
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Enclosure allocations retrieved successfully",
  "data": {
    "enclosure": {
      "letter": "A",
      "name": "Main Hall",
      "allocatedFor": "STUDENTS",
      "entryDirection": "NORTH"
    },
    "rows": [
      {
        "row": "A",
        "startSeat": 1,
        "endSeat": 20,
        "totalSeats": 20,
        "allocatedSeats": 17,
        "attendees": [
          {
            "enrollmentId": "210101001",
            "name": "John Doe",
            "course": "Computer Science",
            "school": "Engineering",
            "degree": "B.Tech",
            "seat": 2
          },
          ...
        ]
      },
      {
        "row": "B",
        "startSeat": 1,
        "endSeat": 20,
        "totalSeats": 20,
        "allocatedSeats": 18,
        "attendees": [...]
      }
    ],
    "totalAllocations": 35
  }
}
```

### Step 6: Test Search
```bash
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "http://localhost:3000/api/attendees/search?q=John"
```

### Step 7: Test Re-allocation

```bash
# Clear all allocations
curl -X DELETE http://localhost:3000/api/allocations/clear \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Run allocation again
curl -X POST http://localhost:3000/api/allocations/allocate-seats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Verification Checklist

- [ ] Enclosures created successfully
- [ ] Attendees have assigned enclosures
- [ ] Admin reservations recorded (if any)
- [ ] Seat allocation runs without errors
- [ ] Allocated seats skip reserved seats (check specific seat numbers)
- [ ] Statistics show correct counts
- [ ] Enclosure view shows all attendees
- [ ] Individual attendee lookup works
- [ ] Search functionality works
- [ ] Re-allocation (clear + allocate) works

## Common Issues

### Issue: "No attendees to allocate"
**Solution**: Ensure attendees have:
- `assignedEnclosure` field set
- `convocationEligible: true`
- `convocationRegistered: true`
- No existing allocation

### Issue: "Not enough seats"
**Solution**: 
- Check reserved seats in enclosure rows
- Check admin reservations
- Calculate: Total seats - Row reserved - Admin reserved = Available
- Ensure Available >= Number of attendees

### Issue: "Enclosure not found"
**Solution**: Create enclosure first using Phase 1 API

### Issue: Seats are allocated to reserved positions
**Solution**: This shouldn't happen! Check:
- Reserved seats format in row: "1,5,10" (comma-separated)
- Admin reservations are created before allocation
- Check logs for "Skipping admin-reserved seat" messages

## Database Verification

Use Prisma Studio or MongoDB Compass to verify:

```bash
# In apps/api directory
npx prisma studio
```

1. Check `seat_allocations` collection:
   - Records exist after allocation
   - `enclosureLetter`, `rowLetter`, `seatNumber` are correct
   - No duplicate seat allocations

2. Check `seat_reservations` collection:
   - Admin reservations are stored
   - Reservation details are correct

3. Check `attendees` collection:
   - All have `assignedEnclosure` field
   - Linked to allocations via `allocation` relation

## Logs to Monitor

When running allocation, watch for these log messages:

```
Starting seat allocation process...
Found X attendees to allocate
Admin reserved Y seats in enclosure A
Allocating Z seats in enclosure A
Skipping admin-reserved seat: A-5
Skipping row-reserved seat: A-1
Allocated seat A-2 to 210101001 (John Doe)
Successfully created N seat allocations in enclosure A
Allocation complete: N allocated, 0 failed
```

## Next Steps

Once you've verified Phase 2 works correctly:

1. **Test with realistic data**: Upload 100-500 attendees
2. **Test multiple enclosures**: Create enclosures B, C, D
3. **Test edge cases**: More attendees than seats, all seats reserved
4. **Performance test**: Time the allocation for 1000+ attendees
5. **Move to Phase 3**: Start building the frontend visualization

## Support

If you encounter issues:
1. Check the logs in the terminal where the API is running
2. Verify database state using Prisma Studio
3. Review the implementation documentation
4. Check the API response error messages

---

**Happy Testing! 🚀**
