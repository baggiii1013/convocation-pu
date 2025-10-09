# 🎨 Phase 5: Authentication Pages - Visual Guide

## 📋 Overview

This document provides ASCII art mockups and detailed visual descriptions of all Phase 5 authentication pages.

---

## 🔐 Login Page

### Desktop View (Split-Screen)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          PURPLE GRADIENT BACKGROUND                           │
│                     [Animated Floating Orbs + Grid Pattern]                   │
├────────────────────────────────┬──────────────────────────────────────────────┤
│                                │                                              │
│  LEFT SIDE - BRANDING          │  RIGHT SIDE - LOGIN FORM                     │
│                                │                                              │
│  ┌────────────────┐            │    ┌──────────────────────────────────┐     │
│  │ 🎓  │  PU      │            │    │ 🎓  PU Convocation           │     │
│  │     Convocation│            │    └──────────────────────────────────┘     │
│  │  Excellence in │            │                                              │
│  │    Education   │            │    ╔══════════════════════════════════╗     │
│  └────────────────┘            │    ║  GLASSMORPHISM CARD             ║     │
│                                │    ║                                  ║     │
│  Welcome to Your               │    ║  Sign in to your account         ║     │
│  Convocation Portal            │    ║  Enter credentials to access...  ║     │
│  [Gradient Text]               │    ║                                  ║     │
│                                │    ║  ┌───────────────────────────┐  ║     │
│  Manage your convocation...    │    ║  │ 📧 Email address          │  ║     │
│                                │    ║  └───────────────────────────┘  ║     │
│  ✓ Secure and encrypted        │    ║                                  ║     │
│  ✓ Role-based access control   │    ║  ┌───────────────────────────┐  ║     │
│  ✓ Real-time event updates     │    ║  │ 🔒 Password               │  ║     │
│                                │    ║  └───────────────────────────┘  ║     │
│                                │    ║                                  ║     │
│                                │    ║  ☐ Remember me  Forgot password? ║     │
│                                │    ║                                  ║     │
│                                │    ║  ┌───────────────────────────┐  ║     │
│                                │    ║  │      Sign in              │  ║     │
│                                │    ║  └───────────────────────────┘  ║     │
│                                │    ║                                  ║     │
│                                │    ║  Don't have an account?          ║     │
│                                │    ║  Contact your administrator      ║     │
│                                │    ╚══════════════════════════════════╝     │
│                                │                                              │
│                                │    Terms of Service | Privacy Policy         │
└────────────────────────────────┴──────────────────────────────────────────────┘
```

### Mobile View (Single Column)

```
┌──────────────────────────────────────┐
│   PURPLE GRADIENT BACKGROUND         │
│   [Animated Floating Orbs + Grid]    │
│                                      │
│      ┌──────────────────┐            │
│      │ 🎓  │  PU        │            │
│      │     Convocation  │            │
│      └──────────────────┘            │
│                                      │
│  ╔════════════════════════════════╗  │
│  ║  GLASSMORPHISM CARD           ║  │
│  ║                                ║  │
│  ║  Sign in to your account       ║  │
│  ║  Enter credentials to access   ║  │
│  ║                                ║  │
│  ║  ┌──────────────────────────┐ ║  │
│  ║  │ 📧 Email address         │ ║  │
│  ║  └──────────────────────────┘ ║  │
│  ║                                ║  │
│  ║  ┌──────────────────────────┐ ║  │
│  ║  │ 🔒 Password              │ ║  │
│  ║  └──────────────────────────┘ ║  │
│  ║                                ║  │
│  ║  ☐ Remember me                 ║  │
│  ║      Forgot password?          ║  │
│  ║                                ║  │
│  ║  ┌──────────────────────────┐ ║  │
│  ║  │      Sign in             │ ║  │
│  ║  └──────────────────────────┘ ║  │
│  ║                                ║  │
│  ║  Don't have an account?        ║  │
│  ║  Contact your administrator    ║  │
│  ╚════════════════════════════════╝  │
│                                      │
│    Terms of Service | Privacy        │
└──────────────────────────────────────┘
```

### Visual States

#### Default State
```
- Background: Purple gradient with animated orbs
- Card: Semi-transparent white with backdrop blur
- Inputs: White/10 background with white/20 border
- Button: White with purple text
- Text: White for headings, primary-100 for body
```

#### Loading State
```
╔════════════════════════════════╗
║  ┌──────────────────────────┐ ║
║  │ ⏳ Signing in...         │ ║
║  └──────────────────────────┘ ║
╚════════════════════════════════╝
```

#### Error State
```
╔════════════════════════════════╗
║  ⚠ Invalid email or password  ║
║  [Red background, red text]   ║
╚════════════════════════════════╝
```

---

## 📧 Forgot Password Page

### Email Input State

```
┌──────────────────────────────────────────────────────────────┐
│              PURPLE GRADIENT BACKGROUND                       │
│          [Animated Floating Orbs + Grid Pattern]             │
│                                                               │
│   ← Back to login                                            │
│                                                               │
│            ┌──────────────────┐                               │
│            │ 🎓  │  PU        │                               │
│            │     Convocation  │                               │
│            └──────────────────┘                               │
│                                                               │
│  ╔═════════════════════════════════════════════════════════╗ │
│  ║         GLASSMORPHISM CARD                             ║ │
│  ║                                                         ║ │
│  ║              ┌─────────────┐                            ║ │
│  ║              │   📧 [Blue] │                            ║ │
│  ║              └─────────────┘                            ║ │
│  ║                                                         ║ │
│  ║         Forgot your password?                           ║ │
│  ║                                                         ║ │
│  ║    No worries! Enter your email address and            ║ │
│  ║    we'll send you a link to reset your password.       ║ │
│  ║                                                         ║ │
│  ║    ┌─────────────────────────────────────────────┐     ║ │
│  ║    │ 📧 Enter your email address              │     ║ │
│  ║    └─────────────────────────────────────────────┘     ║ │
│  ║                                                         ║ │
│  ║    ┌─────────────────────────────────────────────┐     ║ │
│  ║    │         📤 Send reset link              │     ║ │
│  ║    └─────────────────────────────────────────────┘     ║ │
│  ║                                                         ║ │
│  ║    Remember your password? Sign in                      ║ │
│  ╚═════════════════════════════════════════════════════════╝ │
│                                                               │
│            Need help? Contact support                         │
└──────────────────────────────────────────────────────────────┘
```

### Success State

```
┌──────────────────────────────────────────────────────────────┐
│              PURPLE GRADIENT BACKGROUND                       │
│          [Animated Floating Orbs + Grid Pattern]             │
│                                                               │
│  ╔═════════════════════════════════════════════════════════╗ │
│  ║         GLASSMORPHISM CARD                             ║ │
│  ║                                                         ║ │
│  ║              ┌─────────────┐                            ║ │
│  ║              │      ✓      │  [Green circle, animated]  ║ │
│  ║              │   [Large]   │                            ║ │
│  ║              └─────────────┘                            ║ │
│  ║                                                         ║ │
│  ║           Check your email                              ║ │
│  ║                                                         ║ │
│  ║    We've sent a password reset link to                 ║ │
│  ║         user@example.com                                ║ │
│  ║                                                         ║ │
│  ║    ┌───────────────────────────────────────────┐       ║ │
│  ║    │ Didn't receive the email?                 │       ║ │
│  ║    │ Check your spam folder or try again       │       ║ │
│  ║    └───────────────────────────────────────────┘       ║ │
│  ║                                                         ║ │
│  ║    ┌─────────────────────────────────────────────┐     ║ │
│  ║    │         Return to login                 │     ║ │
│  ║    └─────────────────────────────────────────────┘     ║ │
│  ╚═════════════════════════════════════════════════════════╝ │
└──────────────────────────────────────────────────────────────┘
```

### Animation Flow

```
STEP 1: Email Input
   ↓
