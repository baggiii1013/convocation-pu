'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Seat } from './Seat';

interface Row {
  letter: string;
  startSeat: number;
  endSeat: number;
  reservedSeats: string; // "1,5,10"
}

interface SeatMapProps {
  enclosure: {
    letter: string;
    entryDirection: string;
    rows: Row[];
  };
  allocation: {
    rowLetter: string;
    seatNumber: number;
  };
  className?: string;
}

export function TheaterSeatMap({
  enclosure,
  allocation,
  className
}: SeatMapProps) {
  const activeRowRef = useRef<HTMLDivElement>(null);
  const activeSeatRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Auto-scroll to active seat on mount
  useEffect(() => {
    if (!hasScrolled && activeRowRef.current && activeSeatRef.current) {
      setTimeout(() => {
        activeSeatRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
        setHasScrolled(true);
      }, 500);
    }
  }, [hasScrolled]);

  // Parse reserved seats
  const parseReserved = (reservedStr: string): number[] => {
    if (!reservedStr) return [];
    return reservedStr
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));
  };

  // Show only rows around user's seat (context: ±3 rows)
  const activeRowIndex = enclosure.rows.findIndex(r => r.letter === allocation.rowLetter);
  const startIndex = Math.max(0, activeRowIndex - 3);
  const endIndex = Math.min(enclosure.rows.length, activeRowIndex + 4);
  const visibleRows = enclosure.rows.slice(startIndex, endIndex);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Entry Direction Indicator */}
      <div className="flex items-center justify-center mb-4">
        <div className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg">
          <div className="flex items-center gap-2">
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
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="font-semibold text-sm uppercase tracking-wider">
              Entry: {enclosure.entryDirection}
            </span>
          </div>
        </div>
      </div>

      {/* Stage/Screen Indicator */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-full max-w-4xl h-3 bg-gradient-to-r from-transparent via-gray-800 to-transparent rounded-full mb-2"></div>
        <p className="text-sm text-gray-600 font-medium">STAGE</p>
      </div>

      {/* Seat Map */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-max space-y-3 px-4">
          {visibleRows.map((row, rowIndex) => {
            const isActiveRow = row.letter === allocation.rowLetter;
            const reservedSeats = parseReserved(row.reservedSeats);
            const _actualRowIndex = startIndex + rowIndex;

            return (
              <div
                key={row.letter}
                ref={isActiveRow ? activeRowRef : null}
                className={cn(
                  'flex items-center gap-2 p-3 rounded-lg transition-all duration-300',
                  isActiveRow && 'bg-blue-50 shadow-md ring-2 ring-blue-300'
                )}
              >
                {/* Row Label */}
                <div
                  className={cn(
                    'flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg font-bold text-lg',
                    isActiveRow
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700'
                  )}
                >
                  {row.letter}
                </div>

                {/* Seats in Row */}
                <div className="flex gap-1 sm:gap-2 flex-wrap">
                  {Array.from(
                    { length: row.endSeat - row.startSeat + 1 },
                    (_, i) => row.startSeat + i
                  ).map((seatNum) => {
                    const isSelected = isActiveRow && seatNum === allocation.seatNumber;
                    const isReserved = reservedSeats.includes(seatNum);

                    return (
                      <div
                        key={seatNum}
                        ref={isSelected ? activeSeatRef : null}
                      >
                        <Seat
                          number={seatNum}
                          isSelected={isSelected}
                          isReserved={isReserved}
                          isInActiveRow={isActiveRow}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Row End Label */}
                <div className="flex-shrink-0 text-sm text-gray-500 ml-2">
                  ({row.endSeat - row.startSeat + 1 - reservedSeats.length} seats)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8">
            <Seat number={0} isSelected={true} />
          </div>
          <span className="text-sm font-medium text-gray-700">Your Seat</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8">
            <Seat number={0} isInActiveRow={true} />
          </div>
          <span className="text-sm font-medium text-gray-700">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8">
            <Seat number={0} isReserved={true} />
          </div>
          <span className="text-sm font-medium text-gray-700">Reserved</span>
        </div>
      </div>

      {/* Navigation Hint */}
      {activeRowIndex > 3 && (
        <p className="text-center text-sm text-gray-500 italic mt-4">
          Showing rows {visibleRows[0].letter} - {visibleRows[visibleRows.length - 1].letter} (Your seat area)
        </p>
      )}
    </div>
  );
}
