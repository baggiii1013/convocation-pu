# Phase 3 Quick Start Guide

## 🎉 Implementation Complete!

All Phase 3 components have been successfully implemented. Here's how to use them.

---

## 📁 Files Created

### Components (`apps/web/src/components/attendee/`)
- `Seat.tsx` - Theater-style seat icon
- `TheaterSeatMap.tsx` - Interactive seat map
- `VenueMap.tsx` - Enclosure grid selector
- `VenueMapWrapper.tsx` - Interactive wrapper
- `index.ts` - Export barrel
- `README.md` - Component documentation

### Pages (`apps/web/src/app/attendee/[enrollmentId]/`)
- `page.tsx` - Main attendee seat page
- `loading.tsx` - Loading skeleton
- `not-found.tsx` - Error page

### Documentation (`docs/`)
- `PHASE-3-IMPLEMENTATION-SUMMARY.md` - Complete summary
- `PHASE-3-QUICK-START.md` - This file

---

## 🚀 How to Use

### 1. Set Environment Variable

Add to your `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Access the Page

Navigate to:
```
http://localhost:3000/attendee/[ENROLLMENT_ID]
```

Example:
```
http://localhost:3000/attendee/210101001
```

### 3. API Requirements

The page expects these endpoints:

**GET `/api/attendees/:enrollmentId/seat`**
```json
{
  "attendee": {
    "name": "John Doe",
    "enrollmentId": "210101001",
    "course": "Computer Science",
    "school": "Engineering"
  },
  "allocation": {
    "enclosureLetter": "A",
    "rowLetter": "B",
    "seatNumber": 15
  },
  "enclosureMetadata": {
    "letter": "A",
    "entryDirection": "NORTH",
    "rows": [
      {
        "letter": "A",
        "startSeat": 1,
        "endSeat": 50,
        "reservedSeats": "1,25,50"
      },
      {
        "letter": "B",
        "startSeat": 1,
        "endSeat": 50,
        "reservedSeats": "10,20"
      }
    ]
  }
}
```

**GET `/api/enclosures`**
```json
[
  {
    "letter": "A",
    "name": "North Wing",
    "allocatedFor": "STUDENTS"
  },
  {
    "letter": "B",
    "name": "South Wing",
    "allocatedFor": "FACULTY"
  }
]
```

---

## 🧪 Testing Without Backend

### Option 1: Mock API with MSW

Install Mock Service Worker:
```bash
npm install msw --save-dev
```

Create mock handlers in `apps/web/src/mocks/handlers.ts`:
```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/attendees/:enrollmentId/seat', ({ params }) => {
    return HttpResponse.json({
      attendee: {
        name: "Test Student",
        enrollmentId: params.enrollmentId,
        course: "Computer Science",
        school: "Engineering"
      },
      allocation: {
        enclosureLetter: "A",
        rowLetter: "B",
        seatNumber: 15
      },
      enclosureMetadata: {
        letter: "A",
        entryDirection: "NORTH",
        rows: [
          { letter: "A", startSeat: 1, endSeat: 50, reservedSeats: "1,25,50" },
          { letter: "B", startSeat: 1, endSeat: 50, reservedSeats: "10,20" },
          { letter: "C", startSeat: 1, endSeat: 50, reservedSeats: "" },
          { letter: "D", startSeat: 1, endSeat: 50, reservedSeats: "5,15,30" }
        ]
      }
    });
  }),

  http.get('/api/enclosures', () => {
    return HttpResponse.json([
      { letter: "A", name: "North Wing", allocatedFor: "STUDENTS" },
      { letter: "B", name: "South Wing", allocatedFor: "FACULTY" },
      { letter: "C", name: "East Wing", allocatedFor: "VIP" },
      { letter: "D", name: "West Wing", allocatedFor: "GUESTS" }
    ]);
  })
];
```

### Option 2: Local JSON Files

Create `public/mock-data/seat-allocation.json`:
```json
{
  "attendee": {
    "name": "Test Student",
    "enrollmentId": "TEST001",
    "course": "Computer Science",
    "school": "Engineering"
  },
  "allocation": {
    "enclosureLetter": "A",
    "rowLetter": "B",
    "seatNumber": 15
  },
  "enclosureMetadata": {
    "letter": "A",
    "entryDirection": "NORTH",
    "rows": [
      { "letter": "A", "startSeat": 1, "endSeat": 50, "reservedSeats": "1,25,50" },
      { "letter": "B", "startSeat": 1, "endSeat": 50, "reservedSeats": "10,20" }
    ]
  }
}
```

Then modify the page to fetch from local file during development.

---

## 🎨 Customization

### Colors

Edit `Seat.tsx` to change seat colors:
```typescript
// Selected seat (currently red)
className="fill-red-500 stroke-red-600"

