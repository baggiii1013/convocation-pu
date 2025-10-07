# 🎨 Visual Component Mockups & Design Guide

## 📋 Overview

This document provides visual descriptions and code examples for all redesigned components based on the District.in-inspired design system. Use these mockups as a reference when implementing each component.

---

## 🎨 Color Palette Visual Reference

### Primary Purple Palette

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ primary-50  │ primary-100 │ primary-200 │ primary-300 │ primary-400 │
│   #F5F3FF   │   #EDE9FE   │   #DDD6FE   │   #C4B5FD   │   #A78BFA   │
│  Lightest   │ Very Light  │    Light    │Medium-Light │   Medium    │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘

┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ primary-500 │ primary-600 │ primary-700 │ primary-800 │ primary-900 │
│   #6D49FD   │   #5938D6   │   #4527B8   │   #3B1F9A   │   #2E1765   │
│ MAIN BRAND  │    Dark     │   Darker    │ Very Dark   │  Deepest    │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

### Accent Colors

```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ accent-blue  │ accent-pink  │ accent-green │accent-orange │ accent-red   │
│   #00D4FF    │   #FF4D8F    │   #00E676    │   #FF9800    │  #FF3B30     │
│ Electric Blue│Vibrant Pink  │Success Green │Warning Orange│  Error Red   │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

---

## 🔘 Button Component

### Visual Mockup

```
┌──────────────────────────────────────────────────┐
│  PRIMARY BUTTON (default)                        │
│  ┌─────────────────────────────┐                 │
│  │ ◀ Icon  Button Label      │  Gradient bg     │
│  └─────────────────────────────┘                 │
│  • Background: Purple gradient (#6D49FD→#8B6DFF) │
│  • Text: White, semibold                         │
│  • Hover: Scale 1.02, shadow-lg                  │
│  • Active: Scale 0.98                            │
│  • Glow effect on hover                          │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  SECONDARY BUTTON (ghost)                        │
│  ┌─────────────────────────────┐                 │
│  │   Button Label              │  Transparent    │
│  └─────────────────────────────┘                 │
│  • Background: Transparent                       │
│  • Text: primary-500                             │
│  • Border: None                                  │
│  • Hover: bg-primary-50, scale 1.02              │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  OUTLINE BUTTON                                  │
│  ┌─────────────────────────────┐                 │
│  │   Button Label              │  Border only    │
│  └─────────────────────────────┘                 │
│  • Background: Transparent                       │
│  • Border: 2px primary-500                       │
│  • Text: primary-500                             │
│  • Hover: bg-primary-500, text-whit              │
└──────────────────────────────────────────────────┘
```

### Code Example

```tsx
// apps/web/src/components/ui/Button.tsx

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import * as React from "react";

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 ease-smooth disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-primary hover:shadow-glow-md hover:scale-102 active:scale-98",
        secondary:
          "bg-transparent text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:scale-102 active:scale-98",
        outline:
          "border-2 border-primary-500 text-primary-500 bg-transparent hover:bg-primary-500 hover:text-white hover:scale-102 active:scale-98",
        ghost:
          "bg-transparent hover:bg-primary-50 dark:hover:bg-primary-500/10 text-primary-500 hover:scale-102 active:scale-98",
        danger:
          "bg-gradient-to-br from-accent-red to-red-600 text-white shadow-red hover:shadow-glow-md hover:scale-102 active:scale-98",
        success:
          "bg-gradient-to-br from-accent-green to-green-600 text-white shadow-green hover:shadow-glow-md hover:scale-102 active:scale-98",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      icon,
      iconPosition = "left",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && icon && iconPosition === "left" && icon}
        {children}
        {!loading && icon && iconPosition === "right" && icon}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

### Usage Example

