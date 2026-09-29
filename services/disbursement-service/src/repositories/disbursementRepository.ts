import { Disbursement, DisbursementId, ApplicationId } from '../types';

export class DisbursementRepository {
  private disbursements: Disbursement[] = [];

  async create(disbursement: Omit<Disbursement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Disbursement> {
    const newDisbursement: Disbursement = {
      ...disbursement,
      id: crypto.randomUUID() as DisbursementId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.disbursements.push(newDisbursement);
    return newDisbursement;
  }

  async getByApplicationId(applicationId: ApplicationId): Promise<Disbursement[]> {
    return this.disbursements.filter(d => d.applicationId === applicationId);
  }

  async updateStatus(
    id: DisbursementId,
    status: Disbursement['status'],
    pfmsTransactionId?: string,
    failureReason?: string
  ): Promise<Disbursement | null> {
    const index = this.disbursements.findIndex(d => d.id === id);
    if (index === -1) return null;
    
    this.disbursements[index] = {
      ...this.disbursements[index],
      status,
      pfmsTransactionId: pfmsTransactionId ?? this.disbursements[index].pfmsTransactionId,
      failureReason: failureReason ?? this.disbursements[index].failureReason,
      updatedAt: new Date()
    };
    return this.disbursements[index];
  }
}
