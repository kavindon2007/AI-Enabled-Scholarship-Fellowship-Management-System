import { Router } from 'express';
import { DisbursementController } from '../controllers/disbursementController';

export const createDisbursementRouter = (controller: DisbursementController): Router => {
  const router = Router();

  router.post('/initiate', controller.initiate);
  router.get('/seeding-alerts', controller.getSeedingAlerts);
  router.post('/seeding-check', controller.seedingCheck);
  router.post('/penny-drop', controller.pennyDrop);
  router.get('/:applicationId', controller.getByApplication);

  return router;
};
