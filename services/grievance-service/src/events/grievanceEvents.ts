import { GrievanceRecord } from "../types";

export const grievanceEvents = {
  async publishGrievanceCreated(grievance: GrievanceRecord): Promise<void> {
    console.log(`[Kafka Producer] Publishing GRIEVANCE_CREATED for ID: ${grievance.id}`);
  },

  async publishGrievanceResolved(grievance: GrievanceRecord): Promise<void> {
    console.log(`[Kafka Producer] Publishing GRIEVANCE_RESOLVED for ID: ${grievance.id}`);
  },

  async publishGrievanceEscalated(grievance: GrievanceRecord, reason: string): Promise<void> {
    console.log(`[Kafka Producer] Publishing GRIEVANCE_ESCALATED for ID: ${grievance.id}, Reason: ${reason}`);
  }
};
