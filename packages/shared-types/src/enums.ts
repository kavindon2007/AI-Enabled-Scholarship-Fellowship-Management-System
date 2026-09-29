/**
 * @module enums
 * Domain enumerations for AI-SFMS — single source of truth.
 * All services import these rather than defining their own.
 */

export const APPLICATION_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'AI_SCREENING',
  'DEFICIENCY_RAISED',
  'RESUBMITTED',
  'OFFICER_REVIEW',
  'APPROVED',
  'REJECTED',
  'SHORTLISTED',
  'SELECTED',
  'DISBURSED',
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const SCHEME_CODES = [
  'PREMATRIC',
  'POSTMATRIC',
  'NFST',
  'NOS',
  'TOPCLASS',
] as const;
export type SchemeCode = (typeof SCHEME_CODES)[number];

export const SCHEME_TYPES = [
  'CENTRALLY_SPONSORED',
  'CENTRAL_SECTOR',
] as const;
export type SchemeType = (typeof SCHEME_TYPES)[number];

export const SELECTION_METHODS = [
  'MERIT',
  'INTERVIEW',
  'FIRST_COME',
] as const;
export type SelectionMethod = (typeof SELECTION_METHODS)[number];

export const DOC_TYPES = [
  'ST_CERTIFICATE',
  'INCOME_CERTIFICATE',
  'MARKSHEET_X',
  'MARKSHEET_XII',
  'MARKSHEET_GRADUATION',
  'MARKSHEET_PG',
  'AADHAAR_CARD',
  'DOMICILE_CERTIFICATE',
  'ADMISSION_LETTER',
  'DISABILITY_CERTIFICATE',
  'PVTG_CERTIFICATE',
  'PASSPORT',
  'TEST_SCORECARD',
  'PHD_CERTIFICATE',
  'PROGRESS_REPORT',
  'JOINING_REPORT',
  'COMPLETION_CERTIFICATE',
  'PHOTOGRAPH',
] as const;
export type DocType = (typeof DOC_TYPES)[number];

export const OCR_STATUSES = [
  'PENDING',
  'PROCESSING',
  'COMPLETE',
  'FAILED',
] as const;
export type OcrStatus = (typeof OCR_STATUSES)[number];

export const VERIFICATION_STATUSES = [
  'PENDING',
  'VERIFIED',
  'REJECTED',
  'FLAGGED',
] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const DOCUMENT_SOURCES = [
  'MANUAL_UPLOAD',
  'DIGILOCKER',
] as const;
export type DocumentSource = (typeof DOCUMENT_SOURCES)[number];

export const ELIGIBILITY_OUTCOMES = [
  'PASS',
  'FAIL',
  'DEFICIENT',
] as const;
export type EligibilityOutcome = (typeof ELIGIBILITY_OUTCOMES)[number];

export const EVALUATOR_TYPES = [
  'AI',
  'OFFICER',
] as const;
export type EvaluatorType = (typeof EVALUATOR_TYPES)[number];

export const SEEDING_STATUSES = [
  'ACTIVE',
  'INACTIVE',
  'NEVER_ENABLED',
  'UNKNOWN',
] as const;
export type SeedingStatus = (typeof SEEDING_STATUSES)[number];

export const DISBURSEMENT_STATUSES = [
  'PENDING',
  'SEEDING_CHECK',
  'SEEDING_FAILED',
  'INITIATED',
  'CONFIRMED',
  'FAILED',
  'ALTERNATE_ROUTED',
] as const;
export type DisbursementStatus = (typeof DISBURSEMENT_STATUSES)[number];

export const DISBURSEMENT_COMPONENTS = [
  'TUITION',
  'MAINTENANCE',
  'CONTINGENCY',
  'HRA',
  'DISABILITY_ALLOWANCE',
  'BOOKS_ADHOC',
] as const;
export type DisbursementComponent = (typeof DISBURSEMENT_COMPONENTS)[number];

export const GRIEVANCE_CATEGORIES = [
  'TECHNICAL',
  'DOCUMENT_UPLOAD',
  'ELIGIBILITY_DISPUTE',
  'PAYMENT_ISSUE',
  'STATUS_QUERY',
  'SELECTION_DISPUTE',
  'OTHER',
] as const;
export type GrievanceCategory = (typeof GRIEVANCE_CATEGORIES)[number];

export const GRIEVANCE_STATUSES = [
  'OPEN',
  'ACKNOWLEDGED',
  'IN_PROGRESS',
  'RESOLVED',
  'ESCALATED',
  'CLOSED',
] as const;
export type GrievanceStatus = (typeof GRIEVANCE_STATUSES)[number];

export const OFFICER_ROLES = [
  'DATA_ENTRY_OPERATOR',
  'SCRUTINY_OFFICER',
  'SECTION_OFFICER',
  'JOINT_SECRETARY',
  'DIRECTOR',
  'FINANCE_OFFICER',
  'SYSTEM_ADMIN',
  'STATE_NODAL_OFFICER',
  'INSTITUTION_NODAL_OFFICER',
  'EMBASSY_OFFICER',
] as const;
export type OfficerRole = (typeof OFFICER_ROLES)[number];

export const RISK_LEVELS = [
  'LOW',
  'MEDIUM',
  'HIGH',
] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const RULE_TYPES = [
  'INCOME_LIMIT',
  'CASTE_CHECK',
  'COURSE_LEVEL',
  'INSTITUTION_CHECK',
  'MARKS_THRESHOLD',
  'AGE_LIMIT',
  'EXISTING_SCHOLARSHIP_CHECK',
  'DOMICILE_CHECK',
  'FAMILY_BENEFIT_LIMIT',
  'COURSE_STREAM_CHECK',
] as const;
export type RuleType = (typeof RULE_TYPES)[number];

export const RULE_OPERATORS = [
  'LTE',
  'GTE',
  'EQ',
  'IN',
  'NOT_IN',
  'REGEX',
  'CUSTOM',
] as const;
export type RuleOperator = (typeof RULE_OPERATORS)[number];

export const FAILURE_MODES = [
  'FAIL',
  'DEFICIENT',
] as const;
export type FailureMode = (typeof FAILURE_MODES)[number];

/** Maps risk score to risk level */
export function riskScoreToLevel(score: number): RiskLevel {
  if (score <= 30) return 'LOW';
  if (score <= 69) return 'MEDIUM';
  return 'HIGH';
}
