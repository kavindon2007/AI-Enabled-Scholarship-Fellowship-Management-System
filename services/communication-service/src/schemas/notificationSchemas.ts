// Layer: Schemas
// Responsibility: Zod request/response validation schemas

import { z } from 'zod';

export const SendNotificationSchema = z.object({
  applicantId: z.string().uuid('Invalid applicant ID format'),
  channel: z.enum(['EMAIL', 'SMS', 'IN_APP']),
  templateId: z.string().min(1, 'Template ID is required'),
  recipientInfo: z.object({
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
  }),
  payload: z.record(z.string(), z.unknown()).optional(),
}).refine(data => {
  if (data.channel === 'EMAIL' && !data.recipientInfo.email) {
    return false;
  }
  if (data.channel === 'SMS' && !data.recipientInfo.phoneNumber) {
    return false;
  }
  return true;
}, {
  message: 'Recipient info (email or phoneNumber) must match the chosen channel',
  path: ['recipientInfo'],
});

export type SendNotificationRequest = z.infer<typeof SendNotificationSchema>;
