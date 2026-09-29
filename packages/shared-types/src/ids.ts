/**
 * @module ids
 * Branded types for domain IDs — prevents accidentally passing
 * one entity's ID where another is expected.
 */

declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };

export type ApplicationId = Brand<string, 'ApplicationId'>;
export type SchemeId = Brand<string, 'SchemeId'>;
export type ApplicantId = Brand<string, 'ApplicantId'>;
export type DocumentId = Brand<string, 'DocumentId'>;
export type GrievanceId = Brand<string, 'GrievanceId'>;
export type DisbursementId = Brand<string, 'DisbursementId'>;
export type UserId = Brand<string, 'UserId'>;
export type BankAccountId = Brand<string, 'BankAccountId'>;
export type EligibilityResultId = Brand<string, 'EligibilityResultId'>;

/** Cast a raw string to a branded ID — use at trust boundaries only */
export function toApplicationId(id: string): ApplicationId {
  return id as ApplicationId;
}
export function toSchemeId(id: string): SchemeId {
  return id as SchemeId;
}
export function toApplicantId(id: string): ApplicantId {
  return id as ApplicantId;
}
export function toDocumentId(id: string): DocumentId {
  return id as DocumentId;
}
export function toGrievanceId(id: string): GrievanceId {
  return id as GrievanceId;
}
export function toDisbursementId(id: string): DisbursementId {
  return id as DisbursementId;
}
export function toUserId(id: string): UserId {
  return id as UserId;
}
export function toBankAccountId(id: string): BankAccountId {
  return id as BankAccountId;
}
