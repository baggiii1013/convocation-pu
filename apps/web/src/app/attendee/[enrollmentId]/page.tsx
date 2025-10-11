import { AerialVenueWrapper } from '@/components/attendee/AerialVenueWrapper';
import { TheaterSeatMap } from '@/components/attendee/TheaterSeatMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { notFound } from 'next/navigation';
import React from 'react';

interface PageProps {
  params: Promise<{ enrollmentId: string }>;
}

async function getAttendeeSeat(enrollmentId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/attendees/${enrollmentId}/seat`,
    { cache: 'no-store' }
  );

  if (!res.ok) return null;
  return res.json();
}

async function getAllEnclosures() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/enclosures`,
    { cache: 'no-store' }
  );

  if (!res.ok) return [];
  return res.json();
}

export default async function AttendeeSeatPage({ params }: PageProps) {
  const { enrollmentId } = await params;
  const [data, enclosures] = await Promise.all([
    getAttendeeSeat(enrollmentId),
    getAllEnclosures()
  ]);

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Convocation Seat
          </h1>
          <p className="text-gray-600">
            Find your assigned seat for the convocation ceremony
          </p>
        </div>

        {/* Aerial Venue View - Full Width */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Convocation Ground - Aerial View</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Click on any enclosure to view detailed seat layout
            </p>
          </CardHeader>
          <CardContent>
            <AerialVenueWrapper
              enclosures={enclosures}
              userAllocation={{
                enclosureLetter: data.allocation.enclosureLetter,
                rowLetter: data.allocation.rowLetter,
                seatNumber: data.allocation.seatNumber
              }}
            />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Attendee Details */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-xl">Your Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Name</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {data.attendee.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">
                      Enrollment ID
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {data.attendee.enrollmentId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Course</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {data.attendee.course}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">School</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {data.attendee.school}
                    </p>
                  </div>
                </div>

                {/* Seat Information */}
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg">
                    <p className="text-sm font-medium mb-4 opacity-90">
                      Your Assigned Seat
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Enclosure</span>
                        <span className="text-3xl font-bold">
                          {data.allocation.enclosureLetter}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Row</span>
                        <span className="text-3xl font-bold">
                          {data.allocation.rowLetter}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Seat Number</span>
                        <span className="text-3xl font-bold">
                          {data.allocation.seatNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Tips */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-amber-900 mb-2">
                      📋 Important Tips
                    </p>
                    <ul className="text-xs text-amber-800 space-y-1">
                      <li>• Arrive 30 minutes before the ceremony</li>
                      <li>• Bring your ID card for verification</li>
                      <li>• Entry from {data.enclosureMetadata.entryDirection} side</li>
                      <li>• Keep this page bookmarked for reference</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Theater Seat Map */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Interactive Seat Map</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Your seat is highlighted in red. Scroll to explore nearby seats.
            </p>
          </CardHeader>
          <CardContent>
            <TheaterSeatMap
              enclosure={data.enclosureMetadata}
              allocation={{
                rowLetter: data.allocation.rowLetter,
                seatNumber: data.allocation.seatNumber
              }}
            />
          </CardContent>
        </Card>

        {/* Download/Print Section */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print Seat Details
          </button>
        </div>
      </div>
    </div>
  );
}
