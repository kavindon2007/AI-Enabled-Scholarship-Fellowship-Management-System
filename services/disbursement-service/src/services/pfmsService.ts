export interface PfmsProvider {
  initiateTransfer(disbursementId: string, amount: number, accountDetails: any): Promise<{ success: boolean; transactionId?: string; error?: string }>;
}

export class MockPfmsProvider implements PfmsProvider {
  constructor(private readonly deterministicMode: 'SUCCESS' | 'FAILURE' | 'RANDOM' = 'SUCCESS') {}

  async initiateTransfer(disbursementId: string, amount: number, accountDetails: any): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    if (this.deterministicMode === 'SUCCESS') {
      return { success: true, transactionId: `PFMS-${crypto.randomUUID()}` };
    } else if (this.deterministicMode === 'FAILURE') {
      return { success: false, error: 'PFMS_REJECTED_SIMULATED' };
    }
    
    // Fallback random mode for specific testing scenarios
    const isSuccess = Math.random() > 0.1;
    if (isSuccess) {
      return { success: true, transactionId: `PFMS-${crypto.randomUUID()}` };
    }
    return { success: false, error: 'PFMS_REJECTED' };
  }
}

export class PfmsService {
  constructor(private provider: PfmsProvider = new MockPfmsProvider('SUCCESS')) {}

  async initiateTransfer(disbursementId: string, amount: number, accountDetails: any): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    return this.provider.initiateTransfer(disbursementId, amount, accountDetails);
  }
}
