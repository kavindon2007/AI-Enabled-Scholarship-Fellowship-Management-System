export class PennyDropService {
  async performPennyDrop(accountNumber: string, ifscCode: string): Promise<{ success: boolean; nameMatchScore?: number }> {
    // Mock Penny Drop testing
    const success = Math.random() > 0.05;
    return { success, nameMatchScore: success ? 95.5 : undefined };
  }
}
