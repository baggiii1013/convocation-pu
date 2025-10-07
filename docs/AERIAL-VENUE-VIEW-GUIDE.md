# Aerial Venue View Implementation Guide

## Overview

This implementation provides an **interactive aerial view of the convocation ground** similar to district.in's venue visualization. It features:

- 🗺️ **Top-down aerial view** with spatial positioning of enclosures
- 🎭 **Main stage** prominently displayed at top-center
- 🪑 **Interactive seat layouts** with district.in-style seat selection
- 🔍 **Zoom and pan controls** for easy navigation
- 📱 **Mobile-responsive** with touch support

## Architecture

### Components Created

#### 1. `AerialVenueView.tsx`
Main aerial view component showing the convocation ground from above.

**Features:**
- Spatial positioning of enclosures using percentage-based coordinates
- Zoom controls (0.5x to 3x)
- Pan/drag functionality for navigation
- Stage indicator at top-center
- Entry gates on sides
- Visual pathways and grid
- Legend for seat status

**Props:**
```typescript
{
  enclosures: Enclosure[];
  activeEnclosure?: string;
  onEnclosureClick?: (letter: string) => void;
  className?: string;
  showControls?: boolean;
}
```

#### 2. `EnclosureDetailModal.tsx`
Modal popup showing detailed seat layout when an enclosure is clicked.

**Features:**
- Theater-style row-wise seat display
- Color-coded seat status (available, occupied, reserved, user)
- User's seat highlighted with star (★)
- Entry direction indicator
- Stage direction marker
- Seat count and statistics
- Interactive seat selection

**Props:**
```typescript
{
  enclosure: {
    letter: string;
    name?: string;
    allocatedFor: string;
    entryDirection: string;
    totalSeats?: number;
    rows: Row[];
  };
  userAllocation?: {
    rowLetter: string;
    seatNumber: number;
  };
  onClose: () => void;
  isOpen: boolean;
}
```

#### 3. `AerialVenueWrapper.tsx`
Wrapper component that manages state and integrates both aerial view and modal.

**Features:**
- State management for modal open/close
- Handles enclosure selection
- Passes user allocation to modal
- Seamless integration between aerial view and detail modal

### Database Schema Updates

The `Enclosure` model was enhanced with spatial positioning fields:

```prisma
model Enclosure {
  // ... existing fields ...
  
  // New spatial positioning fields
  positionX      Float?        @default(0)    // X coordinate (0-100%)
  positionY      Float?        @default(0)    // Y coordinate (0-100%)
  width          Float?        @default(15)   // Width percentage
  height         Float?        @default(15)   // Height percentage
  color          String?       @default("#3B82F6") // Hex color
}
```

## Usage

### Basic Implementation

```tsx
import { AerialVenueWrapper } from '@/components/attendee/AerialVenueWrapper';

// Fetch enclosures from API
const enclosures = await getEnclosures();

// Render the aerial view
<AerialVenueWrapper
  enclosures={enclosures}
  userAllocation={{
    enclosureLetter: 'A',
    rowLetter: 'B',
    seatNumber: 7
  }}
/>
```

### Setting Enclosure Positions

Enclosures use percentage-based positioning (0-100%):

```typescript
const enclosure = {
  letter: 'A',
  positionX: 25,  // 25% from left
  positionY: 35,  // 35% from top
  width: 18,      // 18% of container width
  height: 18,     // 18% of container height
  color: '#3B82F6' // Blue color
};
```

### Default Positioning

If positions are not set, the component uses a default grid layout:
- Top row: 20%, 42.5%, 65% from left
- Bottom row: 20%, 42.5%, 65% from left
- Vertical positions: 30% (top), 55% (bottom)

## Visual Design

### Color Coding

