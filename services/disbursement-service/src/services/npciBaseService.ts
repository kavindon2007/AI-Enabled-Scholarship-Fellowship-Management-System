export class NpciBaseService {
  async checkAadhaarSeeding(aadhaarNumber: string): Promise<{ isSeeded: boolean; lastUpdated: Date }> {
    // Mock NPCI Base API seeding check
    const isSeeded = Math.random() > 0.2;
    return { isSeeded, lastUpdated: new Date() };
  }
}
