import { Footer } from '@/components/landing/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { getServerSession } from '@/lib/auth/session';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import type { Metadata, Viewport } from "next";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

export const metadata: Metadata = {
  title: "PU Convocation - Parul University Convocation Platform",
  description: "Digital platform for managing convocation ceremonies at Parul University. Streamlining registration, seat allocation, and ceremonial processes.",
  keywords: "Parul University, Convocation, Graduation, Ceremony, Registration",
  authors: [{ name: "Kaustubh Bagale" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0F", // Dark mode only
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get session from server
  const session = await getServerSession();

  // Transform to UserInfo format
  const initialUser = session ? {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name || session.user.email,
    role: session.user.role,
    profileImageURL: undefined,
  } : null;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-dark-bg text-foreground">
        <AuthProvider initialUser={initialUser}>
          {children}
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--card)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              },
              success: {
                iconTheme: {
                  primary: 'var(--gold)',
                  secondary: 'var(--card)',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: 'var(--card)',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
