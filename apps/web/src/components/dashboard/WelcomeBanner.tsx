"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles } from "lucide-react";

export function WelcomeBanner() {
  const { user } = useAuth();
  const firstName = user?.firstName || "User";

  return (
    <Card
      variant="gradient"
      padding="lg"
      className="relative overflow-hidden border-none"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-pink opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-300" />
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Welcome back, {firstName}!
            </h2>
          </div>
          <p className="text-lg text-white/90">
            Here's what's happening with your convocation today.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="bg-white text-primary-600 hover:bg-white/90"
          >
            View Profile
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="border-2 border-white text-white hover:bg-white/10"
          >
            Quick Actions
          </Button>
        </div>
      </div>
    </Card>
  );
}
