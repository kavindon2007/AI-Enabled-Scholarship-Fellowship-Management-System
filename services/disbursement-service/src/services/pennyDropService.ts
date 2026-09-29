export interface PennyDropProvider {
  performPennyDrop(accountNumber: string, ifscCode: string): Promise<{ success: boolean; nameMatchScore?: number }>;
}

export class MockPennyDropProvider implements PennyDropProvider {
  constructor(private readonly deterministicMode: 'SUCCESS' | 'FAILURE' | 'RANDOM' = 'SUCCESS') {}

  async performPennyDrop(accountNumber: string, ifscCode: string): Promise<{ success: boolean; nameMatchScore?: number }> {
    if (this.deterministicMode === 'SUCCESS') {
      return { success: true, nameMatchScore: 95.5 };
    } else if (this.deterministicMode === 'FAILURE') {
      return { success: false };
    }
    
    // Fallback random mode for specific testing scenarios
    const success = Math.random() > 0.05;
    return { success, nameMatchScore: success ? 95.5 : undefined };
  }
}

export class PennyDropService {
  constructor(private provider: PennyDropProvider = new MockPennyDropProvider('SUCCESS')) {}

  async performPennyDrop(accountNumber: string, ifscCode: string): Promise<{ success: boolean; nameMatchScore?: number }> {
    return this.provider.performPennyDrop(accountNumber, ifscCode);
  }
}
