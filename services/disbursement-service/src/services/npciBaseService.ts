export interface NpciBaseProvider {
  checkAadhaarSeeding(aadhaarNumber: string): Promise<{ isSeeded: boolean; lastUpdated: Date }>;
}

export class MockNpciBaseProvider implements NpciBaseProvider {
  constructor(private readonly deterministicMode: 'SEEDED' | 'NOT_SEEDED' | 'RANDOM' = 'SEEDED') {}

  async checkAadhaarSeeding(aadhaarNumber: string): Promise<{ isSeeded: boolean; lastUpdated: Date }> {
    if (this.deterministicMode === 'SEEDED') {
      return { isSeeded: true, lastUpdated: new Date() };
    } else if (this.deterministicMode === 'NOT_SEEDED') {
      return { isSeeded: false, lastUpdated: new Date() };
    }

    // Fallback random mode for specific testing scenarios
    const isSeeded = Math.random() > 0.2;
    return { isSeeded, lastUpdated: new Date() };
  }
}

export class NpciBaseService {
  constructor(private provider: NpciBaseProvider = new MockNpciBaseProvider('SEEDED')) {}

  async checkAadhaarSeeding(aadhaarNumber: string): Promise<{ isSeeded: boolean; lastUpdated: Date }> {
    return this.provider.checkAadhaarSeeding(aadhaarNumber);
  }
}
