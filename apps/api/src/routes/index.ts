import type { Request, Response } from 'express';
import { Router } from 'express';
import accountRoutes from './account.routes.js';
import allocationRoutes from './allocation.routes.js';
import attendanceRoutes from './attendance.routes.js';
import attendeeRoutes from './attendee.routes.js';
import authRoutes from './auth.routes.js';
import emailRoutes from './email.routes.js';
import enclosureRoutes from './enclosure.routes.js';
import seatReservationRoutes from './seatReservation.routes.js';

const router = Router();

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'PU Convocation API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API version endpoint
router.get('/version', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    version: '1.0.0',
    name: 'PU Convocation API',
  });
});

// Authentication routes
router.use('/auth', authRoutes);

// Account management routes (Admin only)
router.use('/accounts', accountRoutes);

// Attendee management routes
router.use('/attendees', attendeeRoutes);

// Enclosure management routes (Admin only)
router.use('/enclosures', enclosureRoutes);

// Seat allocation routes
router.use('/allocations', allocationRoutes);

// Seat reservation routes (Admin only)
router.use('/admin', seatReservationRoutes);

// Attendance tracking routes
router.use('/attendance', attendanceRoutes);

// Email management routes (Admin only)
router.use('/emails', emailRoutes);

// TODO: Add route modules here as they are created
// router.use('/config', configRoutes);
// router.use('/analytics', analyticsRoutes);
// router.use('/transactions', transactionRoutes);
// router.use('/assets', assetRoutes);

export default router;
