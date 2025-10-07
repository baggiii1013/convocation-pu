# 📊 PHASE 6: Dashboard Pages - Detailed Implementation Guide

## 📋 Overview

**Duration**: 2 weeks (10 working days)  
**Prerequisites**: Phases 1-5 completed  
**Objective**: Design and implement all dashboard pages including admin panels, profile management, and data visualization components.

---

## 🎯 Phase Goals

By the end of Phase 6, you will have:

- ✅ Dashboard home page with statistics and quick actions
- ✅ User profile page with edit functionality
- ✅ Admin management pages (users, roles, permissions)
- ✅ Attendee management interface
- ✅ Event management dashboard
- ✅ Reports and analytics pages
- ✅ Data tables with sorting, filtering, and pagination
- ✅ Charts and data visualization components
- ✅ Bulk actions and batch operations
- ✅ Excel upload/download functionality

---

## 📅 Day-by-Day Implementation Schedule

---

## 📅 DAY 1: Dashboard Home Page - Stats Cards

### Objective
Create the main dashboard landing page with statistics cards and welcome banner.

### Tasks

#### 1. Create Dashboard Layout Wrapper
**File**: `apps/web/src/app/(dashboard)/dashboard/layout.tsx`

```tsx
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
```

#### 2. Create Stats Card Component
**File**: `apps/web/src/components/dashboard/StatsCard.tsx`

```tsx
import { Card } from "@/components/ui/Card";
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
    <Card className="hover:shadow-lg transition-all duration-300">
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
    </Card>
  );
}
```

#### 3. Create Welcome Banner
**File**: `apps/web/src/components/dashboard/WelcomeBanner.tsx`

```tsx
"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";

export function WelcomeBanner() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "User";

  return (
    <Card variant="gradient" className="relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-400/20 blur-3xl" />
      <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-accent-pink/20 blur-3xl" />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary-500" />
            <h2 className="text-2xl font-bold">
              Welcome back, {firstName}! 👋
            </h2>
          </div>
          <p className="text-muted-foreground">
            Here's what's happening with your convocation management today.
          </p>
        </div>
        <Button variant="secondary">View Reports</Button>
      </div>
    </Card>
  );
}
```

#### 4. Create Dashboard Home Page
**File**: `apps/web/src/app/(dashboard)/dashboard/page.tsx`

```tsx
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  Award,
  MapPin,
} from "lucide-react";

// This would come from your API
async function getDashboardStats() {
  return {
    totalCeremonies: 5,
    totalAttendees: 1248,
    confirmedSeats: 982,
    pendingConfirmations: 266,
    vipGuests: 24,
    venues: 3,
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Ceremonies"
          value={stats.totalCeremonies}
          change={{ value: 20, trend: "up" }}
          icon={Calendar}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          title="Total Attendees"
          value={stats.totalAttendees.toLocaleString()}
          change={{ value: 12, trend: "up" }}
          icon={Users}
          iconColor="text-primary-600"
          iconBgColor="bg-primary-100"
        />
        <StatsCard
          title="Confirmed Seats"
          value={stats.confirmedSeats.toLocaleString()}
          change={{ value: 8, trend: "up" }}
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatsCard
          title="Pending Confirmations"
          value={stats.pendingConfirmations}
          icon={Clock}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
        />
        <StatsCard
          title="VIP Guests"
          value={stats.vipGuests}
          icon={Award}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
        />
        <StatsCard
          title="Active Venues"
          value={stats.venues}
          icon={MapPin}
          iconColor="text-pink-600"
          iconBgColor="bg-pink-100"
        />
      </div>
    </div>
  );
}
```

### Testing
- [ ] Dashboard loads with correct stats
- [ ] Welcome banner displays user's name
- [ ] Stats cards show correct numbers and trends
- [ ] All icons render correctly
- [ ] Hover effects work on cards
- [ ] Responsive layout works on mobile

---

## 📅 DAY 2: Dashboard Home - Quick Actions & Activity Feed

### Objective
Add quick action cards and recent activity timeline to dashboard home.

### Tasks

#### 1. Create Quick Action Card
**File**: `apps/web/src/components/dashboard/QuickActionCard.tsx`

```tsx
import { Card } from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color?: string;
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  color = "text-primary-500",
}: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Card className="group cursor-pointer hover:border-primary-500/50 hover:shadow-glow-sm transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary-500/10 to-primary-600/10 group-hover:from-primary-500/20 group-hover:to-primary-600/20 transition-all duration-300">
            <Icon className={cn("h-6 w-6", color)} />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold group-hover:text-primary-500 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
```

#### 2. Create Activity Feed Component
**File**: `apps/web/src/components/dashboard/ActivityFeed.tsx`

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: Date;
  type: "create" | "update" | "delete" | "upload";
}

