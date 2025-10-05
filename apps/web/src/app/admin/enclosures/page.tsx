'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Edit, GripVertical, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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

export default function EnclosureManagementPage() {
  const [enclosures, setEnclosures] = useState<Enclosure[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEnclosure, setCurrentEnclosure] = useState<Enclosure | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEnclosures();
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
      fetchEnclosures();
      setIsEditing(false);
      setCurrentEnclosure(null);
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
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
      fetchEnclosures();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete');
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
                    variant="destructive"
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

// Enclosure Form Component
function EnclosureForm({
  enclosure,
  onSave,
  onCancel,
  loading,
}: {
  enclosure: Enclosure;
  onSave: (enc: Enclosure) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState<Enclosure>(enclosure);

  const addRow = () => {
    const nextLetter = String.fromCharCode(65 + formData.rows.length); // A, B, C...
    setFormData({
      ...formData,
      rows: [
        ...formData.rows,
        { letter: nextLetter, startSeat: 1, endSeat: 50, reservedSeats: '', displayOrder: formData.rows.length },
      ],
    });
  };

  const removeRow = (index: number) => {
    setFormData({
      ...formData,
      rows: formData.rows.filter((_, i) => i !== index),
    });
  };

  const updateRow = (index: number, field: keyof Row, value: any) => {
    const newRows = [...formData.rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setFormData({ ...formData, rows: newRows });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.letter || !formData.allocatedFor || !formData.entryDirection) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.rows.length === 0) {
      toast.error('Please add at least one row');
      return;
    }

    // Validate rows
    for (const row of formData.rows) {
      if (!row.letter || row.startSeat < 1 || row.endSeat < row.startSeat) {
        toast.error(`Invalid row configuration for Row ${row.letter}`);
        return;
      }
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl my-8">
        <CardHeader>
          <CardTitle>{formData.id ? 'Edit Enclosure' : 'Create Enclosure'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="letter">Enclosure Letter *</Label>
                <Input
                  id="letter"
                  value={formData.letter}
                  onChange={(e) => setFormData({ ...formData, letter: e.target.value.toUpperCase() })}
                  placeholder="A"
                  maxLength={1}
                  required
                />
              </div>
              <div>
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., North Wing"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="allocatedFor">Allocated For *</Label>
                <Select
                  value={formData.allocatedFor}
                  onValueChange={(value) => setFormData({ ...formData, allocatedFor: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENTS">Students</SelectItem>
                    <SelectItem value="FACULTY">Faculty</SelectItem>
                    <SelectItem value="STAFF">Staff</SelectItem>
                    <SelectItem value="GUESTS">Guests</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="MIXED">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="entryDirection">Entry Direction *</Label>
                <Select
                  value={formData.entryDirection}
                  onValueChange={(value) => setFormData({ ...formData, entryDirection: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORTH">North</SelectItem>
                    <SelectItem value="SOUTH">South</SelectItem>
                    <SelectItem value="EAST">East</SelectItem>
                    <SelectItem value="WEST">West</SelectItem>
                    <SelectItem value="LEFT">Left</SelectItem>
                    <SelectItem value="RIGHT">Right</SelectItem>
                    <SelectItem value="CENTER">Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            {/* Rows Configuration */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Rows Configuration</Label>
                <Button type="button" variant="outline" size="sm" onClick={addRow}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Row
                </Button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto border rounded-lg p-4">
                {formData.rows.map((row, index) => (
                  <div key={index} className="flex items-end gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="flex-1 grid grid-cols-4 gap-2">
                      <div>
                        <Label className="text-xs">Row Letter</Label>
                        <Input
                          value={row.letter}
                          onChange={(e) => updateRow(index, 'letter', e.target.value.toUpperCase())}
                          maxLength={1}
                          placeholder="A"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Start Seat</Label>
                        <Input
                          type="number"
                          value={row.startSeat}
                          onChange={(e) => updateRow(index, 'startSeat', parseInt(e.target.value) || 1)}
                          min={1}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">End Seat</Label>
                        <Input
                          type="number"
                          value={row.endSeat}
                          onChange={(e) => updateRow(index, 'endSeat', parseInt(e.target.value) || 1)}
                          min={1}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Reserved (e.g., 1,5,10)</Label>
                        <Input
                          value={row.reservedSeats}
                          onChange={(e) => updateRow(index, 'reservedSeats', e.target.value)}
                          placeholder="1,5,10"
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeRow(index)}
                      disabled={formData.rows.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : formData.id ? 'Update Enclosure' : 'Create Enclosure'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
