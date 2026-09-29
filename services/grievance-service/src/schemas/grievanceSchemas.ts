import { z } from "zod";
import { TICKET_STATUSES, PRIORITY_LEVELS, CATEGORY_TYPES } from "../types";

export const CreateGrievanceSchema = z.object({
  applicantId: z.string().uuid(),
  category: z.enum(CATEGORY_TYPES),
  description: z.string().min(10).max(2000),
});
export type CreateGrievanceRequest = z.infer<typeof CreateGrievanceSchema>;

export const ResolveGrievanceSchema = z.object({
  resolutionText: z.string().min(10).max(2000),
  officerId: z.string().uuid(),
});
export type ResolveGrievanceRequest = z.infer<typeof ResolveGrievanceSchema>;

export const EscalateGrievanceSchema = z.object({
  reason: z.string().min(5),
});
export type EscalateGrievanceRequest = z.infer<typeof EscalateGrievanceSchema>;

export const QueueQuerySchema = z.object({
  status: z.enum(TICKET_STATUSES).optional(),
  priority: z.enum(PRIORITY_LEVELS).optional(),
  page: z.string().regex(/^\d+$/).optional().transform(Number),
  limit: z.string().regex(/^\d+$/).optional().transform(Number),
});
export type QueueQueryRequest = z.infer<typeof QueueQuerySchema>;
