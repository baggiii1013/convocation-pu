'use client';

import { cn } from '@/lib/utils';
import { Info, MapPin, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Row {
  id?: string;
  letter: string;
  startSeat: number;
  endSeat: number;
  reservedSeats: string;
  displayOrder?: number;
}

interface EnclosureDetailProps {
  enclosure: {
    letter: string;
    name?: string;
    allocatedFor: string;
    entryDirection: string;
    totalSeats?: number;
    rows: Row[];
  };
  userAllocation?: {
    rowLetter: string;
    seatNumber: number;
  };
  onClose: () => void;
  isOpen: boolean;
}

type SeatStatus = 'available' | 'occupied' | 'reserved' | 'user';

export function EnclosureDetailModal({
  enclosure,
  userAllocation,
  onClose,
  isOpen
}: EnclosureDetailProps) {
  const [selectedSeat, setSelectedSeat] = useState<{ row: string; seat: number } | null>(null);
  const [seatStatuses, setSeatStatuses] = useState<Record<string, SeatStatus>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Parse reserved seats
  const parseReserved = (reservedStr: string): number[] => {
    if (!reservedStr) return [];
    return reservedStr
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));
  };

  // Get seat status
  const getSeatStatus = (rowLetter: string, seatNumber: number): SeatStatus => {
    const key = `${rowLetter}-${seatNumber}`;
    if (userAllocation?.rowLetter === rowLetter && userAllocation?.seatNumber === seatNumber) {
      return 'user';
    }
    if (seatStatuses[key]) {
      return seatStatuses[key];
    }
    // For demo: randomly mark some as occupied (in real app, fetch from API)
    return Math.random() > 0.7 ? 'occupied' : 'available';
  };

  // Render a single seat
  const renderSeat = (rowLetter: string, seatNumber: number, isReserved: boolean) => {
    const status = isReserved ? 'reserved' : getSeatStatus(rowLetter, seatNumber);
    const isSelected = selectedSeat?.row === rowLetter && selectedSeat?.seat === seatNumber;

    const seatColors = {
      available: 'bg-green-100 hover:bg-green-200 border-green-300 text-green-700',
      occupied: 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed',
      reserved: 'bg-red-100 border-red-300 text-red-600 cursor-not-allowed',
      user: 'bg-blue-500 border-blue-600 text-white font-bold ring-2 ring-yellow-400'
    };

    return (
      <button
        key={`${rowLetter}-${seatNumber}`}
        onClick={() => {
          if (status !== 'occupied' && status !== 'reserved') {
            setSelectedSeat({ row: rowLetter, seat: seatNumber });
          }
        }}
        disabled={status === 'occupied' || status === 'reserved'}
        className={cn(
          'relative w-8 h-8 md:w-10 md:h-10 rounded-md border-2 transition-all duration-200 text-xs font-medium flex items-center justify-center',
          seatColors[status],
          isSelected && 'scale-110 ring-2 ring-blue-400',
          status === 'user' && 'animate-pulse'
        )}
        title={`Row ${rowLetter}, Seat ${seatNumber}`}
      >
        {status === 'user' ? '★' : seatNumber}
        {status === 'user' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white"></div>
        )}
      </button>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
              {enclosure.letter}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                Enclosure {enclosure.letter} {enclosure.name && `- ${enclosure.name}`}
              </h2>
              <p className="text-sm text-blue-100 flex items-center gap-2">
                <Users className="w-4 h-4" />
                {enclosure.allocatedFor}
                {enclosure.totalSeats && ` • ${enclosure.totalSeats} total seats`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            title="Close"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Entry Direction */}
          <div className="mb-6 flex items-center justify-center">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">Entry: {enclosure.entryDirection}</span>
            </div>
          </div>

          {/* Stage Indicator */}
          <div className="mb-8 text-center">
            <div className="inline-block bg-gray-800 text-white px-8 py-3 rounded-lg shadow-lg text-sm font-bold uppercase tracking-wider">
              ▼ Stage Direction
            </div>
            <div className="mt-2 h-1 w-full max-w-4xl mx-auto bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded"></div>
          </div>

          {/* Seat Map */}
          <div className="space-y-4">
            {enclosure.rows.map((row) => {
              const reservedSeats = parseReserved(row.reservedSeats);
              const seats = [];
              for (let seatNum = row.startSeat; seatNum <= row.endSeat; seatNum++) {
                seats.push(seatNum);
              }

              return (
                <div key={row.letter} className="flex items-center gap-3 justify-center">
                  {/* Row Label */}
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-700 text-white rounded-md flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0">
                    {row.letter}
                  </div>

                  {/* Seats */}
                  <div className="flex flex-wrap gap-1 md:gap-2 justify-center">
                    {seats.map((seatNum) =>
                      renderSeat(row.letter, seatNum, reservedSeats.includes(seatNum))
                    )}
                  </div>

                  {/* Row Label (Right) */}
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-700 text-white rounded-md flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0">
                    {row.letter}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Seat Info */}
          {selectedSeat && (
            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">Selected Seat</h4>
                  <p className="text-sm text-blue-700">
                    Row {selectedSeat.row}, Seat {selectedSeat.seat}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* User's Seat Info */}
          {userAllocation && (
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 rounded-lg shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-xl">
                  ★
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Your Assigned Seat</h4>
                  <p className="text-gray-700 font-semibold">
                    Row {userAllocation.rowLetter}, Seat {userAllocation.seatNumber}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Look for the starred seat (★) in the map above
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <h4 className="text-sm font-bold text-gray-800 mb-2">Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 border-2 border-green-300 rounded"></div>
              <span className="text-gray-700">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 border-2 border-gray-400 rounded"></div>
              <span className="text-gray-700">Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-100 border-2 border-red-300 rounded"></div>
              <span className="text-gray-700">Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 border-2 border-blue-600 rounded text-white flex items-center justify-center font-bold">
                ★
              </div>
              <span className="text-gray-700">Your Seat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