STEP 2: Click "Send reset link"
   ↓
STEP 3: Loading (2s)
   ↓
STEP 4: Success Screen
   └─→ Checkmark scales from 0 to 1 (spring animation)
   └─→ Card scales from 0.9 to 1
```

---

## 🔑 Reset Password Page

### Form State

```
┌──────────────────────────────────────────────────────────────┐
│              PURPLE GRADIENT BACKGROUND                       │
│          [Animated Floating Orbs + Grid Pattern]             │
│                                                               │
│            ┌──────────────────┐                               │
│            │ 🎓  │  PU        │                               │
│            │     Convocation  │                               │
│            └──────────────────┘                               │
│                                                               │
│  ╔═════════════════════════════════════════════════════════╗ │
│  ║         GLASSMORPHISM CARD                             ║ │
│  ║                                                         ║ │
│  ║              ┌─────────────┐                            ║ │
│  ║              │  🛡️ [Blue]  │                            ║ │
│  ║              └─────────────┘                            ║ │
│  ║                                                         ║ │
│  ║         Set new password                                ║ │
│  ║    Choose a strong password to secure your account      ║ │
│  ║                                                         ║ │
│  ║    ┌─────────────────────────────────────────────┐     ║ │
│  ║    │ 🔒 New password                      👁️    │     ║ │
│  ║    └─────────────────────────────────────────────┘     ║ │
│  ║                                                         ║ │
│  ║    Password strength: Medium                            ║ │
│  ║    ████████████░░░░░░░░  [60%] [Orange bar]             ║ │
│  ║                                                         ║ │
│  ║    ┌─────────────────────────────────────────────┐     ║ │
│  ║    │ 🔒 Confirm new password              👁️    │     ║ │
│  ║    └─────────────────────────────────────────────┘     ║ │
│  ║                                                         ║ │
│  ║    ┌───────────────────────────────────────────┐       ║ │
│  ║    │ Password must contain:                    │       ║ │
│  ║    │ ✓ At least 8 characters                   │       ║ │
│  ║    │ ✓ One uppercase letter                    │       ║ │
│  ║    │ ○ One lowercase letter                    │       ║ │
│  ║    │ ✓ One number                              │       ║ │
│  ║    │ ○ One special character                   │       ║ │
│  ║    └───────────────────────────────────────────┘       ║ │
│  ║                                                         ║ │
│  ║    ┌─────────────────────────────────────────────┐     ║ │
│  ║    │         Reset password                  │     ║ │
│  ║    └─────────────────────────────────────────────┘     ║ │
│  ║                                                         ║ │
│  ║    Remember your password? Sign in                      ║ │
│  ╚═════════════════════════════════════════════════════════╝ │
└──────────────────────────────────────────────────────────────┘
```

### Password Strength States

#### Weak (0-39%)
```
Password strength: Weak
████░░░░░░░░░░░░░░  [25%]
[Red progress bar]
```

#### Medium (40-69%)
```
Password strength: Medium
████████████░░░░░░  [60%]
[Orange progress bar]
```

#### Strong (70-100%)
```
Password strength: Strong
████████████████░░  [85%]
[Green progress bar]
```

### Success State

```
┌──────────────────────────────────────────────────────────────┐
│              PURPLE GRADIENT BACKGROUND                       │
│                                                               │
│  ╔═════════════════════════════════════════════════════════╗ │
│  ║         GLASSMORPHISM CARD                             ║ │
│  ║                                                         ║ │
│  ║              ┌─────────────┐                            ║ │
│  ║              │      ✓      │  [Green circle, animated]  ║ │
│  ║              │   [Large]   │                            ║ │
│  ║              └─────────────┘                            ║ │
│  ║                                                         ║ │
│  ║     Password reset successful!                          ║ │
│  ║                                                         ║ │
│  ║    Your password has been reset successfully.           ║ │
│  ║    Redirecting you to login...                          ║ │
│  ║                                                         ║ │
│  ║              ⏳ [Spinner]                                ║ │
│  ║                                                         ║ │
│  ╚═════════════════════════════════════════════════════════╝ │
└──────────────────────────────────────────────────────────────┘
```

### Invalid Token Error

```
┌──────────────────────────────────────────────────────────────┐
│              PURPLE GRADIENT BACKGROUND                       │
│                                                               │
│              ┌─────────────┐                                  │
│              │      ⚠️     │  [Red circle]                    │
│              │   [Large]   │                                  │
│              └─────────────┘                                  │
│                                                               │
│           Invalid Reset Link                                  │
│                                                               │
│    This password reset link is invalid or has expired.        │
│                                                               │
│    ┌─────────────────────────────────────────────┐           │
│    │      Request a new link                 │           │
│    └─────────────────────────────────────────────┘           │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Palette Reference