**Enclosures:**
- Default: Blue (#3B82F6)
- Active/Selected: Yellow ring highlight
- Hover: White ring overlay

**Seats:**
- Available: Green (#10B981)
- Occupied: Gray (#9CA3AF)
- Reserved: Red (#EF4444)
- User's Seat: Blue with yellow ring and star (★)

### Stage Design

```
┌──────────────────────────────────┐
│     ● ● ● MAIN STAGE ● ● ●       │
│      Convocation Ceremony         │
└──────────────────────────────────┘
```

Positioned at 8% from top, horizontally centered.

### Entry Gates

Visual indicators on sides:
- West Entry (left side)
- East Entry (right side)
- Customizable per enclosure

## Interactive Features

### Zoom Controls

- **Zoom In**: Increase scale up to 3x
- **Zoom Out**: Decrease scale down to 0.5x
- **Reset View**: Return to 1x zoom and centered position

### Pan/Drag

- **Desktop**: Click and drag to pan
- **Mobile**: Touch and drag to pan
- Smooth transitions with CSS transforms

### Enclosure Interaction

1. Click enclosure block in aerial view
2. Modal opens with detailed seat layout
3. View all rows and individual seats
4. User's seat automatically highlighted
5. Close modal to return to aerial view

## Mobile Optimization

- Touch-friendly controls
- Responsive grid layouts
- Pinch-to-zoom support (can be added)
- Optimized button sizes for mobile
- Scrollable content in modals

## Integration with Existing System

### Attendee Page Integration

The aerial view has been integrated into the attendee seat page:

```tsx
// apps/web/src/app/attendee/[enrollmentId]/page.tsx

<AerialVenueWrapper
  enclosures={enclosures}
  userAllocation={{
    enclosureLetter: data.allocation.enclosureLetter,
    rowLetter: data.allocation.rowLetter,
    seatNumber: data.allocation.seatNumber
  }}
/>
```

### API Requirements

Ensure the enclosures API returns:
```typescript
{
  id: string;
  letter: string;
  name?: string;
  allocatedFor: string;
  entryDirection: string;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  color?: string;
  totalSeats?: number;
  rows: Array<{
    letter: string;
    startSeat: number;
    endSeat: number;
    reservedSeats: string;
    displayOrder: number;
  }>;
}
```

## Admin Configuration (Future Enhancement)

To enable admin configuration of enclosure positions:

1. **UI for Position Editor:**
   - Drag-and-drop enclosures in aerial view
   - Input fields for precise positioning
   - Color picker for enclosure colors
   - Preview mode

2. **API Endpoints:**
   ```
   PUT /api/enclosures/:id/position
   Body: { positionX, positionY, width, height, color }
   ```

3. **Implementation:**
   ```tsx
   const handleDragEnd = async (letter, newX, newY) => {
     await updateEnclosurePosition(letter, {
       positionX: newX,
       positionY: newY
     });
   };
   ```

## Demo Page

A demo page is available at `/demo/aerial-view` with:
- Sample enclosure data
- Full functionality demonstration
- Usage instructions
- Feature highlights

## Testing

### Manual Testing Checklist

- [ ] Aerial view renders correctly
- [ ] All enclosures are visible
- [ ] Stage appears at top-center
- [ ] Zoom controls work (in/out/reset)
- [ ] Pan/drag functionality works
- [ ] Clicking enclosure opens modal
- [ ] Modal shows correct seat layout
- [ ] User's seat is highlighted
- [ ] Close modal returns to aerial view
- [ ] Mobile touch events work
- [ ] Responsive on different screen sizes

### Test Data

Use the demo page data structure for testing:
```tsx
const testEnclosures = [
  {
    letter: 'A',
    positionX: 25,
    positionY: 35,
    // ... other fields
  }
];
```

## Performance Considerations

1. **Lazy Loading**: Modal content loads only when opened
2. **CSS Transforms**: Hardware-accelerated transformations
3. **Debounced Events**: Pan/drag events are optimized
4. **Memoization**: Consider using React.memo for enclosure blocks

## Accessibility

- Keyboard navigation support
- ARIA labels for interactive elements
- Focus management in modal
- Color contrast ratios meet WCAG standards
- Screen reader announcements

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (including iOS)
- Mobile browsers: Touch events supported

## Future Enhancements

1. **3D View**: Add perspective transform for depth
2. **Live Updates**: Real-time seat availability via WebSocket
3. **Path Finding**: Show route from entry to seat
4. **Accessibility Mode**: High contrast and reduced motion
5. **Print Layout**: Optimized print view of seat assignment
6. **Multi-language**: Support for multiple languages
7. **Dark Mode**: Dark theme support

## Troubleshooting

### Enclosures Not Showing
- Check if enclosure data includes `positionX` and `positionY`
- Verify default positioning logic
- Inspect browser console for errors

### Modal Not Opening
- Verify `onEnclosureClick` handler is connected
- Check if enclosure has `rows` data
- Ensure modal state management is working

### Zoom/Pan Issues
- Check if event handlers are properly bound
- Verify CSS transform values
- Test with different browsers

## Credits

Inspired by [district.in](https://www.district.in)'s venue seat selection interface.

## Support

For issues or questions, refer to the main project documentation or contact the development team.
