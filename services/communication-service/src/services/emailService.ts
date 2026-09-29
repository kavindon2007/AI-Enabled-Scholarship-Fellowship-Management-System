// Layer: Services
// Responsibility: Email dispatch logic

import nodemailer from 'nodemailer';
import { config } from '../config';
import pino from 'pino';

const logger = pino();

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_PORT === 465, // true for 465, false for other ports
      auth: (config.SMTP_USER && config.SMTP_PASS) ? {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      } : undefined,
    });
  }

  public async sendEmail(to: string, subject: string, htmlBody: string): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: '"AI-SFMS Auto-Notifier" <no-reply@ai-sfms.gov.in>',
        to,
        subject,
        html: htmlBody,
      });

      logger.info({ messageId: info.messageId }, 'Email sent successfully');

      // If using ethereal, you might want to log the preview URL:
      // logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);

      return true;
    } catch (error) {
      logger.error({ err: error, to }, 'Failed to send email');
      return false;
    }
  }
}
