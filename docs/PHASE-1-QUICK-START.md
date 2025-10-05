# Quick Start Guide - Phase 1: Enclosure Management

**For:** System Administrators  
**Version:** 1.0  
**Date:** October 5, 2025

---

## 🎯 Quick Navigation

- **Enclosure Management:** `/admin/enclosures`
- **Seat Reservation:** `/admin/reserve-seats`

---

## 📋 Step-by-Step: Create Your First Enclosure

### Step 1: Access Enclosure Management
1. Navigate to: `http://localhost:3000/admin/enclosures`
2. You should see an empty list with a "Create First Enclosure" button

### Step 2: Create Enclosure
1. Click **"New Enclosure"** button
2. Fill in the form:
   - **Enclosure Letter:** `A` (single letter, e.g., A, B, C)
   - **Name (Optional):** `Main Hall` (descriptive name)
   - **Allocated For:** Select from dropdown (STUDENTS, FACULTY, etc.)
   - **Entry Direction:** Select entry point (NORTH, SOUTH, etc.)
   - **Display Order:** `0` (determines order in lists)

### Step 3: Add Rows
1. Click **"Add Row"** button to add your first row
2. Configure each row:
   - **Row Letter:** `A` (auto-filled, single letter)
   - **Start Seat:** `1` (first seat number in row)
   - **End Seat:** `50` (last seat number in row)
   - **Reserved Seats:** `1,25,50` (optional, comma-separated)

3. Add more rows as needed (click "Add Row" again)

### Step 4: Save
1. Click **"Create Enclosure"**
2. You should see a success message
3. Your enclosure appears in the list with statistics

---

## 🎫 Step-by-Step: Reserve Seats

### When to Reserve Seats?
- Before running the automatic allocation algorithm
- For VIP guests, special needs, or accessibility requirements
- For manual seat assignments

### Step 1: Access Seat Reservation
Navigate to: `http://localhost:3000/admin/reserve-seats`

### Step 2: Select Enclosure and Row
1. **Enclosure:** Select from dropdown (e.g., "A - Main Hall")
2. **Row:** Select from dropdown (e.g., "Row A (Seats 1-50)")

### Step 3: Enter Seat Numbers
You can use three formats:

**Single Seats:**
```
1,5,10
```

**Range:**
```
1-10
```

**Mixed:**
```
1,5-10,15,20-25
```

### Step 4: Add Description (Optional)
- **Reserved For:** `VIP Guest` or `Wheelchair Access`

### Step 5: Reserve
1. Click **"Reserve Seats"**
2. Check results (success/failed count)
3. View reserved seats in the list

---

## 📊 Understanding the Dashboard

### Enclosure Card Statistics

**Total Seats:**
- Calculated automatically
- (End Seat - Start Seat + 1) × Number of Rows
- Minus reserved seats

**Allocated:**
- Number of seats assigned to attendees
- Will be 0 until Phase 2 allocation runs

**Rows:**
- Total number of rows in enclosure

---

## 🎨 Example Configurations

### Example 1: Simple Enclosure
```
Enclosure: A
Name: Main Hall
Allocated For: STUDENTS
Entry: NORTH

Rows:
- Row A: Seats 1-50 (no reservations)
- Row B: Seats 1-50 (no reservations)
- Row C: Seats 1-50 (no reservations)

Total Seats: 150
```

### Example 2: Complex Enclosure with Reservations
```
Enclosure: B
Name: VIP Section
Allocated For: VIP
Entry: SOUTH

Rows:
- Row A: Seats 1-30, Reserved: 1,15,30 (27 available)
- Row B: Seats 1-30, Reserved: 5-10 (24 available)

Admin Reserved:
- B-A-10 (VIP Guest 1)
- B-A-11 (VIP Guest 2)

Total Available: 49 seats
```

---

## ⚠️ Important Rules

### Enclosure Letters
- ✅ Must be unique (A, B, C, etc.)
- ❌ Cannot have duplicate letters
- ❌ Cannot change if seats are allocated

### Row Configuration
- ✅ Start Seat must be >= 1
- ✅ End Seat must be >= Start Seat
- ✅ Row letters must be unique within enclosure

### Seat Reservations
- ✅ Can reserve multiple seats at once
- ✅ Can remove reservations anytime
- ❌ Cannot reserve already allocated seats
- ❌ Cannot reserve seats outside row range

### Deleting Enclosures
- ✅ Can delete if no seats are allocated
- ❌ Cannot delete if attendees are assigned
- 💡 Clear allocations first, then delete

---

## 🔧 Common Tasks

### Task: Add More Rows to Existing Enclosure
1. Go to Enclosure Management
2. Click **"Edit"** on the enclosure
3. Click **"Add Row"**
4. Configure new row
5. Click **"Update Enclosure"**

### Task: Change Reserved Seats in a Row
1. Go to Enclosure Management
2. Click **"Edit"** on the enclosure
3. Find the row
4. Update **"Reserved"** field (e.g., `1,5,10`)
5. Click **"Update Enclosure"**

### Task: Reserve Seats for Wheelchair Access
1. Go to Seat Reservation
2. Select enclosure and row (usually front rows)
3. Enter seat numbers: `1,2` (aisle seats)
4. Reserved For: `Wheelchair Access`
5. Click **"Reserve Seats"**

### Task: View All Reservations for an Enclosure
1. Go to Seat Reservation
2. Scroll to "Reservations Summary by Enclosure"
3. Find your enclosure card
4. See count of reserved seats

### Task: Remove All Reservations (Testing)
**⚠️ Caution: This cannot be undone!**

Using API (requires admin access):
```bash
curl -X DELETE http://localhost:5000/api/v1/admin/reservations \
  -H "Cookie: accessToken=YOUR_TOKEN"
```

---

## 🐛 Troubleshooting

### Problem: "Enclosure letter already exists"
**Solution:** Use a different letter (A, B, C, etc.)

### Problem: "Seat number must be between X and Y"
**Solution:** Check your row configuration. Seat must be within start-end range.

### Problem: "Seat already allocated to an attendee"
**Solution:** This seat has been assigned. Cannot reserve allocated seats.

### Problem: "Cannot delete enclosure with seat allocations"
**Solution:** 
1. Go to allocation management (Phase 2)
2. Clear allocations for this enclosure
3. Then delete

### Problem: Reserved seats not showing
**Solution:** 
1. Refresh the page
2. Check browser console for errors
3. Verify you're logged in as admin

---

## 📞 Need Help?

**For Technical Issues:**
- Check browser console (F12)
- Check API logs
- Verify authentication token

**For Configuration Help:**
- Review this guide
- Check SEAT-ASSIGNMENT-IMPLEMENTATION-PLAN.md
- Review example configurations above

---

## 🚀 What's Next?

After completing Phase 1:

1. ✅ Create all enclosures
2. ✅ Configure all rows
3. ✅ Reserve special seats (VIP, accessibility)
4. ⏭️ **Ready for Phase 2:** Automatic Seat Allocation
5. ⏭️ Upload attendee data with enclosure assignments
6. ⏭️ Run allocation algorithm
7. ⏭️ Students can view their seats

---

## 🎉 Checklist Before Moving to Phase 2

- [ ] All venue enclosures created (A, B, C, etc.)
- [ ] All rows configured for each enclosure
- [ ] Row-level reserved seats marked (if any)
- [ ] Admin reserved seats created (VIP, etc.)
- [ ] Test enclosure editing works
- [ ] Test seat reservation works
- [ ] Verify total seat counts are correct
- [ ] Document your configuration for reference

---

**Happy Configuring! 🎓**
