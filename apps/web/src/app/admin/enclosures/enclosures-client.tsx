'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { EnclosureForm } from './enclosure-form.client';

interface Row {
  letter: string;
  startSeat: number;
  endSeat: number;
  reservedSeats: string;
  displayOrder?: number;
}

interface Enclosure {
  id?: string;
  letter: string;
  name?: string;
  allocatedFor: string;
  entryDirection: string;
  displayOrder: number;
  rows: Row[];
  totalSeats?: number;
  allocatedSeats?: number;
}

interface EnclosuresClientProps {
  initialEnclosures: Enclosure[];
}

export function EnclosuresClient({ initialEnclosures }: EnclosuresClientProps) {
  const router = useRouter();
  const [enclosures, setEnclosures] = useState<Enclosure[]>(initialEnclosures);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEnclosure, setCurrentEnclosure] = useState<Enclosure | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEnclosures = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures`, {
        credentials: 'include',
      });
      const data = await res.json();
      setEnclosures(data);
    } catch (error) {
      console.error('Failed to load enclosures:', error);
      toast.error('Failed to load enclosures');
    }
  };

  const handleCreateOrUpdate = async (enclosure: Enclosure) => {
    setLoading(true);
    try {
      const url = enclosure.id
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures/${enclosure.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures`;
      const method = enclosure.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enclosure),
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      toast.success(enclosure.id ? 'Enclosure updated' : 'Enclosure created');
      await fetchEnclosures();
      setIsEditing(false);
      setCurrentEnclosure(null);
      router.refresh(); // Refresh server component data
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Operation failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This cannot be undone.')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }
      toast.success('Enclosure deleted');
      await fetchEnclosures();
      router.refresh(); // Refresh server component data
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (enclosure: Enclosure) => {
    setCurrentEnclosure(enclosure);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentEnclosure({
      letter: '',
      name: '',
      allocatedFor: 'STUDENTS',
      entryDirection: 'NORTH',
      displayOrder: enclosures.length,
      rows: [{ letter: 'A', startSeat: 1, endSeat: 50, reservedSeats: '', displayOrder: 0 }],
    });
    setIsEditing(true);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Enclosure Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure venue enclosures and seating arrangements
          </p>
        </div>
        <Button 
          onClick={handleCreate} 
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          New Enclosure
        </Button>
      </div>

      {/* Enclosure List */}
      <div className="grid gap-6">
        {enclosures.map((enclosure) => (
          <Card key={enclosure.id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white dark:bg-dark-card">
            {/* Decorative top border */}
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              
              <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg">
                      {enclosure.letter}
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {enclosure.name || `Enclosure ${enclosure.letter}`}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                          {enclosure.allocatedFor}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                          Entry: {enclosure.entryDirection}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(enclosure)}
                      className="gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(enclosure.id!)}
                      className="gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {enclosure.totalSeats || 0}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 mt-1">Total Seats</div>
                  </div>
                  <div className="text-center p-5 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-300">
                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      {enclosure.allocatedSeats || 0}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 mt-1">Allocated</div>
                  </div>
                  <div className="text-center p-5 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <div className="text-3xl font-bold text-gray-700">
                      {enclosure.rows?.length || 0}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 mt-1">Rows</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-1 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
                    <h4 className="font-bold text-gray-900">Row Configuration</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {enclosure.rows?.map((row) => (
                      <div 
                        key={row.letter} 
                        className="p-3 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-lg text-sm hover:border-indigo-300 hover:shadow-md transition-all duration-300"
                      >
                        <div className="font-bold text-gray-900">Row {row.letter}</div>
                        <div className="text-gray-600 text-xs mt-1">
                          Seats: {row.startSeat}-{row.endSeat}
                        </div>
                        {row.reservedSeats && (
                          <div className="text-red-600 font-semibold text-xs mt-1">
                            Reserved: {row.reservedSeats}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {enclosures.length === 0 && (
            <Card className="text-center py-16 border-2 border-dashed border-gray-300 bg-gradient-to-br from-white to-gray-50 rounded-2xl">
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Plus className="w-10 h-10 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-900 mb-2">No Enclosures Found</p>
                    <p className="text-gray-500 mb-6">Create your first enclosure to get started</p>
                  </div>
                  <Button 
                    onClick={handleCreate}
                    className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Enclosure
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Enclosure Form Modal */}
      {/* Enclosure Form Modal */}
      {isEditing && currentEnclosure && (
        <EnclosureForm
          enclosure={currentEnclosure}
          onSave={handleCreateOrUpdate}
          onCancel={() => {
            setIsEditing(false);
            setCurrentEnclosure(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
}
