export class ScholarshipCalculator {
  calculateAmount(schemeId: string, criteria: any): number {
    // Mock calculation logic across schemes
    if (schemeId === 'pre-matric') return 5000;
    if (schemeId === 'post-matric') return 12000;
    return 10000; // default
  }
}
