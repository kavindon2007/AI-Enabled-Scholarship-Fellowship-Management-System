/**
 * @module schemas
 * Shared Zod validation schemas referenced across services.
 */

import { z } from 'zod';
import { 
  APPLICATION_STATUSES, SCHEME_CODES, SCHEME_TYPES, SELECTION_METHODS,
  DOC_TYPES, OCR_STATUSES, VERIFICATION_STATUSES, DOCUMENT_SOURCES,
  ELIGIBILITY_OUTCOMES, EVALUATOR_TYPES, SEEDING_STATUSES, 
  DISBURSEMENT_STATUSES, DISBURSEMENT_COMPONENTS, GRIEVANCE_CATEGORIES,
  GRIEVANCE_STATUSES, OFFICER_ROLES, RISK_LEVELS, RULE_TYPES, 
  RULE_OPERATORS, FAILURE_MODES 
} from '../enums.js';

/** Academic year format: "2025-26" */
export const AcademicYearSchema = z.string().regex(
  /^\d{4}-\d{2}$/,
  'Academic year must be in format YYYY-YY (e.g. 2025-26)',
);

/** Indian mobile number: 10 digits starting with 6-9 */
export const IndianMobileSchema = z.string().regex(
  /^[6-9]\d{9}$/,
  'Must be a valid 10-digit Indian mobile number',
);

/** IFSC code format */
export const IfscCodeSchema = z.string().regex(
  /^[A-Z]{4}0[A-Z0-9]{6}$/,
  'Must be a valid IFSC code',
);

/** UUID string validation */
export const UuidSchema = z.string().uuid();

/** Pagination query params */
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

/** Sort query params */
export const SortQuerySchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
export type SortQuery = z.infer<typeof SortQuerySchema>;

/** Date range filter */
export const DateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});
export type DateRange = z.infer<typeof DateRangeSchema>;

/** Eligibility rule configuration shape (stored in schemes.eligibility_rules) */
export const EligibilityRuleSchema = z.object({
  ruleId: z.string(),
  ruleType: z.enum(RULE_TYPES),
  sourceField: z.string(),
  operator: z.enum(RULE_OPERATORS),
  value: z.unknown(),
  failureMode: z.enum(FAILURE_MODES),
  failureMessage: z.object({
    en: z.string(),
    hi: z.string().optional(),
  }),
  exceptionRules: z.array(z.object({
    condition: z.string(),
    overrideValue: z.unknown(),
  })).optional(),
});
export type EligibilityRule = z.infer<typeof EligibilityRuleSchema>;

/** Per-rule verdict in eligibility evaluation */
export const RuleVerdictSchema = z.object({
  ruleId: z.string(),
  ruleType: z.string(),
  verdict: z.enum(ELIGIBILITY_OUTCOMES),
  actualValue: z.unknown(),
  expectedValue: z.unknown(),
  message: z.string().optional(),
});
export type RuleVerdict = z.infer<typeof RuleVerdictSchema>;

// ─── DOMAIN ENTITY SCHEMAS ───

export const UserSchema = z.object({
  id: UuidSchema,
  nicSsoId: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(OFFICER_ROLES),
  assignedSchemes: z.array(z.string()),
  assignedStates: z.array(z.string()),
  isActive: z.boolean(),
  createdAt: z.date(),
});
export type User = z.infer<typeof UserSchema>;

export const ApplicantSchema = z.object({
  id: UuidSchema,
  aadhaarHash: z.string(),
  name: z.string(),
  dob: z.date(),
  gender: z.string(),
  stateOfDomicile: z.string(),
  casteCategory: z.string(),
  contactMobile: IndianMobileSchema.optional(),
  contactEmail: z.string().email().optional(),
  eKycVerified: z.boolean(),
});
export type Applicant = z.infer<typeof ApplicantSchema>;

export const ApplicationVersionSchema = z.object({
  id: UuidSchema,
  applicationId: UuidSchema,
  versionNumber: z.number().int().min(1),
  formData: z.record(z.unknown()),
  status: z.enum(APPLICATION_STATUSES),
  riskScore: z.number().int().min(0).max(100),
  riskFlags: z.record(z.unknown()).optional().nullable(),
  snapshotAt: z.date(),
  actorId: UuidSchema.optional().nullable(),
});
export type ApplicationVersion = z.infer<typeof ApplicationVersionSchema>;