```tsx
import { Button } from "@/components/ui/Button";
import { ChevronRight, Download } from "lucide-react";

export default function Example() {
  return (
    <div className="flex gap-4">
      {/* Primary button with icon */}
      <Button icon={<ChevronRight />} iconPosition="right">
        Get Started
      </Button>

      {/* Secondary button */}
      <Button variant="secondary">Learn More</Button>

      {/* Outline button with loading */}
      <Button variant="outline" loading>
        Processing...
      </Button>

      {/* Icon only button */}
      <Button size="icon" variant="ghost">
        <Download className="h-5 w-5" />
      </Button>
    </div>
  );
}
```

---

## 🎴 Card Component

### Visual Mockup

```
┌──────────────────────────────────────────────────────────┐
│  GLASS CARD (glassmorphism effect)                        │
│  ┌────────────────────────────────────────────────────┐  │
│  │ [Background Image/Gradient]                        │  │
│  │   ┌─────────────────────────────────────────────┐ │  │
│  │   │ Semi-transparent white/dark background      │ │  │
│  │   │ Backdrop blur: 12px                         │ │  │
│  │   │ Border: 1px white/20% opacity               │ │  │
│  │   │                                              │ │  │
│  │   │ Card Content Here                            │ │  │
│  │   │                                              │ │  │
│  │   └─────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────┘  │
│  • Hover: Lift effect (-4px translateY)                   │
│  • Hover: Shadow increase                                 │
│  • Border radius: 12px (rounded-xl)                       │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  STANDARD CARD                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 📋 Card Header                                     │  │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  │
│  │                                                    │  │
│  │ Card Content                                       │  │
│  │ Lorem ipsum dolor sit amet                         │  │
│  │                                                    │  │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  │
│  │ [Button]  [Link]                     Card Footer │  │
│  └────────────────────────────────────────────────────┘  │
│  • Background: White (light) / dark-card (dark)           │
│  • Border: 1px light-border / dark-border                 │
│  • Shadow: shadow-md                                      │
│  • Hover: shadow-lg, border-primary-500/30                │
└──────────────────────────────────────────────────────────┘
```

### Code Example

```tsx
// apps/web/src/components/ui/Card.tsx

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import * as React from "react";

const cardVariants = cva("rounded-xl transition-all duration-300 ease-smooth", {
  variants: {
    variant: {
      default:
        "bg-white dark:bg-dark-card border border-light-border dark:border-dark-border shadow-md hover:shadow-lg hover:border-primary-500/30",
      glass: "glass-card shadow-lg hover:shadow-xl hover:-translate-y-1",
      elevated:
        "bg-white dark:bg-dark-card border border-light-border dark:border-dark-border shadow-xl hover:shadow-2xl hover:-translate-y-1",
      gradient:
        "bg-gradient-subtle border border-primary-500/20 shadow-primary hover:shadow-glow-md hover:-translate-y-1",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
  },
});

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
>(({ className, variant, padding, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, padding, className }))}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-bold leading-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};
```

