'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { AlertCircle, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
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

export default function ReserveSeatsPage() {
  const [enclosures, setEnclosures] = useState<Enclosure[]>([]);
  const [selectedEnclosure, setSelectedEnclosure] = useState('');
  const [selectedRow, setSelectedRow] = useState('');
  const [seatNumbers, setSeatNumbers] = useState('');
  const [reservedFor, setReservedFor] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEnclosures();
    fetchReservations();
  }, []);

  const fetchEnclosures = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures`, {
        credentials: 'include',
      });
      const data = await res.json();
      setEnclosures(data);
    } catch (error) {
      toast.error('Failed to load enclosures');
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/reservations`, {
        credentials: 'include',
      });
      const data = await res.json();
      setReservations(data.reservations || []);
    } catch (error) {
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

  const selectedEnclosureData = enclosures.find((e) => e.letter === selectedEnclosure);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Reserve Seats</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Reservation Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Seat Reservation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="enclosure">Enclosure *</Label>
              <Select value={selectedEnclosure} onValueChange={(value) => {
                setSelectedEnclosure(value);
                setSelectedRow(''); // Reset row when enclosure changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select enclosure" />
                </SelectTrigger>
                <SelectContent>
                  {enclosures.map((enc) => (
                    <SelectItem key={enc.id} value={enc.letter}>
                      {enc.letter} - {enc.name || `Enclosure ${enc.letter}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="row">Row *</Label>
              <Select
                value={selectedRow}
                onValueChange={setSelectedRow}
                disabled={!selectedEnclosure}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select row" />
                </SelectTrigger>
                <SelectContent>
                  {selectedEnclosureData?.rows.map((row) => (
                    <SelectItem key={row.letter} value={row.letter}>
                      Row {row.letter} (Seats {row.startSeat}-{row.endSeat})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="seats">Seat Numbers *</Label>
              <Input
                id="seats"
                value={seatNumbers}
                onChange={(e) => setSeatNumbers(e.target.value)}
                placeholder="e.g., 1,5,10 or 1-10"
              />
              <p className="text-xs text-gray-500 mt-1">
                Comma-separated or range (e.g., "1,5,10" or "1-10" or "1,5-10,15")
              </p>
            </div>

            <div>
              <Label htmlFor="reservedFor">Reserved For (Optional)</Label>
              <Input
                id="reservedFor"
                value={reservedFor}
                onChange={(e) => setReservedFor(e.target.value)}
                placeholder="e.g., VIP, Special Guest"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <strong>Note:</strong> Reserved seats will be skipped during automatic seat allocation.
                Make sure to reserve seats before running the allocation algorithm.
              </div>
            </div>

            <Button onClick={handleReserve} disabled={loading} className="w-full">
              {loading ? 'Reserving...' : 'Reserve Seats'}
            </Button>
          </CardContent>
        </Card>

        {/* Reservations List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Reservations</CardTitle>
              <span className="text-sm text-gray-600">{reservations.length} reserved</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {reservations.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No reservations yet</p>
              ) : (
                reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-semibold">
                        {reservation.enclosureLetter} - Row {reservation.rowLetter} - Seat{' '}
                        {reservation.seatNumber}
                      </div>
                      {reservation.reservedFor && (
                        <div className="text-sm text-gray-600">For: {reservation.reservedFor}</div>
                      )}
                      <div className="text-xs text-gray-400">
                        Reserved on {new Date(reservation.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeReservation(reservation.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reservations by Enclosure Summary */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Reservations Summary by Enclosure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {enclosures.map((enclosure) => {
              const enclosureReservations = reservations.filter(
                (r) => r.enclosureLetter === enclosure.letter
              );
              return (
                <div key={enclosure.id} className="p-4 border rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{enclosure.letter}</div>
                  <div className="text-sm text-gray-600">{enclosure.name || `Enclosure ${enclosure.letter}`}</div>
                  <div className="text-lg font-semibold mt-2">{enclosureReservations.length}</div>
                  <div className="text-xs text-gray-500">Reserved Seats</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
