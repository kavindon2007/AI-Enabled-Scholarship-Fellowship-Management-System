import { GrievanceRecord } from "../types";
import { config } from "../config";

export const cpgramsService = {
  async forwardGrievance(grievance: GrievanceRecord): Promise<string> {
    // In a real scenario, this would make an HTTP request to CPGRAMS
    console.log(`Forwarding grievance ${grievance.id} to CPGRAMS API at ${config.CPGRAMS_API_URL}`);

    // Simulating API latency and response
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return a mock registration number
        const mockRegNo = `CPGRAMS-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000)}`;
        resolve(mockRegNo);
      }, 500);
    });
  }
};
