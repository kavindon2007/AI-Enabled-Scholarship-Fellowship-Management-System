export type ApplicationId = string & { readonly __brand: "ApplicationId" };
export type DisbursementId = string & { readonly __brand: "DisbursementId" };

export interface BankAccount {
  id: string;
  applicationId: ApplicationId;
  accountNumberHash: string; // Hashed/encrypted representation
  ifscCode: string;
  aadhaarSeeded: boolean;
  seedingStatus: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'FAILED';
  lastSeedingCheck: Date;
  pennyDropStatus: 'SUCCESS' | 'FAILED' | 'PENDING' | 'NOT_INITIATED';
}

export interface Disbursement {
  id: DisbursementId;
  applicationId: ApplicationId;
  amount: number;
  schemeId: string;
  status: 'PENDING' | 'INITIATED' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  pfmsTransactionId?: string;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
