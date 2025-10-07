# Aerial Venue View - Visual Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Opens Attendee Page                     │
│                  /attendee/[enrollmentId]                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Fetch Data from APIs                          │
│  ┌──────────────────────┐  ┌───────────────────────────────┐   │
│  │  Get Attendee Seat   │  │  Get All Enclosures           │   │
│  │  /api/attendees/:id  │  │  /api/enclosures              │   │
│  └──────────────────────┘  └───────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   AerialVenueWrapper Component                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              State Management                             │  │
│  │  - selectedEnclosure: string | null                       │  │
│  │  - isModalOpen: boolean                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
          ↓                                    ↓
┌──────────────────────────┐      ┌──────────────────────────────┐
│  AerialVenueView         │      │  EnclosureDetailModal        │
│  (Main Ground View)      │      │  (Seat Layout View)          │
│                          │      │                              │
│  ┌────────────────────┐  │      │  ┌────────────────────────┐ │
│  │  Zoom Controls     │  │      │  │  Modal Header          │ │
│  │  + / - / Reset     │  │      │  │  - Enclosure Info      │ │
│  └────────────────────┘  │      │  └────────────────────────┘ │
│                          │      │                              │
│  ┌────────────────────┐  │      │  ┌────────────────────────┐ │
│  │  Stage (Top)       │  │      │  │  Stage Direction       │ │
│  │  Main Stage Label  │  │      │  │  Entry Direction       │ │
│  └────────────────────┘  │      │  └────────────────────────┘ │
│                          │      │                              │
│  ┌────────────────────┐  │      │  ┌────────────────────────┐ │
│  │  Enclosure Blocks  │  │ ───> │  │  Row-wise Seat Grid    │ │
│  │  - Click to open   │  │      │  │  - Seat status colors  │ │
│  │  - Position based  │  │      │  │  - User seat (★)       │ │
│  │  - Color coded     │  │      │  │  - Interactive         │ │
│  └────────────────────┘  │      │  └────────────────────────┘ │
│                          │      │                              │
│  ┌────────────────────┐  │      │  ┌────────────────────────┐ │
│  │  Entry Gates       │  │      │  │  Legend                │ │
│  │  West & East       │  │      │  │  - Available (Green)   │ │
│  └────────────────────┘  │      │  │  - Occupied (Gray)     │ │
│                          │      │  │  - Reserved (Red)      │ │
│  ┌────────────────────┐  │      │  │  - User Seat (Blue ★) │ │
│  │  Legend            │  │      │  └────────────────────────┘ │
│  │  - Seat colors     │  │      │                              │
│  └────────────────────┘  │      │  [Close Button]              │
└──────────────────────────┘      └──────────────────────────────┘
```

## Visual Layout - Aerial View

```
┌────────────────────────────────────────────────────────────────┐
│  [+]  [−]  [⌂]                                    Zoom: 100%   │ Controls
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                    ╔══════════════════╗                        │
│                    ║   ● STAGE ●      ║  ← Stage at top-center│
│                    ╚══════════════════╝                        │
│                                                                │
│         ┌────────┐      ┌────────┐      ┌────────┐           │
│  West   │   A    │      │   B    │      │   C    │   East    │
│  Entry  │ Students│     │ Faculty│      │ Guests │   Entry   │
│    ←    │  ★ 200 │      │  150   │      │  180   │    →      │
│         └────────┘      └────────┘      └────────┘           │
│                                                                │
│         ┌────────┐      ┌────────┐      ┌────────┐           │
│         │   D    │      │   E    │      │   F    │           │
│         │  VIP   │      │ Staff  │      │ Mixed  │           │
│         │  100   │      │  120   │      │  160   │           │
│         └────────┘      └────────┘      └────────┘           │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Legend:  🟡 Your Enclosure  🔵 Others  ⬛ Stage          │ │
│  │  💡 Click enclosure to view seats                         │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

## Visual Layout - Seat Detail Modal

```
┌────────────────────────────────────────────────────────────────┐
│  ⓘ Enclosure A - North Wing                              [X]  │ Header
│     👥 STUDENTS • 200 seats                                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                📍 Entry: NORTH                                 │
│                                                                │
│              ▼ ━━━━━ STAGE ━━━━━ ▼                            │
│              ────────────────────────                          │
│                                                                │
│  [A] ⬜⬜⬜⬜⬜⬛⬜⬜⬜★⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ [A]  │ Row A
│      1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20│
│                                                                │
│  [B] ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ [B]  │ Row B
│      1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20│
│                                                                │
│  [C] ⬜⬜⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ [C]  │ Row C
│      1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20│
│                                                                │
│  [D] ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ [D]  │ Row D
│      1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20│
│                                                                │
│  [E] ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬛⬜⬜ [E]  │ Row E
│      1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20│
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  ★ Your Assigned Seat: Row B, Seat 10                    │ │ User Info
│  │     Look for the starred seat (★) in the map above       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  Legend:  🟩 Available  ⬛ Occupied  🟥 Reserved  🔵★ Your Seat│ Footer
└────────────────────────────────────────────────────────────────┘

Legend:
⬜ = Available seat (Green)
⬛ = Occupied seat (Gray)
🟥 = Reserved seat (Red)
★ = User's assigned seat (Blue with star)
```

