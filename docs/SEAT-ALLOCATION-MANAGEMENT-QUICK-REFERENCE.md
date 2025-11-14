# Seat Allocation Management - Quick Reference

## Access
**URL:** `/admin/seat-allocation`  
**Permission:** Admin only

## Features at a Glance

### 📊 Global Statistics
- Total eligible attendees
- Total allocated seats (with percentage)
- Total unallocated attendees

### 🎯 Per-Enclosure Management

Each enclosure card shows:
- **Total Seats**: All seats in enclosure
- **Reserved**: Admin + row-level reserved seats
- **Allocated**: Currently assigned seats
- **Available**: Remaining seats for allocation
- **Utilization**: Percentage of non-reserved seats filled

### 🔧 Actions Available

#### Per-Enclosure Actions
1. **Run Allocation** - Allocate seats for this enclosure only
2. **Reset** - Clear all seat allocations (keeps reservations)

#### Global Actions
1. **Allocate All Enclosures** - Run algorithm everywhere
2. **Reset All Allocations** - Clear all seat assignments

## API Endpoints

### New Endpoints
```
POST   /api/v1/allocations/allocate-enclosure/:enclosureLetter
DELETE /api/v1/allocations/clear-enclosure/:enclosureLetter
```

### Existing Endpoints (Also Available)
```
POST   /api/v1/allocations/allocate-seats
DELETE /api/v1/allocations/clear
GET    /api/v1/allocations/stats
```

## How Reserved Seats Work

### Reserved Seats Are ALWAYS Skipped
The allocation algorithm automatically skips:

1. **Admin-Reserved Seats**
   - Created via `/admin/reserve-seats` page
   - Stored in `SeatReservation` table
   - Example: VIP seats, special guests

2. **Row-Reserved Seats**
   - Configured in enclosure row settings
   - Stored as comma-separated numbers (e.g., "1,5,10")
   - Example: Wheelchair accessible seats, emergency exits

### Reserved Seats Are NEVER Deleted
- Reset operations only clear seat allocations
- Reserved seats remain in place
- Must be manually removed if needed

## Workflow Example

### Initial Setup
1. Create enclosures (`/admin/enclosures`)
2. Reserve VIP seats (`/admin/reserve-seats`)
3. Upload attendees with enclosure assignments

### Running Allocation
1. Go to `/admin/seat-allocation`
2. Review statistics
3. Choose action:
   - Test on single enclosure first
   - Or run on all enclosures at once
4. Confirm action
5. Review results in aerial view

### Re-running Allocation
If you need to change assignments:
1. Reset specific enclosure (or all)
2. Update reservations/configurations if needed
3. Run allocation again
4. New assignments created (skipping reservations)

## Common Scenarios

### Scenario 1: Test Allocation
```
1. Run allocation on Enclosure A only
2. Check results in Aerial View
3. If satisfied, run on remaining enclosures
```

### Scenario 2: Fix Mistakes
```
1. Reset specific enclosure
2. Fix attendee data or reservations
3. Run allocation again for that enclosure
```

### Scenario 3: Start Over
```
1. Use "Reset All Allocations"
2. Update any configurations
3. Use "Allocate All Enclosures"
```

### Scenario 4: Partial Update
```
1. Reset Enclosure B only
2. Enclosures A, C, D keep their allocations
3. Run allocation for Enclosure B
4. Only B gets new assignments
```

## Status Indicators

### Button States
- **Enabled**: Action can be performed
- **Disabled**: No action needed (e.g., no allocations to reset)
- **Loading**: Operation in progress

### Statistics Colors
- **Blue**: Total/capacity information
- **Green**: Successfully allocated
- **Orange**: Pending allocation
- **Red**: Reserved seats

### Utilization Percentage
```
Formula: (Allocated Seats / Available Seats) × 100
Where: Available Seats = Total Seats - Reserved Seats
```

## Confirmation Dialogs

All destructive actions require confirmation:

