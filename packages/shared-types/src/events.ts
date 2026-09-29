/**
 * @module events
 * Kafka event payload schemas — validated on both produce and consume.
 */

import { z } from 'zod';

/** Base fields present on every Kafka event */
const BaseEvent = z.object({
  eventId: z.string().uuid(),
  timestamp: z.string().datetime(),
  correlationId: z.string().uuid(),
});

export const DocumentUploadedEvent = BaseEvent.extend({
  type: z.literal('document-uploaded'),
  payload: z.object({
    documentId: z.string().uuid(),
    applicationId: z.string().uuid(),
    docTypeHint: z.string().optional(),
    storagePath: z.string(),
    mimeType: z.string(),
  }),
});
export type DocumentUploadedEvent = z.infer<typeof DocumentUploadedEvent>;

export const OcrCompleteEvent = BaseEvent.extend({
  type: z.literal('ocr-complete'),
  payload: z.object({
    documentId: z.string().uuid(),
    applicationId: z.string().uuid(),
    overallConfidence: z.number().min(0).max(1),
    criticalFieldFlags: z.array(z.string()),
    tamperingDetected: z.boolean(),
  }),
});
export type OcrCompleteEvent = z.infer<typeof OcrCompleteEvent>;

export const ApplicationSubmittedEvent = BaseEvent.extend({
  type: z.literal('application-submitted'),
  payload: z.object({
    applicationId: z.string().uuid(),
    applicantId: z.string().uuid(),
    schemeId: z.string().uuid(),
    schemeCode: z.string(),
    academicYear: z.string(),
    documentIds: z.array(z.string().uuid()),
  }),
});
export type ApplicationSubmittedEvent = z.infer<typeof ApplicationSubmittedEvent>;

export const ApplicationStatusChangedEvent = BaseEvent.extend({
  type: z.literal('application-status-changed'),
  payload: z.object({
    applicationId: z.string().uuid(),
    applicantId: z.string().uuid(),
    previousStatus: z.string(),
    newStatus: z.string(),
    changedBy: z.string().uuid().optional(),
    reason: z.string().optional(),
  }),
});
export type ApplicationStatusChangedEvent = z.infer<typeof ApplicationStatusChangedEvent>;

export const EligibilityEvaluatedEvent = BaseEvent.extend({
  type: z.literal('eligibility-evaluated'),
  payload: z.object({
    applicationId: z.string().uuid(),
    schemeId: z.string().uuid(),
    outcome: z.enum(['PASS', 'FAIL', 'DEFICIENT']),
    ruleSetVersion: z.string(),
    failedRules: z.array(z.object({
      ruleId: z.string(),
      ruleType: z.string(),
      message: z.string(),
    })),
  }),
});
export type EligibilityEvaluatedEvent = z.infer<typeof EligibilityEvaluatedEvent>;

export const FraudScoreCalculatedEvent = BaseEvent.extend({
  type: z.literal('fraud-score-calculated'),
  payload: z.object({
    applicationId: z.string().uuid(),
    riskScore: z.number().int().min(0).max(100),
    riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    triggeredSignals: z.array(z.object({
      signalName: z.string(),
      contribution: z.number(),
      details: z.string(),
    })),
    hardBlocks: z.array(z.object({
      blockType: z.string(),
      message: z.string(),
    })),
  }),
});
export type FraudScoreCalculatedEvent = z.infer<typeof FraudScoreCalculatedEvent>;

export const DeficiencyRaisedEvent = BaseEvent.extend({
  type: z.literal('deficiency-raised'),
  payload: z.object({
    applicationId: z.string().uuid(),
    applicantId: z.string().uuid(),
    deficiencies: z.array(z.object({
      documentType: z.string(),
      reason: z.string(),
      deadline: z.string().datetime(),
    })),
    raisedBy: z.string().uuid(),
  }),
});
export type DeficiencyRaisedEvent = z.infer<typeof DeficiencyRaisedEvent>;

export const DisbursementTriggeredEvent = BaseEvent.extend({
  type: z.literal('disbursement-triggered'),
  payload: z.object({
    disbursementId: z.string().uuid(),
    applicationId: z.string().uuid(),
    applicantId: z.string().uuid(),
    schemeId: z.string().uuid(),
    amount: z.number().positive(),
    component: z.string(),
    installmentNumber: z.number().int().positive(),
  }),
});
export type DisbursementTriggeredEvent = z.infer<typeof DisbursementTriggeredEvent>;

export const SeedingAlertEvent = BaseEvent.extend({
  type: z.literal('seeding-alert'),
  payload: z.object({
    applicantId: z.string().uuid(),
    applicationId: z.string().uuid(),
    seedingStatus: z.enum(['INACTIVE', 'NEVER_ENABLED']),
    daysUntilDisbursement: z.number().int(),
    alertLevel: z.enum(['INITIAL', 'FOLLOW_UP', 'ESCALATION', 'FINAL']),
  }),
});
export type SeedingAlertEvent = z.infer<typeof SeedingAlertEvent>;

/** Union of all event types */
export const SfmsEvent = z.discriminatedUnion('type', [
  DocumentUploadedEvent,
  OcrCompleteEvent,
  ApplicationSubmittedEvent,
  ApplicationStatusChangedEvent,
  EligibilityEvaluatedEvent,
  FraudScoreCalculatedEvent,
  DeficiencyRaisedEvent,
  DisbursementTriggeredEvent,
  SeedingAlertEvent,
]);
export type SfmsEvent = z.infer<typeof SfmsEvent>;

/** Kafka topic names */
export const KAFKA_TOPICS = {
  DOCUMENT_UPLOADED: 'document-uploaded',
  OCR_COMPLETE: 'ocr-complete',
  APPLICATION_SUBMITTED: 'application-submitted',
  APPLICATION_STATUS_CHANGED: 'application-status-changed',
  ELIGIBILITY_EVALUATED: 'eligibility-evaluated',
  FRAUD_SCORE_CALCULATED: 'fraud-score-calculated',
  DEFICIENCY_RAISED: 'deficiency-raised',
  DISBURSEMENT_TRIGGERED: 'disbursement-triggered',
  SEEDING_ALERT: 'seeding-alert',
} as const;

/** Dead letter queue topic for a given topic */
export function dlqTopic(topic: string): string {
  return `${topic}.dlq`;
}
