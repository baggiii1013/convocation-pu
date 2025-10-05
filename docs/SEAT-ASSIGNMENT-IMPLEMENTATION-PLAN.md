# Seat Assignment System - Implementation Plan

## Executive Summary

This document outlines a comprehensive, phased approach to implement an **automatic seat assignment system** for convocation attendees with a **theater-style seat visualization** (inspired by District.in). 

**Key Features:**
- **Admin-Managed Enclosures**: Admins create and manage enclosure configurations (rows, columns, reserved seats) through a frontend dashboard
- **Admin Seat Reservation**: Admins can manually reserve specific seats before running the allocation algorithm
- **Database-Driven Attendee Data**: Attendee data is read from the existing `attendee` collection in MongoDB, which includes their assigned enclosure letter
- **Automatic Seat Allocation**: Backend algorithm automatically assigns available seats, skipping admin-reserved seats
- **Theater-Style Visualization**: Students view their seats in a District.in-inspired interface

---

## Current State Analysis

### Your Project Structure
- **Backend**: Node.js/TypeScript API using Prisma ORM with MongoDB
- **Frontend**: Next.js web application
- **Database**: MongoDB with Prisma schema
- **Stack**: Bun runtime, TypeScript, REST APIs

### Reference Implementation (mussiii1013/pu-convocation)
- **Backend**: Kotlin (Ktor) + AWS Lambda for seat allocation
- **Seat Algorithm**: AWS Lambda job that runs automatically on data upload
- **Frontend**: Next.js with sophisticated seat visualization components
- **Key Features**:
  - Automatic seat assignment based on enclosure/row/column configuration
  - Reserved seat handling
  - Entry direction support
  - Theater-style seat map view
  - Ground/venue mapper for enclosure selection

### Schema Modifications Required

Your current schema needs the following adjustments to match the seat assignment functionality:

```prisma
// Current gaps in your schema:
// 1. Column model lacks proper naming (letter field)
// 2. Row model needs end letter support
// 3. Enclosure needs proper row/column relationships
// 4. Missing seat numbering logic in Column model
```

---

## Implementation Phases

---

## **PHASE 1: Database Schema & Admin Enclosure Management**

### Duration: 3-4 days

### Objectives
- Align your Prisma schema with seat assignment requirements
- Ensure proper relationships between Enclosure, Row, Column, and SeatAllocation
- Create admin API endpoints for managing enclosures
- Build admin frontend for enclosure configuration (CRUD operations)
- Add validation and constraints

**Note**: Enclosures are managed by admins through the frontend, NOT uploaded via CSV. The CSV only contains attendee data with their assigned enclosure letter.

### Tasks

#### 1.1 Update Prisma Schema (schema.prisma)

**Current Issues:**
- `Column` model needs proper letter designation
- `Row` needs range support (start letter to end letter)
- Missing relationship clarity for seat numbering

**Proposed Schema Updates:**

```prisma
// Enhanced Enclosure Model
model Enclosure {
  id             String        @id @default(auto()) @map("_id") @db.ObjectId
  letter         String        @unique // A, B, C, etc.
  name           String?       // Optional: "North Wing", "Main Hall"
  allocatedFor   EnclosureType
  entryDirection Direction
  displayOrder   Int           @default(0) // Order to display in UI
  totalSeats     Int           @default(0) // Auto-calculated
  isActive       Boolean       @default(true)
  
  // Relations
  rows           Row[]
  seatAllocations SeatAllocation[]
  
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("enclosures")
}

// Enhanced Row Model
model Row {
  id          String  @id @default(auto()) @map("_id") @db.ObjectId
  letter      String  // Row identifier (A, B, C, etc.)
  startSeat   Int     // First seat number in row
  endSeat     Int     // Last seat number in row
  reservedSeats String  @default("") // Comma-separated reserved seat numbers: "1,5,10"
  displayOrder Int    @default(0)  // Order of rows in enclosure
  
  // Relations
  enclosure   Enclosure @relation(fields: [enclosureId], references: [id], onDelete: Cascade)
  enclosureId String    @db.ObjectId

  @@unique([enclosureId, letter])
  @@index([enclosureId, displayOrder])
  @@map("rows")
}

// Admin Seat Reservation Model - NEW
model SeatReservation {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  enclosureLetter String // Enclosure letter
  rowLetter   String   // Row letter
  seatNumber  Int      // Reserved seat number
  reservedFor String?  // Optional: reason or person name
  reservedBy  String?  // Admin who reserved it
  createdAt   DateTime @default(now())
  
  @@unique([enclosureLetter, rowLetter, seatNumber]) // Prevent duplicate reservations
  @@index([enclosureLetter])
  @@map("seat_reservations")
}

// Enhanced SeatAllocation Model
model SeatAllocation {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  enclosureLetter String // Changed to letter for easier querying
  rowLetter   String   // Row letter (A, B, C)
  seatNumber  Int      // Actual seat number
  allocatedAt DateTime @default(now())

  // Relations
  enclosure  Enclosure @relation(fields: [enclosureId], references: [id], onDelete: Cascade)
  enclosureId String   @db.ObjectId
  attendee   Attendee  @relation(fields: [attendeeId], references: [id], onDelete: Cascade)
  attendeeId String    @unique @db.ObjectId

  @@unique([enclosureLetter, rowLetter, seatNumber]) // Prevent double allocation
  @@index([enclosureLetter, rowLetter])
  @@index([enclosureId])
  @@map("seat_allocations")
}

// Update Attendee Model
model Attendee {
  id                    String   @id @default(auto()) @map("_id") @db.ObjectId
  enrollmentId          String   @unique
  name                  String
  course                String
  school                String
  degree                String
  email                 String
  phone                 String?
  convocationEligible   Boolean  @default(false)
  convocationRegistered Boolean  @default(false)
  
  // Enclosure assignment - stored in database
  assignedEnclosure     String?  // Enclosure letter (A, B, C, etc.)
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  crr                   String   @db.ObjectId
  
  // Relations
  account               Account?        @relation(fields: [accountId], references: [id])
  accountId             String?         @db.ObjectId
  allocation            SeatAllocation? // Auto-assigned seat

  @@map("attendees")
}

// Enhanced Direction enum
enum Direction {
  NORTH
  SOUTH
  EAST
  WEST
  NORTHEAST
  NORTHWEST
  SOUTHEAST
  SOUTHWEST
  LEFT    // For simple left/right entry
  RIGHT
  CENTER
}
```

**Note**: We removed the `Column` model as it's not needed. Rows contain all the seat information we need.

#### 1.2 Migration Strategy

```bash
# Generate migration
bun run db:generate

# Apply to database
bun run db:push
```

#### 1.3 Create Enclosure Management API (Backend)

**Admin will manage enclosures through API endpoints, not seeders.**

```typescript
// apps/api/src/controllers/enclosure.controller.ts

import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class EnclosureController {
  /**
   * GET /api/enclosures - List all enclosures
   */
  async getAllEnclosures(req: Request, res: Response) {
    try {
      const enclosures = await prisma.enclosure.findMany({
        include: {
          rows: {
            orderBy: { displayOrder: 'asc' }
          },
          _count: {
            select: { seatAllocations: true }
          }
        },
        orderBy: { displayOrder: 'asc' }
      });

      // Calculate total seats for each enclosure
      const enclosuresWithSeats = enclosures.map(enc => ({
        ...enc,
        totalSeats: this.calculateTotalSeats(enc.rows),
        allocatedSeats: enc._count.seatAllocations
      }));

      return res.json(enclosuresWithSeats);
    } catch (error) {
      console.error('Get enclosures error:', error);
      return res.status(500).json({ error: 'Failed to fetch enclosures' });
    }
  }

  /**
   * POST /api/enclosures - Create new enclosure
   */
  async createEnclosure(req: Request, res: Response) {
    try {
      const { letter, name, allocatedFor, entryDirection, displayOrder, rows } = req.body;

      // Validate enclosure letter is unique
      const existing = await prisma.enclosure.findUnique({
        where: { letter }
      });

      if (existing) {
        return res.status(400).json({ error: 'Enclosure letter already exists' });
      }

      // Create enclosure with rows
      const enclosure = await prisma.enclosure.create({
        data: {
          letter,
          name,
          allocatedFor,
          entryDirection,
          displayOrder: displayOrder || 0,
          rows: {
            create: rows.map((row: any, index: number) => ({
              letter: row.letter,
              startSeat: row.startSeat,
              endSeat: row.endSeat,
              reserved: row.reserved || '',
              displayOrder: index
            }))
          }
        },
        include: {
          rows: true
        }
      });

      // Calculate and update total seats
      const totalSeats = this.calculateTotalSeats(enclosure.rows);
      await prisma.enclosure.update({
        where: { id: enclosure.id },
        data: { totalSeats }
      });

      return res.status(201).json(enclosure);
    } catch (error) {
      console.error('Create enclosure error:', error);
      return res.status(500).json({ error: 'Failed to create enclosure' });
    }
  }

  /**
   * PUT /api/enclosures/:id - Update enclosure
   */
  async updateEnclosure(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { letter, name, allocatedFor, entryDirection, displayOrder, rows } = req.body;

      // Delete existing rows
      await prisma.row.deleteMany({
        where: { enclosureId: id }
      });

      // Update enclosure with new rows
      const enclosure = await prisma.enclosure.update({
        where: { id },
        data: {
          letter,
          name,
          allocatedFor,
          entryDirection,
          displayOrder,
          rows: {
            create: rows.map((row: any, index: number) => ({
              letter: row.letter,
              startSeat: row.startSeat,
              endSeat: row.endSeat,
              reserved: row.reserved || '',
              displayOrder: index
            }))
          }
        },
        include: {
          rows: true
        }
      });

      // Update total seats
      const totalSeats = this.calculateTotalSeats(enclosure.rows);
      await prisma.enclosure.update({
        where: { id },
        data: { totalSeats }
      });

      return res.json(enclosure);
    } catch (error) {
      console.error('Update enclosure error:', error);
      return res.status(500).json({ error: 'Failed to update enclosure' });
    }
  }

  /**
   * DELETE /api/enclosures/:id - Delete enclosure
   */
  async deleteEnclosure(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check if enclosure has allocations
      const allocations = await prisma.seatAllocation.count({
        where: { enclosureId: id }
      });

      if (allocations > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete enclosure with seat allocations. Clear allocations first.' 
        });
      }

      await prisma.enclosure.delete({
        where: { id }
      });

      return res.json({ message: 'Enclosure deleted successfully' });
    } catch (error) {
      console.error('Delete enclosure error:', error);
      return res.status(500).json({ error: 'Failed to delete enclosure' });
    }
  }

  /**
   * Helper: Calculate total seats in enclosure
   */
  private calculateTotalSeats(rows: Array<{ startSeat: number; endSeat: number; reserved: string }>): number {
    return rows.reduce((total, row) => {
      const reservedCount = row.reserved
        ? row.reserved.split(',').filter(s => s.trim()).length
        : 0;
      const rowSeats = (row.endSeat - row.startSeat + 1) - reservedCount;
      return total + rowSeats;
    }, 0);
  }
}
```

