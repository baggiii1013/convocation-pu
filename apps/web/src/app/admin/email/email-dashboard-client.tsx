'use client';

import { EmailSender } from "@/components/admin/EmailSender";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Enclosure {
  id: string;
  letter: string;
  name: string | null;
  allocatedFor: string;
  totalSeats: number;
  allocatedSeats?: number;
  isActive: boolean;
}

export function EmailDashboardClient() {
  const [enclosures, setEnclosures] = useState<Enclosure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEnclosures();
  }, []);

  const fetchEnclosures = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch enclosures: ${res.status}`);
      }

      const data = await res.json();
      // The API returns the array directly, not wrapped in { data: [...] }
      const enclosuresArray = Array.isArray(data) ? data : (data.data || []);
      // console.log('Enclosures array:', enclosuresArray);
      setEnclosures(enclosuresArray);
    } catch (err) {
      console.error('Error fetching enclosures:', err);
      setError(err instanceof Error ? err.message : 'Failed to load enclosures');
    } finally {
      setLoading(false);
    }
  };

  // Transform enclosures to match EmailSender props
  const formattedEnclosures = React.useMemo(() => {
    const formatted = enclosures.map(enc => ({
      letter: enc.letter,
      name: enc.name,
      allocatedFor: enc.allocatedFor,
      totalSeats: enc.totalSeats,
      allocatedSeats: enc.allocatedSeats || 0
    }));
    return formatted;
  }, [enclosures]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <Link 
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Email Communication
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Send promotional or informational emails to attendees
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading enclosures...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">
            {error}
          </p>
          <button
            onClick={fetchEnclosures}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Email Sender Component */}
      {!loading && !error && (
        <EmailSender enclosures={formattedEnclosures} />
      )}
    </div>
  );
}
