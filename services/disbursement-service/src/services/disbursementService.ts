import { DisbursementRepository } from '../repositories/disbursementRepository';
import { BankAccountRepository } from '../repositories/bankAccountRepository';
import { PfmsService } from './pfmsService';
import { NpciBaseService } from './npciBaseService';
import { PennyDropService } from './pennyDropService';
import { ApplicationId, Disbursement, DisbursementId } from '../types';
import { ConflictError, NotFoundError } from '../errors/AppError';
import { InitiateDisbursementRequest } from '../schemas/disbursementSchemas';

export class DisbursementService {
  constructor(
    private disbursementRepo: DisbursementRepository,
    private bankAccountRepo: BankAccountRepository,
    private pfmsService: PfmsService,
    private npciService: NpciBaseService,
    private pennyDropService: PennyDropService
  ) {}

  async initiateDisbursement(data: InitiateDisbursementRequest): Promise<Disbursement> {
    const appId = data.applicationId as ApplicationId;
    
    // Validate bank account active status
    const account = await this.bankAccountRepo.findByApplicationId(appId);
    if (!account) {
      throw new NotFoundError('Bank account details not found for application');
    }

    if (!account.aadhaarSeeded || account.seedingStatus !== 'ACTIVE') {
      throw new ConflictError('Aadhaar not seeded with bank account');
    }

    // Create disbursement record
    const disbursement = await this.disbursementRepo.create({
      applicationId: appId,
      amount: data.amount,
      schemeId: data.schemeId,
      status: 'INITIATED'
    });

    // Call PFMS API mock
    const pfmsResult = await this.pfmsService.initiateTransfer(
      disbursement.id,
      disbursement.amount,
      account
    );

    // Update status
    if (pfmsResult.success) {
      return this.disbursementRepo.updateStatus(
        disbursement.id as DisbursementId,
        'PROCESSING',
        pfmsResult.transactionId
      ) as Promise<Disbursement>;
    } else {
      return this.disbursementRepo.updateStatus(
        disbursement.id as DisbursementId,
        'FAILED',
        undefined,
        pfmsResult.error
      ) as Promise<Disbursement>;
    }
  }

  async getDisbursementsByApplication(applicationId: string): Promise<Disbursement[]> {
    return this.disbursementRepo.getByApplicationId(applicationId as ApplicationId);
  }
}