#### 1.4 Enclosure API Routes

```typescript
// apps/api/src/routes/enclosure.routes.ts

import { Router } from 'express';
import { EnclosureController } from '../controllers/enclosure.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const controller = new EnclosureController();

// All routes require authentication
router.use(authMiddleware);

// CRUD operations
router.get('/', controller.getAllEnclosures.bind(controller));
router.post('/', controller.createEnclosure.bind(controller));
router.put('/:id', controller.updateEnclosure.bind(controller));
router.delete('/:id', controller.deleteEnclosure.bind(controller));

export default router;
```

#### 1.5 Admin Frontend - Enclosure Management UI

```typescript
// apps/web/src/app/admin/enclosures/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

interface Row {
  letter: string;
  startSeat: number;
  endSeat: number;
  reserved: string;
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
      const res = await fetch('/api/enclosures');
      const data = await res.json();
      setEnclosures(data);
    } catch (error) {
      toast.error('Failed to load enclosures');
    }
  };

  const handleCreateOrUpdate = async (enclosure: Enclosure) => {
    setLoading(true);
    try {
      const url = enclosure.id ? `/api/enclosures/${enclosure.id}` : '/api/enclosures';
      const method = enclosure.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enclosure)
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
      const res = await fetch(`/api/enclosures/${id}`, { method: 'DELETE' });
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

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Enclosure Management</h1>
          <p className="text-gray-600 mt-2">
            Configure venue enclosures, rows, and seating arrangements
          </p>
        </div>
        <Button
          onClick={() => {
            setIsEditing(true);
            setCurrentEnclosure({
              letter: '',
              name: '',
              allocatedFor: 'STUDENTS',
              entryDirection: 'NORTH',
              displayOrder: enclosures.length,
              rows: [{ letter: 'A', startSeat: 1, endSeat: 50, reserved: '' }]
            });
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Enclosure
        </Button>
      </div>

      {/* Enclosure List */}
      <div className="grid gap-6 mb-8">
        {enclosures.map((enclosure) => (
          <Card key={enclosure.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-lg flex items-center justify-center font-bold text-2xl">
                    {enclosure.letter}
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      Enclosure {enclosure.letter}
                      {enclosure.name && ` - ${enclosure.name}`}
                    </CardTitle>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>For: {enclosure.allocatedFor}</span>
                      <span>Entry: {enclosure.entryDirection}</span>
                      <span>Total Seats: {enclosure.totalSeats}</span>
                      <span className="text-green-600">
                        Allocated: {enclosure.allocatedSeats}/{enclosure.totalSeats}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setIsEditing(true);
                      setCurrentEnclosure(enclosure);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(enclosure.id!)}
                    disabled={enclosure.allocatedSeats! > 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Rows Configuration:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {enclosure.rows.map((row) => {
                    const reserved = row.reserved ? row.reserved.split(',').length : 0;
                    const total = row.endSeat - row.startSeat + 1;
                    return (
                      <div key={row.letter} className="bg-gray-50 p-3 rounded text-xs">
                        <p className="font-bold">Row {row.letter}</p>
                        <p className="text-gray-600">
                          Seats: {row.startSeat}-{row.endSeat} ({total - reserved} available)
                        </p>
                        {reserved > 0 && (
                          <p className="text-yellow-600">Reserved: {reserved}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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

// Enclosure Form Component (separate for clarity)
function EnclosureForm({
  enclosure,
  onSave,
  onCancel,
  loading
}: {
  enclosure: Enclosure;
  onSave: (enc: Enclosure) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState<Enclosure>(enclosure);

  const addRow = () => {
    const nextLetter = String.fromCharCode(
      65 + formData.rows.length
    ); // A, B, C...
    setFormData({
      ...formData,
      rows: [
        ...formData.rows,
        { letter: nextLetter, startSeat: 1, endSeat: 50, reserved: '' }
      ]
    });
  };

  const removeRow = (index: number) => {
    setFormData({
      ...formData,
      rows: formData.rows.filter((_, i) => i !== index)
    });
  };

  const updateRow = (index: number, field: keyof Row, value: any) => {
    const newRows = [...formData.rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setFormData({ ...formData, rows: newRows });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>
            {formData.id ? 'Edit Enclosure' : 'Create New Enclosure'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave(formData);
            }}
            className="space-y-6"
          >
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Enclosure Letter *</Label>
                <Input
                  value={formData.letter}
                  onChange={(e) =>
                    setFormData({ ...formData, letter: e.target.value.toUpperCase() })
                  }
                  placeholder="A, B, C..."
                  maxLength={1}
                  required
                />
              </div>
              <div>
                <Label>Name (Optional)</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Main Hall, North Wing..."
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Allocated For *</Label>
                <Select
                  value={formData.allocatedFor}
                  onValueChange={(value) =>
                    setFormData({ ...formData, allocatedFor: value })
                  }
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
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Entry Direction *</Label>
                <Select
                  value={formData.entryDirection}
                  onValueChange={(value) =>
                    setFormData({ ...formData, entryDirection: value })
                  }
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
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, displayOrder: parseInt(e.target.value) })
                  }
                  min={0}
                />
              </div>
            </div>

            {/* Rows Configuration */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg">Rows Configuration</Label>
                <Button type="button" onClick={addRow} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Row
                </Button>
              </div>

              <div className="space-y-3">
                {formData.rows.map((row, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded"
                  >
                    <div className="col-span-1">
                      <Input
                        value={row.letter}
                        onChange={(e) =>
                          updateRow(index, 'letter', e.target.value.toUpperCase())
                        }
                        placeholder="A"
                        maxLength={1}
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        value={row.startSeat}
                        onChange={(e) =>
                          updateRow(index, 'startSeat', parseInt(e.target.value))
                        }
                        placeholder="Start Seat"
                        min={1}
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        value={row.endSeat}
                        onChange={(e) =>
                          updateRow(index, 'endSeat', parseInt(e.target.value))
                        }
                        placeholder="End Seat"
                        min={row.startSeat}
                        required
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        value={row.reserved}
                        onChange={(e) => updateRow(index, 'reserved', e.target.value)}
                        placeholder="Reserved: 1,5,10"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRow(index)}
                        disabled={formData.rows.length === 1}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : formData.id ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### 1.4 Admin Seat Reservation API

**Purpose**: Allow admins to manually reserve specific seats before running the allocation algorithm.

```typescript
// apps/api/src/controllers/seatReservation.controller.ts

