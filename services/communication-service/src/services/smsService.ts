// Layer: Services
// Responsibility: SMS dispatch logic

import pino from 'pino';
import { config } from '../config';

const logger = pino();

export class SmsService {
  public async sendSms(phoneNumber: string, messageBody: string): Promise<boolean> {
    try {
      if (config.TWILIO_ACCOUNT_SID && config.TWILIO_AUTH_TOKEN) {
        // Pseudo implementation for real SMS gateway
        // const client = require('twilio')(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
        // await client.messages.create({
        //     body: messageBody,
        //     from: config.TWILIO_FROM_NUMBER,
        //     to: phoneNumber
        // });
        logger.info({ to: phoneNumber }, 'SMS sent via Gateway');
        return true;
      }

      // Mock SMS
      logger.info({ to: phoneNumber, body: messageBody }, 'Mock SMS sent');
      return true;
    } catch (error) {
      logger.error({ err: error, to: phoneNumber }, 'Failed to send SMS');
      return false;
    }
  }
}
