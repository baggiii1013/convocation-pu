# Phase 4 Quick Reference Guide

## 🚀 Quick Start

### Access the New Features

1. **Statistics Dashboard**
   - URL: `/admin/dashboard`
   - Navigation: Admin Sidebar → "Statistics Dashboard"
   - Purpose: View allocation statistics and metrics

2. **Aerial View**
   - URL: `/admin/aerial-view`
   - Navigation: Admin Sidebar → "Aerial View"
   - Purpose: View and search seat allocations

---

## 📊 Statistics Dashboard

### Key Metrics
- **Total Attendees**: All registered students
- **Allocated Seats**: Successfully assigned seats
- **Allocation Rate**: Percentage of completed assignments
- **Unallocated**: Pending seat assignments
- **Enclosures**: Total active venues
- **Utilization Rate**: Efficiency per enclosure

### Actions
- **Refresh**: Click refresh button to update statistics
- **View Details**: Scroll to see detailed enclosure breakdown

---

## 🗺️ Aerial View

### Features

#### 1. Enclosure Selection
- Click enclosure buttons (A, B, C, D) to switch views
- Current enclosure highlighted in blue

#### 2. Search Attendees
- **By Enrollment ID**: Type enrollment number
- **By Name**: Type student name
- **Auto-navigation**: System scrolls to result
- **Highlighting**: Found attendee highlighted in yellow

#### 3. Row Management
- **Expand**: Click row header to view attendees
- **Collapse**: Click again to hide details
- **Occupancy**: See visual progress bar for each row

#### 4. View Attendee Details
- Seat number
- Full name
- Enrollment ID
- Course and school

---

## 🔍 Search Tips

### Effective Searching
1. **Exact Match**: Type complete enrollment ID
2. **Partial Match**: Type first few characters
3. **Name Search**: Type any part of the name
4. **Case Insensitive**: Works with any case

### Search Examples
```
Search: "2023001" → Finds enrollment ID 2023001
Search: "john" → Finds all Johns
Search: "doe" → Finds all Does (last name)
Search: "202300" → Finds all IDs starting with 202300
```

---

## 🎯 Common Tasks

### Task 1: Check Overall Allocation Status
1. Go to **Statistics Dashboard**
2. View summary cards at top
3. Check allocation percentage
4. Review enclosure utilization rates

### Task 2: Find a Specific Student
1. Go to **Aerial View**
2. Select appropriate enclosure (if known)
3. Type enrollment ID or name in search
4. System auto-scrolls to result

### Task 3: View All Attendees in a Row
1. Go to **Aerial View**
2. Select enclosure
3. Click on row header to expand
4. Scroll through attendee list

### Task 4: Check Enclosure Capacity
1. Go to **Statistics Dashboard**
2. Scroll to "Enclosure Details" table
3. View Total/Allocated/Available columns
4. Check utilization percentage

---

## 🖥️ API Endpoints Reference

### Get Statistics
```
GET /api/allocations/stats

Authentication: Required (Admin)
Response: Statistics object with all metrics
```

### Get Enclosure Allocations
```
GET /api/allocations/enclosure/:letter

Authentication: Required (Admin)
Parameters: 
  - letter: Enclosure letter (A, B, C, D)
Response: Full enclosure data with rows and attendees
```

### Get Enclosure List
```
GET /api/enclosures

Authentication: Required (Admin)
Response: Array of all enclosures
```

---

## 🐛 Troubleshooting

### Issue: Dashboard Shows No Data
**Solution:**
1. Check if attendees are uploaded
2. Verify seat allocation has been run
3. Click refresh button
4. Check browser console for errors

### Issue: Search Not Finding Attendee
**Solution:**
1. Verify spelling of name/enrollment ID
2. Ensure correct enclosure is selected
3. Check if attendee has been allocated
4. Try partial search (first few characters)

### Issue: Rows Not Expanding
**Solution:**
1. Click directly on row header
2. Check if row has attendees
3. Try refreshing the page
4. Check browser console for errors

### Issue: Statistics Showing Zero
**Solution:**
1. Ensure attendees are uploaded to database
2. Verify enclosures are configured
3. Check if seat allocation algorithm has been run
4. Verify API endpoints are accessible

