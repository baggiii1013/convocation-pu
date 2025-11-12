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
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Enclosure Management</h1>
          <p className="text-gray-600 mt-2">Create and manage venue enclosures with row configurations</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Enclosure
        </Button>
      </div>

      {/* Enclosure List */}
      <div className="grid gap-6 mb-8">
        {enclosures.map((enclosure) => (
          <Card key={enclosure.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-blue-600">{enclosure.letter}</div>
                  <div>
                    <CardTitle className="text-xl">{enclosure.name || `Enclosure ${enclosure.letter}`}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {enclosure.allocatedFor} • Entry: {enclosure.entryDirection}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(enclosure)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(enclosure.id!)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{enclosure.totalSeats || 0}</div>
                  <div className="text-sm text-gray-600">Total Seats</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{enclosure.allocatedSeats || 0}</div>
                  <div className="text-sm text-gray-600">Allocated</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{enclosure.rows?.length || 0}</div>
                  <div className="text-sm text-gray-600">Rows</div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-700">Row Configuration:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {enclosure.rows?.map((row) => (
                    <div key={row.letter} className="p-2 border rounded text-sm">
                      <span className="font-semibold">Row {row.letter}:</span> {row.startSeat}-{row.endSeat}
                      {row.reservedSeats && (
                        <span className="text-red-600 ml-1">(Reserved: {row.reservedSeats})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {enclosures.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 mb-4">No enclosures found. Create your first enclosure to get started.</p>
              <Button onClick={handleCreate}>Create First Enclosure</Button>
            </CardContent>
          </Card>
        )}
      </div>

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
