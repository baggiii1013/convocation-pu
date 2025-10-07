# 🎬 PHASE 7: Animations & Micro-interactions - Detailed Implementation Guide

## 📋 Overview

**Duration**: 1-2 weeks (7-10 working days)  
**Prerequisites**: Phases 1-6 completed  
**Objective**: Add smooth animations, delightful micro-interactions, and purposeful motion to enhance user experience throughout the application.

---

## 🎯 Phase Goals

By the end of Phase 7, you will have:

- ✅ Page transition animations between routes
- ✅ Scroll-triggered animations for content reveal
- ✅ Hover effects and micro-interactions on all interactive elements
- ✅ Loading states with skeleton screens
- ✅ Toast notification animations
- ✅ Modal and dialog entrance/exit animations
- ✅ Button ripple effects and feedback
- ✅ Card hover and tilt effects
- ✅ Form input animations
- ✅ Data visualization animations (charts)
- ✅ Animation utilities and reusable hooks

---

## 📅 Day-by-Day Implementation Schedule

---

## 📅 DAY 1: Page Transition Animations

### Objective
Implement smooth page transitions using Framer Motion.

### Tasks

#### 1. Create Page Transition Wrapper
**File**: `apps/web/src/components/animations/PageTransition.tsx`

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

#### 2. Wrap Dashboard Layout with Transitions
**File**: `apps/web/src/components/layouts/DashboardLayout.tsx`

```tsx
"use client";

import { Header } from "@/components/shared/Header";
import { Sidebar } from "@/components/shared/Sidebar";
import { BottomNav } from "@/components/shared/BottomNav";
import { PageTransition } from "@/components/animations/PageTransition";
import { useState } from "react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
          }`}
        >
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
```

#### 3. Create Stagger Children Animation
**File**: `apps/web/src/components/animations/StaggerChildren.tsx`

```tsx
"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

interface StaggerChildrenProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerChildren({ children, className }: StaggerChildrenProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: StaggerChildrenProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
```

#### 4. Apply Stagger Animation to Dashboard Stats
**File**: `apps/web/src/app/(dashboard)/dashboard/page.tsx` (update)

```tsx
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { StatsCard } from "@/components/dashboard/StatsCard";
// ... other imports

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8 p-6">
      <WelcomeBanner />

      {/* Statistics Grid with Stagger Animation */}
      <StaggerChildren className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StaggerItem>
          <StatsCard
            title="Total Ceremonies"
            value={stats.totalCeremonies}
            change={{ value: 20, trend: "up" }}
            icon={Calendar}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
        </StaggerItem>
        <StaggerItem>
          <StatsCard
            title="Total Attendees"
            value={stats.totalAttendees.toLocaleString()}
            change={{ value: 12, trend: "up" }}
            icon={Users}
            iconColor="text-primary-600"
            iconBgColor="bg-primary-100"
          />
        </StaggerItem>
        {/* ... other stats cards wrapped in StaggerItem */}
      </StaggerChildren>
    </div>
  );
}
```

### Testing
- [ ] Page transitions work when navigating
- [ ] No layout shift during transitions
- [ ] Stats cards appear with stagger effect
- [ ] Animations are smooth (60fps)

---

## 📅 DAY 2: Scroll Animations

### Objective
Create scroll-triggered animations for content reveal.

### Tasks

#### 1. Create Scroll Animation Hook
**File**: `apps/web/src/hooks/useScrollAnimation.ts`

```typescript
"use client";

import { useInView } from "framer-motion";
import { useRef, useEffect } from "react";

export function useScrollAnimation(options = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.3,
    ...options,
  });

  return { ref, isInView };
}
```

#### 2. Create Fade In Component
**File**: `apps/web/src/components/animations/FadeIn.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface FadeInProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  className,
}: FadeInProps) {
  const { ref, isInView } = useScrollAnimation();

  const directionOffset = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directionOffset[direction],
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              transition: {
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1],
              },
            }
          : {}
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

#### 3. Create Scale In Component
**File**: `apps/web/src/components/animations/ScaleIn.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.5,
  className,
}: ScaleInProps) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              scale: 1,
              transition: {
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1],
              },
            }
          : {}
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

#### 4. Apply Scroll Animations to Landing Page
**File**: `apps/web/src/components/Hero.tsx` (update)

```tsx
"use client";

