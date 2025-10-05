import type { Request, Response } from 'express';
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

        // Validate required fields
        if (!enclosureLetter || !rowLetter || seatNumber === undefined) {
          errors.push({
            seat: `${enclosureLetter}-${rowLetter}-${seatNumber}`,
            error: 'Missing required fields'
          });
          continue;
        }

        try {
          // Check if enclosure exists
          const enclosure = await prisma.enclosure.findUnique({
            where: { letter: enclosureLetter },
            include: { rows: true }
          });

          if (!enclosure) {
            errors.push({
              seat: `${enclosureLetter}-${rowLetter}-${seatNumber}`,
              error: 'Enclosure not found'
            });
            continue;
          }

          // Check if row exists in enclosure
          const row = enclosure.rows.find(r => r.letter === rowLetter);
          if (!row) {
            errors.push({
              seat: `${enclosureLetter}-${rowLetter}-${seatNumber}`,
              error: 'Row not found in enclosure'
            });
            continue;
          }

          // Check if seat number is within row range
          if (seatNumber < row.startSeat || seatNumber > row.endSeat) {
            errors.push({
              seat: `${enclosureLetter}-${rowLetter}-${seatNumber}`,
              error: `Seat number must be between ${row.startSeat} and ${row.endSeat}`
            });
            continue;
          }

          // Check if already allocated to an attendee
          const existing = await prisma.seatAllocation.findFirst({
            where: {
              enclosureLetter,
              rowLetter,
              seatNumber
            }
          });

          if (existing) {
            errors.push({
              seat: `${enclosureLetter}-${rowLetter}-${seatNumber}`,
              error: 'Seat already allocated to an attendee'
            });
            continue;
          }

          // Create reservation (upsert to handle duplicates)
          const created = await prisma.seatReservation.upsert({
            where: {
              enclosureLetter_rowLetter_seatNumber: {
                enclosureLetter,
                rowLetter,
                seatNumber
              }
            },
            update: {
              reservedFor,
              reservedBy
            },
            create: {
              enclosureLetter,
              rowLetter,
              seatNumber,
              reservedFor,
              reservedBy
            }
          });

          results.push(created);
        } catch (error: any) {
          errors.push({
            seat: `${enclosureLetter}-${rowLetter}-${seatNumber}`,
            error: error.message || 'Unknown error'
          });
        }
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
