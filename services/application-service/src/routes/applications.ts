import { Router } from 'express';
import { ApplicationController } from '../controllers/applicationController';
import { ApplicationService } from '../services/applicationService';
import { ApplicationRepository } from '../repositories/applicationRepository';

const router = Router();

// DI Composition
const repository = new ApplicationRepository();
const service = new ApplicationService(repository);
const controller = new ApplicationController(service);

router.post('/', controller.createApplication);
router.get('/:id', controller.getApplication);
router.patch('/:id', controller.updateApplication);
router.post('/:id/submit', controller.submitApplication);

export default router;