### Background Gradients
```
from-primary-900: #2E1765 (deepest purple)
via-primary-800:  #3B1F9A (very dark purple)
to-primary-600:   #5938D6 (dark purple)
```

### Glassmorphism Cards
```
Background: bg-white/10 (white at 10% opacity)
Border: border-white/20 (white at 20% opacity)
Backdrop: backdrop-blur-sm (12px blur)
Shadow: shadow-2xl (large purple-tinted shadow)
```

### Text Colors
```
Headings: text-white (#FFFFFF)
Body: text-primary-100 (light purple tint)
Labels: text-primary-200 (lighter purple tint)
Helper: text-primary-300 (medium purple tint)
```

### Input Fields
```
Background: bg-white/10
Border: border-white/20
Text: text-white
Placeholder: placeholder:text-primary-200
Focus Border: border-white/40
Focus Ring: ring-white/20
```

### Buttons
```
Primary CTA:
- Background: bg-white
- Text: text-primary-700
- Hover: bg-primary-50
- Shadow: shadow-xl

Loading State:
- Disabled: opacity-50
- Spinner: w-5 h-5 border-2 border-white/30 border-t-white
```

### Status Colors
```
Success (Green):
- Icon: text-green-400
- Background: bg-green-500/20
- Border: border-green-400/30

Error (Red):
- Icon: text-red-400
- Background: bg-red-500/20
- Border: border-red-400/30

Warning (Orange):
- Progress: bg-orange-500
```

