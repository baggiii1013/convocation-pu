# Seat Assignment System - Quick Start Guide

## Overview

This guide provides a quick reference for implementing the automatic seat assignment system with theater-style visualization. **Note**: Enclosures are managed by admins through the frontend UI, not uploaded via CSV. CSV uploads only contain attendee data with their assigned enclosure letter.

---

## 📋 Prerequisites

- [x] Node.js/Bun environment
- [x] MongoDB database
- [x] Prisma ORM setup
- [x] Next.js frontend
- [x] Basic understanding of the reference repo: https://github.com/mussiii1013/pu-convocation

---

## 🚀 Quick Implementation Steps

### Step 1: Database Schema & Admin Enclosure Management (Day 1-4)

**Part A: Update Database Schema**

```bash
# Edit apps/api/prisma/schema.prisma
# Add/update: Enclosure, Row, SeatAllocation models
# Note: Column model removed - not needed

# Generate Prisma client
cd apps/api
bun run db:generate

# Push to database
bun run db:push
```

**Key Schema Changes:**
- Add `Enclosure` model with `displayOrder`, `totalSeats`, `isActive` fields
- Add `Row` model with `displayOrder` for UI ordering
- Remove `Column` model (not needed)
- Update `SeatAllocation` with indexes for performance
- Add `assignedEnclosure` field to Attendee model

**Part B: Build Admin Enclosure Management UI**

```typescript
// apps/api/src/controllers/enclosure.controller.ts
// CRUD API for enclosures:
// - GET /api/enclosures (list with calculated totalSeats)
// - POST /api/enclosures (create with rows)
// - PUT /api/enclosures/:letter (update, replace rows)
// - DELETE /api/enclosures/:letter (check allocations first)

// apps/web/src/app/admin/enclosures/page.tsx
// Admin UI with:
// - Grid view of all enclosures
// - Add/Edit/Delete operations
// - Row management within each enclosure
// - Drag-drop display order (future enhancement)
// - Validation (prevent deletion if allocations exist)
```

### Step 2: Create Seat Allocation Service (Day 5-9)

```typescript
// apps/api/src/services/seatAllocation.service.ts
// Implement the algorithm from the main plan document
```

**Core Algorithm:**
1. Group attendees by assigned enclosure letter
2. For each enclosure:
   - Get rows configuration (ordered by displayOrder)
   - Skip reserved seats
   - Allocate sequentially row by row
   - Create SeatAllocation records

### Step 3: Build Upload & Allocation API (Day 10-11)

```typescript
// apps/api/src/controllers/attendee.controller.ts
// POST /api/attendees/upload - CSV upload (attendees only)
// POST /api/attendees/allocate-seats - Trigger allocation
// GET /api/attendees/:id/seat - Get seat info
// GET /api/attendees/search?q=<query> - Search functionality
```

**CSV Format Required** (attendees only, NOT enclosures):
```csv
enrollmentId,name,course,school,degree,email,enclosure
210101001,John Doe,Computer Science,Engineering,B.Tech,john@example.com,A
```

**Important**: The `enclosure` column refers to an enclosure letter that must already exist in the database (created by admin via UI).

### Step 4: Create Theater Seat Components (Day 12-18)

```typescript
// apps/web/src/components/attendee/
// - Seat.tsx (SVG theater seat)
// - TheaterSeatMap.tsx (seat map with rows)
// - VenueMap.tsx (enclosure selector)
```

**Key Features:**
- Theater-style seat SVG (rounded top)
- Color coding: Red (selected), Yellow (reserved), Gray (available)
- Auto-scroll to user's seat
- Responsive design

### Step 5: Build Attendee Page (Day 19-21)

```typescript
// apps/web/src/app/attendee/[enrollmentId]/page.tsx
```

**Layout:**
- Left: Venue map (enclosure selector)
- Right: Student details + seat assignment
- Bottom: Interactive theater seat map

### Step 6: Admin Dashboard - Aerial View & Analytics (Day 22-25)

```typescript
// apps/web/src/app/admin/
// - dashboard/page.tsx (statistics & utilization metrics)
// - aerial-view/page.tsx (view all allocations by enclosure/row)
// - search/page.tsx (search attendees and their seats)

// apps/api/src/controllers/allocation.controller.ts
// - GET /api/allocations/stats (aggregated statistics)
```

