# Phase 2: Core UI Components - Detailed Implementation Guide

## 📋 Overview

**Timeline**: 2 weeks (10 working days)
**Focus**: Building foundational UI components with District.in design language
**Prerequisites**: Phase 1 must be completed (design tokens, Tailwind config, global CSS)

---

## 🎯 Goals

- ✅ Create 10 core UI components
- ✅ Implement all variants and states for each component
- ✅ Add accessibility features (ARIA labels, keyboard navigation)
- ✅ Write reusable, type-safe components with TypeScript
- ✅ Add Storybook documentation for each component
- ✅ Test components in light and dark modes
- ✅ Ensure mobile responsiveness

---

## 📦 Components to Build

1. **Button** - Primary interactive element
2. **Card** - Content container
3. **Input** - Text input field
4. **Select** - Dropdown selector
5. **Modal** - Dialog/popup
6. **Toast** - Notification system
7. **Tooltip** - Hover information
8. **Badge** - Status indicators
9. **Avatar** - User profile image
10. **Skeleton** - Loading placeholders

---

## 📅 Day-by-Day Implementation

### **DAY 1-2: Button Component (Most Important)**

#### Step 1: Create Button Component File

**File**: `/apps/web/src/components/ui/Button.tsx`

```tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: 
          "bg-gradient-primary text-white shadow-md hover:shadow-lg hover:shadow-primary-500/50 hover:scale-102 active:scale-98",
        secondary: 
          "bg-dark-surface/80 text-white border border-dark-border hover:bg-dark-surface hover:border-primary-500/50 hover:shadow-glow-sm",
        outline: 
          "border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white hover:shadow-glow-sm",
        ghost: 
          "text-primary-500 hover:bg-primary-500/10 hover:text-primary-600",
        destructive: 
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:shadow-red-500/50 hover:scale-102",
        link: 
          "text-primary-500 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-13 px-8 text-lg",
        xl: "h-15 px-10 text-xl",
        icon: "h-10 w-10",
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
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <motion.div
            className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

#### Step 2: Create Utils Function

**File**: `/apps/web/src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### Step 3: Test Button Component

Create a test page: `/apps/web/src/app/test/buttons/page.tsx`

```tsx
import { Button } from '@/components/ui/Button';
import { ArrowRight, Download, Trash2, Plus } from 'lucide-react';

export default function ButtonTest() {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Button Components
        </h1>

        {/* Variants */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="link">Link Button</Button>
          </div>
        </section>

        {/* Sizes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
            <Button size="icon"><Plus className="h-5 w-5" /></Button>
          </div>
        </section>

        {/* With Icons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">With Icons</h2>
          <div className="flex flex-wrap gap-4">
            <Button leftIcon={<Download className="h-4 w-4" />}>
              Download
            </Button>
            <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
              Next
            </Button>
            <Button 
              variant="destructive" 
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Delete
            </Button>
          </div>
        </section>

        {/* States */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">States</h2>
          <div className="flex flex-wrap gap-4">
            <Button loading>Loading...</Button>
            <Button disabled>Disabled</Button>
            <Button variant="secondary" loading>Processing</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
```

#### Step 4: Verify Button Works

```bash
cd apps/web
npm run dev
```

Navigate to `http://localhost:3000/test/buttons` and verify:
- ✅ All variants render correctly
- ✅ Hover effects work
- ✅ Icons display properly
- ✅ Loading state shows spinner
- ✅ Disabled state prevents interaction
- ✅ Dark mode works

---

### **DAY 3-4: Card Component**

#### Step 1: Create Card Component

