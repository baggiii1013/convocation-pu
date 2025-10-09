# 📱 Phase 3 Visual Component Guide

This guide shows what each component looks like and how they work together.

---

## 🎨 Complete Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (Fixed top, glassmorphism on scroll)                    │
│ [☰] PU Logo  [Search..................] 🔔 ☀️/🌙 [👤 User ▼] │
└─────────────────────────────────────────────────────────────────┘
┌──────────┬──────────────────────────────────────────────────────┐
│          │ BREADCRUMB                                           │
│ SIDEBAR  │ 🏠 > Section > Current Page                         │
│          ├──────────────────────────────────────────────────────┤
│ 🏠 Home  │                                                      │
│ 📅 Events│                 MAIN CONTENT AREA                   │
│ 👥 Users │                                                      │
│ ⚙️ Config│                 (Your page content)                 │
│          │                                                      │
│ [Help]   │                                                      │
└──────────┴──────────────────────────────────────────────────────┘
                           [BOTTOM NAV - Mobile Only]
                           [🏠] [📅] [👥] [⚙️]
```

---

## 1️⃣ Header Component

### Desktop View
```
┌───────────────────────────────────────────────────────────────────┐
│ [☰] 🔵 PU Convocation    [🔍 Search.................] 🔔₅ ☀️ 👤▼ │
└───────────────────────────────────────────────────────────────────┘
```

### Mobile View
```
┌──────────────────────────────────────────┐
│ [☰] 🔵 PU          🔍 🔔₅ ☀️ 👤▼        │
└──────────────────────────────────────────┘
```

### Features
- **Logo**: Gradient purple background with "PU" text
- **Menu Button**: Opens sidebar on mobile/tablet
- **Search**: 
  - Desktop: Always visible input
  - Mobile: Toggle button that expands search bar
- **Notification Badge**: Red circle with count
- **Theme Toggle**: Sun/Moon icon with smooth animation
- **User Menu**: Avatar with dropdown

### States
- **Default**: Transparent background
- **Scrolled**: Glassmorphism (blur + semi-transparent)
- **Mobile Search Open**: Expands below header

---

## 2️⃣ Sidebar Component

### Desktop View (Expanded)
```
┌─────────────────────┐
│ 🔵 PU Convocation ⟨ │
├─────────────────────┤
│                     │
│ ● 🏠 Dashboard      │  ← Active
│   📅 Events         │
│   👥 Attendees  ③  │  ← Badge
│   📊 Reports        │
│   ⚙️ Settings       │
│                     │
├─────────────────────┤
│ Need Help?          │
│ Contact support for │
│ assistance          │
│ [Get Support]       │
└─────────────────────┘
```

### Desktop View (Collapsed)
```
┌────┐
│ 🔵 ⟩│
├────┤
│ ●  │
│ 🏠 │
│ 📅 │
│ 👥③│
│ 📊 │
│ ⚙️ │
└────┘
```

### Mobile View (Overlay)
```
[Dark backdrop]
┌─────────────────────┐
│ 🔵 PU Convocation ⟨ │
├─────────────────────┤
│ ● 🏠 Dashboard      │
│   📅 Events         │
│   👥 Attendees      │
│   📊 Reports        │
│   ⚙️ Settings       │
├─────────────────────┤
│ [Help Section]      │
└─────────────────────┘
```

### Features
- **Active Indicator**: Purple background with glow
- **Badges**: Optional notification count
- **Collapse/Expand**: Icon-only mode on desktop
- **Overlay**: Semi-transparent backdrop on mobile
- **Help Section**: Fixed at bottom
- **Auto-close**: Closes on navigation (mobile)

---

## 3️⃣ Bottom Navigation (Mobile Only)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ●                                                       │
│  🏠        📅        👥        ⚙️                       │
│  Home     Events  Attendees Settings                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Features
- **Fixed Position**: Always at bottom
- **Glassmorphism**: Blur + semi-transparent
- **Active Indicator**: Purple background + glow
- **Safe Area**: iOS notch/home indicator spacing
- **4 Items**: Optimal for mobile UX
- **Icons + Labels**: Clear navigation

### States
```
Normal:    🏠        Active:    ●
           Home                🏠  ← Purple bg + scale
                              Home
