'use client';

import { cn } from '@/lib/utils';
import { Info, Loader2, MapPin, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Row {
  id?: string;
  letter: string;
  startSeat: number;
  endSeat: number;
  reservedSeats: string;
  displayOrder?: number;
}

interface SeatAllocation {
  row: string;
  seat: number;
  enrollmentId: string;
  name?: string;
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
  seatAllocations?: SeatAllocation[];
  loadingAllocations?: boolean;
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
  seatAllocations = [],
  loadingAllocations = false,
  userAllocation,
  onClose,
  isOpen
}: EnclosureDetailProps) {
  const [selectedSeat, setSelectedSeat] = useState<{ row: string; seat: number } | null>(null);

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

  // Get seat status using real allocation data
  const getSeatStatus = (rowLetter: string, seatNumber: number): SeatStatus => {
    if (userAllocation?.rowLetter === rowLetter && userAllocation?.seatNumber === seatNumber) {
      return 'user';
    }
    
    // Check if this seat is allocated to someone
    const isOccupied = seatAllocations.some(
      allocation => allocation.row === rowLetter && allocation.seat === seatNumber
    );
    
    return isOccupied ? 'occupied' : 'available';
  };

  // Get seat allocation info for tooltip
  const getSeatInfo = (rowLetter: string, seatNumber: number): SeatAllocation | undefined => {
    return seatAllocations.find(
      allocation => allocation.row === rowLetter && allocation.seat === seatNumber
    );
  };

  // Render a single seat
  const renderSeat = (rowLetter: string, seatNumber: number, isReserved: boolean) => {
    const status = isReserved ? 'reserved' : getSeatStatus(rowLetter, seatNumber);
    const isSelected = selectedSeat?.row === rowLetter && selectedSeat?.seat === seatNumber;
    const seatInfo = getSeatInfo(rowLetter, seatNumber);

    const seatColors = {
      available: 'bg-green-100 hover:bg-green-200 border-green-300 text-green-700',
      occupied: 'bg-gray-300 hover:bg-gray-400 border-gray-400 text-gray-700 cursor-pointer',
      reserved: 'bg-red-100 hover:bg-red-200 border-red-300 text-red-600 cursor-pointer',
      user: 'bg-blue-500 border-blue-600 text-white font-bold ring-2 ring-yellow-400'
    };

    // Build tooltip text
    let tooltipText = `Row ${rowLetter}, Seat ${seatNumber}`;
    if (status === 'occupied' && seatInfo) {
      tooltipText += `\nOccupied by: ${seatInfo.name || seatInfo.enrollmentId}`;
    } else if (status === 'reserved') {
      tooltipText += '\nReserved';
    } else if (status === 'available') {
      tooltipText += '\nAvailable';
    } else if (status === 'user') {
      tooltipText += '\nYour Seat';
    }

    return (
      <button
        key={`${rowLetter}-${seatNumber}`}
        onClick={() => {
          setSelectedSeat({ row: rowLetter, seat: seatNumber });
        }}
        className={cn(
          'relative w-8 h-8 md:w-10 md:h-10 rounded-md border-2 transition-all duration-200 text-xs font-medium flex items-center justify-center',
          seatColors[status],
          isSelected && 'scale-110 ring-2 ring-blue-400',
          status === 'user' && 'animate-pulse'
        )}
        title={tooltipText}
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
      <div className="relative w-full max-w-7xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 flex items-center justify-between">
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
                {!loadingAllocations && ` • ${seatAllocations.length} occupied`}
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

        {/* Content - Two Column Layout */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Left/Top Column - Seat Map */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Loading State */}
            {loadingAllocations && (
              <div className="mb-6 flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-lg">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                <span className="text-blue-700 font-medium">Loading seat allocations...</span>
              </div>
            )}

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
          </div>

          {/* Right/Bottom Column - Selected Seat Info & Legend */}
          <div className="w-full lg:w-96 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              {/* Selected Seat Info */}
              {selectedSeat ? (() => {
                const seatInfo = getSeatInfo(selectedSeat.row, selectedSeat.seat);
                const isOccupied = !!seatInfo;
                const isReserved = enclosure.rows
                  .find(r => r.letter === selectedSeat.row)
                  ?.reservedSeats.split(',')
                  .map(s => parseInt(s.trim()))
                  .includes(selectedSeat.seat);

                if (isOccupied) {
                  return (
                    <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg shadow-md">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          <Users className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg mb-1">Occupied Seat</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Row {selectedSeat.row}, Seat {selectedSeat.seat}
                          </p>
                          <div className="bg-white rounded-md p-3 border border-gray-200">
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Assigned To</p>
                            <p className="text-gray-900 font-semibold text-base">{seatInfo.name || 'Unknown'}</p>
                            <p className="text-gray-600 text-sm mt-1">
                              <span className="text-gray-500">Enrollment ID:</span> {seatInfo.enrollmentId}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else if (isReserved) {
                  return (
                    <div className="p-5 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-lg shadow-md">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          ⚠
                        </div>
                        <div>
                          <h4 className="font-bold text-red-900 text-lg mb-1">Reserved Seat</h4>
                          <p className="text-sm text-red-700">
                            Row {selectedSeat.row}, Seat {selectedSeat.seat}
                          </p>
                          <p className="text-sm text-red-600 mt-2">
                            This seat is reserved and cannot be allocated
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="p-5 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-lg shadow-md">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-bold text-green-900 text-lg mb-1">Available Seat</h4>
                          <p className="text-sm text-green-700">
                            Row {selectedSeat.row}, Seat {selectedSeat.seat}
                          </p>
                          <p className="text-sm text-green-600 mt-2">
                            This seat is available for allocation
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              })() : (
                <div className="p-5 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900">No Seat Selected</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Click on any seat in the map to view details and occupant information
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* User's Seat Info */}
              {userAllocation && (
                <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 rounded-lg shadow-md">
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
                        Look for the starred seat (★) in the map
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Legend Footer - Sticky */}
            <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4">
              <h4 className="text-sm font-bold text-gray-800 mb-2">Legend</h4>
              <div className="grid grid-cols-2 gap-3 text-xs mb-2">
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
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <Info className="w-3 h-3" />
                <span>Click any seat for details</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
