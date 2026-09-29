import { v4 as uuidv4 } from "uuid";
import { GrievanceRecord, GrievanceId, TicketStatus, ApplicantId } from "../types";

// In-memory mock database
const db = new Map<GrievanceId, GrievanceRecord>();

export const grievanceRepository = {
  async create(data: Omit<GrievanceRecord, "id" | "createdAt" | "updatedAt">): Promise<GrievanceRecord> {
    const id = uuidv4() as GrievanceId;
    const now = new Date();

    const record: GrievanceRecord = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };

    db.set(id, record);
    return record;
  },

  async findById(id: GrievanceId): Promise<GrievanceRecord | null> {
    return db.get(id) || null;
  },

  async update(id: GrievanceId, data: Partial<GrievanceRecord>): Promise<GrievanceRecord | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated: GrievanceRecord = {
      ...existing,
      ...data,
      updatedAt: new Date()
    };

    db.set(id, updated);
    return updated;
  },

  async findQueue(status?: TicketStatus, limit: number = 20, offset: number = 0): Promise<GrievanceRecord[]> {
    let records = Array.from(db.values());

    if (status) {
      records = records.filter(r => r.status === status);
    }

    // Sort by created at desc
    records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return records.slice(offset, offset + limit);
  }
};