---

## 📱 Mobile Usage

### Dashboard on Mobile
- Scroll vertically through cards
- Swipe table horizontally to see all columns
- Tap refresh button in top-right

### Aerial View on Mobile
- Enclosure buttons wrap to multiple lines
- Search input full-width
- Tap row headers to expand
- Scroll within expanded rows

---

## ⚡ Performance Tips

### For Large Datasets
1. **Use Search**: Don't expand all rows
2. **Specific Enclosures**: Select only needed enclosure
3. **Refresh Wisely**: Only when data changes
4. **Close Rows**: Collapse rows after viewing

---

## 🔐 Permissions

### Required Access
- Admin role required for both features
- Login must be active
- Session must be valid

### Access Denied?
1. Verify admin role in database
2. Log out and log back in
3. Check with system administrator
4. Clear browser cache and cookies

---

## 💡 Best Practices

### Dashboard Usage
1. Check dashboard daily for overview
2. Monitor utilization rates
3. Watch for unallocated attendees
4. Review before running re-allocation

### Aerial View Usage
1. Use search for specific queries
2. Expand only needed rows
3. Close rows after viewing
4. Select correct enclosure first

### Search Best Practices
1. Use enrollment ID for exact match
2. Use name for multiple results
3. Clear search to view all rows
4. Be specific to reduce results

---

## 📋 Status Indicators

### Dashboard Colors
- 🟢 **Green**: Allocated seats, good status
- 🟠 **Orange**: Unallocated seats, action needed
- 🔵 **Blue**: Total counts, informational
- 🟣 **Purple**: Enclosures, category info

### Aerial View Colors
- 🟦 **Blue Background**: Enclosure/row identifiers
- 🟨 **Yellow Background**: Search result highlight
- ⚪ **White Background**: Normal state
- 🔲 **Gray Background**: Empty/collapsed state

---

## 🔄 Refresh & Updates

### When to Refresh
- After running seat allocation
- After uploading new attendees
- After modifying enclosures
- When data seems outdated

### How to Refresh
- **Dashboard**: Click refresh button (top-right)
- **Aerial View**: Re-select enclosure or reload page

---

## 📊 Understanding Metrics

### Allocation Rate
```
Formula: (Allocated Seats / Total Attendees) × 100
Example: (1,150 / 1,234) × 100 = 93.2%

Good: > 95%
Fair: 85% - 95%
Poor: < 85%
```

### Utilization Rate
```
Formula: (Allocated Seats / Total Available Seats) × 100
Example: (300 / 320) × 100 = 93.8%

Good: > 90%
Fair: 75% - 90%
Poor: < 75%
```

---

## 🎓 Training Resources

### For New Admins
1. Start with Statistics Dashboard
2. Learn to read metrics
3. Practice search in Aerial View
4. Understand row expansion
5. Try different enclosures

### For Experienced Users
1. Use keyboard shortcuts (when available)
2. Bookmark frequently used enclosures
3. Master search patterns
4. Monitor trends over time

---

## 🆘 Support

### Getting Help
1. **Documentation**: Read this guide
2. **Testing**: Try with sample data
3. **Console**: Check browser developer tools
4. **Admin**: Contact system administrator

### Reporting Issues
Include:
- Page URL
- Action attempted
- Expected result
- Actual result
- Browser console errors

---

## 📅 Version Info

**Phase**: 4  
**Features**: Statistics Dashboard, Aerial View  
**Status**: Production Ready  
**Last Updated**: October 6, 2025

---

## 🔗 Related Documentation

- [Phase 4 Complete Documentation](./PHASE-4-IMPLEMENTATION-COMPLETE.md)
- [Seat Assignment Implementation Plan](./SEAT-ASSIGNMENT-IMPLEMENTATION-PLAN.md)
- [API Documentation](../apps/api/README.md)
- [Frontend Documentation](../apps/web/README.md)

---

**Quick Links:**
- Dashboard: `/admin/dashboard`
- Aerial View: `/admin/aerial-view`
- Enclosures: `/admin/enclosures`
- Reserve Seats: `/admin/reserve-seats`