export const ApplicationSchema = z.object({
  id: UuidSchema,
  schemeId: UuidSchema,
  schemeVersionId: UuidSchema.optional().nullable(),
  applicantId: UuidSchema,
  academicYear: AcademicYearSchema,
  formData: z.record(z.unknown()),
  status: z.enum(APPLICATION_STATUSES),
  version: z.number().int().min(1),
  createdAt: z.date(),
  lastUpdatedAt: z.date(),
  submittedAt: z.date().optional().nullable(),
});
export type Application = z.infer<typeof ApplicationSchema>;

export const SchemeVersionSchema = z.object({
  id: UuidSchema,
  schemeId: UuidSchema,
  versionNumber: z.number().int().min(1),
  eligibilityRules: z.array(EligibilityRuleSchema),
  formConfig: z.record(z.unknown()),
  docChecklist: z.array(z.string()),
  effectiveFrom: z.date(),
  effectiveTo: z.date().optional().nullable(),
});
export type SchemeVersion = z.infer<typeof SchemeVersionSchema>;

export const SchemeSchema = z.object({
  id: UuidSchema,
  schemeCode: z.enum(SCHEME_CODES),
  schemeName: z.string(),
  schemeType: z.enum(SCHEME_TYPES),
  isActive: z.boolean(),
  applicationWindowStart: z.date(),
  applicationWindowEnd: z.date(),
});
export type Scheme = z.infer<typeof SchemeSchema>;

export const DocumentVersionSchema = z.object({
  id: UuidSchema,
  documentId: UuidSchema,
  versionNumber: z.number().int().min(1),
  storagePath: z.string(),
  originalFilename: z.string(),
  fileSizeBytes: z.number().int(),
  mimeType: z.string(),
  checksumSha256: z.string().optional().nullable(),
  uploadedAt: z.date(),
  uploadedBy: UuidSchema.optional().nullable(),
});
export type DocumentVersion = z.infer<typeof DocumentVersionSchema>;

export const DocumentSchema = z.object({
  id: UuidSchema,
  applicationId: UuidSchema,
  docType: z.enum(DOC_TYPES),
  storagePath: z.string(),
  originalFilename: z.string(),
  fileSizeBytes: z.number().int(),
  mimeType: z.string(),
  checksumSha256: z.string().optional().nullable(),
  ocrStatus: z.enum(OCR_STATUSES),
  verifiedStatus: z.enum(VERIFICATION_STATUSES),
  version: z.number().int().min(1),
  uploadedAt: z.date(),
});
export type Document = z.infer<typeof DocumentSchema>;

export const AuditEventSchema = z.object({
  id: UuidSchema,
  correlationId: z.string().optional().nullable(),
  actorId: UuidSchema.optional().nullable(),
  actorType: z.enum(['APPLICANT', 'OFFICER', 'SYSTEM']).optional().nullable(),
  action: z.string(),
  resourceType: z.string(),
  resourceId: z.string().optional().nullable(),
  details: z.record(z.unknown()).optional().nullable(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.date(),
});
export type AuditEvent = z.infer<typeof AuditEventSchema>;

export const WorkflowTransitionSchema = z.object({
  id: UuidSchema,
  applicationId: UuidSchema,
  applicationVersion: z.number().int().min(1),
  fromState: z.enum(APPLICATION_STATUSES),
  toState: z.enum(APPLICATION_STATUSES),
  actorId: UuidSchema,
  reason: z.string().optional().nullable(),
  transitionedAt: z.date(),
});
export type WorkflowTransition = z.infer<typeof WorkflowTransitionSchema>;

export const VerificationRecordSchema = z.object({
  id: UuidSchema,
  documentId: UuidSchema.optional().nullable(),
  applicationId: UuidSchema,
  entityType: z.string(),
  status: z.enum(VERIFICATION_STATUSES),
  verifiedBy: UuidSchema,
  verifiedAt: z.date(),
  evidence: z.record(z.unknown()).optional().nullable(),
});
export type VerificationRecord = z.infer<typeof VerificationRecordSchema>;