```

---

## 4️⃣ Breadcrumb Component

```
🏠 > Dashboard > Users > User Profile
↑       ↑         ↑           ↑
Home  Link      Link      Current (no link)
```

### Features
- **Home Icon**: Always first item
- **Separators**: Chevron right (>)
- **Links**: All items except last
- **Current Page**: Bold, no link
- **Hover**: Purple background highlight

---

## 5️⃣ Theme Toggle

### Light Mode
```
┌────┐
│ ☀️ │  ← Visible
│ 🌙 │  ← Hidden (scale: 0)
└────┘
```

### Dark Mode
```
┌────┐
│ ☀️ │  ← Hidden (scale: 0)
│ 🌙 │  ← Visible
└────┘
```

### Features
- **Smooth Transition**: Icons scale and fade
- **Persistence**: Saves to localStorage
- **System Preference**: Detects initial preference
- **Toggle**: Click to switch

---

## 6️⃣ User Menu

### Trigger
```
┌──────────────────────┐
│ 👤 John Doe        ▼│
│    john@example.com  │
└──────────────────────┘
```

### Dropdown (Open)
```
┌──────────────────────┐
│ 👤 John Doe        ▼│
│    john@example.com  │
└──────────────────────┘
  ┌────────────────┐
  │ 👤 Profile     │
  │ ⚙️ Settings    │
  ├────────────────┤
  │ 🚪 Logout      │  ← Red text
  └────────────────┘
