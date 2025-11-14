# Seat Allocation Management Page - Implementation Summary

## Overview

Created a new admin page that allows administrators to run seat allocation algorithms and reset allocations on a per-enclosure basis. The system respects reserved seats (both admin-reserved and row-level reserved seats) during allocation.

## What Was Implemented

### 1. Backend API Enhancements

#### New Service Methods (`apps/api/src/services/seatAllocation.service.ts`)

**`allocateSeatsForEnclosure(enclosureLetter: string)`**
- Allocates seats for attendees in a specific enclosure only
- Fetches eligible attendees assigned to the specified enclosure
- Skips reserved seats (admin-reserved and row-reserved)
- Returns allocation statistics (allocated, failed, errors)

**`clearEnclosureAllocations(enclosureLetter: string)`**
- Clears all seat allocations for a specific enclosure
- Reserved seats remain intact
- Returns count of cleared allocations

#### New Controller Methods (`apps/api/src/controllers/allocation.controller.ts`)

**`allocateEnclosureSeats(req, res)`**
- POST endpoint to trigger allocation for specific enclosure
- Admin only
- Endpoint: `POST /api/allocations/allocate-enclosure/:enclosureLetter`

**`clearEnclosureAllocations(req, res)`**
- DELETE endpoint to reset allocations for specific enclosure
- Admin only
- Endpoint: `DELETE /api/allocations/clear-enclosure/:enclosureLetter`

#### New Routes (`apps/api/src/routes/allocation.routes.ts`)

```typescript
// Allocate seats for a specific enclosure
POST /api/allocations/allocate-enclosure/:enclosureLetter

// Clear allocations for a specific enclosure
DELETE /api/allocations/clear-enclosure/:enclosureLetter
```

Both routes:
- Require authentication
- Require admin authorization
- Validate enclosure letter parameter

### 2. Frontend Admin Page

#### Server Component (`apps/web/src/app/admin/seat-allocation/page.tsx`)

**Responsibilities:**
- Enforce admin-only access via `requireAdmin()`
- Fetch initial enclosures data with statistics
- Fetch allocation statistics across all enclosures
- Pass data to client component

**Data Fetched:**
- List of all enclosures with row configurations
- Global allocation statistics (total attendees, allocated, unallocated)
- Per-enclosure statistics (total, allocated, available seats)

#### Client Component (`apps/web/src/app/admin/seat-allocation/seat-allocation-client.tsx`)

**Features:**

1. **Global Statistics Dashboard**
   - Total attendees eligible for allocation
   - Total allocated seats with completion percentage
   - Total unallocated attendees pending allocation

2. **Global Actions**
   - Allocate All Enclosures: Run algorithm across all enclosures
   - Reset All Allocations: Clear all seat assignments

3. **Per-Enclosure Cards**
   - Enclosure information (letter, name, allocated for)
   - Statistics:
     - Total seats in enclosure
     - Reserved seats count
     - Allocated seats count
     - Available seats count
     - Utilization percentage
   - Row configuration display
   - Actions:
     - Run Allocation: Execute algorithm for this enclosure
     - Reset: Clear allocations for this enclosure

4. **User Experience**
   - Confirmation dialogs for all destructive actions
   - Loading states during operations
   - Toast notifications for success/error feedback
   - Automatic data refresh after operations
   - Disabled reset button when no allocations exist

5. **Visual Design**
   - Gradient cards for statistics
   - Color-coded statistics (blue, green, orange, red)
   - Hover effects and shadows
   - Responsive grid layout
   - Information box explaining how the system works

## How It Works

### Allocation Algorithm

1. **Fetch Eligible Attendees**
   - Filters by assigned enclosure
   - Only includes attendees without existing allocations
   - Must be convocation eligible and registered

2. **Fetch Reserved Seats**
   - Admin-reserved seats from `SeatReservation` table
   - Row-level reserved seats from enclosure configuration

3. **Allocate Sequentially**
   - Process rows in display order
   - For each seat in row:
     - Skip if admin-reserved
     - Skip if row-reserved
     - Skip if already allocated
     - Assign to next attendee in queue

4. **Bulk Create**
   - All allocations created in single database transaction
   - Returns statistics on success/failure

### Reset Functionality

- Deletes seat allocations for specified enclosure
- Reserved seats remain intact (not deleted)
- Allows re-running allocation with updated data
- Can be performed per-enclosure or globally

## Key Features

✅ **Per-Enclosure Control**: Run allocation or reset for specific enclosures without affecting others

✅ **Reserved Seat Protection**: Algorithm automatically skips:
- Admin-reserved seats (from seat reservation system)
- Row-level reserved seats (from enclosure configuration)

