/**
 * @module schemas
 * Shared Zod validation schemas referenced across services.
 */

import { z } from 'zod';

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
  ruleType: z.enum([
    'INCOME_LIMIT', 'CASTE_CHECK', 'COURSE_LEVEL', 'INSTITUTION_CHECK',
    'MARKS_THRESHOLD', 'AGE_LIMIT', 'EXISTING_SCHOLARSHIP_CHECK',
    'DOMICILE_CHECK', 'FAMILY_BENEFIT_LIMIT', 'COURSE_STREAM_CHECK',
  ]),
  sourceField: z.string(),
  operator: z.enum(['LTE', 'GTE', 'EQ', 'IN', 'NOT_IN', 'REGEX', 'CUSTOM']),
  value: z.unknown(),
  failureMode: z.enum(['FAIL', 'DEFICIENT']),
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
  verdict: z.enum(['PASS', 'FAIL', 'DEFICIENT']),
  actualValue: z.unknown(),
  expectedValue: z.unknown(),
  message: z.string().optional(),
});
export type RuleVerdict = z.infer<typeof RuleVerdictSchema>;
