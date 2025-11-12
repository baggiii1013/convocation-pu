'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
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

interface EnclosureFormProps {
  enclosure: Enclosure;
  onSave: (enc: Enclosure) => void;
  onCancel: () => void;
  loading: boolean;
}

export function EnclosureForm({ enclosure, onSave, onCancel, loading }: EnclosureFormProps) {
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

  const updateRow = (index: number, field: keyof Row, value: string | number) => {
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
                      variant="danger"
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
