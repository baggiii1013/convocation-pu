# Phase 5: Authentication Pages Redesign - Detailed Implementation Guide

## 📋 Overview

**Timeline**: 1 week (5 working days)
**Focus**: Redesign login, register, and password reset pages
**Prerequisites**: Phases 1-4 must be completed

---

## 🎯 Goals

- ✅ Create modern login page
- ✅ Build registration page with validation
- ✅ Design password reset flow
- ✅ Implement form validation
- ✅ Add social login options
- ✅ Create error handling
- ✅ Add success states
- ✅ Ensure mobile responsiveness
- ✅ Implement accessibility features

---

## 📦 Pages to Build

1. **Login Page** - User authentication
2. **Register Page** - New user signup
3. **Forgot Password** - Password reset request
4. **Reset Password** - New password form
5. **Email Verification** - Verify email page

---

## 📅 Day-by-Day Implementation

### **DAY 1-2: Login Page**

#### Step 1: Create Auth Layout

**File**: `/apps/web/src/components/auth/AuthLayout.tsx`

```tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8 bg-white dark:bg-dark-bg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              PU Convocation
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
          </div>

          {/* Form Content */}
          {children}
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex items-center justify-center p-12 bg-gradient-primary relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-accent-blue rounded-full blur-3xl"
        />
        
        <div className="relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-xl text-white/90 mb-8">
              Continue your journey with us
            </p>
            
            {/* Illustration */}
            <div className="relative w-full max-w-md mx-auto">
              <div className="aspect-square relative">
                <Image
                  src="/auth-illustration.svg"
                  alt="Authentication"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
```

#### Step 2: Create Login Page

**File**: `/apps/web/src/app/(auth)/login/page.tsx`

```tsx
'use client';

import * as React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, Lock, Github } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Login successful!');
      router.push('/dashboard');
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login coming soon!`);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />

        {/* Password */}
        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />
          <div className="flex justify-end mt-2">
            <Link
              href="/forgot-password"
              className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Remember me for 30 days
          </label>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Sign In
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-dark-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-dark-bg text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin('Google')}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin('GitHub')}
          >
            <Github className="h-5 w-5" />
            GitHub
          </Button>
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
```

---

### **DAY 3-4: Register Page**

#### Step 1: Create Register Page

**File**: `/apps/web/src/app/(auth)/register/page.tsx`

```tsx
'use client';

import * as React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { User, Mail, Lock, Phone, Building } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Registration successful! Please verify your email.');
      router.push('/verify-email');
    }, 1500);
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Sign up to register for the convocation"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          leftIcon={<User className="h-4 w-4" />}
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          error={errors.fullName}
        />

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />

        {/* Phone */}
        <Input
          label="Phone Number"
          type="tel"
          placeholder="9876543210"
          leftIcon={<Phone className="h-4 w-4" />}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          error={errors.phone}
        />

        {/* Department */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-white">
            Department
          </label>
          <Select
            value={formData.department}
            onValueChange={(value) => setFormData({ ...formData, department: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cs">Computer Science</SelectItem>
              <SelectItem value="ee">Electrical Engineering</SelectItem>
              <SelectItem value="me">Mechanical Engineering</SelectItem>
              <SelectItem value="ce">Civil Engineering</SelectItem>
              <SelectItem value="ec">Electronics & Communication</SelectItem>
            </SelectContent>
          </Select>
          {errors.department && (
            <p className="text-sm text-red-500">{errors.department}</p>
          )}
        </div>

        {/* Password */}
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          helperText="Must be at least 8 characters"
        />

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
        />

        {/* Terms & Conditions */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            required
            className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500 mt-1"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            I agree to the{' '}
            <Link href="/terms" className="text-primary-500 hover:text-primary-600">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-500 hover:text-primary-600">
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Create Account
        </Button>

        {/* Login link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
```

---

### **DAY 5: Password Reset Pages**

#### Step 1: Forgot Password Page

**File**: `/apps/web/src/app/(auth)/forgot-password/page.tsx`

```tsx
'use client';

import * as React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Password reset link sent!');
    }, 1500);
  };

  if (submitted) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent you a password reset link"
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We've sent a password reset link to{' '}
              <span className="font-medium text-gray-900 dark:text-white">{email}</span>
            </p>
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setSubmitted(false)}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                try again
              </button>
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/login">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="No worries, we'll send you reset instructions"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Send Reset Link
        </Button>

        <Button asChild variant="ghost" className="w-full">
          <Link href="/login">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Link>
        </Button>
      </form>
    </AuthLayout>
  );
}
```

#### Step 2: Reset Password Page

**File**: `/apps/web/src/app/(auth)/reset-password/page.tsx`

```tsx
'use client';

import * as React from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Password reset successful!');
      router.push('/login');
    }, 1500);
  };

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Your new password must be different from previous passwords"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="New Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          helperText="Must be at least 8 characters"
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          error={errors.confirmPassword}
        />

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
}
```

---

## ✅ Phase 5 Checklist

- [ ] Login page with validation
- [ ] Register page with form fields
- [ ] Forgot password flow
- [ ] Reset password page
- [ ] Social login buttons
- [ ] Form validation
- [ ] Error handling
- [ ] Success states
- [ ] Mobile responsive
- [ ] Accessibility features

---

## 🚀 Next Steps

Proceed to **Phase 6: Dashboard Pages** to redesign the dashboard, profile, and admin pages.

---

**Phase 5 Timeline**: 1 week
**Status**: Ready to implement

Good luck! 🎉
