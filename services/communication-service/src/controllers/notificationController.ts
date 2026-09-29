// Layer: Controllers
// Responsibility: Parse Request, call Service, send Response

import { Request, Response, NextFunction } from 'express';
import { SendNotificationSchema } from '../schemas/notificationSchemas';
import { NotificationService } from '../services/notificationService';

export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  public sendNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate body
      const validatedBody = SendNotificationSchema.parse(req.body);

      // Call Service
      const result = await this.notificationService.processNotification(validatedBody);

      // Send Response
      res.status(200).json({
        data: result,
        error: null,
        meta: {
          requestId: req.headers['x-correlation-id'] || 'unknown',
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getApplicantNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { applicantId } = req.params;

      const results = await this.notificationService.getApplicantHistory(String(applicantId));

      res.status(200).json({
        data: results,
        error: null,
        meta: {
          requestId: req.headers['x-correlation-id'] || 'unknown',
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
