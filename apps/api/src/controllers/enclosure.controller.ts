import type { Request, Response } from 'express';
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
   * GET /api/enclosures/:id - Get single enclosure
   */
  async getEnclosure(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const enclosure = await prisma.enclosure.findUnique({
        where: { id },
        include: {
          rows: {
            orderBy: { displayOrder: 'asc' }
          },
          _count: {
            select: { seatAllocations: true }
          }
        }
      });

      if (!enclosure) {
        return res.status(404).json({ error: 'Enclosure not found' });
      }

      const enclosureWithSeats = {
        ...enclosure,
        totalSeats: this.calculateTotalSeats(enclosure.rows),
        allocatedSeats: enclosure._count.seatAllocations
      };

      return res.json(enclosureWithSeats);
    } catch (error) {
      console.error('Get enclosure error:', error);
      return res.status(500).json({ error: 'Failed to fetch enclosure' });
    }
  }

  /**
   * POST /api/enclosures - Create new enclosure
   */
  async createEnclosure(req: Request, res: Response) {
    try {
      const { letter, name, allocatedFor, entryDirection, displayOrder, rows } = req.body;

      // Validate required fields
      if (!letter || !allocatedFor || !entryDirection) {
        return res.status(400).json({ error: 'Missing required fields: letter, allocatedFor, entryDirection' });
      }

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
          name: name || null,
          allocatedFor,
          entryDirection,
          displayOrder: displayOrder || 0,
          rows: {
            create: rows?.map((row: any, index: number) => ({
              letter: row.letter,
              startSeat: row.startSeat,
              endSeat: row.endSeat,
              reservedSeats: row.reservedSeats || '',
              displayOrder: row.displayOrder !== undefined ? row.displayOrder : index
            })) || []
          }
        },
        include: {
          rows: {
            orderBy: { displayOrder: 'asc' }
          }
        }
      });

      // Calculate and update total seats
      const totalSeats = this.calculateTotalSeats(enclosure.rows);
      const updatedEnclosure = await prisma.enclosure.update({
        where: { id: enclosure.id },
        data: { totalSeats },
        include: {
          rows: {
            orderBy: { displayOrder: 'asc' }
          }
        }
      });

      return res.status(201).json(updatedEnclosure);
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

      // Check if enclosure exists
      const existing = await prisma.enclosure.findUnique({
        where: { id }
      });

      if (!existing) {
        return res.status(404).json({ error: 'Enclosure not found' });
      }

      // If letter is changing, check uniqueness
      if (letter && letter !== existing.letter) {
        const letterExists = await prisma.enclosure.findUnique({
          where: { letter }
        });
        if (letterExists) {
          return res.status(400).json({ error: 'Enclosure letter already exists' });
        }
      }

      // Delete existing rows
      await prisma.row.deleteMany({
        where: { enclosureId: id }
      });

      // Update enclosure with new rows
      const enclosure = await prisma.enclosure.update({
        where: { id },
        data: {
          letter: letter || existing.letter,
          name: name !== undefined ? name : existing.name,
          allocatedFor: allocatedFor || existing.allocatedFor,
          entryDirection: entryDirection || existing.entryDirection,
          displayOrder: displayOrder !== undefined ? displayOrder : existing.displayOrder,
          rows: {
            create: rows?.map((row: any, index: number) => ({
              letter: row.letter,
              startSeat: row.startSeat,
              endSeat: row.endSeat,
              reservedSeats: row.reservedSeats || '',
              displayOrder: row.displayOrder !== undefined ? row.displayOrder : index
            })) || []
          }
        },
        include: {
          rows: {
            orderBy: { displayOrder: 'asc' }
          }
        }
      });

      // Update total seats
      const totalSeats = this.calculateTotalSeats(enclosure.rows);
      const updatedEnclosure = await prisma.enclosure.update({
        where: { id },
        data: { totalSeats },
        include: {
          rows: {
            orderBy: { displayOrder: 'asc' }
          }
        }
      });

      return res.json(updatedEnclosure);
    } catch (error) {
      console.error('Update enclosure error:', error);
      return res.status(500).json({ error: 'Failed to update enclosure' });
    }
  }

  /**
   * PATCH /api/enclosures/:id/layout - Update enclosure spatial layout only
   */
  async updateEnclosureLayout(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { positionX, positionY, width, height, color } = req.body;

      // console.log(`Updating enclosure layout for ID: ${id}`, { positionX, positionY, width, height, color });

      // Check if enclosure exists
      const existing = await prisma.enclosure.findUnique({
        where: { id }
      });

      if (!existing) {
        console.error(`Enclosure not found: ${id}`);
        return res.status(404).json({ error: 'Enclosure not found' });
      }

      // Build update data object
      const updateData: any = {};
      if (positionX !== undefined) updateData.positionX = positionX;
      if (positionY !== undefined) updateData.positionY = positionY;
      if (width !== undefined) updateData.width = width;
      if (height !== undefined) updateData.height = height;
      if (color !== undefined) updateData.color = color;

      // console.log(`Updating enclosure ${existing.letter} with data:`, updateData);

      // Update only spatial fields
      const enclosure = await prisma.enclosure.update({
        where: { id },
        data: updateData,
        include: {
          rows: {
            orderBy: { displayOrder: 'asc' }
          }
        }
      });

      // console.log(`Successfully updated enclosure ${enclosure.letter}:`, {
      //   positionX: enclosure.positionX,
      //   positionY: enclosure.positionY
      // });

      return res.json(enclosure);
    } catch (error) {
      console.error('Update enclosure layout error:', error);
      return res.status(500).json({ error: 'Failed to update enclosure layout' });
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
          error: 'Cannot delete enclosure with seat allocations. Please clear allocations first.'
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
  private calculateTotalSeats(rows: Array<{ startSeat: number; endSeat: number; reservedSeats: string }>): number {
    return rows.reduce((total, row) => {
      const reservedCount = row.reservedSeats
        ? row.reservedSeats.split(',').filter(s => s.trim()).length
        : 0;
      const rowSeats = (row.endSeat - row.startSeat + 1) - reservedCount;
      return total + rowSeats;
    }, 0);
  }
}
