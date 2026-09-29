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

export const AddressSchema = z.object({
  id: UuidSchema,
  applicantId: UuidSchema,
  addressType: z.enum(['PERMANENT', 'CURRENT']),
  addressLine1: z.string(),
  addressLine2: z.string().optional().nullable(),
  villageTownCity: z.string(),
  district: z.string(),
  stateUtCode: z.string(),
  postalCode: z.string(),
  countryCode: z.string().default('IN'),
  verificationStatus: z.string().default('UNVERIFIED'),
});
export type Address = z.infer<typeof AddressSchema>;

export const EducationRecordSchema = z.object({
  id: UuidSchema,
  applicantId: UuidSchema,
  level: z.string(),
  qualification: z.string().optional().nullable(),
  institutionId: z.string().optional().nullable(),
  institutionName: z.string(),
  boardUniversity: z.string().optional().nullable(),
  academicYear: z.string().optional().nullable(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  marksObtained: z.number().optional().nullable(),
  marksMaximum: z.number().optional().nullable(),
  rawCgpa: z.number().optional().nullable(),
  gradingScale: z.number().optional().nullable(),
  convertedPercentage: z.number().optional().nullable(),
  conversionSource: z.string().optional().nullable(),
  conversionVerified: z.boolean().default(false),
  verificationStatus: z.string().default('UNVERIFIED'),
});
export type EducationRecord = z.infer<typeof EducationRecordSchema>;

export const DisabilityProfileSchema = z.object({
  id: UuidSchema,
  applicantId: UuidSchema,
  hasDisability: z.boolean(),
  disabilityType: z.string().optional().nullable(),
  disabilityPercentage: z.number().optional().nullable(),
  certificateReference: z.string().optional().nullable(),
  verificationStatus: z.string().default('UNVERIFIED'),
});
export type DisabilityProfile = z.infer<typeof DisabilityProfileSchema>;

export const GuardianProfileSchema = z.object({
  id: UuidSchema,
  applicantId: UuidSchema,
  guardianRelationship: z.string(),
  guardianName: z.string(),
  incomeSource: z.string().optional().nullable(),
  familyMemberCount: z.number().int().optional().nullable(),
  isSingleParent: z.boolean().default(false),
  isOrphan: z.boolean().default(false),
});
export type GuardianProfile = z.infer<typeof GuardianProfileSchema>;

export const BankAccountSummarySchema = z.object({
  id: UuidSchema,
  applicantId: UuidSchema,
  accountNumberEncrypted: z.string(), // Consider omitting entirely from some DTOs
  ifscCode: IfscCodeSchema,
  bankName: z.string(),
  accountHolderName: z.string(),
  aadhaarSeedingStatus: z.enum(['ACTIVE', 'INACTIVE', 'NEVER_ENABLED', 'UNKNOWN']).default('UNKNOWN'),
  isPrimary: z.boolean().default(true),
  verificationStatus: z.string().default('UNVERIFIED'),
});
export type BankAccountSummary = z.infer<typeof BankAccountSummarySchema>;

export const ApplicantSchema = z.object({
  id: UuidSchema,
  aadhaarHash: z.string(),
  fullName: z.string(),
  originalName: z.string().optional().nullable(),
  normalizedName: z.string().optional().nullable(),
  dob: z.date(),
  gender: z.string(),
  applicantType: z.string().optional().nullable(),
  identityVerificationStatus: z.string().default('UNVERIFIED'),
  contactMobile: IndianMobileSchema.optional().nullable(),
  mobileVerificationStatus: z.string().default('UNVERIFIED'),
  contactEmail: z.string().email().optional().nullable(),
  emailVerificationStatus: z.string().default('UNVERIFIED'),
  preferredLanguage: z.string().default('en'),
  communityStatus: z.string().default('SELF_DECLARED'),
  communityName: z.string().optional().nullable(),
  pvtgStatus: z.string().default('NOT_APPLICABLE'),
  communityVerificationStatus: z.string().default('PENDING'),
  communityVerificationSource: z.string().optional().nullable(),
  communityVerifiedAt: z.date().optional().nullable(),
  domicileStateUtCode: z.string().optional().nullable(),
  profileVersion: z.number().int().default(1),
  profileCompletion: z.number().int().default(0),
  eKycVerified: z.boolean().default(false),
});
export type Applicant = z.infer<typeof ApplicantSchema>;

export const ApplicationVersionSchema = z.object({
  id: UuidSchema,
  applicationId: UuidSchema,
  versionNumber: z.number().int().min(1),
  formData: z.record(z.unknown()),
  profileSnapshot: z.record(z.unknown()).optional().nullable(),
  profileVersionSnapshot: z.number().int().optional().nullable(),
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
  profileSnapshot: z.record(z.unknown()).optional().nullable(),
  profileVersionSnapshot: z.number().int().optional().nullable(),
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

