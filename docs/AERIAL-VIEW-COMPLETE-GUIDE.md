# Aerial View System - Complete Implementation Guide

## 📋 Overview

The Aerial View system provides an interactive, district.in-style convocation ground visualization with clickable enclosures that show detailed seat layouts. The system is fully integrated with the API and database.

## 🏗️ Architecture

### Components

1. **AerialVenueView.tsx** - Core visualization component
   - Renders the aerial ground view with stage
   - Handles zoom, pan, and drag operations
   - Manages enclosure positioning and interactions
   - Location: `/apps/web/src/components/attendee/AerialVenueView.tsx`

2. **EnclosureDetailModal.tsx** - Seat detail modal
   - Shows district.in-style seat grid layout
   - Color-coded seat status (available/occupied/reserved/user)
   - Row-wise seat arrangement
   - Location: `/apps/web/src/components/attendee/EnclosureDetailModal.tsx`

3. **AerialVenueWrapper.tsx** - Integration wrapper
   - Manages modal state
   - Handles enclosure selection
   - Passes props to AerialVenueView
   - Location: `/apps/web/src/components/attendee/AerialVenueWrapper.tsx`

### Pages

#### 1. Attendee Page (Production)
- **Path**: `/attendee/[enrollmentId]`
- **File**: `/apps/web/src/app/attendee/[enrollmentId]/page.tsx`
- **Features**:
  - Fetches attendee data from API
  - Fetches all enclosures from API
  - Shows personalized seat information
  - Highlights user's assigned seat with ★
  - Displays aerial view with user's enclosure highlighted
- **API Endpoints Used**:
  - `GET /api/attendees/:enrollmentId/seat`
  - `GET /api/enclosures`

#### 2. Admin Aerial View Editor (Production)
- **Path**: `/admin/aerial-view-editor`
- **File**: `/apps/web/src/app/admin/aerial-view-editor/page.tsx`
- **Features**:
  - Fetches all enclosures from API
  - Edit mode toggle for repositioning enclosures
  - Drag-and-drop enclosure repositioning
  - Save layout changes to database
  - Discard changes functionality
  - Real-time position tracking
  - Visual indicators for modified enclosures
- **API Endpoints Used**:
  - `GET /api/v1/enclosures`
  - `PATCH /api/v1/enclosures/:id/layout`

#### 3. Demo Page (Testing Only)
- **Path**: `/demo/aerial-view`
- **File**: `/apps/web/src/app/demo/aerial-view/page.tsx`
- **Purpose**: Testing and demonstration with mock data
- **Note**: Uses hardcoded demo data, not connected to API

## 🔌 API Integration

### Backend Endpoints