✅ **Real-time Statistics**: View allocation status and utilization per enclosure

✅ **Safe Operations**: Confirmation dialogs and clear messaging for all actions

✅ **Error Handling**: Comprehensive error messages and toast notifications

✅ **Responsive Design**: Works on desktop and mobile devices

## API Endpoints

### Existing (Enhanced)
- `POST /api/v1/allocations/allocate-seats` - Allocate all enclosures
- `DELETE /api/v1/allocations/clear` - Clear all allocations
- `GET /api/v1/allocations/stats` - Get allocation statistics

### New
- `POST /api/v1/allocations/allocate-enclosure/:enclosureLetter` - Allocate specific enclosure
- `DELETE /api/v1/allocations/clear-enclosure/:enclosureLetter` - Clear specific enclosure

## Access & Navigation

**Route:** `/admin/seat-allocation`

**Access Level:** Admin only (enforced server-side)

**Navigation:** Should be added to admin sidebar under "Seat Management" section

## Files Created/Modified

### Created
1. `/apps/web/src/app/admin/seat-allocation/page.tsx` - Server component
2. `/apps/web/src/app/admin/seat-allocation/seat-allocation-client.tsx` - Client component

### Modified
1. `/apps/api/src/services/seatAllocation.service.ts` - Added per-enclosure methods
2. `/apps/api/src/controllers/allocation.controller.ts` - Added new endpoints
3. `/apps/api/src/routes/allocation.routes.ts` - Added new routes

## Usage Instructions

### For Administrators

1. **Navigate to Seat Allocation Page**
   - Go to `/admin/seat-allocation`

2. **View Statistics**
   - Review global statistics at top
   - Check per-enclosure statistics in cards

3. **Run Allocation for Specific Enclosure**
   - Click "Run Allocation" on desired enclosure card
   - Confirm the action
   - Wait for completion (loading indicator shows)
   - Review success message with count

4. **Reset Specific Enclosure**
   - Click "Reset" on desired enclosure card
   - Confirm the action (warns about irreversibility)
   - Wait for completion
   - Review success message with count

5. **Global Operations**
   - Use "Allocate All Enclosures" to run algorithm everywhere
   - Use "Reset All Allocations" to clear all assignments

### Best Practices

1. **Reserve Seats First**
   - Use the Seat Reservation page to reserve VIP/special seats
   - Allocation algorithm will automatically skip these

2. **Test on One Enclosure**
   - Run allocation on a single enclosure first
   - Review results in Aerial View
   - If satisfied, run for remaining enclosures

3. **Check Statistics**
   - Review utilization percentages
   - Ensure available seats exist before running
   - Check for unallocated attendees after running

4. **Reset Safely**
   - Resetting clears assignments but NOT reservations
   - Use this to re-run allocation with updated data
   - Global reset affects all enclosures

## Technical Details

### Authentication
- Uses `credentials: 'include'` for API calls
- Server-side admin check via `requireAdmin()`
- All API endpoints require admin authorization

### State Management
- Local state for enclosures and statistics
- Loading states per operation
- Automatic refresh after mutations

### Error Handling
- Try-catch blocks on all API calls
- User-friendly error messages
- Toast notifications for feedback

### Data Flow
1. Server fetches initial data
2. Client renders with server data
3. User triggers action
4. API call with loading state
5. Success/error handling
6. Refresh data from server
7. Update UI with new data

## Future Enhancements

- [ ] Add filters (by school, degree, etc.)
- [ ] Export allocation results to Excel
- [ ] Allocation preview before running
- [ ] Undo last allocation
- [ ] Batch allocation by criteria
- [ ] Allocation history/audit log
- [ ] Email notifications on completion
- [ ] Progress indicator for large allocations

## Testing Checklist

- [ ] Admin can access page
- [ ] Non-admin redirected
- [ ] Statistics display correctly
- [ ] Per-enclosure allocation works
- [ ] Per-enclosure reset works
- [ ] Global allocation works
- [ ] Global reset works
- [ ] Reserved seats are skipped
- [ ] Loading states show correctly
- [ ] Error messages display
- [ ] Success toasts appear
- [ ] Data refreshes after operations
- [ ] Confirmation dialogs work
- [ ] Disabled states work correctly
- [ ] Responsive on mobile

## Related Documentation

- Phase 1: Database Schema & Enclosure Management
- Phase 2: Seat Allocation Algorithm
- Seat Reservation System
- Aerial View Documentation
- Admin Dashboard Documentation

## Support

For issues or questions:
1. Check allocation statistics first
2. Verify reserved seats configuration
3. Review attendee enclosure assignments
4. Check API logs for errors
5. Test with single enclosure before global operation