import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class SeatReservationController {
  /**
   * POST /api/admin/reserve-seats
   * Reserve specific seats for admin purposes
   */
  static async reserveSeats(req: Request, res: Response) {
    try {
      const { reservations } = req.body;
      
      // Validate input
      if (!Array.isArray(reservations) || reservations.length === 0) {
        return res.status(400).json({ error: 'Reservations array required' });
      }

      const results = [];
      const errors = [];

      for (const reservation of reservations) {
        const { enclosureLetter, rowLetter, seatNumber, reservedFor, reservedBy } = reservation;

        // Check if seat is already allocated
        const existing = await prisma.seatAllocation.findUnique({
          where: {
            enclosureLetter_rowLetter_seatNumber: {
              enclosureLetter,
              rowLetter,
              seatNumber
            }
          }
        });

        if (existing) {
          errors.push({
            seat: `${enclosureLetter}-${rowLetter}-${seatNumber}`,
            error: 'Seat already allocated to an attendee'
          });
          continue;
        }

        // Check if already reserved
        const alreadyReserved = await prisma.seatReservation.findUnique({
          where: {
            enclosureLetter_rowLetter_seatNumber: {
              enclosureLetter,
              rowLetter,
              seatNumber
            }
          }
        });

        if (alreadyReserved) {
          errors.push({
            seat: `${enclosureLetter}-${rowLetter}-${seatNumber}`,
            error: 'Seat already reserved'
          });
          continue;
        }

        // Create reservation
        const created = await prisma.seatReservation.create({
          data: {
            enclosureLetter,
            rowLetter,
            seatNumber,
            reservedFor,
            reservedBy
          }
        });

        results.push(created);
      }

      res.json({
        success: results.length,
        failed: errors.length,
        reservations: results,
        errors
      });
    } catch (error) {
      console.error('Seat reservation error:', error);
      res.status(500).json({ error: 'Failed to reserve seats' });
    }
  }

  /**
   * GET /api/admin/reservations
   * Get all reserved seats
   */
  static async getReservations(req: Request, res: Response) {
    try {
      const { enclosureLetter } = req.query;

      const where = enclosureLetter 
        ? { enclosureLetter: enclosureLetter as string }
        : {};

      const reservations = await prisma.seatReservation.findMany({
        where,
        orderBy: [
          { enclosureLetter: 'asc' },
          { rowLetter: 'asc' },
          { seatNumber: 'asc' }
        ]
      });

      res.json({ reservations });
    } catch (error) {
      console.error('Get reservations error:', error);
      res.status(500).json({ error: 'Failed to fetch reservations' });
    }
  }

  /**
   * DELETE /api/admin/reservations/:id
   * Remove a seat reservation
   */
  static async removeReservation(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.seatReservation.delete({
        where: { id }
      });

      res.json({ message: 'Reservation removed successfully' });
    } catch (error) {
      console.error('Remove reservation error:', error);
      res.status(500).json({ error: 'Failed to remove reservation' });
    }
  }

  /**
   * DELETE /api/admin/reservations
   * Clear all reservations (optional - for testing)
   */
  static async clearAllReservations(req: Request, res: Response) {
    try {
      const result = await prisma.seatReservation.deleteMany({});
      res.json({ message: `Cleared ${result.count} reservations` });
    } catch (error) {
      console.error('Clear reservations error:', error);
      res.status(500).json({ error: 'Failed to clear reservations' });
    }
  }
}
```

```typescript
// apps/api/src/routes/seatReservation.routes.ts

import { Router } from 'express';
import { SeatReservationController } from '../controllers/seatReservation.controller';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';

const router = Router();

// All routes require admin authentication
router.use(authMiddleware, adminMiddleware);

router.post('/reserve-seats', SeatReservationController.reserveSeats);
router.get('/reservations', SeatReservationController.getReservations);
router.delete('/reservations/:id', SeatReservationController.removeReservation);
router.delete('/reservations', SeatReservationController.clearAllReservations);