**File**: `/apps/web/src/components/ui/Card.tsx`

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  "rounded-xl transition-all duration-300",
  {
    variants: {
      variant: {
        default: 
          "bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border shadow-sm hover:shadow-md",
        glass: 
          "glass backdrop-blur-xl border border-white/20 dark:border-white/10",
        gradient: 
          "bg-gradient-primary text-white shadow-lg shadow-primary-500/20",
        elevated: 
          "bg-white dark:bg-dark-card shadow-lg hover:shadow-xl hover:-translate-y-1",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding }),
          interactive && "cursor-pointer hover:scale-102",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

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
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-gray-900 dark:text-white",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 dark:text-gray-400", className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4 border-t border-gray-200 dark:border-dark-border", className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

#### Step 2: Test Card Component

**File**: `/apps/web/src/app/test/cards/page.tsx`

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function CardTest() {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Card Components</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Default Card */}
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>Standard card with border and shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                This is a default card variant with clean styling and hover effects.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Learn More</Button>
            </CardFooter>
          </Card>

          {/* Glass Card */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Glass Card</CardTitle>
              <CardDescription>Glassmorphism effect</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                Semi-transparent with backdrop blur for modern aesthetic.
              </p>
            </CardContent>
          </Card>

          {/* Gradient Card */}
          <Card variant="gradient">
            <CardHeader>
              <CardTitle>Gradient Card</CardTitle>
              <CardDescription className="text-white/80">
                Purple gradient background
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">
                Eye-catching gradient card for highlighted content.
              </p>
            </CardContent>
          </Card>

          {/* Elevated Card */}
          <Card variant="elevated" interactive>
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>Interactive with hover lift</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                Hover over this card to see the elevation effect.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

---

### **DAY 5-6: Input & Select Components**

#### Step 1: Create Input Component

**File**: `/apps/web/src/components/ui/Input.tsx`

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  "flex w-full rounded-lg border bg-transparent px-4 py-2.5 text-base transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: 
          "border-gray-300 dark:border-dark-border focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/20",
        error: 
          "border-red-500 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20",
        success: 
          "border-green-500 focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/20",
      },
      inputSize: {
        sm: "h-9 text-sm px-3 py-2",
        md: "h-11 text-base px-4 py-2.5",
        lg: "h-13 text-lg px-5 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      inputSize,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const finalVariant = hasError ? 'error' : variant;

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant: finalVariant, inputSize }),
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              "text-sm",
              hasError ? "text-red-500" : "text-gray-600 dark:text-gray-400"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
```

#### Step 2: Create Select Component

**File**: `/apps/web/src/components/ui/Select.tsx`

```tsx
import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 dark:border-dark-border bg-transparent px-4 py-2.5 text-base transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-lg animate-fade-in",
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-primary-500/10 focus:text-primary-600 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-gray-200 dark:bg-dark-border', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
```

#### Step 3: Test Input & Select

**File**: `/apps/web/src/app/test/forms/page.tsx`

```tsx
'use client';

import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Mail, Lock, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export default function FormsTest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Form Components</h1>

        {/* Input Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Input Field</h2>
          
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            leftIcon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            leftIcon={<Lock className="h-4 w-4" />}
            helperText="Must be at least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            label="Search"
            type="text"
            placeholder="Search..."
            leftIcon={<Search className="h-4 w-4" />}
            inputSize="lg"
          />

          <Input
            label="Error State"
            type="text"
            placeholder="This field has an error"
            error="This field is required"
          />

          <Input
            label="Success State"
            type="text"
            placeholder="Valid input"
            variant="success"
            helperText="Looks good!"
          />
        </section>

        {/* Select Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Select Dropdown</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="in">India</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="attendee">Attendee</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Form Example */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Complete Form</h2>
          <form className="space-y-4 bg-white dark:bg-dark-card p-6 rounded-xl border border-gray-200 dark:border-dark-border">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              leftIcon={<User className="h-4 w-4" />}
            />
            <Input
              label="Email"
              type="email"
              placeholder="john@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="ee">Electrical Engineering</SelectItem>
                  <SelectItem value="me">Mechanical Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">Submit</Button>
          </form>
        </section>
      </div>
    </div>
  );
}
```

---

### **DAY 7-8: Modal & Toast Components**

#### Step 1: Install Additional Dependencies

```bash
npm install @radix-ui/react-dialog sonner
```

#### Step 2: Create Modal Component

**File**: `/apps/web/src/components/ui/Modal.tsx`

```tsx
'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalPortal = DialogPrimitive.Portal;
const ModalClose = DialogPrimitive.Close;

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
      className
    )}
    {...props}
  />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-6 shadow-xl duration-300 data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out sm:rounded-xl',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 dark:ring-offset-gray-950 dark:focus:ring-gray-300 dark:data-[state=open]:bg-gray-800">
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </ModalPortal>
));
ModalContent.displayName = DialogPrimitive.Content.displayName;

const ModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
);
ModalHeader.displayName = 'ModalHeader';