import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/animations/FadeIn";
import { ScaleIn } from "@/components/animations/ScaleIn";
import { ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-background to-accent-pink/5" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-pink/20 rounded-full blur-3xl animate-float-delayed" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <FadeIn direction="down" duration={0.8}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
            Celebrating Excellence
          </h1>
        </FadeIn>

        <FadeIn delay={0.2} duration={0.8}>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Join us in honoring the achievements of our graduates at the
            Panjab University Convocation Ceremony
          </p>
        </FadeIn>

        <ScaleIn delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" icon={<ChevronDown />} iconPosition="right">
              Register Now
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </ScaleIn>

        <FadeIn delay={0.6}>
          <div className="mt-16 animate-bounce">
            <ChevronDown className="h-8 w-8 mx-auto text-primary-500" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
```

#### 5. Add Floating Animation to CSS
**File**: `apps/web/src/app/globals.css` (add)

```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(20px) translateX(-10px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}
```

### Testing
- [ ] Scroll animations trigger on scroll
- [ ] Animations only play once
- [ ] Hero section animates on load
- [ ] Floating orbs animate smoothly

---

## 📅 DAY 3: Button & Interactive Element Animations

### Objective
Add micro-interactions to buttons and interactive elements.

### Tasks

#### 1. Update Button Component with Ripple Effect
**File**: `apps/web/src/components/ui/Button.tsx` (update)

```tsx
"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { motion } from "framer-motion";

const buttonVariants = cva(
  "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 ease-smooth disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
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
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = React.useState<
      Array<{ x: number; y: number; id: number }>
    >([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newRipple = {
        x,
        y,
        id: Date.now(),
      };

      setRipples((prev) => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);

      onClick?.(e);
    };

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading}
        onClick={handleClick}
        {...props}
      >
        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
            initial={{ width: 0, height: 0, x: 0, y: 0 }}
            animate={{
              width: 300,
              height: 300,
              x: -150,
              y: -150,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}

        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && icon && iconPosition === "left" && icon}
        <span className="relative z-10">{children}</span>
        {!loading && icon && iconPosition === "right" && icon}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

#### 2. Create Magnetic Button Component
**File**: `apps/web/src/components/animations/MagneticButton.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
}

export function MagneticButton({
  children,
  strength = 0.3,
}: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.div>
  );
}
```

### Testing
- [ ] Ripple effect appears on button click
- [ ] Ripple animates outward smoothly
- [ ] Magnetic button follows cursor
- [ ] Button returns to original position on mouse leave

---

## 📅 DAY 4: Card Hover Effects

### Objective
Add 3D tilt and hover effects to cards.

### Tasks

#### 1. Create Tilt Card Component
**File**: `apps/web/src/components/animations/TiltCard.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export function TiltCard({ children, className }: TiltCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const rotateXValue = (deltaY / rect.height) * -10;
    const rotateYValue = (deltaX / rect.width) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

#### 2. Create Hover Lift Card
**File**: `apps/web/src/components/animations/HoverLiftCard.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardProps } from "@/components/ui/Card";

interface HoverLiftCardProps extends CardProps {
  liftAmount?: number;
}

export function HoverLiftCard({
  liftAmount = -8,
  children,
  ...props
}: HoverLiftCardProps) {
  return (
    <motion.div
      whileHover={{
        y: liftAmount,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  );
}
```

#### 3. Apply to Stats Cards
**File**: `apps/web/src/components/dashboard/StatsCard.tsx` (update)

```tsx
import { HoverLiftCard } from "@/components/animations/HoverLiftCard";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: "up" | "down";
  };
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-primary-500",
  iconBgColor = "bg-primary-100",
}: StatsCardProps) {
  return (
    <HoverLiftCard>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "text-sm font-medium",
                  change.trend === "up" ? "text-green-600" : "text-red-600"
                )}
              >
                {change.trend === "up" ? "↑" : "↓"} {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", iconBgColor)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>
    </HoverLiftCard>
  );
}
```

### Testing
- [ ] Cards lift on hover
- [ ] Tilt effect works on mouse move
- [ ] Cards return to original position smoothly
- [ ] No performance issues

---

## 📅 DAY 5: Form Input Animations

### Objective
Add focus animations and floating labels to form inputs.

### Tasks

#### 1. Create Animated Input Component
**File**: `apps/web/src/components/ui/AnimatedInput.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function AnimatedInput({
  label,
  error,
  className,
  ...props
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
  };

  return (
    <div className="relative">
      <input
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "w-full rounded-lg border border-input bg-background px-4 pt-6 pb-2 text-sm transition-all duration-200",
          "focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
      />
      {label && (
        <motion.label
          initial={false}
          animate={{
            top: isFocused || hasValue ? "0.5rem" : "1rem",
            fontSize: isFocused || hasValue ? "0.75rem" : "1rem",
            color: error
              ? "rgb(239 68 68)"
              : isFocused
              ? "hsl(var(--primary-500))"
              : "hsl(var(--muted-foreground))",
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-4 pointer-events-none"
        >
          {label}
        </motion.label>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500 mt-1"
        >
          {error}
        </motion.p>
      )}
      {isFocused && (
        <motion.div
          layoutId="input-focus"
          className="absolute inset-0 rounded-lg border-2 border-primary-500 pointer-events-none"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </div>
  );
}
```

#### 2. Create Password Strength Meter
**File**: `apps/web/src/components/ui/PasswordStrengthMeter.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const strengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
  ];

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i < strength ? strengthColor[strength - 1] : "bg-muted"
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: i < strength ? 1 : 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          />
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs text-muted-foreground"
      >
        Password strength: <span className="font-medium">{strengthText[strength - 1]}</span>
      </motion.p>
    </div>
  );
}
```

### Testing
- [ ] Labels float on focus
- [ ] Focus ring animates smoothly
- [ ] Error messages appear with animation
- [ ] Password strength meter updates in real-time

---

## 📅 DAY 6: Loading States & Skeleton Screens

### Objective
Create animated skeleton screens for loading states.

### Tasks

#### 1. Update Skeleton Component with Animation
**File**: `apps/web/src/components/ui/Skeleton.tsx`

```tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  className,
  variant = "rectangular",
  width,
  height,
  animation = "wave",
}: SkeletonProps) {
  const baseClasses = "bg-muted";
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <motion.div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{ width, height }}
      animate={
        animation === "pulse"
          ? {
              opacity: [0.5, 1, 0.5],
            }
          : animation === "wave"
          ? {
              backgroundPosition: ["200% 0", "-200% 0"],
            }
          : {}
      }
      transition={
        animation === "pulse"
          ? {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : animation === "wave"
          ? {
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }
          : undefined
      }
      style={{
        ...(animation === "wave" && {
          backgroundImage:
            "linear-gradient(90deg, transparent, rgba(109, 73, 253, 0.1), transparent)",
          backgroundSize: "200% 100%",
        }),
      }}
    />
  );
}
```

#### 2. Create Dashboard Skeleton
**File**: `apps/web/src/components/skeletons/DashboardSkeleton.tsx`

```tsx
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-6">
      {/* Welcome Banner Skeleton */}
      <Card>
        <Skeleton height={120} />
      </Card>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <div className="space-y-3">
              <Skeleton height={16} width="60%" />
              <Skeleton height={32} width="40%" />
              <Skeleton height={16} width="50%" />
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div>
        <Skeleton height={24} width={150} className="mb-4" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <Skeleton height={80} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
