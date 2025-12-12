'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { AlertCircle, ChevronLeft, Download, Info, Loader2, MapPin, RefreshCw, Search, Users } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface Enclosure {
  id: string;
  letter: string;
  name?: string;
  allocatedFor: string;
  entryDirection: string;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  color?: string;
  totalSeats?: number;
  rows: Array<{
    letter: string;
    startSeat: number;
    endSeat: number;
    reservedSeats: string;
    displayOrder: number;
  }>;
}

interface SeatAllocation {
  row: string;
  seat: number;
  enrollmentId: string;
  name?: string;
}

interface AerialViewEditorClientProps {
  initialEnclosures: Enclosure[];
}

/**
 * Client Component: Convocation Ground Overview
 * 
 * View the convocation ground layout and enclosure seat arrangements:
 * - Display convocation venue layout image
 * - View all enclosures with seat counts
 * - Click on enclosures to view detailed seat maps
 * - See which seats are occupied and by whom
 * 
 * @component
 */
export function AerialViewEditorClient({ initialEnclosures }: AerialViewEditorClientProps) {
  const [enclosures, setEnclosures] = useState<Enclosure[]>(initialEnclosures);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for selected enclosure detail view
  const [selectedEnclosure, setSelectedEnclosure] = useState<Enclosure | null>(null);
  const [seatAllocations, setSeatAllocations] = useState<SeatAllocation[]>([]);
  const [loadingAllocations, setLoadingAllocations] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<{ row: string; seat: number } | null>(null);

  const fetchEnclosures = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch enclosures');
      }

      const data = await res.json();
      setEnclosures(data.data || data || []);
      toast.success('Enclosures refreshed');
    } catch (err) {
      console.error('Error fetching enclosures:', err);
      setError('Failed to load enclosures. Please try again.');
      toast.error('Failed to refresh enclosures');
    } finally {
      setLoading(false);
    }
  };

  const handleExportLayout = () => {
    if (enclosures.length === 0) {
      toast.error('No enclosures to export');
      return;
    }

    try {
      // Create CSV content
      const headers = ['Letter', 'Name', 'Allocated For', 'Total Seats', 'Rows'];
      const csvContent = [
        headers.join(','),
        ...enclosures.map(e => [
          e.letter,
          `"${e.name || ''}"`,
          e.allocatedFor,
          e.totalSeats || 0,
          e.rows?.length || 0
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `aerial-view-layout-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Layout exported successfully');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Failed to export layout');
    }
  };

  // Handle enclosure card click to show seat details
  const handleEnclosureClick = async (enclosure: Enclosure) => {
    setSelectedEnclosure(enclosure);
    setSelectedSeat(null);
    setSeatAllocations([]);
    setLoadingAllocations(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/allocations/enclosure/${enclosure.letter}`,
        { credentials: 'include' }
      );

      if (response.ok) {
        const data = await response.json();
        const allocations: SeatAllocation[] = [];
        if (data.data?.rows) {
          data.data.rows.forEach((row: { row: string; attendees?: Array<{ seat: number; enrollmentId: string; name?: string }> }) => {
            row.attendees?.forEach((attendee: { seat: number; enrollmentId: string; name?: string }) => {
              allocations.push({
                row: row.row,
                seat: attendee.seat,
                enrollmentId: attendee.enrollmentId,
                name: attendee.name,
              });
            });
          });
        }
        setSeatAllocations(allocations);
      } else {
        setSeatAllocations([]);
      }
    } catch (error) {
      console.error('Failed to fetch seat allocations:', error);
      setSeatAllocations([]);
    } finally {
      setLoadingAllocations(false);
    }
  };

  const handleCloseEnclosureDetail = () => {
    setSelectedEnclosure(null);
    setSeatAllocations([]);
    setSelectedSeat(null);
  };

  // Parse reserved seats
  const parseReserved = (reservedStr: string): number[] => {
    if (!reservedStr) return [];
    return reservedStr
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));
  };

  type SeatStatus = 'available' | 'occupied' | 'reserved';

  // Get seat status using real allocation data
  const getSeatStatus = (rowLetter: string, seatNumber: number): SeatStatus => {
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
    };

    let tooltipText = `Row ${rowLetter}, Seat ${seatNumber}`;
    if (status === 'occupied' && seatInfo) {
      tooltipText += `\nOccupied by: ${seatInfo.name || seatInfo.enrollmentId}`;
    } else if (status === 'reserved') {
      tooltipText += '\nReserved';
    } else if (status === 'available') {
      tooltipText += '\nAvailable';
    }

    return (
      <button
        key={`${rowLetter}-${seatNumber}`}
        onClick={() => setSelectedSeat({ row: rowLetter, seat: seatNumber })}
        className={cn(
          'relative w-8 h-8 md:w-10 md:h-10 rounded-md border-2 transition-all duration-200 text-xs font-medium flex items-center justify-center',
          seatColors[status],
          isSelected && 'scale-110 ring-2 ring-blue-400'
        )}
        title={tooltipText}
      >
        {seatNumber}
      </button>
    );
  };

  // Filter enclosures based on search query
  const filteredEnclosures = enclosures.filter(e => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      e.letter.toLowerCase().includes(query) ||
      (e.name && e.name.toLowerCase().includes(query)) ||
      e.allocatedFor.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Convocation Ground Overview
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                View the convocation venue layout and enclosure seat arrangements
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={fetchEnclosures}
                variant="outline"
                size="sm"
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={handleExportLayout}
                variant="outline"
                size="sm"
                disabled={enclosures.length === 0}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Convocation Layout Image */}
        <Card className="mb-6 bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border">
          <CardHeader className="bg-blue-50 dark:bg-gray-800/50 border-b border-blue-100 dark:border-dark-border mb-4">
            <CardTitle className="text-xl text-gray-900 dark:text-white">Convocation Ground Layout</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Reference layout of the convocation venue
            </p>
          </CardHeader>
          <CardContent>
            <div className="relative w-full rounded-lg overflow-hidden border border-gray-200 dark:border-dark-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Convocation Layout Final-1.png"
                alt="Convocation Ground Layout"
                className="w-full h-auto object-contain"
              />
            </div>
          </CardContent>
        </Card>

        {/* Enclosure List / Detail View */}
        <Card className="mt-6 bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border">
          <CardHeader className="bg-blue-50 dark:bg-gray-800/50 border-b border-blue-100 dark:border-dark-border mb-[32px]">
            <div className="flex items-center justify-between">
              {selectedEnclosure ? (
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseEnclosureDetail}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <CardTitle className="text-lg text-gray-900 dark:text-white">
                    Enclosure {selectedEnclosure.letter} {selectedEnclosure.name && `- ${selectedEnclosure.name}`}
                  </CardTitle>
                </div>
              ) : (
                <CardTitle className="text-lg text-gray-900 dark:text-white">Enclosures Overview</CardTitle>
              )}
              {!selectedEnclosure && enclosures.length > 0 && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredEnclosures.length} of {enclosures.length} enclosures
                </span>
              )}
            </div>
            {!selectedEnclosure && enclosures.length > 0 && (
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search enclosures by letter, name, or allocation..."
                  className="pl-10 border-2 border-gray-200 focus:border-blue-500"
                />
              </div>
            )}
          </CardHeader>
          <CardContent>
            {selectedEnclosure ? (
              /* Enclosure Detail View with Seat Map */
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column - Seat Map */}
                <div className="flex-1">
                  {/* Loading State */}
                  {loadingAllocations && (
                    <div className="mb-6 flex items-center justify-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="text-blue-700 dark:text-blue-300 font-medium">Loading seat allocations...</span>
                    </div>
                  )}

                  {/* Enclosure Info */}
                  <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-3">
                      <div 
                        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                        style={{ backgroundColor: selectedEnclosure.color || '#3B82F6' }}
                      >
                        {selectedEnclosure.letter}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {selectedEnclosure.name || `Enclosure ${selectedEnclosure.letter}`}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {selectedEnclosure.allocatedFor}
                          {selectedEnclosure.totalSeats && ` • ${selectedEnclosure.totalSeats} total seats`}
                          {!loadingAllocations && ` • ${seatAllocations.length} occupied`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Entry Direction */}
                  <div className="mb-6 flex items-center justify-center">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span className="font-semibold">Entry: {selectedEnclosure.entryDirection}</span>
                    </div>
                  </div>

                  {/* Stage Indicator */}
                  <div className="mb-8 text-center">
                    <div className="inline-block bg-gray-800 dark:bg-gray-700 text-white px-8 py-3 rounded-lg shadow-lg text-sm font-bold uppercase tracking-wider">
                      ▼ Stage Direction
                    </div>
                    <div className="mt-2 h-1 w-full max-w-4xl mx-auto bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded"></div>
                  </div>

                  {/* Seat Map */}
                  <div className="space-y-4 overflow-x-auto">
                    {selectedEnclosure.rows.map((row) => {
                      const reservedSeats = parseReserved(row.reservedSeats);
                      const seats = [];
                      for (let seatNum = row.startSeat; seatNum <= row.endSeat; seatNum++) {
                        seats.push(seatNum);
                      }

                      return (
                        <div key={row.letter} className="flex items-center gap-3 justify-center min-w-fit">
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

                {/* Right Column - Selected Seat Info & Legend */}
                <div className="w-full lg:w-80 flex-shrink-0">
                  {/* Selected Seat Info */}
                  <div className="mb-4">
                    {selectedSeat ? (() => {
                      const seatInfo = getSeatInfo(selectedSeat.row, selectedSeat.seat);
                      const isOccupied = !!seatInfo;
                      const isReserved = selectedEnclosure.rows
                        .find(r => r.letter === selectedSeat.row)
                        ?.reservedSeats.split(',')
                        .map(s => parseInt(s.trim()))
                        .includes(selectedSeat.seat);

                      if (isOccupied) {
                        return (
                          <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-md">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                <Users className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">Occupied Seat</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                  Row {selectedSeat.row}, Seat {selectedSeat.seat}
                                </p>
                                <div className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-600">
                                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Assigned To</p>
                                  <p className="text-gray-900 dark:text-white font-semibold text-base">{seatInfo.name || 'Unknown'}</p>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                    <span className="text-gray-500">Enrollment ID:</span> {seatInfo.enrollmentId}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      } else if (isReserved) {
                        return (
                          <div className="p-5 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-2 border-red-300 dark:border-red-700 rounded-lg shadow-md">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-red-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                ⚠
                              </div>
                              <div>
                                <h4 className="font-bold text-red-900 dark:text-red-300 text-lg mb-1">Reserved Seat</h4>
                                <p className="text-sm text-red-700 dark:text-red-400">
                                  Row {selectedSeat.row}, Seat {selectedSeat.seat}
                                </p>
                                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                                  This seat is reserved and cannot be allocated
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="p-5 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-2 border-green-300 dark:border-green-700 rounded-lg shadow-md">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                ✓
                              </div>
                              <div>
                                <h4 className="font-bold text-green-900 dark:text-green-300 text-lg mb-1">Available Seat</h4>
                                <p className="text-sm text-green-700 dark:text-green-400">
                                  Row {selectedSeat.row}, Seat {selectedSeat.seat}
                                </p>
                                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                                  This seat is available for allocation
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })() : (
                      <div className="p-5 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-200">No Seat Selected</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                              Click on any seat in the map to view details and occupant information
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Legend */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-6 py-4">
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Legend</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-100 border-2 border-green-300 rounded"></div>
                        <span className="text-gray-700 dark:text-gray-300">Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-300 border-2 border-gray-400 rounded"></div>
                        <span className="text-gray-700 dark:text-gray-300">Occupied</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-red-100 border-2 border-red-300 rounded"></div>
                        <span className="text-gray-700 dark:text-gray-300">Reserved</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-3">
                      <Info className="w-3 h-3" />
                      <span>Click any seat for details</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : filteredEnclosures.length === 0 && searchQuery ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">No matching enclosures</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Try adjusting your search query</p>
              </div>
            ) : filteredEnclosures.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No enclosures available</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredEnclosures.map((enc) => (
                  <div
                    key={enc.id}
                    onClick={() => handleEnclosureClick(enc)}
                    className="border-2 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-100 dark:bg-gray-800 cursor-pointer hover:scale-[1.02]"
                    style={{ borderColor: enc.color || '#3B82F6' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-2xl font-bold"
                        style={{ color: enc.color || '#3B82F6' }}
                      >
                        {enc.letter}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {enc.name || `Enclosure ${enc.letter}`}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{enc.allocatedFor}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {enc.totalSeats || 0} seats • {enc.rows?.length || 0} rows
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">
                      Click to view seat map →
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
