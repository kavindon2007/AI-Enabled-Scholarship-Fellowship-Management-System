// Layer: Types
// Responsibility: Shared TypeScript types

export type CommunicationChannel = 'EMAIL' | 'SMS' | 'IN_APP';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface BaseNotification {
  id: string; // Branded type could be added later if needed
  applicantId: string;
  channel: CommunicationChannel;
  templateId: string;
  status: NotificationStatus;
  createdAt: Date;
  updatedAt: Date;
}
