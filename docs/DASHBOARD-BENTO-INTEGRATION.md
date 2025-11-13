# Dashboard Bento Integration Guide

## Overview

The Magic Bento component has been successfully integrated into your convocation management system dashboards, providing an interactive and visually appealing way to navigate between all the main pages of your application.

## What's Been Added

### 1. **DashboardBento Component** (`/components/DashboardBento.tsx`)
A specialized wrapper around the MagicBento component that:
- Displays all main features/pages of your application
- Supports role-based card display (admin vs regular user)
- Handles click navigation to respective pages
- Provides beautiful interactive effects (particles, spotlight, tilt, magnetism, click ripples)

### 2. **Enhanced MagicBento Component** (`/components/MagicBento.tsx`)
Updated to accept custom card data through props, making it reusable across different contexts.

### 3. **Integration Points**

#### Admin Dashboard (`/apps/web/src/app/admin/dashboard/dashboard-client.tsx`)
- Shows 6 admin feature cards:
  - Seat Allocation (Dashboard)
  - Reserve Seats
  - Enclosures Management
  - Aerial View
  - Upload Students
  - User Management

#### User Dashboard (`/apps/web/src/app/(dashboard)/dashboard/page.tsx`)
- Shows 4 user feature cards:
  - My Profile
  - My Seat
  - Venue View
  - Settings

## Features

### Interactive Effects
- ✨ **Particle Stars**: Animated particles that appear on card hover
- 🔦 **Spotlight Effect**: Global spotlight that follows mouse movement
- 🌟 **Border Glow**: Dynamic glowing border effect based on mouse position
- 📐 **3D Tilt**: Subtle 3D tilt effect on hover (configurable)
- 🧲 **Magnetism**: Cards subtly follow the mouse cursor
- 💫 **Click Ripple**: Beautiful ripple animation on click
- 📱 **Mobile Responsive**: Automatically adjusts layout and disables heavy animations on mobile

### Navigation
All cards are clickable and navigate to their respective pages:

**Admin Cards:**
1. **Seat Allocation** → `/admin/dashboard`
2. **Reserve Seats** → `/admin/reserve-seats`
3. **Enclosures** → `/admin/enclosures`
4. **Aerial View** → `/admin/aerial-view`
5. **Upload Students** → `/admin/upload-students`
6. **User Management** → `/admin/users`

**User Cards:**
1. **My Profile** → `/dashboard/profile`
2. **My Seat** → `/attendee`
3. **Venue View** → `/admin/aerial-view`
4. **Settings** → `/settings`

## Customization

### DashboardBento Props

```tsx
interface DashboardBentoProps {
  userRole?: 'admin' | 'user';           // Role-based card display
  textAutoHide?: boolean;                // Auto-hide overflow text (default: true)
  enableStars?: boolean;                 // Show particle stars (default: true)
  enableSpotlight?: boolean;             // Show spotlight effect (default: true)
  enableBorderGlow?: boolean;            // Show border glow (default: true)
  disableAnimations?: boolean;           // Disable all animations (default: false)
  spotlightRadius?: number;              // Spotlight radius in pixels (default: 300)
  particleCount?: number;                // Number of particles per card (default: 12)
  enableTilt?: boolean;                  // Enable 3D tilt effect (default: false)
  glowColor?: string;                    // RGB color for glow effects (default: '132, 0, 255')
  clickEffect?: boolean;                 // Enable click ripple effect (default: true)
  enableMagnetism?: boolean;             // Enable magnetism effect (default: true)
}
```

### Example Usage

```tsx
// Admin dashboard with all effects
<DashboardBento 
  userRole="admin"
  enableStars={true}
  enableSpotlight={true}
  enableBorderGlow={true}
  enableTilt={false}
  clickEffect={true}
  enableMagnetism={true}
  spotlightRadius={300}
  particleCount={8}
/>

// User dashboard with minimal effects
<DashboardBento 
  userRole="user"
  enableStars={false}
  enableSpotlight={true}
  enableBorderGlow={true}
  disableAnimations={false}
/>

// Performance mode (disable heavy effects)
<DashboardBento 
  userRole="admin"
  enableStars={false}
  enableSpotlight={false}
  disableAnimations={true}
/>
```

## Adding New Cards

To add new pages to the dashboard:

### 1. Update Card Data in `DashboardBento.tsx`

```tsx
// For admin users
const adminCards: BentoCardProps[] = [
  // ... existing cards
  {
    color: '#060010',
    title: 'New Feature',
    description: 'Description of new feature',
    label: 'Category'
  }
];

// For regular users
const userCards: BentoCardProps[] = [
  // ... existing cards
  {
    color: '#060010',
    title: 'New Feature',
    description: 'Description of new feature',
    label: 'Category'
  }
];
```

### 2. Add Corresponding Route

```tsx
// Admin routes
const adminRoutes = [
  // ... existing routes
  '/admin/new-feature'
];

// User routes
const userRoutes = [
  // ... existing routes
  '/user/new-feature'
];
```

## Styling Customization

### Changing Glow Color

```tsx
<DashboardBento 
  glowColor="255, 0, 132" // Purple-pink glow
  // or
  glowColor="0, 255, 200" // Cyan glow
  // or
  glowColor="255, 165, 0"  // Orange glow
/>
```

### Adjusting Effects Intensity

```tsx
<DashboardBento 
  spotlightRadius={400}  // Larger spotlight area
  particleCount={16}     // More particles
  enableMagnetism={true} // Stronger interaction
/>
```

## Performance Considerations

The component automatically:
- Detects mobile devices and disables heavy animations
- Uses requestAnimationFrame for smooth animations
- Implements particle pooling to reduce memory allocation
- Cleans up animations on component unmount

## Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (with reduced animations)

## Dependencies

- `react` - Core React library
- `gsap` - Animation library for smooth effects
- `next/navigation` - Next.js routing for navigation
- `lucide-react` - Icons (for the main dashboard components)

## Troubleshooting

### Cards not navigating on click
- Ensure Next.js routing is properly configured
- Check that all routes exist in your application

### Performance issues
- Reduce `particleCount` to 6-8
- Disable `enableTilt` and `enableMagnetism`
- Set `disableAnimations={true}` for low-end devices

### Styling conflicts
- Ensure Tailwind CSS is properly configured
- Check for conflicting global styles
- Verify dark mode compatibility if using dark theme

## Future Enhancements

Potential improvements:
- Dynamic card loading based on user permissions
- Card drag-and-drop reordering
- Customizable card colors per feature
- Statistics overlay on cards (e.g., notification counts)
- Animation presets (subtle, normal, dramatic)
- Theme variants (light, dark, custom)

## Screenshots

The bento grid provides:
- **Responsive Layout**: Adapts from 1 column (mobile) → 2 columns (tablet) → 4 columns (desktop)
- **Visual Hierarchy**: Important features can span multiple grid cells
- **Interactive Feedback**: Hover, tilt, and click effects provide engaging user experience
- **Quick Navigation**: One-click access to all major features

## License

Part of the Convocation Management System project.