### Usage Example

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Example() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Standard Card */}
      <Card>
        <CardHeader>
          <CardTitle>Standard Card</CardTitle>
          <CardDescription>With header and footer</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is a standard card with default styling.</p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Action</Button>
        </CardFooter>
      </Card>

      {/* Glass Card */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Glass Effect</CardTitle>
          <CardDescription>Glassmorphism design</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Semi-transparent with backdrop blur.</p>
        </CardContent>
      </Card>

      {/* Gradient Card */}
      <Card variant="gradient">
        <CardHeader>
          <CardTitle>Gradient Card</CardTitle>
          <CardDescription>Subtle purple gradient</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Perfect for highlighting special content.</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 📝 Input Component

### Visual Mockup

```
┌──────────────────────────────────────────────────────────┐
│  INPUT FIELD (default state)                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 🔍 Enter your email                                │  │
│  └────────────────────────────────────────────────────┘  │
│  • Border: 1px light-border                              │
│  • Padding: 12px 16px                                    │
│  • Border radius: 8px                                    │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  INPUT FIELD (focused state)                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 🔍 john@example.com                        ║       │  │
│  └────────────────────────────────────────────────────┘  │
│  • Border: 2px primary-500                               │
│  • Ring: 4px primary-500/20                              │
│  • Glow effect                                           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  INPUT FIELD (error state)                               │
│  ┌────────────────────────────────────────────────────┐  │
│  │ ❌ invalid@email                                   │  │
│  └────────────────────────────────────────────────────┘  │
│  ⚠ Please enter a valid email address                   │
│  • Border: 2px accent-red                                │
│  • Text: accent-red                                      │
│  • Shake animation on error                              │
└──────────────────────────────────────────────────────────┘
```

---

## 🎭 Modal/Dialog Component

### Visual Mockup

```
┌──────────────────────────────────────────────────────────────┐
│                   [Backdrop Blur Overlay]                     │
│                                                               │
│         ┌─────────────────────────────────────┐              │
│         │  ✕                            MODAL │              │
│         │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │              │
│         │                                     │              │
│         │  Modal Title                        │              │
│         │                                     │              │
│         │  Lorem ipsum dolor sit amet,        │              │
│         │  consectetur adipiscing elit.       │              │
│         │  Sed do eiusmod tempor incididunt.  │              │
│         │                                     │              │
│         │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │              │
│         │          [Cancel]    [Confirm]      │              │
│         └─────────────────────────────────────┘              │
│                                                               │
└──────────────────────────────────────────────────────────────┘

Animation:
- Backdrop: Fade in (opacity 0→1) 200ms
- Modal: Scale in (0.95→1) + Fade in 300ms with spring easing
- On mobile: Slide up from bottom 300ms
```

---

## 🔔 Toast Notification

### Visual Mockup

```
TOP-RIGHT POSITION:

┌──────────────────────────────────────────┐
│ ✓ Success!                          ✕   │
│ Your changes have been saved             │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ (progress bar)
└──────────────────────────────────────────┘
• Background: White / dark-card
• Border: 1px accent-green
• Shadow: shadow-lg
• Animation: Slide in from right
• Auto dismiss: 3-5 seconds

VARIANTS:
┌──────────────────────────────────────────┐
│ ℹ Info: New update available        ✕   │ (Blue)
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ ⚠ Warning: Storage almost full      ✕   │ (Orange)
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ ✗ Error: Failed to save changes     ✕   │ (Red)
└──────────────────────────────────────────┘
```

---

## 📱 Mobile Bottom Navigation

### Visual Mockup

```
MOBILE VIEW (Bottom of screen):

┌──────────────────────────────────────────────────┐
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │
│  │  🏠  │  │  📊  │  │  🔔  │  │  👤  │       │
│  │ Home │  │Dash- │  │Notif │  │Profile│       │
│  │      │  │board │  │      │  │      │       │
│  └──────┘  └──────┘  └──────┘  └──────┘       │
└──────────────────────────────────────────────────┘
     ACTIVE   INACTIVE  INACTIVE  INACTIVE

Active State:
- Icon color: primary-500
- Top border: 3px primary-500
- Label: Bold, primary-500
- Scale: 1.05

Inactive State:
- Icon color: muted-foreground
- Label: Regular, muted-foreground
- Tap: Ripple effect
```

---

## 🎨 Typography Examples

### Visual Mockup

```
┌──────────────────────────────────────────────────────────┐
│  Display Large (Hero)                                     │
│  ━━━━━━━━━━━━━━━━━━━                                    │
│  Celebrating Excellence                                   │
│  • Font: 64px/72px, extrabold                            │
│  • Gradient text: primary-500 → primary-700              │
│  • Letter spacing: -0.025em                               │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Heading 1                                                │
│  ━━━━━━━━━━━━━━━━━━━                                    │
│  Welcome to PU Convocation                                │
│  • Font: 48px/56px, bold                                 │
│  • Color: foreground                                      │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Body Large                                               │
│  ━━━━━━━━━━━━━━━━━━━                                    │
│  This is a large body text used for important content.   │
│  It provides better readability for key information.      │
│  • Font: 18px/28px, regular                              │
│  • Color: foreground                                      │
│  • Line height: 1.75 (relaxed)                            │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Caption / Small Text                                     │
│  ━━━━━━━━━━━━━━━━━━━                                    │
│  Last updated: 2 hours ago                                │
│  • Font: 12px/16px, regular                              │
│  • Color: muted-foreground                                │
└──────────────────────────────────────────────────────────┘
```

---

## 🎬 Animation Examples

### Fade In Animation

```
Opacity: 0 ────────────────────> 1
         0ms                    300ms

Duration: 300ms
Easing: ease-smooth (cubic-bezier(0.4, 0, 0.2, 1))
Use case: Modal overlays, tooltips
```

### Slide Up Animation

```
Position Y: +20px ─────────────> 0
Opacity:    0     ─────────────> 1
            0ms                  300ms

Duration: 300ms
Easing: ease-out
Use case: Cards entering view, mobile sheets
```

### Hover Lift Effect

```
Default State:
  translateY: 0
  shadow: shadow-md

Hover State:
  translateY: -4px
  shadow: shadow-lg
  scale: 1.02

Transition: 200ms ease-smooth
Use case: Cards, buttons, interactive elements
```

### Shimmer Loading

```
Background gradient moves from left to right:
Position: -1000px ═══════════> 1000px (repeating)
Duration: 2s linear infinite

Use case: Skeleton loaders, loading states
```

---

## 📏 Spacing & Layout Examples

### Container Widths

```
Mobile:      Full width (padding: 16px)
Tablet:      max-w-3xl (768px)
Desktop:     max-w-7xl (1280px)
Large:       max-w-screen-2xl (1536px)
```

### Grid Layouts

```
┌──────────────────────────────────────────────────┐
│  Mobile (1 column)                                │
│  ┌────────────────────────────────────────────┐  │
│  │ Card 1                                     │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │ Card 2                                     │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  Tablet (2 columns)                               │
│  ┌───────────────────┐ ┌───────────────────┐    │
│  │ Card 1            │ │ Card 2            │    │
│  └───────────────────┘ └───────────────────┘    │
│  ┌───────────────────┐ ┌───────────────────┐    │
│  │ Card 3            │ │ Card 4            │    │
│  └───────────────────┘ └───────────────────┘    │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  Desktop (3 columns)                                      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │ Card 1     │ │ Card 2     │ │ Card 3     │          │
│  └────────────┘ └────────────┘ └────────────┘          │
└──────────────────────────────────────────────────────────┘
```

---

## 🎨 Dark Mode Examples

### Light vs Dark Theme

```
LIGHT MODE:
┌──────────────────────────────────────────┐
│ Background: #FFFFFF (white)              │
│ Surface: #F8F9FB (light gray)            │
│ Text: #0A0A0F (almost black)             │
│ Border: #E5E7EB (light gray)             │
└──────────────────────────────────────────┘

DARK MODE:
┌──────────────────────────────────────────┐
│ Background: #0A0A0F (very dark)          │
│ Surface: #1A1A24 (dark gray)             │
│ Text: #FFFFFF (white)                    │
│ Border: #2D2D40 (medium gray)            │
└──────────────────────────────────────────┘

Purple accent remains consistent in both modes
```

---

## 📱 Responsive Breakpoints

```
Mobile:    < 640px   (sm)
Tablet:    640-768px  (md)
Desktop:   768-1024px (lg)
Large:     1024-1280px (xl)
XL:        > 1280px   (2xl)
```

---

## ✅ Implementation Checklist

When implementing each component:

- [ ] Mobile-first responsive design
- [ ] Dark mode support
- [ ] Hover states with smooth transitions
- [ ] Focus visible for keyboard navigation
- [ ] Loading states where applicable
- [ ] Error states with helpful messages
- [ ] Disabled states with visual feedback
- [ ] Accessibility attributes (ARIA)
- [ ] TypeScript types
- [ ] Animation performance (60fps)

---

**END OF VISUAL MOCKUP DOCUMENT**

Use this as a reference when implementing components in Phase 2 and beyond!
