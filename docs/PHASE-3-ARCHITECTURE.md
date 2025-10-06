# Phase 3 Component Architecture

## Component Tree Structure

```
📄 /attendee/[enrollmentId]/page.tsx (Server Component)
│
├─ 📦 Card (Header Section)
│  └─ Convocation Title & Description
│
├─ 📦 Grid Layout (lg:grid-cols-3)
│  │
│  ├─ 📦 Card (Venue Overview)
│  │  └─ 🔷 VenueMap
│  │     ├─ Enclosure Grid (2/3/4 cols responsive)
│  │     ├─ Active Enclosure Highlight
│  │     └─ Legend
│  │
│  └─ 📦 Card (Attendee Details)
│     ├─ Personal Information
│     │  ├─ Name
│     │  ├─ Enrollment ID
│     │  ├─ Course
│     │  └─ School
│     │
│     └─ Seat Information Card (Gradient)
│        ├─ Enclosure Letter
│        ├─ Row Letter
│        ├─ Seat Number
│        └─ Important Tips
│
└─ 📦 Card (Interactive Seat Map)
   └─ 🔷 TheaterSeatMap
      ├─ Entry Direction Indicator
      ├─ Stage/Screen Indicator
      ├─ Seat Rows (±3 rows context)
      │  └─ 🔷 Seat (multiple instances)
      │     ├─ SVG Icon
      │     │  ├─ Seat Back
      │     │  ├─ Seat Cushion
      │     │  └─ Armrests
      │     └─ Seat Number
      │
      └─ Legend (Your Seat, Available, Reserved)
```

---

## Component Hierarchy

### Level 1: Page (Server Component)
```
page.tsx
├─ Fetches data from API
├─ Handles not-found redirects
└─ Renders layout with data
```

### Level 2: Layout Containers
```
Cards & Grid
├─ Responsive grid (1/3 columns)
├─ Card wrappers for sections
└─ Print button
```

### Level 3: Feature Components
```
VenueMap (Client Component)
├─ Props: enclosures[], activeEnclosure, onEnclosureClick?
├─ Renders grid of enclosure buttons
└─ Highlights active enclosure

TheaterSeatMap (Client Component)
├─ Props: enclosure, allocation
├─ Auto-scrolls to active seat
├─ Renders seat rows
└─ Shows legend
```

### Level 4: Primitive Components
```
Seat (Client Component)
├─ Props: number, isSelected, isReserved, isInActiveRow
├─ Renders SVG theater seat
└─ Handles click events
```

---

## Data Flow

```
┌─────────────────────────────────────────┐
│  External API                            │
│  ├─ /api/attendees/:id/seat             │
│  └─ /api/enclosures                     │
└───────────────┬─────────────────────────┘
                │
                │ fetch (Server-side)
                ▼
┌─────────────────────────────────────────┐
│  page.tsx (Server Component)            │
│  ├─ getAttendeeSeat()                   │
│  └─ getAllEnclosures()                  │
└───────────────┬─────────────────────────┘
                │
                │ Props
                ▼
┌─────────────────────────────────────────┐
│  Client Components                       │
│  ├─ VenueMap                            │
│  │  └─ receives: enclosures[]           │
│  │                                       │
│  └─ TheaterSeatMap                      │
│     └─ receives: enclosure, allocation  │
└───────────────┬─────────────────────────┘
                │
                │ Props
                ▼
┌─────────────────────────────────────────┐
│  Seat Component                          │
│  └─ receives: number, states            │
└─────────────────────────────────────────┘
```

---

## State Management

### Server State (API Data)
```typescript
// Fetched on server
const data = await getAttendeeSeat(enrollmentId);
const enclosures = await getAllEnclosures();

// No client-side state management needed
// Data flows down as props
```

### Client State (UI Interactions)
```typescript
// TheaterSeatMap.tsx
const [hasScrolled, setHasScrolled] = useState(false);
// Tracks if auto-scroll has executed

// VenueMapWrapper.tsx (if using wrapper)
const [selectedEnclosure, setSelectedEnclosure] = useState(activeEnclosure);
// Tracks currently viewed enclosure
```

### Ref Management
```typescript
// TheaterSeatMap.tsx
const activeRowRef = useRef<HTMLDivElement>(null);
const activeSeatRef = useRef<HTMLButtonElement>(null);
// Used for auto-scroll functionality
```

---

## Styling Architecture

### Utility Classes (Tailwind)
```
Mobile First Approach:
├─ Base styles (< 640px)
├─ sm: breakpoint (≥ 640px)
└─ lg: breakpoint (≥ 1024px)
```

### Dynamic Classes
```typescript
cn(
  'base classes',
  condition && 'conditional classes',
  anotherCondition ? 'true classes' : 'false classes'
)
```

### Color System
```
Seat States:
├─ Selected: red-500 → red-600
├─ Reserved: gray-400 → gray-500
├─ Active Row: blue-100 (bg), blue-400 (stroke)
└─ Available: gray-200 → gray-400

Enclosures:
├─ Active: blue-500 → indigo-600 (gradient)
└─ Inactive: white (bg), gray-700 (text)
```

---

## Responsive Behavior

### Breakpoint Adaptations

**Mobile (< 640px)**
```
Grid: 1 column (stack everything)
Venue Map: 2 enclosures per row
Seat Size: w-10 h-10
Text: Base sizes
Touch Targets: ≥44x44px
```

