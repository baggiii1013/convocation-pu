import { AuthProvider } from '@/contexts/AuthContext';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased bg-dark-bg text-foreground">
        <AuthProvider>
          {children}
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
