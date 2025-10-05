import { Router } from 'express';
import { EnclosureController } from '../controllers/enclosure.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new EnclosureController();

// All routes require authentication
router.use(authenticate);

// CRUD operations
router.get('/', controller.getAllEnclosures.bind(controller));
router.get('/:id', controller.getEnclosure.bind(controller));
router.post('/', controller.createEnclosure.bind(controller));
router.put('/:id', controller.updateEnclosure.bind(controller));
router.delete('/:id', controller.deleteEnclosure.bind(controller));

export default router;