// Reserved seat (currently gray)
className="fill-gray-400 stroke-gray-500"

// Available seat (currently light gray)
className="fill-gray-200 stroke-gray-400"
```

### Auto-scroll Delay

Edit `TheaterSeatMap.tsx`:
```typescript
setTimeout(() => {
  activeSeatRef.current?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'center'
  });
  setHasScrolled(true);
}, 500); // Change this delay (milliseconds)
```

### Visible Row Context

Edit `TheaterSeatMap.tsx`:
```typescript
// Currently shows ±3 rows around active row
const startIndex = Math.max(0, activeRowIndex - 3); // Change 3 to show more/less
const endIndex = Math.min(enclosure.rows.length, activeRowIndex + 4);
```

---

## 📱 Responsive Design

The components adapt to screen sizes:

- **Mobile** (< 640px): 2-column enclosure grid, compact seat view
- **Tablet** (640px - 1024px): 3-column grid, medium seat view
- **Desktop** (> 1024px): 4-column grid, full seat view

Test responsive design:
```bash
# Chrome DevTools
Press F12 → Toggle device toolbar (Ctrl+Shift+M)

# Test these dimensions:
# - iPhone SE: 375x667
# - iPad: 768x1024
# - Desktop: 1920x1080
```

---

## 🐛 Troubleshooting

### Issue: Components not rendering

**Solution:**
1. Check if `cn` utility is available in `@/lib/utils`
2. Verify shadcn/ui components are installed
3. Check Tailwind CSS is configured properly

### Issue: Auto-scroll not working

**Solution:**
1. Check browser console for errors
2. Verify refs are properly attached
3. Try increasing the delay in `setTimeout`

### Issue: API data not loading

**Solution:**
1. Check `NEXT_PUBLIC_API_URL` environment variable
2. Verify API endpoints are running
3. Check browser network tab for failed requests
4. Ensure CORS is configured on backend

### Issue: Seat numbers not displaying

**Solution:**
1. Verify `reservedSeats` is a comma-separated string
2. Check `startSeat` and `endSeat` are valid numbers
3. Ensure rows array is not empty

---

## ✅ Testing Checklist

Before moving to Phase 4:

- [ ] Page loads without errors
- [ ] Seat component renders with correct colors
- [ ] Auto-scroll works to user's seat
- [ ] Reserved seats are grayed out
- [ ] Venue map shows all enclosures
- [ ] Active enclosure is highlighted
- [ ] Responsive on mobile devices
- [ ] Print button works
- [ ] Loading state displays properly
- [ ] Not-found page shows for invalid IDs

---

## 📖 Documentation

For detailed component documentation, see:
- `apps/web/src/components/attendee/README.md`
- `docs/PHASE-3-IMPLEMENTATION-SUMMARY.md`

---

## 🔜 Next Steps

### If Phase 2 is Complete:
1. Connect components to real API
2. Test with actual seat allocation data
3. Verify reserved seat logic
4. Test edge cases

### If Phase 2 is Not Complete:
1. Use mock data for testing
2. Proceed to Phase 4 (Admin Dashboard)
3. Come back for integration testing later

---

## 🎯 Key Features

✨ **What's Working:**
- Theater-style seat visualization
- Auto-scroll to user's seat
- Responsive design (mobile, tablet, desktop)
- Touch-friendly interactions
- Loading states
- Error handling
- Print support (button ready)

⏳ **Pending Integration:**
- Real API connection
- Actual seat allocation data
- End-to-end testing
- Performance optimization

---

## 💡 Tips

1. **Use Mock Data First**: Test components with mock data before API integration
2. **Check Responsive**: Always test on mobile, tablet, and desktop
3. **Verify Auto-scroll**: The seat should be centered after 500ms
4. **Test Reserved Seats**: Make sure reserved seats are properly disabled
5. **Print Preview**: Use browser print preview to check print layout

---

## 🤝 Need Help?

- Check component README: `apps/web/src/components/attendee/README.md`
- Review implementation plan: `docs/SEAT-ASSIGNMENT-IMPLEMENTATION-PLAN.md`
- Read summary: `docs/PHASE-3-IMPLEMENTATION-SUMMARY.md`

---

**Happy Testing! 🚀**

Phase 3 is complete and ready for integration with Phase 2 backend!
