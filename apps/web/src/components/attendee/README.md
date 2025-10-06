# Attendee Seat View Components

This directory contains the theater-style seat visualization components for the convocation seat assignment system, inspired by District.in's seat map interface.

## Components

### 1. `Seat.tsx`
The fundamental seat component with SVG theater-style icon.

**Props:**
- `number`: The seat number to display
- `isSelected`: Whether this is the user's assigned seat (highlighted in red)
- `isReserved`: Whether the seat is reserved/unavailable (grayed out)
- `isInActiveRow`: Whether the seat is in the active row (blue tint)
- `onClick`: Optional click handler
- `className`: Additional CSS classes

**Usage:**
```tsx
<Seat 
  number={15} 
  isSelected={true}
/>
```

### 2. `TheaterSeatMap.tsx`
Interactive seat map showing rows of seats with auto-scroll functionality.

**Props:**
- `enclosure`: Object containing enclosure data (letter, entryDirection, rows)
- `allocation`: Object with rowLetter and seatNumber for the user's seat
- `className`: Additional CSS classes

**Features:**
- Auto-scrolls to the user's seat on mount
- Shows ±3 rows around the user's seat for context
- Displays entry direction indicator
- Shows stage/screen at the top
- Visual legend for seat states
- Responsive design with horizontal scrolling for wide seat rows

**Usage:**
```tsx
<TheaterSeatMap
  enclosure={{
    letter: 'A',
    entryDirection: 'NORTH',
    rows: [
      { letter: 'A', startSeat: 1, endSeat: 50, reservedSeats: '1,25,50' },
      { letter: 'B', startSeat: 1, endSeat: 50, reservedSeats: '10,20' }
    ]
  }}
  allocation={{
    rowLetter: 'B',
    seatNumber: 15
  }}
/>
```

### 3. `VenueMap.tsx`
Grid layout showing all enclosures in the venue.

**Props:**
- `enclosures`: Array of enclosure objects (letter, name, allocatedFor)
- `activeEnclosure`: The currently selected/highlighted enclosure letter
- `onEnclosureClick`: Optional callback when an enclosure is clicked
- `className`: Additional CSS classes

**Features:**
- Responsive grid (2 cols mobile, 3 cols tablet, 4 cols desktop)
- Active enclosure highlighted with gradient and checkmark
- Shows enclosure name and allocation category
- Visual legend

**Usage:**
```tsx
<VenueMap
  enclosures={[
    { letter: 'A', name: 'North Wing', allocatedFor: 'STUDENTS' },
    { letter: 'B', name: 'South Wing', allocatedFor: 'FACULTY' }
  ]}
  activeEnclosure="A"
  onEnclosureClick={(letter) => console.log(letter)}
/>
```

### 4. `VenueMapWrapper.tsx`
Client-side wrapper for VenueMap with interactive state management.

**Props:**
- `enclosures`: Array of enclosure objects
- `activeEnclosure`: The user's assigned enclosure

**Features:**
- Allows clicking on different enclosures to explore
- Shows a "return to your enclosure" button when exploring others

### 5. `index.ts`
Export barrel file for convenient imports.

## Page Implementation

The main attendee page is located at:
```
/app/attendee/[enrollmentId]/page.tsx
```

This page:
1. Fetches seat allocation data from API
2. Displays attendee details
3. Shows venue map with all enclosures
4. Renders interactive theater seat map
5. Provides print functionality

**Additional Files:**
- `loading.tsx`: Skeleton loading state
- `not-found.tsx`: Error page for invalid enrollment IDs

## API Integration

The components expect data in the following format:

```typescript
{
  attendee: {
    name: string;
    enrollmentId: string;
    course: string;
    school: string;
  },
  allocation: {
    enclosureLetter: string;
    rowLetter: string;
    seatNumber: number;
  },
  enclosureMetadata: {
    letter: string;
    entryDirection: string;
    rows: Array<{
      letter: string;
      startSeat: number;
      endSeat: number;
      reservedSeats: string; // comma-separated: "1,5,10"
    }>;
  }
}
```

## Styling

All components use:
- Tailwind CSS for styling
- `cn()` utility from `@/lib/utils` for conditional classes
- Responsive design with mobile-first approach
- Touch-friendly interactions (larger tap targets on mobile)

## Color Scheme

- **Selected Seat (User's)**: Red gradient (#ef4444 to #dc2626)
- **Active Row**: Blue tint (#dbeafe background, #3b82f6 accent)
- **Reserved Seats**: Gray (#9ca3af)
- **Available Seats**: Light gray (#e5e7eb)
- **Active Enclosure**: Blue-indigo gradient (#3b82f6 to #4f46e5)

## Accessibility

- All interactive elements have proper `aria-label` attributes
- Keyboard navigation support
- Focus states with ring indicators
- High contrast text for readability
- Touch targets meet minimum size requirements (44x44px)

## Mobile Optimization

- Responsive grid layouts
- Horizontal scrolling for wide seat rows
- Touch-friendly button sizes
- Optimized SVG rendering
- Smooth scroll animations

## Print Styles

The page includes a print button that triggers `window.print()`. Consider adding print-specific CSS:

```css
@media print {
  .no-print { display: none; }
  /* Add print-specific styles */
}
```

## Future Enhancements

- [ ] Add seat zoom functionality
- [ ] Implement touch gestures (pinch-to-zoom)
- [ ] Add QR code for seat ticket
- [ ] Export seat details as PDF
- [ ] Add seat swap/exchange feature
- [ ] Show nearby facilities (restrooms, exits)
- [ ] Add 3D venue visualization option
