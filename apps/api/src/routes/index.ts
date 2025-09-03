import type { Request, Response } from 'express';
import { Router } from 'express';

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

// TODO: Add route modules here as they are created
// router.use('/auth', authRoutes);
// router.use('/accounts', accountRoutes);
// router.use('/attendees', attendeeRoutes);
// router.use('/config', configRoutes);
// router.use('/analytics', analyticsRoutes);
// router.use('/transactions', transactionRoutes);
// router.use('/assets', assetRoutes);

export default router;
