import { GrievanceRecord } from "../types";
import { config } from "../config";

export interface CpgramsProvider {
  forwardGrievance(grievance: GrievanceRecord): Promise<string>;
}

export class MockCpgramsProvider implements CpgramsProvider {
  constructor(private readonly deterministicMode: 'SUCCESS' | 'DELAYED' | 'ERROR' = 'SUCCESS') {}

  async forwardGrievance(grievance: GrievanceRecord): Promise<string> {
    console.log(`[Mock CPGRAMS] Forwarding grievance ${grievance.id} in ${this.deterministicMode} mode.`);
    
    if (this.deterministicMode === 'SUCCESS') {
      return `CPGRAMS-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000)}`;
    } else if (this.deterministicMode === 'DELAYED') {
      return new Promise((resolve) => {
        setTimeout(() => resolve(`CPGRAMS-DELAYED-${new Date().getFullYear()}`), 2000);
      });
    } else {
      throw new Error("CPGRAMS_SIMULATED_ERROR");
    }
  }
}

export const cpgramsProvider: CpgramsProvider = new MockCpgramsProvider('SUCCESS');

export const cpgramsService = {
  async forwardGrievance(grievance: GrievanceRecord): Promise<string> {
    return cpgramsProvider.forwardGrievance(grievance);
  }
};
