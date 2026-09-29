import { Request, Response, NextFunction } from "express";
import { grievanceService } from "../services/grievanceService";
import {
  CreateGrievanceSchema,
  ResolveGrievanceSchema,
  EscalateGrievanceSchema,
  QueueQuerySchema
} from "../schemas/grievanceSchemas";
import { GrievanceId, ApiResponse } from "../types";

export const grievanceController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = CreateGrievanceSchema.parse(req.body);
      const grievance = await grievanceService.createGrievance(parsedData);

      const response: ApiResponse<typeof grievance> = {
        data: grievance,
        error: null,
        meta: {
          requestId: (req.headers["x-request-id"] as string) || "sys-req",
          timestamp: new Date().toISOString()
        }
      };
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.ticketId as GrievanceId;
      const grievance = await grievanceService.getGrievanceById(id);

      const response: ApiResponse<typeof grievance> = {
        data: grievance,
        error: null,
        meta: {
          requestId: (req.headers["x-request-id"] as string) || "sys-req",
          timestamp: new Date().toISOString()
        }
      };
      res.json(response);
    } catch (e) {
      next(e);
    }
  },

  async resolve(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.ticketId as GrievanceId;
      const parsedData = ResolveGrievanceSchema.parse(req.body);
      const grievance = await grievanceService.resolveGrievance(id, parsedData);

      const response: ApiResponse<typeof grievance> = {
        data: grievance,
        error: null,
        meta: {
          requestId: (req.headers["x-request-id"] as string) || "sys-req",
          timestamp: new Date().toISOString()
        }
      };
      res.json(response);
    } catch (e) {
      next(e);
    }
  },

  async escalate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.ticketId as GrievanceId;
      const parsedData = EscalateGrievanceSchema.parse(req.body);
      const grievance = await grievanceService.escalateGrievance(id, parsedData);

      const response: ApiResponse<typeof grievance> = {
        data: grievance,
        error: null,
        meta: {
          requestId: (req.headers["x-request-id"] as string) || "sys-req",
          timestamp: new Date().toISOString()
        }
      };
      res.json(response);
    } catch (e) {
      next(e);
    }
  },

  async getQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedQuery = QueueQuerySchema.parse(req.query);
      const grievances = await grievanceService.getQueue(
        parsedQuery.status,
        parsedQuery.limit,
        parsedQuery.page
      );

      const response: ApiResponse<typeof grievances> = {
        data: grievances,
        error: null,
        meta: {
          requestId: (req.headers["x-request-id"] as string) || "sys-req",
          timestamp: new Date().toISOString()
        }
      };
      res.json(response);
    } catch (e) {
      next(e);
    }
  },

  async forward(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.ticketId as GrievanceId;
      const grievance = await grievanceService.forwardToCpgrams(id);

      const response: ApiResponse<typeof grievance> = {
        data: grievance,
        error: null,
        meta: {
          requestId: (req.headers["x-request-id"] as string) || "sys-req",
          timestamp: new Date().toISOString()
        }
      };
      res.json(response);
    } catch (e) {
      next(e);
    }
  }
};