**Features:**
- Statistics dashboard with allocation metrics
- Enclosure utilization rates with progress bars
- Aerial view showing all allocated seats by enclosure
- Row-by-row attendee listings
- Search functionality to find attendees

**Note**: Enclosure management UI was already built in Step 1.

### Step 7: Testing & Deployment (Day 26-32)

- Unit tests for allocation algorithm
- Integration tests for APIs
- Frontend component tests
- Performance optimization
- Documentation

---

## 📁 Project Structure

```
convocation-pu/
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   │   └── schema.prisma          # ✏️ Update models
│   │   ├── src/
│   │   │   ├── services/
│   │   │   │   └── seatAllocation.service.ts  # 🆕 Core algorithm
│   │   │   ├── controllers/
│   │   │   │   └── attendee.controller.ts     # 🆕 API endpoints
│   │   │   └── routes/
│   │   │       └── attendee.routes.ts          # 🆕 Route definitions
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   │   ├── attendee/
│       │   │   │   └── [enrollmentId]/
│       │   │   │       └── page.tsx            # 🆕 Student seat view
│       │   │   └── admin/
│       │   │       ├── enclosures/
│       │   │       │   └── page.tsx            # 🆕 Enclosure management
│       │   │       └── aerial-view/
│       │   │           └── page.tsx            # 🆕 Aerial view
│       │   └── components/
│       │       └── attendee/
│       │           ├── Seat.tsx                # 🆕 Theater seat component
│       │           ├── TheaterSeatMap.tsx      # 🆕 Seat map
│       │           └── VenueMap.tsx            # 🆕 Venue selector
└── docs/
    ├── SEAT-ASSIGNMENT-IMPLEMENTATION-PLAN.md  # 📄 Full plan
    └── SEAT-ASSIGNMENT-QUICK-START.md          # 📄 This file
```

---

## 🎯 Key Components

### 1. Seat Allocation Algorithm (Backend)

```typescript
// Simplified flow
async function allocateSeats(attendees) {
  // 1. Group by enclosure
  const grouped = groupByEnclosure(attendees);
  
  // 2. For each enclosure
  for (const [enclosure, attendeeList] of Object.entries(grouped)) {
    const rows = await getEnclosureRows(enclosure);
    
    let attendeeIndex = 0;
    
    // 3. For each row
    for (const row of rows) {
      const reserved = parseReservedSeats(row.reserved);
      
      // 4. For each seat in row
      for (let seatNum = row.start; seatNum <= row.end; seatNum++) {
        if (reserved.includes(seatNum)) continue; // Skip reserved
        
        // 5. Assign seat
        await createSeatAllocation({
          attendeeId: attendeeList[attendeeIndex].id,
          enclosure,
          row: row.letter,
          seatNumber: seatNum
        });
        
        attendeeIndex++;
        if (attendeeIndex >= attendeeList.length) break;
      }
      
      if (attendeeIndex >= attendeeList.length) break;
    }
  }
}
```

### 2. Seat Component (Frontend)

```tsx
<Seat
  number={15}
  isSelected={true}      // Red color
  isReserved={false}     // Yellow color
  isInActiveRow={true}   // Gray background
/>
```

### 3. Theater Seat Map

```tsx
<TheaterSeatMap
  enclosure={{
    letter: 'A',
    entryDirection: 'NORTH',
    rows: [
      { letter: 'A', startSeat: 1, endSeat: 50, reserved: '1,25,50' },
      { letter: 'B', startSeat: 1, endSeat: 50, reserved: '10,20' }
    ]
  }}
  allocation={{
    row: 'B',
    seat: 15
  }}
/>
```

---

## 🔑 Critical Features

### Must-Have (MVP)
- ✅ Automatic seat allocation on CSV upload
- ✅ Reserved seat handling
- ✅ Theater-style seat visualization
- ✅ Student seat lookup by enrollment ID
- ✅ Mobile-responsive design

### Nice-to-Have (Post-MVP)
- 🔜 QR code ticket generation
- 🔜 Email notifications
- 🔜 Seat swap requests
- 🔜 Analytics dashboard
- 🔜 3D venue visualization

---

## 📝 Sample Data

### Enclosure Configuration

```json
{
  "letter": "A",
  "allocatedFor": "STUDENTS",
  "entryDirection": "NORTH",
  "rows": [
    { "letter": "A", "start": 1, "end": 50, "reserved": "1,25,50" },
    { "letter": "B", "start": 1, "end": 50, "reserved": "10,20" },
    { "letter": "C", "start": 1, "end": 50, "reserved": "" }
  ]
}
```