// Mock data - replace with API call
const activities: Activity[] = [
  {
    id: "1",
    user: { name: "Admin User", avatar: "/avatars/admin.jpg" },
    action: "uploaded",
    target: "student list (250 entries)",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    type: "upload",
  },
  {
    id: "2",
    user: { name: "John Doe", avatar: "/avatars/john.jpg" },
    action: "confirmed",
    target: "seat allocation",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    type: "update",
  },
  {
    id: "3",
    user: { name: "Jane Smith", avatar: "/avatars/jane.jpg" },
    action: "created",
    target: "new ceremony event",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    type: "create",
  },
];

const typeColors = {
  create: "success",
  update: "default",
  delete: "danger",
  upload: "default",
} as const;

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={activity.id} className="relative">
              {/* Timeline line */}
              {index !== activities.length - 1 && (
                <div className="absolute left-5 top-10 h-full w-px bg-border" />
              )}
              
              <div className="flex gap-4">
                <Avatar
                  src={activity.user.avatar}
                  alt={activity.user.name}
                  fallback={activity.user.name[0]}
                  size="md"
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.name}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant={typeColors[activity.type]} size="sm">
                      {activity.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

#### 3. Update Dashboard Home Page
**File**: `apps/web/src/app/(dashboard)/dashboard/page.tsx`

```tsx
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  Award,
  MapPin,
  Upload,
  UserPlus,
  FileText,
  Settings,
} from "lucide-react";

async function getDashboardStats() {
  return {
    totalCeremonies: 5,
    totalAttendees: 1248,
    confirmedSeats: 982,
    pendingConfirmations: 266,
    vipGuests: 24,
    venues: 3,
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8 p-6">
      <WelcomeBanner />

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Ceremonies"
          value={stats.totalCeremonies}
          change={{ value: 20, trend: "up" }}
          icon={Calendar}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          title="Total Attendees"
          value={stats.totalAttendees.toLocaleString()}
          change={{ value: 12, trend: "up" }}
          icon={Users}
          iconColor="text-primary-600"
          iconBgColor="bg-primary-100"
        />
        <StatsCard
          title="Confirmed Seats"
          value={stats.confirmedSeats.toLocaleString()}
          change={{ value: 8, trend: "up" }}
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatsCard
          title="Pending Confirmations"
          value={stats.pendingConfirmations}
          icon={Clock}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
        />
        <StatsCard
          title="VIP Guests"
          value={stats.vipGuests}
          icon={Award}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
        />
        <StatsCard
          title="Active Venues"
          value={stats.venues}
          icon={MapPin}
          iconColor="text-pink-600"
          iconBgColor="bg-pink-100"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickActionCard
            title="Upload Students"
            description="Import student list via Excel"
            icon={Upload}
            href="/admin/upload-students"
          />
          <QuickActionCard
            title="Add Attendee"
            description="Manually add new attendee"
            icon={UserPlus}
            href="/admin/attendees/new"
          />
          <QuickActionCard
            title="Generate Reports"
            description="View analytics and insights"
            icon={FileText}
            href="/admin/reports"
          />
          <QuickActionCard
            title="Manage Settings"
            description="Configure system preferences"
            icon={Settings}
            href="/admin/settings"
          />
        </div>
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <div>
          {/* Placeholder for upcoming events or notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No upcoming events scheduled
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

### Testing
- [ ] Quick action cards navigate to correct pages
- [ ] Activity feed shows recent activities with timestamps
- [ ] Timeline rendering works correctly
- [ ] Hover effects on quick action cards
- [ ] Mobile layout stacks properly

---

## 📅 DAY 3: Profile Page - View & Edit

### Objective
Create user profile page with view and edit modes.

### Tasks

#### 1. Create Profile Header Component
**File**: `apps/web/src/components/profile/ProfileHeader.tsx`

```tsx
"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Camera, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

interface ProfileHeaderProps {
  user: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    avatar?: string;
    role: string;
  };
  onEdit: () => void;
}

