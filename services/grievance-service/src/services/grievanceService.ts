import { grievanceRepository } from "../repositories/grievanceRepository";
import { nlpClassifierService } from "./nlpClassifierService";
import { slaEngine } from "./slaEngine";
import { cpgramsService } from "./cpgramsService";
import { grievanceEvents } from "../events/grievanceEvents";
import { NotFoundError, ConflictError } from "../errors/AppError";
import {
  CreateGrievanceRequest,
  ResolveGrievanceRequest,
  EscalateGrievanceRequest
} from "../schemas/grievanceSchemas";
import { GrievanceRecord, GrievanceId, OfficerId, ApplicantId } from "../types";

export const grievanceService = {
  async createGrievance(data: CreateGrievanceRequest): Promise<GrievanceRecord> {
    const analysis = await nlpClassifierService.analyzeText(data.description);
    const now = new Date();
    const slaBreachAt = slaEngine.calculateSlaBreachTime(analysis.suggestedPriority, now);

    const record = await grievanceRepository.create({
      applicantId: data.applicantId as ApplicantId,
      category: data.category,
      description: data.description,
      status: "OPEN",
      priority: analysis.suggestedPriority,
      assignedOfficerId: null,
      cpgramsRegistrationNumber: null,
      resolutionText: null,
      slaBreachAt,
      isEscalated: analysis.isEscalationRisk,
    });

    await grievanceEvents.publishGrievanceCreated(record);
    return record;
  },

  async getGrievanceById(id: GrievanceId): Promise<GrievanceRecord> {
    const record = await grievanceRepository.findById(id);
    if (!record) {
      throw new NotFoundError(`Grievance with ID ${id} not found`);
    }
    return record;
  },

  async resolveGrievance(id: GrievanceId, data: ResolveGrievanceRequest): Promise<GrievanceRecord> {
    const grievance = await this.getGrievanceById(id);

    if (grievance.status === "CLOSED" || grievance.status === "RESOLVED") {
      throw new ConflictError("Grievance is already resolved or closed");
    }

    const updated = await grievanceRepository.update(id, {
      status: "RESOLVED",
      resolutionText: data.resolutionText,
      assignedOfficerId: data.officerId as OfficerId,
    });

    if (!updated) throw new NotFoundError();

    await grievanceEvents.publishGrievanceResolved(updated);
    return updated;
  },

  async escalateGrievance(id: GrievanceId, data: EscalateGrievanceRequest): Promise<GrievanceRecord> {
    const grievance = await this.getGrievanceById(id);

    if (grievance.status === "CLOSED" || grievance.status === "RESOLVED") {
      throw new ConflictError("Cannot escalate a resolved grievance");
    }

    const updated = await grievanceRepository.update(id, {
      status: "ESCALATED",
      isEscalated: true,
      priority: "URGENT",
    });

    if (!updated) throw new NotFoundError();

    await grievanceEvents.publishGrievanceEscalated(updated, data.reason);
    return updated;
  },

  async forwardToCpgrams(id: GrievanceId): Promise<GrievanceRecord> {
    const grievance = await this.getGrievanceById(id);

    if (grievance.cpgramsRegistrationNumber) {
      throw new ConflictError("Already forwarded to CPGRAMS");
    }

    const cpgramsNo = await cpgramsService.forwardGrievance(grievance);

    const updated = await grievanceRepository.update(id, {
      status: "FORWARDED_TO_CPGRAMS",
      cpgramsRegistrationNumber: cpgramsNo,
    });

    if (!updated) throw new NotFoundError();
    return updated;
  },

  async getQueue(status?: any, limit?: number, page?: number): Promise<GrievanceRecord[]> {
    const offset = page && limit ? (page - 1) * limit : 0;
    return grievanceRepository.findQueue(status, limit || 20, offset);
  }
};
