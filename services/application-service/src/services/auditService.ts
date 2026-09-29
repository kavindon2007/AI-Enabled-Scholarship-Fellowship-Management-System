import { prisma } from '../utils/prisma';
import { AuditEvent } from '@ai-sfms/shared-types';
import { randomUUID } from 'crypto';

export class AuditService {
  /**
   * Logs an immutable audit event to the database.
   */
  async logEvent(event: Omit<AuditEvent, 'id' | 'createdAt'>): Promise<void> {
    await prisma.auditEvent.create({
      data: {
        id: randomUUID(),
        correlationId: event.correlationId || null,
        actorId: event.actorId || null,
        actorType: event.actorType || null,
        action: event.action,
        resourceType: event.resourceType,
        resourceId: event.resourceId || null,
        details: event.details ? (event.details as any) : null,
        ipAddress: event.ipAddress || null,
        userAgent: event.userAgent || null,
      },
    });
  }

  /**
   * Retrieves audit events for a specific resource
   */
  async getEventsForResource(resourceType: string, resourceId: string): Promise<AuditEvent[]> {
    const events = await prisma.auditEvent.findMany({
      where: {
        resourceType,
        resourceId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return events.map((e: any) => ({
      id: e.id,
      correlationId: e.correlationId,
      actorId: e.actorId,
      actorType: e.actorType as any,
      action: e.action,
      resourceType: e.resourceType,
      resourceId: e.resourceId,
      details: e.details,
      ipAddress: e.ipAddress,
      userAgent: e.userAgent,
      createdAt: e.createdAt,
    }));
  }
}

export const auditService = new AuditService();