```

#### 3. Create Table Skeleton
**File**: `apps/web/src/components/skeletons/TableSkeleton.tsx`

```tsx
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card padding="none">
      <div className="p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {[...Array(5)].map((_, i) => (
                <th key={i} className="px-6 py-3 text-left">
                  <Skeleton height={16} width="80%" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(rows)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {[...Array(5)].map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <Skeleton height={16} width="90%" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
```

### Testing
- [ ] Skeleton screens show while loading
- [ ] Wave animation is smooth
- [ ] Skeleton matches actual content layout
- [ ] Transitions from skeleton to content are seamless

---

## 📅 DAY 7: Modal & Toast Animations

### Objective
Enhance modal and toast notification animations.

### Tasks

#### 1. Update Modal Component with Better Animations
**File**: `apps/web/src/components/ui/Modal.tsx`

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "relative w-full bg-white dark:bg-dark-card rounded-xl shadow-2xl",
                sizeClasses[size],
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h2 className="text-2xl font-bold">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
```

#### 2. Configure Sonner Toast Animations
**File**: `apps/web/src/app/layout.tsx` (update Toaster)

```tsx
import { Toaster } from "sonner";

// In your layout component
<Toaster
  position="top-right"
  expand={true}
  richColors
  closeButton
  toastOptions={{
    style: {
      background: "hsl(var(--card))",
      border: "1px solid hsl(var(--border))",
      color: "hsl(var(--foreground))",
    },
    className: "rounded-lg shadow-lg",
  }}
/>
```

### Testing
- [ ] Modal animates in/out smoothly
- [ ] Backdrop blur works
- [ ] ESC key closes modal
- [ ] Toast notifications slide in from top-right
- [ ] Multiple toasts stack correctly

---

## 📅 DAY 8-9: Chart Animations

### Objective
Add animations to data visualization charts.

### Tasks

#### 1. Create Animated Line Chart
**File**: `apps/web/src/components/charts/AnimatedLineChart.tsx`

```tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const data = [
  { month: "Jan", attendees: 120 },
  { month: "Feb", attendees: 180 },
  { month: "Mar", attendees: 240 },
  { month: "Apr", attendees: 320 },
  { month: "May", attendees: 450 },
  { month: "Jun", attendees: 580 },
];

export function AnimatedLineChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="attendees"
                stroke="hsl(var(--primary-500))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary-500))", r: 5 }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </CardContent>
    </Card>
  );
}
```

#### 2. Create Animated Counter
**File**: `apps/web/src/components/animations/AnimatedCounter.tsx`

```tsx
"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className={className}>{display}</motion.span>;
}
```

#### 3. Update Stats Card with Animated Counter
**File**: `apps/web/src/components/dashboard/StatsCard.tsx` (update)

```tsx
import { HoverLiftCard } from "@/components/animations/HoverLiftCard";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: "up" | "down";
  };
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-primary-500",
  iconBgColor = "bg-primary-100",
}: StatsCardProps) {
  const numericValue = typeof value === "number" ? value : parseInt(value.replace(/,/g, ""));

  return (
    <HoverLiftCard>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">
            {typeof value === "number" ? (
              <AnimatedCounter value={numericValue} />
            ) : (
              value
            )}
          </p>
          {change && (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "text-sm font-medium",
                  change.trend === "up" ? "text-green-600" : "text-red-600"
                )}
              >
                {change.trend === "up" ? "↑" : "↓"} {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", iconBgColor)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
      </div>
    </HoverLiftCard>
  );
}
```

### Testing
- [ ] Numbers count up smoothly
- [ ] Charts animate on load
- [ ] Line chart draws from left to right
- [ ] Counter respects duration prop

---

## 📅 DAY 10: Polish & Performance Optimization

### Objective
Optimize animations for performance and add final touches.

### Tasks

#### 1. Create Animation Utilities
**File**: `apps/web/src/lib/animations.ts`

```typescript
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const smoothTransition = {
  type: "spring" as const,
  damping: 25,
  stiffness: 300,
};

export const easeSmooth = [0.4, 0, 0.2, 1] as const;
```

#### 2. Add Reduced Motion Support
**File**: `apps/web/src/hooks/useReducedMotion.ts`

```typescript
"use client";

import { useEffect, useState } from "react";

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
```

#### 3. Create Motion Config
**File**: `apps/web/src/lib/motion-config.ts`

```typescript
import { MotionConfig } from "framer-motion";

export const globalMotionConfig = {
  reducedMotion: "user",
  transition: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
};
```

#### 4. Wrap App with Motion Config
**File**: `apps/web/src/app/layout.tsx` (update)

```tsx
import { MotionConfig } from "framer-motion";
import { globalMotionConfig } from "@/lib/motion-config";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MotionConfig {...globalMotionConfig}>
          {children}
        </MotionConfig>
      </body>
    </html>
  );
}
```

### Testing & Optimization
- [ ] Test all animations on low-end devices
- [ ] Verify reduced motion preference is respected
- [ ] Check for layout shifts during animations
- [ ] Ensure animations run at 60fps
- [ ] Test animation performance with React DevTools Profiler
- [ ] Remove unnecessary re-renders
- [ ] Lazy load animation components where possible

---

## ✅ Phase 7 Completion Checklist

Before moving to Phase 8, ensure:

- [ ] Page transitions work smoothly
- [ ] Scroll animations trigger correctly
- [ ] Button ripple effects work
- [ ] Card hover effects (lift, tilt) implemented
- [ ] Form inputs have floating labels and animations
- [ ] Password strength meter animates
- [ ] Skeleton screens implemented for all loading states
- [ ] Modal animations enhanced
- [ ] Toast notifications animate properly
- [ ] Charts have entrance animations
- [ ] Counters count up on mount
- [ ] Reduced motion preference respected
- [ ] All animations run at 60fps
- [ ] No layout shifts during animations

---

## 🎯 Next Steps

After completing Phase 7:
1. Review the [PHASE-8-DETAILED-GUIDE.md](./PHASE-8-DETAILED-GUIDE.md) for accessibility
2. Test animations across different browsers
3. Get user feedback on animation timing
4. Optimize any performance bottlenecks

---

## 📚 Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Animation Principles](https://www.youtube.com/watch?v=1ANhJFseLcI)
- [Web Animation Performance](https://web.dev/animations/)
- [Reduced Motion Guide](https://web.dev/prefers-reduced-motion/)

---

**END OF PHASE 7 GUIDE**

Continue with Phase 8 for accessibility and performance optimization!
