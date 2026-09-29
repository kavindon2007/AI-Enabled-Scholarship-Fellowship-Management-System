// Layer: Services
// Responsibility: Business logic for dispatching and logging notifications

import { SendNotificationRequest } from '../schemas/notificationSchemas';
import { NotificationRepository } from '../repositories/notificationRepository';
import { EmailService } from './emailService';
import { SmsService } from './smsService';
import { getTemplate } from '../utils/templates';
import { BaseNotification } from '../types';
import crypto from 'crypto';
import { ValidationError } from '../errors/AppError';
import pino from 'pino';

const logger = pino();

export class NotificationService {
  constructor(
    private notificationRepo: NotificationRepository,
    private emailService: EmailService,
    private smsService: SmsService
  ) {}

  public async processNotification(dto: SendNotificationRequest): Promise<{ id: string; status: string }> {
    // Render templates
    const template = getTemplate(dto.templateId, dto.payload);

    // Create DB record (PENDING)
    const notification: BaseNotification = {
      id: crypto.randomUUID(),
      applicantId: dto.applicantId,
      channel: dto.channel,
      templateId: dto.templateId,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.notificationRepo.saveNotification(notification);

    logger.info({ notificationId: notification.id }, 'Initiating notification send');

    // Dispatch
    let success = false;

    if (dto.channel === 'EMAIL') {
      if (!dto.recipientInfo.email) {
        throw new ValidationError('Email address missing for EMAIL channel');
      }
      success = await this.emailService.sendEmail(dto.recipientInfo.email, template.subject || 'Notification from AI-SFMS', template.body);
    } else if (dto.channel === 'SMS') {
      if (!dto.recipientInfo.phoneNumber) {
        throw new ValidationError('Phone number missing for SMS channel');
      }
      success = await this.smsService.sendSms(dto.recipientInfo.phoneNumber, template.body);
    } else if (dto.channel === 'IN_APP') {
      // IN_APP logic - usually just storing it in the DB is enough, as they fetch it via GET endpoints
      success = true;
    }

    // Update Status
    const newStatus = success ? 'SENT' : 'FAILED';
    await this.notificationRepo.updateStatus(notification.id, newStatus);

    return {
      id: notification.id,
      status: newStatus,
    };
  }

  public async getApplicantHistory(applicantId: string): Promise<BaseNotification[]> {
    return this.notificationRepo.getNotificationsByApplicantId(applicantId);
  }
}