const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
);
ModalFooter.displayName = 'ModalFooter';

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight text-gray-900 dark:text-white',
      className
    )}
    {...props}
  />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-gray-600 dark:text-gray-400', className)}
    {...props}
  />
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalClose,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
};
```

#### Step 3: Create Toast Component

**File**: `/apps/web/src/components/ui/Toast.tsx`

```tsx
'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white dark:group-[.toaster]:bg-dark-card group-[.toaster]:text-gray-900 dark:group-[.toaster]:text-white group-[.toaster]:border-gray-200 dark:group-[.toaster]:border-dark-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-gray-600 dark:group-[.toast]:text-gray-400',
          actionButton:
            'group-[.toast]:bg-primary-500 group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-gray-100 dark:group-[.toast]:bg-gray-800 group-[.toast]:text-gray-600 dark:group-[.toast]:text-gray-400',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
```

#### Step 4: Add Toaster to Layout

**File**: `/apps/web/src/app/layout.tsx` (add to existing layout)

```tsx
import { Toaster } from '@/components/ui/Toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

#### Step 5: Test Modal & Toast

**File**: `/apps/web/src/app/test/dialogs/page.tsx`

```tsx
'use client';

import { Button } from '@/components/ui/Button';
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@/components/ui/Modal';
import { toast } from 'sonner';

export default function DialogsTest() {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Modal & Toast Components</h1>

        {/* Modal Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Modal Dialog</h2>
          <div className="flex flex-wrap gap-4">
            <Modal>
              <ModalTrigger asChild>
                <Button>Open Simple Modal</Button>
              </ModalTrigger>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Modal Title</ModalTitle>
                  <ModalDescription>
                    This is a simple modal dialog with a title and description.
                  </ModalDescription>
                </ModalHeader>
                <div className="py-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Modal content goes here. You can add any content you want.
                  </p>
                </div>
                <ModalFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Confirm</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Modal>
              <ModalTrigger asChild>
                <Button variant="destructive">Delete Confirmation</Button>
              </ModalTrigger>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle>Are you absolutely sure?</ModalTitle>
                  <ModalDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </ModalDescription>
                </ModalHeader>
                <ModalFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive">Delete</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </section>

        {/* Toast Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Toast Notifications</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => toast('Simple toast message')}>
              Default Toast
            </Button>
            
            <Button 
              variant="secondary"
              onClick={() => toast.success('Successfully saved!', {
                description: 'Your changes have been saved.'
              })}
            >
              Success Toast
            </Button>
            
            <Button 
              variant="destructive"
              onClick={() => toast.error('Something went wrong!', {
                description: 'Please try again later.'
              })}
            >
              Error Toast
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => toast.warning('Warning message', {
                description: 'Please review your input.'
              })}
            >
              Warning Toast
            </Button>
            
            <Button 
              variant="ghost"
              onClick={() => toast.info('Information', {
                description: 'Here is some important information.'
              })}
            >
              Info Toast
            </Button>

            <Button 
              onClick={() => toast('Event created', {
                description: 'Sunday, December 03, 2023 at 9:00 AM',
                action: {
                  label: 'Undo',
                  onClick: () => toast('Undone!'),
                },
              })}
            >
              Toast with Action
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
```

---

### **DAY 9-10: Tooltip, Badge, Avatar, Skeleton**

#### Step 1: Create Tooltip Component

**File**: `/apps/web/src/components/ui/Tooltip.tsx`

```tsx
'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-lg bg-gray-900 dark:bg-gray-800 px-3 py-1.5 text-sm text-white shadow-lg animate-fade-in',
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
```

#### Step 2: Create Badge Component

**File**: `/apps/web/src/components/ui/Badge.tsx`

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary-500 text-white shadow hover:bg-primary-600',
        secondary:
          'border-transparent bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white',
        success:
          'border-transparent bg-green-500 text-white shadow',
        warning:
          'border-transparent bg-orange-500 text-white shadow',
        error:
          'border-transparent bg-red-500 text-white shadow',
        outline:
          'text-gray-900 dark:text-white border-gray-300 dark:border-dark-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
```

#### Step 3: Create Avatar Component

**File**: `/apps/web/src/components/ui/Avatar.tsx`

```tsx
'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-gradient-primary text-white font-medium',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
```

#### Step 4: Create Skeleton Component

**File**: `/apps/web/src/components/ui/Skeleton.tsx`

```tsx
import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 bg-[length:200%_100%]',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
```

#### Step 5: Test All Remaining Components

**File**: `/apps/web/src/app/test/misc/page.tsx`

```tsx
'use client';