## Component Hierarchy

```
AerialVenueWrapper
├── AerialVenueView
│   ├── Controls (Zoom +/-, Reset)
│   ├── Stage Component
│   ├── Enclosure Blocks (Map)
│   │   └── Individual Enclosure Button
│   ├── Entry Gates (West/East)
│   ├── Pathways (Visual guides)
│   └── Legend
│
└── EnclosureDetailModal (Conditional)
    ├── Modal Header
    │   ├── Enclosure Info
    │   └── Close Button
    ├── Modal Content
    │   ├── Entry Direction
    │   ├── Stage Direction
    │   ├── Seat Grid (Rows Map)
    │   │   └── Individual Seat Buttons
    │   └── User Seat Info
    └── Legend Footer
```

## Data Flow

```
┌─────────────────┐
│   API Server    │
│   (Prisma)      │
└────────┬────────┘
         │
         │ GET /api/enclosures
         │ GET /api/attendees/:id/seat
         │
         ↓
┌─────────────────────────────────┐
│   Next.js Server Component      │
│   (attendee/[enrollmentId])     │
└────────┬────────────────────────┘
         │
         │ Pass props
         │
         ↓
┌─────────────────────────────────┐
│   AerialVenueWrapper            │
│   (Client Component)            │
│                                 │
│   State:                        │
│   - selectedEnclosure           │
│   - isModalOpen                 │
└────────┬────────────────────────┘
         │
         ├─────────────────┬──────────────────┐
         │                 │                  │
         ↓                 ↓                  ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Aerial View  │  │    Modal     │  │  User Data   │
│              │  │              │  │              │
│ Props:       │  │ Props:       │  │ From API:    │
│ - enclosures │  │ - enclosure  │  │ - allocation │
│ - active     │  │ - user alloc │  │ - attendee   │
│ - onClick    │  │ - isOpen     │  │ - enclosure  │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Event Flow

```
1. User Loads Page
   ↓
2. Fetch APIs (enclosures, attendee seat)
   ↓
3. Render AerialVenueWrapper
   ↓
4. Display AerialVenueView with enclosures
   ↓
5. User clicks enclosure block
   ↓
6. onClick handler triggered
   ↓
7. Update state: setSelectedEnclosure(letter), setIsModalOpen(true)
   ↓
8. EnclosureDetailModal renders
   ↓
9. Display seat layout for selected enclosure
   ↓
10. User views seats, identifies their seat (★)
    ↓
11. User clicks close button
    ↓
12. Update state: setIsModalOpen(false)
    ↓
13. Return to aerial view
```

## Responsive Breakpoints

```
Mobile (< 640px)
┌────────────┐
│   STAGE    │
├────────────┤
│  [A]  [B]  │
│  [C]  [D]  │
│  [E]  [F]  │
├────────────┤
│  Legend    │
└────────────┘

Tablet (640px - 1024px)
┌─────────────────────┐
│      STAGE          │
├─────────────────────┤
│  [A]  [B]  [C]      │
│  [D]  [E]  [F]      │
├─────────────────────┤
│  Legend             │
└─────────────────────┘

Desktop (> 1024px)
┌──────────────────────────────┐
│         STAGE                │
├──────────────────────────────┤
│  [A]    [B]    [C]           │
│  [D]    [E]    [F]           │
├──────────────────────────────┤
│  Legend                      │
└──────────────────────────────┘
```

## Color Palette

```
Enclosures:
  Students:  #3B82F6 (Blue)    ████
  Faculty:   #10B981 (Green)   ████
  Guests:    #F59E0B (Amber)   ████
  VIP:       #EF4444 (Red)     ████
  Staff:     #8B5CF6 (Purple)  ████
  Mixed:     #EC4899 (Pink)    ████

Seats:
  Available:  #10B981 (Green)  ⬜
  Occupied:   #9CA3AF (Gray)   ⬛
  Reserved:   #EF4444 (Red)    🟥
  User Seat:  #3B82F6 (Blue)   🔵★

UI Elements:
  Background: #F9FAFB (Gray-50)
  Stage:      #1F2937 (Gray-800)
  Highlight:  #FCD34D (Yellow-400)
```

## Performance Metrics

```
Component Render Times (Target):
├── AerialVenueView: < 50ms
├── Enclosure Blocks: < 10ms each
├── Modal Open Animation: 300ms
├── Zoom Transition: 200ms
└── Pan/Drag Response: < 16ms (60fps)

Asset Sizes:
├── AerialVenueView.tsx: ~8KB
├── EnclosureDetailModal.tsx: ~9KB
├── AerialVenueWrapper.tsx: ~3KB
└── Total CSS (inline): ~2KB
```

---

This visual architecture document provides a comprehensive overview of how the aerial venue view system is structured and operates.
