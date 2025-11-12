"use client";

import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileFormData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const userProfile = {
    name: user.name,
    email: user.email,
    phone: "+1 (555) 123-4567",
    address: "123 University Ave, City, State",
    avatar: user.profileImageURL,
    role: user.role || "Attendee",
  };

  const handleSave = async (data: ProfileFormData) => {
    console.log("Saving profile:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
    toast.info("Changes discarded");
  };

  return (
    <div className="space-y-6">
      <ProfileHeader user={userProfile} onEdit={() => setIsEditing(true)} />

      {isEditing ? (
        <ProfileEditForm
          defaultValues={{
            name: userProfile.name,
            email: userProfile.email,
            phone: userProfile.phone,
            address: userProfile.address,
            bio: "Software developer passionate about education technology.",
          }}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </label>
                <div className="mt-1">
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Role
                </label>
                <p className="mt-1 text-base text-gray-900 dark:text-white">
                  {user.role}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Member Since
                </label>
                <p className="mt-1 text-base text-gray-900 dark:text-white">
                  January 2024
                </p>
              </div>
            </CardContent>
          </Card>

          <Card variant="default">
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Registered Events
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  3
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Attended Events
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  2
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Certificates Earned
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  2
                </span>
              </div>
            </CardContent>
          </Card>

          <Card variant="default" className="lg:col-span-2">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Software developer passionate about education technology and helping
                students achieve their academic goals. Experienced in building scalable
                web applications and contributing to open-source projects.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
