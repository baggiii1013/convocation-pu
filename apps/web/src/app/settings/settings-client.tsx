'use client';

import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import toast from 'react-hot-toast';

interface UserSession {
  id: string;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'STUDENT';
  name?: string;
}

interface SettingsClientProps {
  user: UserSession;
}

export function SettingsClient({ user }: SettingsClientProps) {
  const handleThemeToggle = () => {
    // Theme is locked to dark mode
    toast('Dark mode is enabled by default', { icon: 'ℹ️' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and application settings.
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Appearance</CardTitle>
            <CardDescription>
              Customize how the application looks and feels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Currently using dark mode
                </p>
              </div>
              <Button
                onClick={handleThemeToggle}
                variant="outline"
                className="border-gold/20 hover:border-gold/40"
              >
                Dark Mode (Default)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Account Information</CardTitle>
            <CardDescription>
              View your current account details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-foreground">Email</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Role</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {user.role.toLowerCase()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
