import { Router } from 'express';
import { ApplicationController } from '../controllers/applicationController';
import { ApplicationService } from '../services/applicationService';
import { ApplicationRepository } from '../repositories/applicationRepository';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// DI Composition
const repository = new ApplicationRepository();
const service = new ApplicationService(repository);
const controller = new ApplicationController(service);

router.post('/', requireAuth, controller.createApplication);
router.get('/:id', requireAuth, controller.getApplication);
router.patch('/:id', requireAuth, controller.updateApplication);
router.post('/:id/submit', requireAuth, controller.submitApplication);

export default router;