```

### Features
- **Avatar**: Image or initials fallback
- **User Info**: Name + email (desktop only)
- **Menu Items**: Profile, Settings, Logout
- **Hover**: Purple highlight
- **Keyboard**: Arrow keys to navigate

---

## 7️⃣ Dashboard Layout

### Desktop Layout
```
┌──────────────────────────────────────────────────────────────┐
│                         HEADER                               │
└──────────────────────────────────────────────────────────────┘
┌──────────┬───────────────────────────────────────────────────┐
│          │ BREADCRUMB                                        │
│ SIDEBAR  ├───────────────────────────────────────────────────┤
│          │                                                   │
│          │              PAGE CONTENT                         │
│          │                                                   │
│          │                                                   │
└──────────┴───────────────────────────────────────────────────┘
```

### Mobile Layout
```
┌────────────────────────────────────┐
│            HEADER                  │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│         BREADCRUMB                 │
├────────────────────────────────────┤
│                                    │
│        PAGE CONTENT                │
│                                    │
│                                    │
│                                    │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│      🏠  📅  👥  ⚙️               │
│    BOTTOM NAVIGATION               │
└────────────────────────────────────┘
```

---

## 🎨 Color System

### Primary Colors
```
Light Mode:
- Background: White/Light gray
- Card: White with subtle shadow
- Text: Dark gray/Black
- Primary: Purple (#6D49FD)

Dark Mode:
- Background: Very dark blue (#0A0A0F)
- Card: Dark surface (#1A1A24)
- Text: White/Light gray
- Primary: Purple (#6D49FD)
```

### Active States
```
Navigation Item (Inactive):
┌────────────────┐
│ 🏠 Dashboard   │  Light gray text
└────────────────┘

Navigation Item (Active):
┌────────────────┐
│ ● 🏠 Dashboard │  Purple bg, white text, glow
└────────────────┘
```

---

## 🎬 Animations

### Sidebar Slide
```
Closed → Open:
[  ]  →  [    ]  →  [      ]  →  [        ]
0ms      100ms      200ms       300ms

Using spring physics: smooth deceleration
```

### Active Indicator
```
Tab 1 → Tab 2:

[●────][─────]  →  [─────][─────]  →  [─────][●────]
Active  Inactive    Morphing...       Inactive Active

Using layoutId: Framer Motion shared element
```

### Theme Toggle
```
Light → Dark:

☀️ (opacity: 1, scale: 1)
    ↓
☀️ (opacity: 0, scale: 0)  🌙 (opacity: 1, scale: 1)

200ms smooth transition
```

---

## 📐 Spacing & Sizes

### Touch Targets
```
Button:    [  48px min  ]
Icon:      [  24px × 24px  ]
Avatar:    [  40px × 40px  ]
```

### Layout Measurements
```
Header Height:       64px
Sidebar Width:       280px (expanded) / 80px (collapsed)
Bottom Nav Height:   68px (56px + 12px safe area)
Content Padding:     24px (mobile) / 32px (desktop)
```

---

## 🔄 Responsive Breakpoints

### Mobile (<768px)
```
┌──────────────┐
│   HEADER     │
├──────────────┤
│              │
│   CONTENT    │
│              │
├──────────────┤
│  BOTTOM NAV  │
└──────────────┘

- Sidebar: Overlay
- Bottom Nav: Visible
- Search: Toggle button
```

### Tablet (768-1024px)
```
┌───┬──────────┐
│ H │  HEADER  │
├───┼──────────┤
│ S │          │
│ I │ CONTENT  │
│ D │          │
│ E ├──────────┤
│   │BOTTOM NAV│
└───┴──────────┘

- Sidebar: Toggle
- Bottom Nav: Visible
- Search: Full bar
```

### Desktop (>1024px)
```
┌─────┬────────┐
│  H  │ HEADER │
├─────┼────────┤
│  S  │        │
│  I  │CONTENT │
│  D  │        │
│  E  │        │
│     │        │
└─────┴────────┘

- Sidebar: Fixed
- Bottom Nav: Hidden
- Search: Full bar
```

---

## 🎯 Usage Scenarios

### Scenario 1: Dashboard Homepage
```tsx
<DashboardLayout>
  <h1>Welcome to Dashboard</h1>
  <StatsCards />
  <RecentActivity />
</DashboardLayout>
```

### Scenario 2: Deep Navigation
```tsx
<DashboardLayout
  breadcrumbs={[
    { title: 'Users', href: '/users' },
    { title: 'John Doe', href: '/users/123' },
    { title: 'Edit Profile' }
  ]}
>
  <EditProfileForm />
</DashboardLayout>
```

### Scenario 3: With Notifications
```tsx
<DashboardLayout
  notificationCount={5}
  showSearch={true}
>
  <NotificationCenter />
</DashboardLayout>
```

---

## 📱 Mobile Gestures

### Supported Gestures
```
Sidebar Overlay:
• Swipe from left edge → Open sidebar
• Tap backdrop → Close sidebar
• Swipe left on sidebar → Close sidebar

Bottom Nav:
• Tap item → Navigate
• Hold item → Preview (future)
```

---

## ✨ Visual Feedback

### Hover States
```
Button:
Normal:  [Button]
Hover:   [Button]  ← Scale 1.02, shadow-lg

Nav Item:
Normal:  Dashboard
Hover:   Dashboard  ← Light purple bg

Link:
Normal:  Link
Hover:   Link  ← Purple text, underline
```

### Loading States
```
Button Loading:
[⟳ Loading...]  ← Spinning icon, disabled state

Skeleton:
████████  ← Shimmer animation
████████
████████
```

---

## 🎨 Theme Comparison

### Light Theme
```
┌─────────────────────────┐
│ Header: White + Shadow  │
├─────────────────────────┤
│ Bg: Light Gray (#F9FAFB)│
│ Card: White             │
│ Text: Dark (#1F2937)    │
│ Border: Gray (#E5E7EB)  │
└─────────────────────────┘
```

### Dark Theme
```
┌─────────────────────────┐
│ Header: Dark + Glow     │
├─────────────────────────┤
│ Bg: Very Dark (#0A0A0F) │
│ Card: Dark (#1A1A24)    │
│ Text: Light (#F9FAFB)   │
│ Border: Dark (#2D2D40)  │
└─────────────────────────┘
```

---

**Complete Visual Reference for Phase 3 Implementation**

All components are designed to work together seamlessly, providing a consistent and modern user experience across all devices and themes.