**Tablet (640px - 1024px)**
```
Grid: 2 columns (venue + details, full-width map)
Venue Map: 3 enclosures per row
Seat Size: w-12 h-12
Text: Slightly larger
```

**Desktop (≥ 1024px)**
```
Grid: 3 columns (venue | details | full-width map below)
Venue Map: 4 enclosures per row
Seat Size: w-12 h-12
Text: Full sizes
```

---

## Event Handling

### User Interactions

```typescript
// Seat click (currently disabled, but ready)
<Seat onClick={() => handleSeatClick(seatNumber)} />

// Enclosure click
<VenueMap onEnclosureClick={(letter) => console.log(letter)} />

// Print button
<button onClick={() => window.print()}>Print</button>
```

### Auto-scroll
```typescript
useEffect(() => {
  if (!hasScrolled && activeRowRef.current && activeSeatRef.current) {
    setTimeout(() => {
      activeSeatRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
      setHasScrolled(true);
    }, 500);
  }
}, [hasScrolled]);
```

---

## Performance Optimizations

### Current Optimizations
```
✅ Server-side rendering (SSR)
✅ Conditional rendering (visible rows only: ±3)
✅ CSS transitions (hardware accelerated)
✅ Minimal re-renders (useState used sparingly)
✅ Inline SVG (no image requests)
```

### Future Optimizations
```
⏳ React.memo() on Seat component
⏳ Virtual scrolling for large enclosures
⏳ Image optimization (if photos added)
⏳ Code splitting
⏳ Lazy loading for off-screen content
```

---

## Error Boundaries

### Current Error Handling
```
✅ not-found.tsx for invalid enrollment IDs
✅ Server-side null checks
✅ API error handling (returns null)
```

### Recommended Additions
```
⏳ Error boundary component
⏳ Toast notifications for errors
⏳ Retry mechanisms
⏳ Fallback UI for failed renders
```

---

## Testing Strategy

### Unit Testing
```typescript
// Test individual components
describe('Seat', () => {
  it('renders seat number', () => {...});
  it('applies selected style', () => {...});
  it('disables reserved seats', () => {...});
});
```

### Integration Testing
```typescript
// Test component interactions
describe('TheaterSeatMap', () => {
  it('auto-scrolls to active seat', () => {...});
  it('parses reserved seats correctly', () => {...});
  it('renders correct number of rows', () => {...});
});
```

### E2E Testing
```typescript
// Test full user flow
test('User can view their seat', async () => {
  await page.goto('/attendee/210101001');
  await expect(page.locator('text=Row B')).toBeVisible();
  await expect(page.locator('text=Seat 15')).toBeVisible();
});
```

---

## File Size & Bundle Analysis

### Estimated Sizes (Gzipped)

```
Seat.tsx:           ~2KB
TheaterSeatMap.tsx: ~4KB
VenueMap.tsx:       ~3KB
page.tsx:           ~5KB
Total Components:   ~15KB

Dependencies:
- React:            ~40KB (already loaded)
- Tailwind:         ~10KB (only used classes)
- shadcn/ui:        ~5KB (Card component)
```

---

## Accessibility Features

### Keyboard Navigation
```
Tab: Navigate between interactive elements
Enter/Space: Activate buttons
Escape: Close modals (future)
```

### Screen Readers
```
aria-label: "Seat 15"
role: button (implicit on <button>)
disabled: true (for reserved seats)
```

### Visual Accessibility
```
High contrast text
Focus indicators (ring-2)
Color not sole indicator (text + icon)
Touch targets ≥44x44px
```

---

## Browser Support Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| CSS Grid | ✅ 90+ | ✅ 88+ | ✅ 14+ | ✅ 90+ |
| Flexbox | ✅ 90+ | ✅ 88+ | ✅ 14+ | ✅ 90+ |
| SVG | ✅ 90+ | ✅ 88+ | ✅ 14+ | ✅ 90+ |
| scrollIntoView | ✅ 90+ | ✅ 88+ | ✅ 14+ | ✅ 90+ |
| ES6+ | ✅ 90+ | ✅ 88+ | ✅ 14+ | ✅ 90+ |

---

## Deployment Considerations

### Environment Variables
```bash
# Required
NEXT_PUBLIC_API_URL=https://api.production.com

# Optional
NEXT_PUBLIC_PRINT_ENABLED=true
NEXT_PUBLIC_ANALYTICS_ID=GA-XXXXX
```

### Build Optimization
```bash
# Next.js optimizations
next build

# Analyze bundle
npm install @next/bundle-analyzer
```

### CDN Considerations
```
✅ Static assets served from CDN
✅ SVGs inline (no CDN needed)
✅ Fonts from Google Fonts
```

---

## Migration Path (If Needed)

### From Static to Dynamic
```typescript
// Current: SSR with fetch
const data = await fetch(...);

// Future: Client-side with SWR/React Query
const { data } = useSWR('/api/attendees/:id/seat');
```

### From REST to GraphQL
```graphql
query GetAttendeeSeat($enrollmentId: String!) {
  attendee(enrollmentId: $enrollmentId) {
    name
    allocation {
      enclosureLetter
      rowLetter
      seatNumber
    }
  }
}
```

---

**End of Architecture Documentation**

For implementation details, see:
- `PHASE-3-IMPLEMENTATION-SUMMARY.md`
- `PHASE-3-QUICK-START.md`
- Component README files