export default router;
```

#### 1.5 Admin Seat Reservation UI

**Purpose**: Frontend interface for admins to reserve seats visually.

```typescript
// apps/web/src/app/admin/reserve-seats/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [enclosures, setEnclosures] = useState<any[]>([]);
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
    const res = await fetch('/api/enclosures');
    const data = await res.json();
    setEnclosures(data);
  };

  const fetchReservations = async () => {
    const res = await fetch('/api/admin/reservations');
    const data = await res.json();
    setReservations(data.reservations || []);
  };

  const handleReserve = async () => {
    if (!selectedEnclosure || !selectedRow || !seatNumbers) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      // Parse seat numbers (comma-separated: 1,5,10-15)
      const seats = parseSeatNumbers(seatNumbers);
      
      const reservations = seats.map(seat => ({
        enclosureLetter: selectedEnclosure,
        rowLetter: selectedRow,
        seatNumber: seat,
        reservedFor,
        reservedBy: 'admin' // Get from auth context
      }));

      const res = await fetch('/api/admin/reserve-seats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservations })
      });

      const data = await res.json();
      
      if (data.errors && data.errors.length > 0) {
        alert(`Reserved ${data.success} seats. ${data.failed} failed:\n${data.errors.map((e: any) => e.seat + ': ' + e.error).join('\n')}`);
      } else {
        alert(`Successfully reserved ${data.success} seats`);
      }

      // Reset form
      setSeatNumbers('');
      setReservedFor('');
      fetchReservations();
    } catch (error) {
      console.error('Reservation failed:', error);
      alert('Failed to reserve seats');
    } finally {
      setLoading(false);
    }
  };

  const parseSeatNumbers = (input: string): number[] => {
    const seats: number[] = [];
    const parts = input.split(',').map(p => p.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          seats.push(i);
        }
      } else {
        seats.push(Number(part));
      }
    }
    
    return seats;
  };

  const removeReservation = async (id: string) => {
    if (!confirm('Remove this reservation?')) return;

    try {
      await fetch(`/api/admin/reservations/${id}`, { method: 'DELETE' });
      fetchReservations();
    } catch (error) {
      console.error('Remove failed:', error);
    }
  };

  const selectedEnclosureData = enclosures.find(e => e.letter === selectedEnclosure);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Reserve Seats</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Reservation Form */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">New Reservation</h2>
          <div className="space-y-4">
            <div>
              <Label>Enclosure</Label>
              <Select value={selectedEnclosure} onValueChange={setSelectedEnclosure}>
                <SelectTrigger>
                  <SelectValue placeholder="Select enclosure" />
                </SelectTrigger>
                <SelectContent>
                  {enclosures.map(enc => (
                    <SelectItem key={enc.letter} value={enc.letter}>
                      Enclosure {enc.letter} - {enc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedEnclosure && (
              <div>
                <Label>Row</Label>
                <Select value={selectedRow} onValueChange={setSelectedRow}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select row" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedEnclosureData?.rows.map((row: any) => (
                      <SelectItem key={row.letter} value={row.letter}>
                        Row {row.letter} (Seats {row.startSeat}-{row.endSeat})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Seat Numbers</Label>
              <Input
                value={seatNumbers}
                onChange={(e) => setSeatNumbers(e.target.value)}
                placeholder="e.g., 1,5,10-15"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter comma-separated numbers or ranges (e.g., 1,5,10-15)
              </p>
            </div>

            <div>
              <Label>Reserved For (Optional)</Label>
              <Input
                value={reservedFor}
                onChange={(e) => setReservedFor(e.target.value)}
                placeholder="e.g., VIP Guest, Photography"
              />
            </div>

            <Button 
              onClick={handleReserve} 
              disabled={loading || !selectedEnclosure || !selectedRow || !seatNumbers}
              className="w-full"
            >
              {loading ? 'Reserving...' : 'Reserve Seats'}
            </Button>
          </div>
        </Card>

        {/* Current Reservations */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Current Reservations ({reservations.length})
          </h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {reservations.map(res => (
              <div key={res.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-bold">
                    {res.enclosureLetter}-{res.rowLetter}-{res.seatNumber}
                  </p>
                  {res.reservedFor && (
                    <p className="text-sm text-gray-600">{res.reservedFor}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeReservation(res.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
            {reservations.length === 0 && (
              <p className="text-center text-gray-500 py-8">No reservations yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
```

### Deliverables
- ✅ Updated Prisma schema with SeatReservation model
- ✅ Database migration files
- ✅ Enclosure Management API (CRUD endpoints)
- ✅ Seat Reservation API (reserve, view, remove)
- ✅ Admin Frontend for Enclosure Management
- ✅ Admin Frontend for Seat Reservation
- ✅ Updated TypeScript types in `packages/types`

---

## **PHASE 2: Backend Seat Assignment Algorithm**

### Duration: 5-7 days

### Objectives
- Implement automatic seat allocation algorithm in bun
- Read attendee data from existing MongoDB `attendee` collection
- Handle admin-reserved seats and skip them during allocation
- Handle row-level reserved seats from enclosure configuration
- Create seat assignment service that processes enclosures sequentially

### Architecture Design

```
┌─────────────────────────────────────────────────────────┐
│                    API Layer                             │
│  POST /api/admin/reserve-seats (Admin seat reservation)│
│  POST /api/attendees/allocate-seats (Run algorithm)    │
│  GET  /api/attendees/:id/seat-allocation                │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              Seat Allocation Service                     │
│  1. Fetch attendees from database (with enclosure)     │
│  2. Group attendees by assigned enclosure               │
│  3. Fetch admin-reserved seats for each enclosure      │
│  4. Run allocation algorithm per enclosure              │
│  5. Skip admin-reserved + row-reserved seats           │
│  6. Create SeatAllocation records                       │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                  Database Layer                          │
│  Attendee (DB) → Enclosures → Rows → SeatAllocations  │
└─────────────────────────────────────────────────────────┘
```

### Tasks

#### 2.1 Create Seat Allocation Service

```typescript
// apps/api/src/services/seatAllocation.service.ts

import { PrismaClient } from '@prisma/client';

interface EnclosureConfig {
  letter: string;
  rows: Array<{
    letter: string;
    start: number;
    end: number;
    reserved: string; // "1,5,10"
  }>;
}

export class SeatAllocationService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Main allocation algorithm - inspired by reference implementation
   * @param attendees - Attendees with assigned enclosure
   */
  async allocateSeats(attendees: Array<{ id: string; assignedEnclosure: string }>) {
    // Group attendees by enclosure
    const attendeesByEnclosure = this.groupByEnclosure(attendees);

    for (const [enclosureLetter, enclosureAttendees] of Object.entries(attendeesByEnclosure)) {
      await this.allocateForEnclosure(enclosureLetter, enclosureAttendees);
    }
  }

  /**
   * Allocate seats for a specific enclosure
   */
  private async allocateForEnclosure(
    enclosureLetter: string,
    attendees: Array<{ id: string }>
  ) {
    // Fetch enclosure configuration
    const enclosure = await this.prisma.enclosure.findUnique({
      where: { letter: enclosureLetter },
      include: { rows: true }
    });

    if (!enclosure) {
      throw new Error(`Enclosure ${enclosureLetter} not found`);
    }

    // Fetch admin-reserved seats for this enclosure
    const adminReservedSeats = await this.prisma.seatReservation.findMany({
      where: { enclosureLetter },
      select: { rowLetter: true, seatNumber: true }
    });

    // Create a Set for quick lookup: "A-5" format
    const adminReservedSet = new Set(
      adminReservedSeats.map(r => `${r.rowLetter}-${r.seatNumber}`)
    );

    console.log(`Admin reserved ${adminReservedSet.size} seats in enclosure ${enclosureLetter}`);

    // Sort rows by displayOrder
    const sortedRows = enclosure.rows.sort((a, b) => a.displayOrder - b.displayOrder);

    let attendeeIndex = 0;

    // Iterate through rows
    for (const row of sortedRows) {
      if (attendeeIndex >= attendees.length) break;

      const rowReservedSeats = this.parseReservedSeats(row.reservedSeats);

      // Allocate seats in this row
      for (let seatNum = row.startSeat; seatNum <= row.endSeat; seatNum++) {
        if (attendeeIndex >= attendees.length) break;
        
        // Check if seat is reserved by row configuration
        if (rowReservedSeats.includes(seatNum)) {
          console.log(`Skipping row-reserved seat: ${enclosureLetter}-${row.letter}-${seatNum}`);
          continue;
        }

        // Check if seat is reserved by admin
        const seatKey = `${row.letter}-${seatNum}`;
        if (adminReservedSet.has(seatKey)) {
          console.log(`Skipping admin-reserved seat: ${enclosureLetter}-${seatKey}`);
          continue;
        }

        const attendee = attendees[attendeeIndex];

        // Create seat allocation
        await this.prisma.seatAllocation.create({
          data: {
            enclosureLetter: enclosureLetter,
            enclosureId: enclosure.id,
            rowLetter: row.letter,
            seatNumber: seatNum,
            attendeeId: attendee.id
          }
        });

        attendeeIndex++;
      }
    }

    console.log(`Allocated ${attendeeIndex} seats in enclosure ${enclosureLetter}`);
  }

  /**
   * Parse reserved seat string: "1,5,10" → [1, 5, 10]
   */
  private parseReservedSeats(reservedStr: string): number[] {
    if (!reservedStr || reservedStr === '') return [];
    return reservedStr
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));
  }

  /**
   * Group attendees by their assigned enclosure
   */
  private groupByEnclosure(attendees: Array<{ id: string; assignedEnclosure: string }>) {
    return attendees.reduce((acc, attendee) => {
      const enclosure = attendee.assignedEnclosure;
      if (!acc[enclosure]) acc[enclosure] = [];
      acc[enclosure].push(attendee);
      return acc;
    }, {} as Record<string, Array<{ id: string }>>);
  }

  /**
   * Calculate total available seats in enclosure (excluding admin + row reservations)
   */
  async getTotalSeats(enclosureLetter: string): Promise<number> {
    const enclosure = await this.prisma.enclosure.findUnique({
      where: { letter: enclosureLetter },
      include: { rows: true }
    });

    if (!enclosure) return 0;

    // Get admin-reserved seat count
    const adminReservedCount = await this.prisma.seatReservation.count({
      where: { enclosureLetter }
    });

    // Calculate row-reserved seats
    const rowReservedTotal = enclosure.rows.reduce((total, row) => {
      return total + this.parseReservedSeats(row.reservedSeats).length;
    }, 0);

    // Calculate total seats
    const totalSeats = enclosure.rows.reduce((total, row) => {
      return total + (row.endSeat - row.startSeat + 1);
    }, 0);

    return totalSeats - adminReservedCount - rowReservedTotal;
  }
}
```

#### 2.2 Create Allocation Controller

**Purpose**: API endpoint to trigger seat allocation from database attendees.

```typescript
// apps/api/src/controllers/allocation.controller.ts

import { Request, Response } from 'express';
import { SeatAllocationService } from '../services/seatAllocation.service';
import { prisma } from '../lib/prisma';

export class AllocationController {
  private seatService: SeatAllocationService;

  constructor() {
    this.seatService = new SeatAllocationService(prisma);
  }

  /**
   * POST /api/attendees/allocate-seats
   * Run the seat allocation algorithm for all attendees in database
   */
  async allocateSeats(req: Request, res: Response) {
    try {
      // Fetch all attendees from database who have an assigned enclosure
      const attendees = await prisma.attendee.findMany({
        where: {
          assignedEnclosure: { not: null },
          allocation: null // Only attendees without existing allocation
        },
        select: {
          id: true,
          enrollmentId: true,
          assignedEnclosure: true
        }
      });

      if (attendees.length === 0) {
        return res.status(400).json({ 
          error: 'No attendees found for allocation. Either all attendees are already allocated or none have assigned enclosures.' 
        });
      }

      console.log(`Starting allocation for ${attendees.length} attendees...`);

      // Run allocation algorithm
      await this.seatService.allocateSeats(attendees as any);

      // Get allocation statistics
      const allocated = await prisma.seatAllocation.count();
      const reserved = await prisma.seatReservation.count();

      res.json({
        message: 'Seat allocation completed successfully',
        statistics: {
          attendeesProcessed: attendees.length,
          seatsAllocated: allocated,
          adminReservedSeats: reserved
        }
      });
    } catch (error) {
      console.error('Allocation error:', error);
      res.status(500).json({ 
        error: 'Seat allocation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * DELETE /api/attendees/clear-allocations
   * Clear all seat allocations (for testing/re-allocation)
   */
  async clearAllocations(req: Request, res: Response) {
    try {
      const result = await prisma.seatAllocation.deleteMany({});
      res.json({ 
        message: `Cleared ${result.count} seat allocations` 
      });
    } catch (error) {
      console.error('Clear allocations error:', error);
      res.status(500).json({ error: 'Failed to clear allocations' });
    }
  }

  /**
   * GET /api/attendees/:enrollmentId/seat-allocation
   * Get seat allocation for a specific attendee
   */
  async getSeatAllocation(req: Request, res: Response) {
    try {
      const { enrollmentId } = req.params;

      const attendee = await prisma.attendee.findUnique({
        where: { enrollmentId },
        include: {
          allocation: {
            include: {
              enclosure: true
            }
          }
        }
      });

      if (!attendee) {
        return res.status(404).json({ error: 'Attendee not found' });
      }

      if (!attendee.allocation) {
        return res.status(404).json({ 
          error: 'No seat allocated yet',
          attendee: {
            enrollmentId: attendee.enrollmentId,
            name: attendee.name,
            assignedEnclosure: attendee.assignedEnclosure
          }
        });
      }

      res.json({
        attendee: {
          enrollmentId: attendee.enrollmentId,
          name: attendee.name,
          course: attendee.course
        },
        allocation: {
          enclosure: attendee.allocation.enclosureLetter,
          enclosureName: attendee.allocation.enclosure.name,
          row: attendee.allocation.rowLetter,
          seat: attendee.allocation.seatNumber,
          allocatedAt: attendee.allocation.allocatedAt
        }
      });
    } catch (error) {
      console.error('Get allocation error:', error);
      res.status(500).json({ error: 'Failed to fetch allocation' });
    }
  }
}
```

#### 2.2 Create Attendee Upload Controller

```typescript
// apps/api/src/controllers/attendee.controller.ts

import { Request, Response } from 'express';
import { SeatAllocationService } from '../services/seatAllocation.service';
import { parse } from 'csv-parse/sync';
import { prisma } from '../lib/prisma';

export class AttendeeController {
  private seatService: SeatAllocationService;

  constructor() {
    this.seatService = new SeatAllocationService(prisma);
  }

  /**
   * Upload attendee CSV with enclosure column
   * Expected CSV format:
   * enrollmentId, name, course, school, degree, email, phone, enclosure
   */
  async uploadAttendees(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Parse CSV
      const fileContent = req.file.buffer.toString('utf-8');
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      // Validate CSV has required columns
      const requiredColumns = ['enrollmentId', 'name', 'enclosure'];
      const hasAllColumns = requiredColumns.every(col => 
        records.length > 0 && col in records[0]
      );

      if (!hasAllColumns) {
        return res.status(400).json({ 
          error: 'CSV must contain: enrollmentId, name, enclosure columns' 
        });
      }

      // Clear existing attendees (optional - based on requirements)
      await prisma.attendee.deleteMany({});

      // Insert attendees
      const attendees = await Promise.all(
        records.map(async (record: any) => {
          return prisma.attendee.create({
            data: {
              enrollmentId: record.enrollmentId,
              name: record.name,
              course: record.course || '',
              school: record.school || '',
              degree: record.degree || '',
              email: record.email || '',
              phone: record.phone || null,
              assignedEnclosure: record.enclosure, // Key field!
              crr: record.crr || record.enrollmentId,
              convocationEligible: true
            }
          });
        })
      );

      // Automatically trigger seat allocation
      await this.allocateSeats(req, res);

      return res.status(201).json({
        message: 'Attendees uploaded and seats allocated successfully',
        count: attendees.length
      });

    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: 'Failed to upload attendees' });
    }
  }

  /**
   * Trigger seat allocation for all eligible attendees
   */
  async allocateSeats(req: Request, res: Response) {
    try {
      // Fetch all attendees with assigned enclosure
      const attendees = await prisma.attendee.findMany({
        where: {
          convocationEligible: true,
          assignedEnclosure: { not: null }
        },
        select: {
          id: true,
          assignedEnclosure: true
        }
      });

      // Run allocation algorithm
      await this.seatService.allocateSeats(
        attendees.map(a => ({
          id: a.id,
          assignedEnclosure: a.assignedEnclosure!
        }))
      );

      return res.status(200).json({
        message: 'Seat allocation completed',
        allocated: attendees.length
      });

    } catch (error) {
      console.error('Allocation error:', error);
      return res.status(500).json({ error: 'Seat allocation failed' });
    }
  }

  /**
   * Get seat allocation for specific attendee
   */
  async getAttendeeSeat(req: Request, res: Response) {
    try {
      const { enrollmentId } = req.params;

      const attendee = await prisma.attendee.findUnique({
        where: { enrollmentId },
        include: {
          allocation: {
            include: {
              enclosure: {
                include: {
                  rows: true
                }
              }
            }
          }
        }
      });

      if (!attendee) {
        return res.status(404).json({ error: 'Attendee not found' });
      }

      if (!attendee.allocation) {
        return res.status(404).json({ error: 'Seat not allocated yet' });
      }

      return res.status(200).json({
        attendee: {
          enrollmentId: attendee.enrollmentId,
          name: attendee.name,
          course: attendee.course,
          school: attendee.school
        },
        allocation: {
          enclosure: attendee.allocation.enclosure.letter,
          row: attendee.allocation.row,
          seat: attendee.allocation.seatNumber,
          entryDirection: attendee.allocation.enclosure.entryDirection
        },
        enclosureMetadata: {
          letter: attendee.allocation.enclosure.letter,
          entryDirection: attendee.allocation.enclosure.entryDirection,
          rows: attendee.allocation.enclosure.rows
        }
      });

    } catch (error) {
      console.error('Get seat error:', error);
      return res.status(500).json({ error: 'Failed to retrieve seat' });
    }
  }

  /**
   * Get all attendees in a specific enclosure (for aerial view)
   */
  async getAttendeesInEnclosure(req: Request, res: Response) {
    try {
      const { enclosure } = req.params;

      const allocations = await prisma.seatAllocation.findMany({
        where: {
          enclosure: {
            letter: enclosure
          }
        },
        include: {
          attendee: {
            select: {
              enrollmentId: true,
              name: true
            }
          }
        },
        orderBy: [
          { row: 'asc' },
          { seatNumber: 'asc' }
        ]
      });

      // Group by row
      const groupedByRow = allocations.reduce((acc, alloc) => {
        if (!acc[alloc.row]) {
          acc[alloc.row] = [];
        }
        acc[alloc.row].push({
          enrollmentNumber: alloc.attendee.enrollmentId,
          name: alloc.attendee.name,
          seat: alloc.seatNumber.toString()
        });
        return acc;
      }, {} as Record<string, any[]>);

      // Format response
      const rows = Object.entries(groupedByRow).map(([row, attendees]) => ({
        row,
        attendees
      }));

      return res.status(200).json({
        enclosure,
        rows
      });

    } catch (error) {
      console.error('Get enclosure error:', error);
      return res.status(500).json({ error: 'Failed to retrieve enclosure data' });
    }
  }
}
```

#### 2.3 API Routes

```typescript
// apps/api/src/routes/attendee.routes.ts

import { Router } from 'express';
import multer from 'multer';
import { AttendeeController } from '../controllers/attendee.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const controller = new AttendeeController();

// Upload attendees with enclosure assignments
router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  controller.uploadAttendees.bind(controller)
);

// Manually trigger seat allocation
router.post(
  '/allocate-seats',
  authMiddleware,
  controller.allocateSeats.bind(controller)
);

// Get attendee seat allocation
router.get(
  '/:enrollmentId/seat',
  controller.getAttendeeSeat.bind(controller)
);

// Get all attendees in enclosure (for aerial view)
router.get(
  '/enclosure/:enclosure',
  controller.getAttendeesInEnclosure.bind(controller)
);

export default router;
```

### Deliverables
- ✅ Seat allocation service with admin seat reservation handling
- ✅ Algorithm that skips both admin-reserved and row-reserved seats
- ✅ Allocation controller that reads from database (not CSV)
- ✅ API routes for allocation and retrieval
- ✅ Clear allocations endpoint for re-running algorithm
- ✅ Unit tests for allocation logic with reservation scenarios
- ✅ API documentation

---

## **PHASE 3: Frontend - Theater-Style Seat View Components**

### Duration: 7-10 days

### Objectives
- Create District.in-inspired seat visualization
- Build interactive seat map components
- Implement enclosure selector
- Add responsive design for mobile/desktop

### Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 Attendee Seat Page                       │
│  /attendee/[enrollmentId]                               │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│              SeatViewLayout                              │
│  ┌──────────────┐  ┌──────────────────────────────┐    │
│  │  Venue Map   │  │    Seat Details              │    │
│  │  (Enclosure  │  │    - Name                    │    │
│  │   Selector)  │  │    - Enclosure: A            │    │
│  │              │  │    - Row: B                  │    │
│  │    [A] [B]   │  │    - Seat: 15                │    │
│  │    [C] [D]   │  │                              │    │
│  └──────────────┘  └──────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         TheaterSeatMap                           │  │
│  │                                                  │  │
│  │  Row A:  [1] [2] [3] ... [50]                  │  │
│  │  Row B:  [1] [2] [3] ... [50]  ← Your Row     │  │
│  │  Row C:  [1] [2] [3] ... [50]                  │  │
│  │                                                  │  │
│  │  Legend: ■ Your Seat  □ Available  ■ Reserved  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Tasks

#### 3.1 Create Seat Component (Theater-Style)

```typescript
// apps/web/src/components/attendee/Seat.tsx

import React from 'react';
import { cn } from '@/lib/utils';

interface SeatProps {
  number: number;
  isSelected?: boolean;
  isReserved?: boolean;
  isInActiveRow?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Seat({
  number,
  isSelected = false,
  isReserved = false,
  isInActiveRow = false,
  onClick,
  className
}: SeatProps) {
  return (
    <button
      onClick={onClick}
      disabled={isReserved}
      className={cn(
        'relative group',
        'w-10 h-10 md:w-12 md:h-12',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        className
      )}
      aria-label={`Seat ${number}`}
    >
      {/* Seat SVG - Theater style like District.in */}
      <svg
        viewBox="0 0 24 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          'w-full h-full',
          'border-2 rounded-t-full transition-colors',
          {
            'border-red-600': isSelected,
            'border-gray-400': !isSelected && !isReserved,
            'border-yellow-500': isReserved
          }
        )}
      >
        {/* Seat back */}
        <ellipse
          cx="12"
          cy="8"
          rx="12"
          ry="8"
          className={cn({
            'fill-red-500': isSelected,
            'fill-yellow-500': isReserved,
            'fill-gray-200': !isSelected && !isReserved && isInActiveRow,
            'fill-white': !isSelected && !isReserved && !isInActiveRow
          })}
        />
        
        {/* Seat base */}
        <rect
          y="7"
          width="24"
          height="21"
          className={cn({
            'fill-red-500': isSelected,
            'fill-yellow-500': isReserved,
            'fill-gray-200': !isSelected && !isReserved && isInActiveRow,
            'fill-white': !isSelected && !isReserved && !isInActiveRow
          })}
        />
      </svg>

      {/* Seat number overlay */}
      <span
        className={cn(
          'absolute inset-0',
          'flex items-center justify-center',
          'text-xs font-medium',
          'pt-2',
          {
            'text-white': isSelected || isReserved,
            'text-gray-600': !isSelected && !isReserved
          }
        )}
      >
        {number}
      </span>

      {/* Hover tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                      hidden group-hover:block
                      bg-gray-900 text-white text-xs rounded py-1 px-2 
                      whitespace-nowrap z-10">
        Seat {number}
      </div>
    </button>
  );
}
```

#### 3.2 Create Theater Seat Map Component

```typescript
// apps/web/src/components/attendee/TheaterSeatMap.tsx

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Seat } from './Seat';
import { cn } from '@/lib/utils';

interface Row {
  letter: string;
  startSeat: number;
  endSeat: number;
  reserved: string; // "1,5,10"
}

interface SeatMapProps {
  enclosure: {
    letter: string;
    entryDirection: string;
    rows: Row[];
  };
  allocation: {
    row: string;
    seat: number;
  };
  className?: string;
}

export function TheaterSeatMap({
  enclosure,
  allocation,
  className
}: SeatMapProps) {
  const activeRowRef = useRef<HTMLDivElement>(null);
  const activeSeatRef = useRef<HTMLButtonElement>(null);
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
  const activeRowIndex = enclosure.rows.findIndex(r => r.letter === allocation.row);
  const startIndex = Math.max(0, activeRowIndex - 3);
  const endIndex = Math.min(enclosure.rows.length, activeRowIndex + 4);
  const visibleRows = enclosure.rows.slice(startIndex, endIndex);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Entry Direction Indicator */}
      <div className="flex items-center justify-center space-x-3 text-sm">
        <span className="text-gray-600">Enter from:</span>
        <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full font-medium">
          {enclosure.entryDirection}
        </span>
      </div>

      {/* Seat Map */}
      <div className="space-y-4 bg-white rounded-lg p-4 shadow-sm">
        {visibleRows.map((row) => {
          const isActiveRow = row.letter === allocation.row;
          const reservedSeats = parseReserved(row.reserved);

          return (
            <div
              key={row.letter}
              ref={isActiveRow ? activeRowRef : null}
              className="flex items-center space-x-3"
            >
              {/* Row Label */}
              <div
                className={cn(
                  'flex-shrink-0 w-12 h-12',
                  'flex items-center justify-center',
                  'rounded-md font-bold text-sm',
                  'transition-colors',
                  {
                    'bg-red-500 text-white': isActiveRow,
                    'bg-gray-100 text-gray-600': !isActiveRow
                  }
                )}
              >
                {row.letter}
              </div>

              {/* Seats in Row */}
              <div className="flex-1 overflow-x-auto">
                <div className="flex space-x-2 md:space-x-3 min-w-max px-2">
                  {Array.from(
                    { length: row.endSeat - row.startSeat + 1 },
                    (_, i) => row.startSeat + i
                  ).map((seatNum) => (
                    <Seat
                      key={seatNum}
                      number={seatNum}
                      isSelected={isActiveRow && seatNum === allocation.seat}
                      isReserved={reservedSeats.includes(seatNum)}
                      isInActiveRow={isActiveRow}
                      ref={
                        isActiveRow && seatNum === allocation.seat
                          ? activeSeatRef
                          : null
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
        <div className="flex items-center space-x-2">
          <Seat number={0} isSelected className="w-6 h-6" />
          <span className="text-gray-600">Your Seat</span>
        </div>
        <div className="flex items-center space-x-2">
          <Seat number={0} isReserved className="w-6 h-6" />
          <span className="text-gray-600">Reserved / Faculty</span>
        </div>
        <div className="flex items-center space-x-2">
          <Seat number={0} className="w-6 h-6" />
          <span className="text-gray-600">Available</span>
        </div>
      </div>

      {/* Helper Text */}
      <p className="text-center text-xs text-gray-500">
        If your seat is not visible, scroll horizontally in the highlighted row
      </p>
    </div>
  );
}
```

#### 3.3 Create Venue/Ground Map Component

```typescript
// apps/web/src/components/attendee/VenueMap.tsx

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface Enclosure {
  letter: string;
  allocatedFor: string;
}

interface VenueMapProps {
  enclosures: Enclosure[];
  activeEnclosure: string;
  onEnclosureClick?: (letter: string) => void;
  className?: string;
}

export function VenueMap({
  enclosures,
  activeEnclosure,
  onEnclosureClick,
  className
}: VenueMapProps) {
  return (
    <div className={cn('p-6 bg-gray-50 rounded-lg', className)}>
      <h3 className="text-lg font-semibold mb-4 text-center">Venue Layout</h3>
      
      {/* Simplified grid layout of enclosures */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {enclosures.map((enclosure) => (
          <button
            key={enclosure.letter}
            onClick={() => onEnclosureClick?.(enclosure.letter)}
            className={cn(
              'aspect-square rounded-lg',
              'flex flex-col items-center justify-center',
              'font-bold text-2xl',
              'transition-all duration-200',
              'border-2',
              {
                'bg-red-500 text-white border-red-600 shadow-lg scale-105':
                  enclosure.letter === activeEnclosure,
                'bg-white text-gray-700 border-gray-300 hover:border-red-300':
                  enclosure.letter !== activeEnclosure
              }
            )}
          >
            <span className="text-3xl">{enclosure.letter}</span>
            <span className="text-xs mt-1 opacity-75">
              {enclosure.allocatedFor}
            </span>
          </button>
        ))}
      </div>

      {/* Stage/Front Indicator */}
      <div className="mt-6 text-center">
        <div className="inline-block px-6 py-2 bg-gray-800 text-white text-sm rounded-full">
          ▼ STAGE
        </div>
      </div>
    </div>
  );
}
```

#### 3.4 Create Main Attendee Page

```typescript
// apps/web/src/app/attendee/[enrollmentId]/page.tsx

import React from 'react';
import { notFound } from 'next/navigation';
import { TheaterSeatMap } from '@/components/attendee/TheaterSeatMap';
import { VenueMap } from '@/components/attendee/VenueMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PageProps {
  params: { enrollmentId: string };
}

async function getAttendeeSeat(enrollmentId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/attendees/${enrollmentId}/seat`,
    { cache: 'no-store' }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function AttendeeSeatPage({ params }: PageProps) {
  const data = await getAttendeeSeat(params.enrollmentId);

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Convocation Seat
          </h1>
          <p className="text-gray-600">
            Find your seat location and entry directions below
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left: Venue Map */}
          <VenueMap
            enclosures={[
              { letter: 'A', allocatedFor: 'Students' },
              { letter: 'B', allocatedFor: 'Students' },
              { letter: 'C', allocatedFor: 'Faculty' },
              { letter: 'D', allocatedFor: 'Guests' }
            ]}
            activeEnclosure={data.allocation.enclosure}
          />

          {/* Right: Attendee Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📋</span>
                <span>Your Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-lg">{data.attendee.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Enrollment ID</p>
                <p className="font-semibold">{data.attendee.enrollmentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Course</p>
                <p className="font-semibold">{data.attendee.course}</p>
              </div>

              {/* Seat Details - Prominent */}
              <div className="mt-6 p-4 bg-red-50 rounded-lg border-2 border-red-200">
                <p className="text-sm text-red-600 mb-3 font-medium">
                  Your Seat Assignment
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {data.allocation.enclosure}
                    </p>
                    <p className="text-xs text-gray-600">Enclosure</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {data.allocation.row}
                    </p>
                    <p className="text-xs text-gray-600">Row</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {data.allocation.seat}
                    </p>
                    <p className="text-xs text-gray-600">Seat</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Same content as desktop but stacked */}
              {/* ... */}
            </CardContent>
          </Card>
          
          <VenueMap
            enclosures={[
              { letter: 'A', allocatedFor: 'Students' },
              { letter: 'B', allocatedFor: 'Students' }
            ]}
            activeEnclosure={data.allocation.enclosure}
            className="max-w-md mx-auto"
          />
        </div>

        {/* Seat Map (Full Width) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🎭</span>
              <span>Seat Map</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TheaterSeatMap
              enclosure={data.enclosureMetadata}
              allocation={{
                row: data.allocation.row,
                seat: parseInt(data.allocation.seat)
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### Deliverables
- ✅ Theater-style seat component with SVG
- ✅ Interactive seat map with auto-scroll
- ✅ Venue/enclosure selector
- ✅ Responsive attendee page
- ✅ Mobile-optimized layout

---

## **PHASE 4: Admin Dashboard - Aerial View & Analytics**

### Duration: 3-4 days

### Objectives
- Create aerial view for visualizing seat allocations
- Build analytics dashboard for allocation statistics
- Add attendee search and filtering capabilities

**Note**: Enclosure management UI was already built in Phase 1.

### Tasks

#### 4.1 Statistics Dashboard API

**Purpose**: Provide aggregated statistics for seat allocation across all enclosures.

```typescript
// apps/api/src/controllers/allocation.controller.ts

import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class AllocationController {
  /**
   * GET /api/allocations/stats
   * Returns allocation statistics across all enclosures
   */
  static async getStats(req: Request, res: Response) {
    try {
      // Get total attendees
      const totalAttendees = await prisma.attendee.count();

      // Get allocated attendees
      const totalAllocated = await prisma.seatAllocation.count();

      // Get enclosure count
      const totalEnclosures = await prisma.enclosure.count({
        where: { isActive: true }
      });

      // Get breakdown by category
      const byCategory = await prisma.attendee.groupBy({
        by: ['category'],
        _count: { id: true }
      });

      const categoryMap = byCategory.reduce((acc, item) => {
        acc[item.category] = item._count.id;
        return acc;
      }, {} as Record<string, number>);

      // Get enclosure-wise statistics
      const enclosures = await prisma.enclosure.findMany({
        where: { isActive: true },
        include: {
          rows: true,
          _count: {
            select: { seatAllocations: true }
          }
        },
        orderBy: { displayOrder: 'asc' }
      });

      const enclosureStats = enclosures.map((enc) => {
        const totalSeats = enc.rows.reduce((sum, row) => {
          const reserved = row.reservedSeats ? row.reservedSeats.split(',').length : 0;
          return sum + (row.endSeat - row.startSeat + 1 - reserved);
        }, 0);

        const allocatedSeats = enc._count.seatAllocations;
        const availableSeats = totalSeats - allocatedSeats;
        const utilizationRate = totalSeats > 0 
          ? Math.round((allocatedSeats / totalSeats) * 100) 
          : 0;

        return {
          letter: enc.letter,
          name: enc.name,
          totalSeats,
          allocatedSeats,
          availableSeats,
          utilizationRate
        };
      });

      res.json({
        totalAttendees,
        totalAllocated,
        totalEnclosures,
        byCategory: categoryMap,
        enclosureStats
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  }
}
```

```typescript
// apps/api/src/routes/allocation.routes.ts

import { Router } from 'express';
import { AllocationController } from '../controllers/allocation.controller';

const router = Router();

router.get('/stats', AllocationController.getStats);

export default router;
```

#### 4.2 Statistics Dashboard UI

**Purpose**: Display allocation statistics in an admin dashboard.

```typescript
// apps/web/src/app/admin/dashboard/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface AllocationStats {
  totalAttendees: number;
  totalAllocated: number;
  totalEnclosures: number;
  byCategory: {
    STUDENTS?: number;
    FACULTY?: number;
    VIP?: number;
    GUESTS?: number;
  };
  enclosureStats: Array<{
    letter: string;
    name: string;
    totalSeats: number;
    allocatedSeats: number;
    availableSeats: number;
    utilizationRate: number;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<AllocationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/allocations/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading statistics...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Allocation Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Total Attendees</p>
          <p className="text-3xl font-bold">{stats?.totalAttendees || 0}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Allocated</p>
          <p className="text-3xl font-bold text-green-600">
            {stats?.totalAllocated || 0}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Enclosures</p>
          <p className="text-3xl font-bold">{stats?.totalEnclosures || 0}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Allocation Rate</p>
          <p className="text-3xl font-bold">
            {stats 
              ? Math.round((stats.totalAllocated / stats.totalAttendees) * 100) 
              : 0}%
          </p>
        </Card>
      </div>

      {/* By Category */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">By Category</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded">
            <p className="text-sm text-gray-600">Students</p>
            <p className="text-2xl font-bold">
              {stats?.byCategory.STUDENTS || 0}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded">
            <p className="text-sm text-gray-600">Faculty</p>
            <p className="text-2xl font-bold">
              {stats?.byCategory.FACULTY || 0}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded">
            <p className="text-sm text-gray-600">VIP</p>
            <p className="text-2xl font-bold">
              {stats?.byCategory.VIP || 0}
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded">
            <p className="text-sm text-gray-600">Guests</p>
            <p className="text-2xl font-bold">
              {stats?.byCategory.GUESTS || 0}
            </p>
          </div>
        </div>
      </Card>

      {/* Enclosure Breakdown */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Enclosure Utilization</h2>
        <div className="space-y-4">
          {stats?.enclosureStats.map((enc) => (
            <div key={enc.letter} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-bold text-lg">Enclosure {enc.letter}</span>
                  <span className="ml-2 text-gray-600">- {enc.name}</span>
                </div>
                <span className="text-sm font-medium">
                  {enc.allocatedSeats} / {enc.totalSeats} seats
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${enc.utilizationRate}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {enc.availableSeats} seats available ({enc.utilizationRate}% utilized)
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
```

#### 4.3 Aerial View Component

**Purpose**: Visualize seat allocations across all enclosures with an interactive view.

```typescript
// apps/web/src/app/admin/aerial-view/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RowData {
  row: string;
  attendees: Array<{
    enrollmentNumber: string;
    name: string;
    seat: number;
    category: string;
  }>;
}

interface Enclosure {
  letter: string;
  name: string;
  allocatedFor: string;
}

export default function AerialViewPage() {
  const [enclosures, setEnclosures] = useState<Enclosure[]>([]);
  const [selectedEnclosure, setSelectedEnclosure] = useState<string | null>(null);
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEnclosures();
  }, []);

  const fetchEnclosures = async () => {
    try {
      const res = await fetch('/api/enclosures');
      const data = await res.json();
      setEnclosures(data.enclosures);
      if (data.enclosures.length > 0) {
        selectEnclosure(data.enclosures[0].letter);
      }
    } catch (error) {
      console.error('Failed to fetch enclosures:', error);
    }
  };

  const selectEnclosure = async (letter: string) => {
    setSelectedEnclosure(letter);
    setLoading(true);
    try {
      const res = await fetch(`/api/attendees/enclosure/${letter}`);
      const data = await res.json();
      setRowData(data.rows || []);
    } catch (error) {
      console.error('Failed to fetch enclosure data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Aerial View - Seat Allocations</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Enclosure Selector */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Enclosures</h2>
          <div className="space-y-2">
            {enclosures.map((enc) => (
              <Button
                key={enc.letter}
                variant={selectedEnclosure === enc.letter ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => selectEnclosure(enc.letter)}
              >
                <span className="font-bold mr-2">{enc.letter}</span>
                <span className="text-sm">{enc.name}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Attendee Grid by Row */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : selectedEnclosure ? (
            <>
              <h2 className="text-xl font-semibold">
                Enclosure {selectedEnclosure} - Allocated Seats
              </h2>
              {rowData.length === 0 ? (
                <Card className="p-8 text-center text-gray-500">
                  No allocations found for this enclosure
                </Card>
              ) : (
                rowData.map((row) => (
                  <Card key={row.row} className="p-4">
                    <h3 className="font-bold mb-3 text-lg border-b pb-2">
                      Row {row.row}
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        ({row.attendees.length} attendees)
                      </span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {row.attendees.map((attendee) => (
                        <div
                          key={attendee.enrollmentNumber}
                          className="p-3 bg-gray-50 rounded border hover:bg-gray-100 transition"
                        >
                          <p className="font-bold text-sm">Seat {attendee.seat}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {attendee.enrollmentNumber}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {attendee.name}
                          </p>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                            {attendee.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))
              )}
            </>
          ) : (
            <Card className="p-8 text-center text-gray-500">
              Select an enclosure to view allocations
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
```

#### 4.4 Attendee Search & Filter

**Purpose**: Allow admins to quickly find attendees and their seat assignments.

```typescript
// apps/web/src/app/admin/search/page.tsx

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface AttendeeResult {
  id: string;
  enrollmentNumber: string;
  name: string;
  category: string;
  enclosure?: string;
  row?: string;
  seat?: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AttendeeResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/attendees/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Search Attendees</h1>

      <Card className="p-6 mb-6">
        <div className="flex gap-4">
          <Input
            placeholder="Search by enrollment number or name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-8">Searching...</div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
          {results.map((attendee) => (
            <Card key={attendee.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{attendee.name}</h3>
                  <p className="text-sm text-gray-600">
                    {attendee.enrollmentNumber}
                  </p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-2 inline-block">
                    {attendee.category}
                  </span>
                </div>
                <div className="text-right">
                  {attendee.enclosure && attendee.row && attendee.seat ? (
                    <>
                      <p className="font-bold text-lg">
                        Enclosure {attendee.enclosure}
                      </p>
                      <p className="text-sm text-gray-600">
                        Row {attendee.row}, Seat {attendee.seat}
                      </p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-2 inline-block">
                        Allocated
                      </span>
                    </>
                  ) : (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Not Allocated
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : query && !loading ? (
        <Card className="p-8 text-center text-gray-500">
          No results found for "{query}"
        </Card>
      ) : null}
    </div>
  );
}
```

```typescript
// apps/api/src/controllers/attendee.controller.ts (add search endpoint)

export class AttendeeController {
  // ... existing methods ...

  /**
   * GET /api/attendees/search?q=<query>
   * Search attendees by enrollment number or name
   */
  static async search(req: Request, res: Response) {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: 'Query parameter required' });
      }

      const attendees = await prisma.attendee.findMany({
        where: {
          OR: [
            { enrollmentNumber: { contains: q, mode: 'insensitive' } },
            { name: { contains: q, mode: 'insensitive' } }
          ]
        },
        include: {
          seatAllocation: true
        },
        take: 50 // Limit results
      });

      const results = attendees.map((a) => ({
        id: a.id,
        enrollmentNumber: a.enrollmentNumber,
        name: a.name,
        category: a.category,
        enclosure: a.seatAllocation?.enclosureLetter,
        row: a.seatAllocation?.rowLetter,
        seat: a.seatAllocation?.seatNumber
      }));

      res.json({ results });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  }
}
```

### Deliverables
- ✅ Statistics API endpoint with enclosure breakdown
- ✅ Admin dashboard with utilization metrics
- ✅ Aerial view with interactive enclosure selection
- ✅ Attendee search and filtering capability
- ✅ Row-by-row allocation visualization

---

## **PHASE 5: Testing, Optimization & Documentation**

### Duration: 3-4 days

### Tasks

#### 5.1 Backend Testing

```typescript
// apps/api/src/tests/seatAllocation.test.ts

import { describe, it, expect } from 'bun:test';
import { SeatAllocationService } from '../services/seatAllocation.service';

describe('SeatAllocationService', () => {
  it('should allocate seats correctly', async () => {
    // Test cases
  });

  it('should skip reserved seats', async () => {
    // Test reserved seat logic
  });

  it('should handle multiple enclosures', async () => {
    // Test enclosure grouping
  });
});
```

#### 5.2 Frontend Testing

```typescript
// apps/web/src/components/attendee/__tests__/Seat.test.tsx

import { render, screen } from '@testing-library/react';
import { Seat } from '../Seat';

describe('Seat Component', () => {
  it('renders seat number', () => {
    render(<Seat number={15} />);
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('applies selected styles', () => {
    render(<Seat number={15} isSelected />);
    // Assert red color
  });
});
```

#### 5.3 Performance Optimization

- Add Redis caching for enclosure configurations
- Implement pagination for large attendee lists
- Optimize seat map rendering with virtualization
- Add loading states and skeleton screens

#### 5.4 Documentation

Create comprehensive documentation:

```markdown
# Seat Assignment System Documentation

## For Administrators

### Uploading Attendee Data
1. Prepare CSV with columns: `enrollmentId, name, course, school, degree, email, enclosure`
2. Navigate to Admin > Attendees > Upload
3. Select CSV file
4. System automatically allocates seats upon upload

### Managing Enclosures
1. Go to Admin > Enclosures
2. Create new enclosure with row configuration
3. Set reserved seats (e.g., "1,5,10")

### Viewing Allocations
- Use Aerial View to see all attendees by enclosure
- Export seat assignments as CSV

## For Students

### Finding Your Seat
1. Visit `/attendee/[your-enrollment-id]`
2. View your enclosure, row, and seat number
3. Use the interactive seat map to locate your exact position
4. Note the entry direction for the venue

## API Reference

### POST /api/attendees/upload
Upload attendee CSV with enclosure assignments

### POST /api/attendees/allocate-seats
Manually trigger seat allocation

### GET /api/attendees/:enrollmentId/seat
Get seat allocation for specific attendee

### GET /api/attendees/enclosure/:enclosure
Get all attendees in an enclosure
```

### Deliverables
- ✅ Unit and integration tests
- ✅ Performance optimizations
- ✅ User documentation
- ✅ API documentation
- ✅ Deployment guide

---

## **PHASE 6: Deployment & Monitoring**

### Duration: 2-3 days

### Tasks

#### 6.1 Environment Setup

```bash
# .env.production
DATABASE_URL="mongodb+srv://..."
NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
JWT_SECRET="..."
```

#### 6.2 Database Indexing

```typescript
// Add indexes for performance
await prisma.$runCommandRaw({
  createIndexes: 'attendees',
  indexes: [
    { key: { enrollmentId: 1 }, name: 'enrollmentId_idx' },
    { key: { assignedEnclosure: 1 }, name: 'enclosure_idx' }
  ]
});

await prisma.$runCommandRaw({
  createIndexes: 'seat_allocations',
  indexes: [
    { key: { enclosureId: 1, row: 1 }, name: 'enclosure_row_idx' },
    { key: { attendeeId: 1 }, name: 'attendee_idx', unique: true }
  ]
});
```

#### 6.3 Monitoring Setup

- Set up error tracking (Sentry)
- Configure logging (Winston/Pino)
- Add analytics for page views
- Monitor API performance

### Deliverables
- ✅ Production deployment
- ✅ Database indexes
- ✅ Monitoring setup
- ✅ Backup strategy

---

## Implementation Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Database Schema & Enclosure Management | 3-4 days | None |
| Phase 2: Backend Allocation Algorithm | 5-7 days | Phase 1 |
| Phase 3: Frontend Theater Components | 7-10 days | Phase 2 |
| Phase 4: Aerial View & Analytics Dashboard | 3-4 days | Phase 2, 3 |
| Phase 5: Testing & Documentation | 3-4 days | Phase 2, 3, 4 |
| Phase 6: Deployment & Optimization | 2-3 days | Phase 5 |
| **Total** | **23-32 days** | |

**Note**: Phase 1 now includes admin UI for enclosure management (CRUD operations), as enclosures are managed through the frontend rather than CSV uploads.

---

## Key Technical Decisions

### Why Node.js/TypeScript for Seat Allocation (vs Lambda)?

**Reference uses**: AWS Lambda (serverless)
**Your stack**: Node.js API

**Decision**: Implement in Node.js API directly
- **Pros**: Simpler architecture, no AWS dependency, easier debugging
- **Cons**: Not as scalable for massive concurrent allocations
- **Recommendation**: Start with API, move to background jobs if needed

### Seat Allocation Trigger

**Options**:
1. **Immediate**: Run allocation on CSV upload (recommended for start)
2. **Deferred**: Manual trigger after review
3. **Scheduled**: Nightly batch process

**Recommendation**: Immediate with manual re-run option

### Frontend Framework Choices

- **Styling**: Tailwind CSS + shadcn/ui (already in use)
- **State Management**: React Query for server state
- **Animation**: Framer Motion for smooth transitions
- **SVG**: Inline SVG for seat icons (performance)

---

## Risk Mitigation

### Risk 1: Double Allocation
**Mitigation**: Unique constraint on `SeatAllocation` (enclosureId + row + seatNumber)

### Risk 2: CSV Format Errors
**Mitigation**: Strict validation + error reporting in upload API

### Risk 3: Performance with Large Data
**Mitigation**: 
- Pagination on frontend
- Database indexing
- Redis caching for enclosure configs

### Risk 4: Concurrent Uploads
**Mitigation**: Transaction locks during allocation, queue system for concurrent requests

---

## Success Criteria

- ✅ Attendees uploaded with enclosure assignments
- ✅ Automatic seat allocation within 30 seconds for 1000 attendees
- ✅ Students can view their seat in theater-style UI
- ✅ Admin can manage enclosures and view allocations
- ✅ Mobile-responsive design
- ✅ 95%+ test coverage on critical paths

---

## Future Enhancements (Post-MVP)

1. **QR Code Generation**: Generate QR codes for seat tickets
2. **Email Notifications**: Send seat assignments via email
3. **Seat Swapping**: Allow students to request seat changes
4. **3D Venue View**: Interactive 3D visualization of venue
5. **Check-in System**: QR code scanning for venue entry
6. **Analytics Dashboard**: Attendance tracking, allocation stats
7. **Multi-Language Support**: i18n for regional languages
8. **PDF Ticket Export**: Downloadable seat tickets

---

## Appendix

### A. CSV Format Example

```csv
enrollmentId,name,course,school,degree,email,phone,enclosure
210101001,John Doe,Computer Science,Engineering,B.Tech,john@example.com,9876543210,A
210101002,Jane Smith,Mechanical,Engineering,B.Tech,jane@example.com,9876543211,A
210201001,Bob Johnson,MBA,Management,MBA,bob@example.com,9876543212,B
```

### B. API Response Examples

**GET /api/attendees/210101001/seat**
```json
{
  "attendee": {
    "enrollmentId": "210101001",
    "name": "John Doe",
    "course": "Computer Science",
    "school": "Engineering"
  },
  "allocation": {
    "enclosure": "A",
    "row": "B",
    "seat": 15,
    "entryDirection": "NORTH"
  },
  "enclosureMetadata": {
    "letter": "A",
    "entryDirection": "NORTH",
    "rows": [
      { "letter": "A", "startSeat": 1, "endSeat": 50, "reserved": "1,25,50" },
      { "letter": "B", "startSeat": 1, "endSeat": 50, "reserved": "10,20" }
    ]
  }
}
```

### C. District.in UI Reference

Key design elements to replicate:
1. **Seat Icon**: Rounded top (theater seat style)
2. **Color Coding**: Red (selected), Gray (available), Yellow (reserved)
3. **Hover Effects**: Tooltip on hover with seat details
4. **Row Highlighting**: Active row highlighted in different color
5. **Auto-scroll**: Smooth scroll to user's seat
6. **Legend**: Clear visual legend for seat states
7. **Responsive**: Touch-friendly on mobile devices

---

## Conclusion

This implementation plan provides a complete roadmap for building an automatic seat assignment system with a theater-style visualization. The phased approach ensures systematic development with clear milestones and deliverables.

**Estimated Total Effort**: 23-32 working days (1-1.5 months)

**Recommended Team**:
- 1 Backend Developer (Phases 1-2, 5-6)
- 1 Frontend Developer (Phases 3-4, 5)
- 1 Full-stack Developer (All phases - you!)

**Next Steps**:
1. Review and approve this plan
2. Set up project tracking (GitHub Projects/Jira)
3. Begin Phase 1: Database Schema
4. Schedule weekly progress reviews

---

*Document Version: 1.0*  
*Created: January 2025*  
*Author: AI Assistant*  
*Status: Ready for Implementation*
