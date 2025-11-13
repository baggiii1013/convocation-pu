'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { AlertCircle, Download, Plus, RefreshCw, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface Enclosure {
  id: string;
  letter: string;
  name?: string;
  rows: Array<{
    letter: string;
    startSeat: number;
    endSeat: number;
    reservedSeats: string;
  }>;
}

interface Reservation {
  id: string;
  enclosureLetter: string;
  rowLetter: string;
  seatNumber: number;
  reservedFor?: string;
  reservedBy?: string;
  createdAt: string;
}

interface ReserveSeatsClientProps {
  initialEnclosures: Enclosure[];
  initialReservations: Reservation[];
}

/**
 * Client Component: Reserve Seats
 * 
 * Handles seat reservation management:
 * - Select enclosure and row
 * - Specify seat numbers (individual or ranges)
 * - Add reservations with optional "reserved for" label
 * - View all current reservations
 * - Remove reservations
 * - Summary by enclosure
 * 
 * Supports complex seat number parsing (1,5,10 or 1-10 or combined).
 * 
 * @component
 */
export function ReserveSeatsClient({ initialEnclosures, initialReservations }: ReserveSeatsClientProps) {
  // Ensure enclosures is always an array
  const [enclosures] = useState<Enclosure[]>(
    Array.isArray(initialEnclosures) ? initialEnclosures : []
  );
  const [selectedEnclosure, setSelectedEnclosure] = useState('');
  const [selectedRow, setSelectedRow] = useState('');
  const [seatNumbers, setSeatNumbers] = useState('');
  const [reservedFor, setReservedFor] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Removed unused fetchEnclosures function since we use initialEnclosures

  const fetchReservations = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/reservations`, {
        credentials: 'include',
      });
      const data = await res.json();
      setReservations(data.reservations || []);
    } catch (error) {
      console.error('Failed to load reservations:', error);
      toast.error('Failed to load reservations');
    }
  };

  const handleReserve = async () => {
    if (!selectedEnclosure || !selectedRow || !seatNumbers) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      // Parse seat numbers (comma-separated: 1,5,10-15)
      const seats = parseSeatNumbers(seatNumbers);

      if (seats.length === 0) {
        toast.error('Invalid seat numbers');
        return;
      }

      const reservations = seats.map((seat) => ({
        enclosureLetter: selectedEnclosure,
        rowLetter: selectedRow,
        seatNumber: seat,
        reservedFor: reservedFor || undefined,
        reservedBy: 'admin', // Get from auth context
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/reserve-seats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservations }),
        credentials: 'include',
      });

      const data = await res.json();

      if (data.errors && data.errors.length > 0) {
        toast.error(
          `Reserved ${data.success} seats. ${data.failed} failed. Check console for details.`
        );
        console.error('Reservation errors:', data.errors);
      } else {
        toast.success(`Successfully reserved ${data.success} seats`);
      }

      // Reset form
      setSeatNumbers('');
      setReservedFor('');
      fetchReservations();
    } catch (error) {
      console.error('Reservation failed:', error);
      toast.error('Failed to reserve seats');
    } finally {
      setLoading(false);
    }
  };

  const parseSeatNumbers = (input: string): number[] => {
    const seats: number[] = [];
    const parts = input.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            seats.push(i);
          }
        }
      } else {
        const num = Number(part);
        if (!isNaN(num)) {
          seats.push(num);
        }
      }
    }

    return [...new Set(seats)]; // Remove duplicates
  };

  const removeReservation = async (id: string) => {
    if (!confirm('Remove this reservation?')) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/reservations/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      toast.success('Reservation removed');
      fetchReservations();
    } catch (error) {
      console.error('Remove failed:', error);
      toast.error('Failed to remove reservation');
    }
  };

  const clearAllReservations = async () => {
    if (!confirm('Are you sure you want to clear ALL reservations? This action cannot be undone!')) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/reservations`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        toast.success('All reservations cleared successfully');
        setReservations([]);
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to clear reservations');
      }
    } catch (error) {
      console.error('Clear all failed:', error);
      toast.error('Failed to clear all reservations');
    } finally {
      setLoading(false);
    }
  };

  const exportReservations = () => {
    if (reservations.length === 0) {
      toast.error('No reservations to export');
      return;
    }

    // Create CSV content
    const headers = ['Enclosure', 'Row', 'Seat Number', 'Reserved For', 'Reserved By', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...reservations.map(r => [
        r.enclosureLetter,
        r.rowLetter,
        r.seatNumber,
        r.reservedFor || '',
        r.reservedBy || '',
        new Date(r.createdAt).toLocaleString()
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `seat-reservations-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Reservations exported successfully');
  };

  // Filter reservations based on search query
  const filteredReservations = reservations.filter(r => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      r.enclosureLetter.toLowerCase().includes(query) ||
      r.rowLetter.toLowerCase().includes(query) ||
      r.seatNumber.toString().includes(query) ||
      (r.reservedFor && r.reservedFor.toLowerCase().includes(query)) ||
      (r.reservedBy && r.reservedBy.toLowerCase().includes(query))
    );
  });

  const selectedEnclosureData = enclosures.find((e) => e.letter === selectedEnclosure);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Reserve Seats
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Reserve specific seats for VIPs and special guests
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Reservation Form - Enhanced */}
        <Card className="border-0 shadow-xl bg-white dark:bg-dark-card overflow-hidden">
          {/* Decorative top border */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
          
          <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20 border-b border-gray-100 dark:border-dark-border">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Create Seat Reservation
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
          <div>
            <Label htmlFor="enclosure" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Enclosure *</Label>
            <Select value={selectedEnclosure} onValueChange={(value: string) => {
              setSelectedEnclosure(value);
              setSelectedRow(''); // Reset row when enclosure changes
            }}>
              <SelectTrigger className="mt-2 border-2 border-gray-200 focus:border-emerald-500 transition-colors">
                <SelectValue placeholder="Select enclosure" />
              </SelectTrigger>
                <SelectContent>
                  {enclosures.map((enc) => (
                    <SelectItem key={enc.id} value={enc.letter}>
                      <span className="font-semibold">{enc.letter}</span> - {enc.name || `Enclosure ${enc.letter}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="row" className="text-sm font-semibold text-gray-700">Row *</Label>
              <Select
                value={selectedRow}
                onValueChange={setSelectedRow}
                disabled={!selectedEnclosure}
              >
                <SelectTrigger className="mt-2 border-2 border-gray-200 focus:border-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <SelectValue placeholder="Select row" />
                </SelectTrigger>
                <SelectContent>
                  {selectedEnclosureData?.rows.map((row) => (
                    <SelectItem key={row.letter} value={row.letter}>
                      <span className="font-semibold">Row {row.letter}</span> (Seats {row.startSeat}-{row.endSeat})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="seats" className="text-sm font-semibold text-gray-700">Seat Numbers *</Label>
              <Input
                id="seats"
                value={seatNumbers}
                onChange={(e) => setSeatNumbers(e.target.value)}
                placeholder="e.g., 1,5,10 or 1-10"
                className="mt-2 border-2 border-gray-200 focus:border-emerald-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
                <span className="text-emerald-600 font-semibold">💡</span>
                Comma-separated or range (e.g., &quot;1,5,10&quot; or &quot;1-10&quot; or &quot;1,5-10,15&quot;)
              </p>
            </div>

            <div>
              <Label htmlFor="reservedFor" className="text-sm font-semibold text-gray-700">Reserved For (Optional)</Label>
              <Input
                id="reservedFor"
                value={reservedFor}
                onChange={(e) => setReservedFor(e.target.value)}
                placeholder="e.g., VIP, Special Guest"
                className="mt-2 border-2 border-gray-200 focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4 shadow-lg">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full blur-2xl"></div>
              <div className="relative flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-blue-600 rounded-lg shadow-md">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-sm text-blue-900">
                  <p className="font-bold mb-1">Important Note</p>
                  <p>Reserved seats will be skipped during automatic seat allocation. Make sure to reserve seats before running the allocation algorithm.</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleReserve} 
              disabled={loading} 
              className="w-full gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Reserving Seats...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Reserve Seats
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Reservations List - Enhanced */}
        <Card className="border-0 shadow-xl bg-white overflow-hidden">
          {/* Decorative top border */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
          
          <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-xl font-bold text-gray-900">Current Reservations</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {reservations.length}
                </span>
                <span className="text-sm text-gray-600">reserved</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={fetchReservations}
                variant="outline"
                size="sm"
                className="gap-2 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                onClick={exportReservations}
                variant="outline"
                size="sm"
                disabled={reservations.length === 0}
                className="gap-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button
                onClick={clearAllReservations}
                variant="danger"
                size="sm"
                disabled={loading || reservations.length === 0}
                className="gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Clear All
              </Button>
            </div>

            {/* Search Bar */}
            {reservations.length > 0 && (
              <div className="mt-4">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by enclosure, row, seat number, or reserved for..."
                  className="border-2 border-gray-200 focus:border-emerald-500"
                />
                {searchQuery && (
                  <p className="text-sm text-gray-600 mt-2">
                    Showing {filteredReservations.length} of {reservations.length} reservations
                  </p>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredReservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-1">
                    {searchQuery ? 'No matching reservations' : 'No Reservations Yet'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {searchQuery ? 'Try adjusting your search query' : 'Create your first seat reservation above'}
                  </p>
                </div>
              ) : (
                filteredReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg">
                        <span className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg mr-2 text-sm font-semibold">
                          {reservation.enclosureLetter}
                        </span>
                        Row {reservation.rowLetter} • Seat {reservation.seatNumber}
                      </div>
                      {reservation.reservedFor && (
                        <div className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                          <span className="font-semibold">For:</span> {reservation.reservedFor}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <span>📅</span>
                        Reserved on {new Date(reservation.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeReservation(reservation.id)}
                      className="gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reservations by Enclosure Summary - Enhanced */}
      <Card className="mt-8 border-0 shadow-xl bg-white overflow-hidden">
        {/* Decorative top border */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
        
        <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border-b border-gray-100">
          <CardTitle className="text-xl font-bold text-gray-900">
            Reservations Summary by Enclosure
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {enclosures.map((enclosure) => {
              const enclosureReservations = reservations.filter(
                (r) => r.enclosureLetter === enclosure.letter
              );
              return (
                <div 
                  key={enclosure.id} 
                  className="p-5 bg-gradient-to-br from-white to-emerald-50 border-2 border-emerald-200 rounded-xl text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                    {enclosure.letter}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {enclosure.name || `Enclosure ${enclosure.letter}`}
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">
                    {enclosureReservations.length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">Reserved Seats</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