export function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
  const [avatarHover, setAvatarHover] = useState(false);

  return (
    <Card className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-accent-pink/5 to-transparent" />
      
      <div className="relative p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {/* Avatar with upload overlay */}
          <div
            className="relative"
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
          >
            <Avatar
              src={user.avatar}
              alt={user.name}
              fallback={user.name[0]}
              size="xl"
            />
            {avatarHover && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200">
                <Camera className="h-6 w-6 text-white" />
              </div>
            )}
          </div>

          {/* User info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground capitalize">{user.role}</p>
              </div>
              <Button onClick={onEdit} variant="outline">
                Edit Profile
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </div>
              {user.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {user.location}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
```

#### 2. Create Profile Edit Form
**File**: `apps/web/src/components/profile/ProfileEditForm.tsx`

```tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileEditFormProps {
  defaultValues: ProfileFormData;
  onSave: (data: ProfileFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProfileEditForm({
  defaultValues,
  onSave,
  onCancel,
}: ProfileEditFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      await onSave(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Full Name *
            </label>
            <Input
              {...register("name")}
              error={errors.name?.message}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Email Address *
            </label>
            <Input
              {...register("email")}
              type="email"
              error={errors.email?.message}
              placeholder="john@example.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Phone Number
              </label>
              <Input
                {...register("phone")}
                error={errors.phone?.message}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Location
              </label>
              <Input
                {...register("location")}
                error={errors.location?.message}
                placeholder="City, Country"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Bio
            </label>
            <textarea
              {...register("bio")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              rows={4}
              placeholder="Tell us about yourself..."
            />
            {errors.bio && (
              <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
```

#### 3. Create Profile Page
**File**: `apps/web/src/app/(dashboard)/dashboard/profile/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data - replace with actual data
  const user = {
    name: session?.user?.name || "User Name",
    email: session?.user?.email || "user@example.com",
    phone: "+1 234 567 8900",
    location: "Chandigarh, India",
    avatar: session?.user?.image,
    role: "admin",
    bio: "Managing convocation ceremonies since 2020",
  };

  const handleSave = async (data: any) => {
    // API call to save profile
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 p-6">
      <ProfileHeader
        user={user}
        onEdit={() => setIsEditing(true)}
      />

      {isEditing ? (
        <ProfileEditForm
          defaultValues={user}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{user.location}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Bio</p>
                  <p className="text-sm">{user.bio}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Role</p>
                  <Badge variant="default" className="capitalize">
                    {user.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Status</p>
                  <Badge variant="success">Active</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Member Since
                  </p>
                  <p className="text-sm">January 2024</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Testing
- [ ] Profile page displays user information
- [ ] Edit mode toggles correctly
- [ ] Form validation works
- [ ] Save updates profile (check toast notification)
- [ ] Cancel button discards changes
- [ ] Avatar hover effect shows camera icon

---

## 📅 DAY 4-5: Data Table Component

### Objective
Create reusable data table component with sorting, filtering, pagination, and bulk actions.

### Tasks

#### 1. Create Data Table Component
**File**: `apps/web/src/components/ui/DataTable.tsx`

```tsx
"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      {searchKey && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pl-9"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-sm font-semibold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper component for sortable column headers
export function SortableHeader({ column, children }: any) {
  return (
    <button
      className="flex items-center gap-2 hover:text-primary-500 transition-colors"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {children}
      <ArrowUpDown className="h-4 w-4" />
    </button>
  );
}
```

#### 2. Install Required Dependencies
```bash
cd apps/web
npm install @tanstack/react-table
```

#### 3. Create User Management Page with Data Table
**File**: `apps/web/src/app/(dashboard)/admin/users/page.tsx`

```tsx
"use client";

import { DataTable, SortableHeader } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "coordinator" | "attendee";
  status: "active" | "inactive";
  avatar?: string;
  createdAt: string;
};

// Mock data
const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "coordinator",
    status: "active",
    createdAt: "2024-02-20",
  },
  // Add more mock users...
];

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar
          src={row.original.avatar}
          alt={row.original.name}
          fallback={row.original.name[0]}
          size="sm"
        />
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-sm text-muted-foreground">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => <SortableHeader column={column}>Role</SortableHeader>,
    cell: ({ row }) => (
      <Badge variant="default" className="capitalize">
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader column={column}>Status</SortableHeader>,
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "success" : "default"}
        className="capitalize"
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortableHeader column={column}>Created</SortableHeader>,
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <Trash className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    ),
  },
];

export default function UsersPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions
          </p>
        </div>
        <Button>Add User</Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchKey="name"
        searchPlaceholder="Search users..."
      />
    </div>
  );
}
```

### Testing
- [ ] Table renders with data
- [ ] Search filters correctly
- [ ] Sorting works for all columns
- [ ] Pagination works
- [ ] Action buttons are clickable
- [ ] Responsive on mobile

---

## 📅 DAY 6-7: Admin Management Pages

### Objective
Create Excel upload, attendee management, and event management pages.

### Tasks

#### 1. Create Excel Upload Page
**File**: `apps/web/src/app/(dashboard)/admin/upload-students/page.tsx`

```tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Upload, Download, FileSpreadsheet, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function UploadStudentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        droppedFile.type === "application/vnd.ms-excel"
      ) {
        setFile(droppedFile);
      } else {
        toast.error("Please upload an Excel file (.xlsx or .xls)");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      // API call to upload file
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(`Successfully uploaded ${file.name}`);
      setFile(null);
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Student List</h1>
        <p className="text-muted-foreground">
          Import student data via Excel spreadsheet
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
                    : "border-border hover:border-primary-300"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-primary-100 dark:bg-primary-500/20">
                    <Upload className="h-8 w-8 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      Drag and drop your Excel file here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {file && (
                <div className="mt-4 p-4 rounded-lg bg-muted flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => setFile(null)} variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  loading={uploading}
                >
                  Upload File
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <p className="text-sm">Download the template Excel file</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <p className="text-sm">Fill in student details</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <p className="text-sm">Upload the completed file</p>
              </div>

              <Button variant="outline" className="w-full" icon={<Download />}>
                Download Template
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Important Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• File format: .xlsx or .xls</li>
                <li>• Max file size: 10 MB</li>
                <li>• Required columns: Name, Email, Enrollment ID</li>
                <li>• Do not modify column headers</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

### Testing
- [ ] File drag and drop works
- [ ] File input works
- [ ] Only Excel files accepted
- [ ] Upload progress shows
- [ ] Success toast displays
- [ ] Template download works

---

## 📅 DAY 8-9: Charts & Analytics

### Objective
Add data visualization with charts for reports and analytics.

### Tasks

#### 1. Install Chart Library
```bash
cd apps/web
npm install recharts
```

#### 2. Create Chart Components
**File**: `apps/web/src/components/charts/AttendanceChart.tsx`

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

const data = [
  { month: "Jan", attendees: 120 },
  { month: "Feb", attendees: 180 },
  { month: "Mar", attendees: 240 },
  { month: "Apr", attendees: 320 },
  { month: "May", attendees: 450 },
  { month: "Jun", attendees: 580 },
];

export function AttendanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Trend</CardTitle>
      </CardHeader>
      <CardContent>
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
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary-500))", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

#### 3. Create Reports Page
**File**: `apps/web/src/app/(dashboard)/admin/reports/page.tsx`

```tsx
import { AttendanceChart } from "@/components/charts/AttendanceChart";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/Button";
import { Download, Users, Calendar, CheckCircle } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            View insights and download reports
          </p>
        </div>
        <Button icon={<Download />}>Export Report</Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Ceremonies"
          value={12}
          icon={Calendar}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          title="Total Attendees"
          value="2,450"
          icon={Users}
          iconColor="text-primary-600"
          iconBgColor="bg-primary-100"
        />
        <StatsCard
          title="Confirmed"
          value="2,100"
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatsCard
          title="Attendance Rate"
          value="85.7%"
          icon={CheckCircle}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        {/* Add more charts as needed */}
      </div>
    </div>
  );
}
```

### Testing
- [ ] Charts render correctly
- [ ] Data displays accurately
- [ ] Responsive on mobile
- [ ] Export button works
- [ ] Tooltips show on hover

---

## 📅 DAY 10: Testing & Polish

### Objective
Test all dashboard pages, fix bugs, and polish UI.

### Tasks

1. **Test All Dashboard Routes**
   - [ ] Dashboard home loads correctly
   - [ ] Profile page works
   - [ ] User management table functions properly
   - [ ] Excel upload works
   - [ ] Reports page displays charts

2. **Test Responsive Design**
   - [ ] Mobile layout for all pages
   - [ ] Tablet layout
   - [ ] Desktop layout
   - [ ] Navigation works on all screen sizes

3. **Test Interactive Elements**
   - [ ] All buttons work
   - [ ] Form submissions
   - [ ] Table sorting/filtering
   - [ ] Modal open/close
   - [ ] Toast notifications

4. **Performance Optimization**
   - [ ] Lazy load heavy components
   - [ ] Optimize images
   - [ ] Check bundle size
   - [ ] Test loading states

5. **Accessibility**
   - [ ] Keyboard navigation
   - [ ] Screen reader labels
   - [ ] Focus indicators
   - [ ] Color contrast

---

## ✅ Phase 6 Completion Checklist

Before moving to Phase 7, ensure:

- [ ] Dashboard home page complete with stats and quick actions
- [ ] Profile page with view/edit modes
- [ ] User management with data table
- [ ] Excel upload functionality
- [ ] Reports page with charts
- [ ] All pages are mobile responsive
- [ ] Data tables have sorting, filtering, pagination
- [ ] Forms have validation
- [ ] Loading states implemented
- [ ] Error handling in place
- [ ] Toast notifications working
- [ ] Dark mode works on all pages

---

## 🎯 Next Steps

After completing Phase 6:
1. Review the [PHASE-7-DETAILED-GUIDE.md](./PHASE-7-DETAILED-GUIDE.md) for animations
2. Commit your changes to git
3. Test the entire dashboard flow end-to-end
4. Get feedback from stakeholders

---

## 📚 Resources

- [TanStack Table Docs](https://tanstack.com/table/v8)
- [Recharts Documentation](https://recharts.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Date-fns](https://date-fns.org/)

---

**END OF PHASE 6 GUIDE**

Continue with Phase 7 for animations and micro-interactions!