### Allocate Confirmation
> "Run seat allocation algorithm for Enclosure X?
> This will assign seats to all eligible attendees in this enclosure who don't have seats yet."

### Reset Confirmation
> "Reset all seat allocations for Enclosure X?
> This will clear all seat assignments in this enclosure. Reserved seats will NOT be affected.
> This action cannot be undone."

## Error Messages

### Common Errors
- "Failed to allocate seats" - Check server logs
- "Failed to fetch stats" - Authentication issue
- "Enclosure not found" - Invalid enclosure letter
- "Not enough available seats" - Capacity exceeded

### Troubleshooting
1. Check if attendees have enclosure assigned
2. Verify enclosure configuration exists
3. Confirm sufficient available seats
4. Review reserved seats count
5. Check API server logs

## Best Practices

### ✅ Do
- Reserve VIP seats BEFORE running allocation
- Test on one enclosure first
- Review statistics before and after
- Use per-enclosure allocation for updates
- Check aerial view after allocation

### ❌ Don't
- Reset without confirming you want to lose data
- Forget to check reserved seats count
- Run global allocation without testing
- Ignore utilization percentages
- Skip reviewing results

## Performance Notes

### Allocation Speed
- Small enclosure (~100 seats): < 1 second
- Medium enclosure (~500 seats): 1-2 seconds
- Large enclosure (~1000 seats): 2-5 seconds
- All enclosures: Varies by total attendees

### Database Operations
- Single transaction per enclosure
- Bulk create for allocations
- Efficient reserved seat lookups
- Optimized queries with proper indexes

## Integration with Other Pages

### Before Allocation
1. **Enclosures**: Configure venue layout
2. **Reserve Seats**: Mark VIP/special seats
3. **Upload Students**: Import attendees with enclosures

### After Allocation
1. **Aerial View**: Visualize seat assignments
2. **Dashboard**: View overall statistics
3. **Search**: Look up specific attendees

## Technical Notes

### Service Methods
```typescript
// Allocate specific enclosure
allocateSeatsForEnclosure(enclosureLetter: string)

// Clear specific enclosure
clearEnclosureAllocations(enclosureLetter: string)

// Existing methods still available
allocateSeats() // All enclosures
clearAllAllocations() // All enclosures
```

### Algorithm Logic
1. Fetch attendees for enclosure
2. Load enclosure rows (ordered)
3. Fetch admin-reserved seats
4. Parse row-reserved seats
5. Get existing allocations
6. Loop through rows and seats
7. Skip reserved/allocated seats
8. Assign to next attendee
9. Bulk create allocations
10. Return statistics

### Data Refresh
After successful operation:
- Refetch statistics
- Refetch enclosures
- Trigger router refresh
- Show toast notification

## Navigation

Added to dashboard bento grid:
- **Card Title**: "Seat Allocation"
- **Description**: "Run seat allocation algorithm per enclosure"
- **Label**: "Allocate Seats"
- **Route**: `/admin/seat-allocation`

## Files Reference

### Frontend
- `apps/web/src/app/admin/seat-allocation/page.tsx`
- `apps/web/src/app/admin/seat-allocation/seat-allocation-client.tsx`

### Backend
- `apps/api/src/services/seatAllocation.service.ts`
- `apps/api/src/controllers/allocation.controller.ts`
- `apps/api/src/routes/allocation.routes.ts`

### Documentation
- `docs/SEAT-ALLOCATION-MANAGEMENT-PAGE.md`
- `docs/SEAT-ALLOCATION-MANAGEMENT-QUICK-REFERENCE.md` (this file)

## Support Checklist

When user reports issues:
- [ ] Is user logged in as admin?
- [ ] Are enclosures configured?
- [ ] Are attendees uploaded with enclosures?
- [ ] Are there available seats?
- [ ] Check reserved seats count
- [ ] Review API logs
- [ ] Check database allocations
- [ ] Verify allocation statistics

## Version History

- **v1.0** (Current) - Initial release with per-enclosure allocation and reset
