// Layer: Routes
// Responsibility: Express Router definitions (POST /api/notifications/send, GET /api/notifications/:applicantId)

import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController';
import { NotificationService } from '../services/notificationService';
import { NotificationRepository } from '../repositories/notificationRepository';
import { EmailService } from '../services/emailService';
import { SmsService } from '../services/smsService';

const router = Router();

// DI Setup
const notificationRepo = new NotificationRepository();
const emailService = new EmailService();
const smsService = new SmsService();
const notificationService = new NotificationService(notificationRepo, emailService, smsService);
const notificationController = new NotificationController(notificationService);

// Routes
// Note: In real setup, you should add RBAC middleware here
router.post('/send', notificationController.sendNotification);
router.get('/:applicantId', notificationController.getApplicantNotifications);

export default router;
