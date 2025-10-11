"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Camera, Edit, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

interface ProfileHeaderProps {
  user: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    avatar?: string;
    role: string;
  };
  onEdit: () => void;
}

export function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
  const [avatarHover, setAvatarHover] = useState(false);

  return (
    <Card variant="gradient" padding="lg" className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-pink opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Avatar and Info */}
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
            {/* Avatar */}
            <div
              className="relative"
              onMouseEnter={() => setAvatarHover(true)}
              onMouseLeave={() => setAvatarHover(false)}
            >
              <Avatar size="xl" className="ring-4 ring-white/20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button
                className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/50 transition-opacity ${
                  avatarHover ? "opacity-100" : "opacity-0"
                }`}
                aria-label="Change avatar"
              >
                <Camera className="h-8 w-8 text-white" />
              </button>
            </div>

            {/* User Info */}
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              <p className="text-lg text-white/90">{user.role}</p>

              <div className="space-y-1 pt-2">
                <div className="flex items-center gap-2 text-white/80">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 text-white/80">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center gap-2 text-white/80">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{user.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <Button
            variant="secondary"
            size="lg"
            onClick={onEdit}
            className="bg-white text-primary-600 hover:bg-white/90"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>
    </Card>
  );
}