#### 1. Get All Enclosures
```typescript
GET /api/v1/enclosures
```
**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "letter": "A",
      "name": "North Wing",
      "allocatedFor": "STUDENTS",
      "entryDirection": "NORTH",
      "positionX": 25.0,
      "positionY": 35.0,
      "width": 18.0,
      "height": 18.0,
      "color": "#3B82F6",
      "totalSeats": 200,
      "rows": [
        {
          "letter": "A",
          "startSeat": 1,
          "endSeat": 20,
          "reservedSeats": "5,10,15",
          "displayOrder": 0
        }
      ]
    }
  ]
}
```

#### 2. Update Enclosure Layout
```typescript
PATCH /api/v1/enclosures/:id/layout
```
**Request Body:**
```json
{
  "positionX": 30.5,
  "positionY": 40.2,
  "width": 20.0,
  "height": 20.0,
  "color": "#FF5733"
}
```
**Response:** Updated enclosure object

#### 3. Get Attendee Seat
```typescript
GET /api/attendees/:enrollmentId/seat
```
**Response:**
```json
{
  "attendee": {
    "enrollmentId": "123456",
    "name": "John Doe",
    "course": "Computer Science",
    "school": "Engineering"
  },
  "allocation": {
    "enclosureLetter": "A",
    "rowLetter": "B",
    "seatNumber": 7
  },
  "enclosureMetadata": {
    "entryDirection": "NORTH"
  }
}
```

### Backend Files

1. **Controller**: `/apps/api/src/controllers/enclosure.controller.ts`
   - `getAllEnclosures()` - Fetches all enclosures with rows
   - `getEnclosure(id)` - Gets single enclosure details
   - `updateEnclosureLayout(id)` - Updates spatial positioning only
   - `createEnclosure()` - Creates new enclosure with rows
   - `updateEnclosure(id)` - Full update of enclosure
   - `deleteEnclosure(id)` - Deletes enclosure if no allocations

2. **Routes**: `/apps/api/src/routes/enclosure.routes.ts`
   ```typescript
   GET    /api/v1/enclosures
   GET    /api/v1/enclosures/:id
   POST   /api/v1/enclosures
   PUT    /api/v1/enclosures/:id
   PATCH  /api/v1/enclosures/:id/layout  // NEW - for position updates
   DELETE /api/v1/enclosures/:id
   ```

## 🗄️ Database Schema

### Enclosure Model
```prisma
model Enclosure {
  id                String   @id @default(auto()) @map("_id") @db.ObjectId
  letter            String   @unique
  name              String?
  allocatedFor      String
  entryDirection    String
  displayOrder      Int      @default(0)
  
  // Spatial positioning fields (NEW)
  positionX         Float?   // X position percentage (0-100)
  positionY         Float?   // Y position percentage (0-100)
  width             Float?   // Width percentage
  height            Float?   // Height percentage
  color             String?  // Hex color code
  
  totalSeats        Int      @default(0)
  rows              Row[]
  seatAllocations   SeatAllocation[]
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

### Migration Required
If spatial fields don't exist in your schema, add them:
```prisma
// Add to Enclosure model:
positionX  Float?
positionY  Float?
width      Float?
height     Float?
color      String?
```

Then run:
```bash
cd apps/api
npx prisma db push
# or
npx prisma migrate dev --name add_spatial_fields
```

## 🎨 Features

### 1. Aerial Ground View
- ✅ Stage at top-center with "MAIN STAGE" label
- ✅ Enclosures positioned using percentage coordinates
- ✅ Color-coded enclosures (customizable per enclosure)
- ✅ Responsive design with proper aspect ratio
- ✅ Legend showing seat status colors
- ✅ Zoom controls (0.5x - 3x)
- ✅ Pan by dragging
- ✅ Touch support for mobile

### 2. Enclosure Interaction
- ✅ Click to view detailed seat layout
- ✅ Hover effects with border highlighting
- ✅ Enclosure name tooltip
- ✅ Visual indicator for user's assigned enclosure

### 3. Seat Detail Modal (District.in Style)
- ✅ Row-wise seat layout
- ✅ Color-coded seats:
  - 🟢 Green: Available
  - ⚪ Gray: Occupied
  - 🔴 Red: Reserved
  - 🔵 Blue with ★: User's seat
- ✅ Row labels (A, B, C, etc.)
- ✅ Seat numbers
- ✅ Scrollable layout for large enclosures
- ✅ Close button with accessibility

### 4. Edit Mode (Admin Only)
- ✅ Toggle edit mode on/off
- ✅ Drag-and-drop enclosure repositioning
- ✅ Visual indicators:
  - Blue border ring in edit mode
  - Cursor changes to move
  - Opacity during drag
  - Blue glow effect
- ✅ Position clamping (10-90% x, 15-85% y)
- ✅ Track pending changes
- ✅ Save to database
- ✅ Discard changes
- ✅ Real-time position display

## 📱 Usage Examples

### For Attendees
1. Navigate to your personal page: `/attendee/[your-enrollment-id]`
2. View the aerial ground layout
3. Your assigned enclosure is highlighted
4. Click any enclosure to see seat details
5. Your seat is marked with a blue star (★)

### For Admins
1. Navigate to: `/admin/aerial-view-editor`
2. Click "Enter Edit Mode"
3. Drag enclosures to reposition them
4. Changes are tracked in real-time
5. Click "Save Layout" to persist to database
6. Or "Discard Changes" to revert

### For Developers (Demo)
1. Navigate to: `/demo/aerial-view`
2. Test with mock data
3. Try edit mode functionality
4. No database connection required

## 🔧 Configuration

### Environment Variables
```bash
# .env.local in /apps/web
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Default Enclosure Positions
If no position is set in database, defaults are used:
```typescript
const defaultPositions = {
  A: { x: 25, y: 35 },
  B: { x: 50, y: 35 },
  C: { x: 75, y: 35 },
  D: { x: 25, y: 60 },
  E: { x: 50, y: 60 },
  F: { x: 75, y: 60 },
  // ... continues for all letters
};
```

### Default Colors
```typescript
const colors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  // ... more colors
];
```

## 🚀 Deployment Checklist

- [x] Backend API endpoints created
- [x] Database schema updated with spatial fields
- [x] Frontend components implemented
- [x] Attendee page connected to API
- [x] Admin editor page created
- [x] Position update endpoint added
- [x] Authentication middleware applied
- [x] Error handling implemented
- [x] Loading states added
- [x] Mobile responsive design
- [x] Accessibility features (ARIA labels, keyboard nav)

## 🐛 Troubleshooting

### Issue: Enclosures not showing
**Solution**: Check if enclosures exist in database and have `positionX`, `positionY` set

### Issue: Can't save layout changes
**Solution**: Verify authentication and check API endpoint `/api/v1/enclosures/:id/layout`

### Issue: Modal not opening
**Solution**: Ensure enclosure has `rows` array populated in database

### Issue: User seat not highlighted
**Solution**: Verify seat allocation exists for the user's enrollment ID

## 📊 Performance Considerations

- Enclosure data is cached with `cache: 'no-store'` for fresh data
- Modal lazy loads seat data only when clicked
- Drag operations use RAF (Request Animation Frame) for smooth updates
- Position updates are batched when saving multiple enclosures

## 🔐 Security

- All API endpoints require authentication via `authenticate` middleware
- Admin routes should have additional admin role check
- Position updates validate data before saving
- XSS protection via React's built-in escaping

## 📈 Future Enhancements

- [ ] Bulk enclosure position updates
- [ ] Undo/redo for layout changes
- [ ] Layout templates (save/load presets)
- [ ] Seat availability real-time updates via WebSocket
- [ ] 3D view option
- [ ] Print-friendly layout view
- [ ] QR code generation for seat info
- [ ] Export layout as image/PDF

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review code comments in component files
3. Check API logs for endpoint errors
4. Verify database schema matches expected structure

---

**Last Updated**: October 7, 2025
**Version**: 1.0.0
**Status**: ✅ Production Ready
