'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface Enclosure {
  letter: string;
  name?: string;
  allocatedFor: string;
}

interface VenueMapProps {
  enclosures: Enclosure[];
  activeEnclosure: string;
  onEnclosureClick?: (letter: string) => void;
  className?: string;
}

export function VenueMap({
  enclosures,
  activeEnclosure,
  onEnclosureClick,
  className
}: VenueMapProps) {
  return (
    <div className={cn('p-6 bg-gray-50 rounded-lg', className)}>
      <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
        Venue Layout
      </h3>

      {/* Ground/Venue Visual Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 max-w-2xl mx-auto">
        {enclosures.map((enclosure) => {
          const isActive = enclosure.letter === activeEnclosure;
          
          return (
            <button
              key={enclosure.letter}
              onClick={() => onEnclosureClick?.(enclosure.letter)}
              className={cn(
                'relative p-6 rounded-xl shadow-md transition-all duration-300 hover:scale-105',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                isActive
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white ring-4 ring-blue-300 shadow-xl'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              )}
            >
              {/* Enclosure Letter */}
              <div
                className={cn(
                  'text-3xl font-bold mb-2',
                  isActive ? 'text-white' : 'text-gray-800'
                )}
              >
                {enclosure.letter}
              </div>

              {/* Enclosure Name */}
              {enclosure.name && (
                <div
                  className={cn(
                    'text-xs font-medium mb-1',
                    isActive ? 'text-blue-100' : 'text-gray-600'
                  )}
                >
                  {enclosure.name}
                </div>
              )}

              {/* Allocated For */}
              <div
                className={cn(
                  'text-xs uppercase tracking-wide font-semibold',
                  isActive ? 'text-blue-200' : 'text-gray-500'
                )}
              >
                {enclosure.allocatedFor}
              </div>

              {/* Active Indicator */}
              {isActive && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded"></div>
          <span className="text-gray-600">Your Enclosure</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
          <span className="text-gray-600">Other Enclosures</span>
        </div>
      </div>
    </div>
  );
}
