import { Router } from 'express';
import { SeatReservationController } from '../controllers/seatReservation.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require admin authentication
router.use(authenticate);

router.post('/reserve-seats', SeatReservationController.reserveSeats);
router.get('/reservations', SeatReservationController.getReservations);
router.delete('/reservations/:id', SeatReservationController.removeReservation);
router.delete('/reservations', SeatReservationController.clearAllReservations);

export default router;