import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip';
import { Button } from '@/components/ui/Button';
import { Info, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export default function MiscTest() {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Misc Components</h1>

        {/* Badge Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Badges</h2>
          <div className="flex flex-wrap gap-4">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success" icon={<CheckCircle className="h-3 w-3" />}>
              Success
            </Badge>
            <Badge variant="warning" icon={<AlertCircle className="h-3 w-3" />}>
              Warning
            </Badge>
            <Badge variant="error" icon={<XCircle className="h-3 w-3" />}>
              Error
            </Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </section>

        {/* Avatar Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Avatars</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            
            <Avatar className="h-12 w-12">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            
            <Avatar className="h-16 w-16">
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://i.pravatar.cc/150?img=5" alt="User" />
              <AvatarFallback>PK</AvatarFallback>
            </Avatar>
          </div>
        </section>

        {/* Tooltip Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Tooltips</h2>
          <TooltipProvider>
            <div className="flex flex-wrap gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is a tooltip</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost">
                    <Info className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>More information here</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </section>

        {/* Skeleton Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Skeleton Loaders</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            
            <Skeleton className="h-48 w-full rounded-xl" />
            
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
```

---

## ✅ Phase 2 Checklist

By the end of this phase, you should have:

- [ ] Button component with 6 variants and 4 sizes
- [ ] Card component with 4 variants
- [ ] Input component with icons and validation states
- [ ] Select component with Radix UI
- [ ] Modal component with animations
- [ ] Toast notification system (Sonner)
- [ ] Tooltip component
- [ ] Badge component with 6 variants
- [ ] Avatar component with fallback
- [ ] Skeleton loading component
- [ ] Test pages for all components
- [ ] All components work in light and dark modes
- [ ] All components are mobile responsive
- [ ] TypeScript types for all components

---

## 🎨 Design Principles Applied

### 1. **Consistency**
- All components use the same purple color palette (#6D49FD)
- Consistent spacing (8px grid system)
- Consistent border radius (8px, 12px, 16px)
- Consistent shadow system

### 2. **Accessibility**
- Keyboard navigation support
- ARIA labels
- Focus visible states
- Proper color contrast
- Screen reader friendly

### 3. **Responsive Design**
- Mobile-first approach
- Touch-friendly (44px minimum touch targets)
- Responsive typography
- Fluid spacing

### 4. **Performance**
- Optimized animations (60fps)
- Lazy loading where appropriate
- Efficient re-renders
- Small bundle sizes

### 5. **User Experience**
- Clear hover states
- Smooth transitions (200-300ms)
- Loading states
- Error handling
- Visual feedback

---

## 🔧 Troubleshooting

### Issue: Components not styled properly

**Solution:**
```bash
# Ensure Tailwind is compiling
npx tailwindcss -i ./src/app/globals.css -o ./test-output.css
rm test-output.css

# Check for CSS errors
npm run build
```

### Issue: Radix UI components not working

**Solution:**
```bash
# Reinstall Radix UI packages
npm install @radix-ui/react-slot @radix-ui/react-dropdown-menu @radix-ui/react-dialog @radix-ui/react-tooltip @radix-ui/react-avatar
```

### Issue: Framer Motion animations not smooth

**Solution:**
- Check if GPU acceleration is enabled
- Reduce complexity of animations
- Use `will-change` CSS property sparingly

### Issue: Dark mode not working

**Solution:**
- Ensure `dark` class is toggled on `<html>` element
- Check CSS custom properties are defined
- Verify Tailwind dark mode is set to 'class' in config

---

## 📚 Resources

- [Radix UI Documentation](https://www.radix-ui.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Class Variance Authority](https://cva.style/docs)
- [Sonner Toast Library](https://sonner.emilkowal.ski/)

---

## 🚀 Next Steps

Once Phase 2 is complete, proceed to **Phase 3: Layout Components** where you'll build:
- Header with navigation
- Sidebar with menu items
- Bottom navigation for mobile
- Breadcrumb navigation
- Dashboard layout structure

---

**Phase 2 Timeline**: 2 weeks
**Status**: Ready to implement
**Dependencies**: Phase 1 must be complete

Good luck! 🎉
