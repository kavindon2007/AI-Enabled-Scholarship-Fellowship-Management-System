// Layer: Repositories
// Responsibility: Data access for Notifications (mocked for simplicity without DB)

import { BaseNotification, NotificationStatus } from '../types';

export class NotificationRepository {
  private notifications: BaseNotification[] = [];

  public async saveNotification(notification: BaseNotification): Promise<void> {
    this.notifications.push(notification);
  }

  public async getNotificationsByApplicantId(applicantId: string): Promise<BaseNotification[]> {
    return this.notifications.filter(n => n.applicantId === applicantId);
  }

  public async updateStatus(id: string, status: NotificationStatus): Promise<boolean> {
    const notification = this.notifications.find(n => n.id === id);
    if (!notification) return false;

    notification.status = status;
    notification.updatedAt = new Date();
    return true;
  }
}