### CSV Upload Format

```csv
enrollmentId,name,course,school,degree,email,phone,enclosure
210101001,John Doe,Computer Science,Engineering,B.Tech,john@example.com,9876543210,A
210101002,Jane Smith,Mechanical,Engineering,B.Tech,jane@example.com,9876543211,A
210201001,Bob Johnson,MBA,Management,MBA,bob@example.com,9876543212,B
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Seats Double-Allocated
**Solution**: Add unique constraint in schema
```prisma
@@unique([enclosureId, row, seatNumber])
```

### Issue 2: Reserved Seats Not Skipped
**Solution**: Check reserved parsing logic
```typescript
const reserved = row.reserved
  .split(',')
  .map(s => parseInt(s.trim()))
  .filter(n => !isNaN(n));
```

### Issue 3: Seat Map Not Auto-scrolling
**Solution**: Add useEffect with scrollIntoView
```typescript
useEffect(() => {
  activeSeatRef.current?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center'
  });
}, []);
```

### Issue 4: Performance Issues with Large Data
**Solution**: 
- Add database indexes
- Implement pagination
- Use Redis caching

---

## 🧪 Testing Checklist

### Backend Tests
- [ ] Seat allocation algorithm with various scenarios
- [ ] Reserved seat handling
- [ ] Multiple enclosures
- [ ] Edge cases (more attendees than seats)
- [ ] CSV parsing and validation

### Frontend Tests
- [ ] Seat component renders correctly
- [ ] Selected seat styles applied
- [ ] Seat map auto-scrolls to active seat
- [ ] Venue map changes enclosure
- [ ] Mobile responsive behavior

### Integration Tests
- [ ] Upload CSV → Seats allocated
- [ ] Get attendee seat → Correct data returned
- [ ] Enclosure API → Filtered attendees

---

## 📊 Success Metrics

- ⏱️ Allocation time: < 30 seconds for 1000 attendees
- 🎯 Accuracy: 100% correct seat assignments
- 📱 Mobile score: > 90 (Lighthouse)
- 🐛 Test coverage: > 90% on critical paths
- 👥 User satisfaction: Intuitive UI for seat finding

---

## 🚦 Go-Live Checklist

### Pre-Deployment
- [ ] Database migrations applied
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database indexes created
- [ ] Error tracking setup (Sentry)
- [ ] Backup strategy in place

### Post-Deployment
- [ ] Smoke tests on production
- [ ] Monitor error rates
- [ ] Check allocation performance
- [ ] Verify mobile responsiveness
- [ ] Collect user feedback

---

## 📚 Resources

### Reference Implementation
- **Repository**: https://github.com/mussiii1013/pu-convocation
- **Key Files**:
  - `backend/jobs/attendee-job/src/index.ts` - Allocation algorithm
  - `frontend/websites/puconvocation-com/src/components/attendee/seat_map.tsx` - Seat map
  - `frontend/websites/puconvocation-com/src/components/attendee/seat.tsx` - Seat component

### Inspiration
- **District.in**: Theater booking UI (seat visualization style)

### Documentation
- Full implementation plan: `docs/SEAT-ASSIGNMENT-IMPLEMENTATION-PLAN.md`
- Database schema: `apps/api/prisma/schema.prisma`

---

## 🎓 Learning Path

If you're new to any of these concepts:

1. **Prisma ORM**: https://www.prisma.io/docs
2. **Next.js App Router**: https://nextjs.org/docs
3. **Theater Seat Layouts**: Study District.in, BookMyShow
4. **SVG Manipulation**: MDN Web Docs
5. **Seat Allocation Algorithms**: First-fit, Best-fit strategies

---

## 💡 Tips

1. **Start Simple**: Begin with one enclosure, then scale
2. **Test Early**: Test allocation with small datasets first
3. **Use Seeders**: Create seed data for development
4. **Mobile First**: Design for mobile, enhance for desktop
5. **Cache Aggressively**: Enclosure configs rarely change
6. **Monitor Performance**: Use React DevTools, Lighthouse

---

## 🤝 Need Help?

1. Review the full implementation plan
2. Check reference repository code
3. Test each component in isolation
4. Use console.log liberally during development
5. Ask specific questions with error messages

---

**Ready to start? Begin with Phase 1: Database Schema!** 🚀

---

*Last Updated: January 2025*  
*Version: 1.0*