---

## 🎭 Animation Examples

### Floating Orbs Animation
```tsx
// Orb 1 (Pink)
animate={{
  x: [0, 100, 0],        // Move right 100px, then back
  y: [0, -50, 0],        // Move up 50px, then back
  scale: [1, 1.2, 1],    // Scale up 20%, then back
}}
transition={{
  duration: 20,           // 20 seconds per loop
  repeat: Infinity,       // Loop forever
  ease: "easeInOut"       // Smooth easing
}}

// Orb 2 (Blue)
animate={{
  x: [0, -80, 0],        // Move left 80px, then back
  y: [0, 80, 0],         // Move down 80px, then back
  scale: [1, 1.1, 1],    // Scale up 10%, then back
}}
transition={{
  duration: 25,           // 25 seconds per loop
  repeat: Infinity,
  ease: "easeInOut"
}}
```

### Page Load Animation (Login Left Side)
```tsx
initial={{ opacity: 0, x: -50 }}  // Start transparent, 50px left
animate={{ opacity: 1, x: 0 }}    // End opaque, original position
transition={{ duration: 0.6, ease: "easeOut" }}
```

### Page Load Animation (Login Right Side)
```tsx
initial={{ opacity: 0, x: 50 }}   // Start transparent, 50px right
animate={{ opacity: 1, x: 0 }}    // End opaque, original position
transition={{ duration: 0.6, ease: "easeOut" }}
```

### Success Checkmark Animation
```tsx
initial={{ scale: 0 }}            // Start at 0% size
animate={{ scale: 1 }}            // Grow to 100% size
transition={{
  type: "spring",                 // Spring physics
  stiffness: 200,                 // How bouncy
  damping: 15,                    // How much oscillation
  delay: 0.2                      // Wait 200ms before starting
}}
```

### Password Strength Bar Animation
```tsx
<motion.div
  className={`h-full ${getStrengthColor()} transition-all duration-300`}
  initial={{ width: 0 }}          // Start at 0% width
  animate={{ width: `${passwordStrength}%` }}  // Grow to calculated %
/>
```

---

## 📐 Responsive Layout Changes

### Desktop (>1024px)
- Login: Split-screen layout (50/50)
- Forgot/Reset: Centered card (max-w-md = 448px)
- Font sizes: Larger (text-5xl, text-6xl)
- Hover effects: Fully visible
- Padding: py-12 (48px)

### Tablet (640px-1024px)
- Login: Single column, centered
- Forms: Slightly wider cards
- Font sizes: Medium (text-4xl)
- Touch targets: Optimized for touch
- Padding: py-8 (32px)

### Mobile (<640px)
- All: Single column, full-width
- Logo: Smaller, centered at top
- Font sizes: Smaller (text-3xl)
- Cards: Full-width with px-4 padding
- Buttons: Full-width
- Text: Reduced line height for space

---

## 🔍 Interactive States

### Input Focus State
```
Default:
┌─────────────────────────┐
│ 📧 Email address        │  [Gray border]
└─────────────────────────┘

Focused:
┌─────────────────────────┐
│ 📧 user@example|        │  [White border, glow ring]
└─────────────────────────┘
```

### Button Hover State
```
Default:
┌─────────────────────────┐
│      Sign in            │  [White bg, shadow-xl]
└─────────────────────────┘

Hover:
┌─────────────────────────┐
│      Sign in            │  [Lighter bg, scale 1.02]
└─────────────────────────┘

Active (Click):
┌─────────────────────────┐
│      Sign in            │  [Scale 0.98]
└─────────────────────────┘
```

### Password Toggle State
```
Hidden:
┌──────────────────────────┐
│ 🔒 •••••••••        👁️   │
└──────────────────────────┘

Visible:
┌──────────────────────────┐
│ 🔒 myPassword123   👁️‍🗨️  │
└──────────────────────────┘
```

---

**Visual Guide - Phase 5 Authentication Pages**
