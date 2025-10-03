'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard profile page
    router.replace('/dashboard/profile');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Redirecting to profile...</p>
    </div>
  );
}