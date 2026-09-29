import { Request, Response, NextFunction } from 'express';
import { CreateApplicationSchema, UpdateApplicationSchema, SubmitApplicationSchema } from '../schemas/applicationSchemas';
import { ApplicationService } from '../services/applicationService';
import { UnauthorizedError } from '../errors/AppError';

export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  createApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required");
      
      const parsedData = CreateApplicationSchema.parse(req.body);

      const application = await this.applicationService.createApplication(
        parsedData, 
        req.user.id, 
        req.user.role
      );

      res.status(201).json({
        data: application,
        error: null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  };

  getApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required");
      const { id } = req.params;
      if (!id) throw new Error("Application ID is required");

      const application = await this.applicationService.getApplication(
        id, 
        req.user.id, 
        req.user.role
      );

      res.status(200).json({
        data: application,
        error: null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  };

  updateApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required");
      const { id } = req.params;
      if (!id) throw new Error("Application ID is required");

      const parsedData = UpdateApplicationSchema.parse(req.body);

      const application = await this.applicationService.updateApplication(
        id, 
        parsedData, 
        req.user.id, 
        req.user.role
      );

      res.status(200).json({
        data: application,
        error: null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  };

  submitApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("Authentication required");
      const { id } = req.params;
      if (!id) throw new Error("Application ID is required");

      const parsedData = SubmitApplicationSchema.parse(req.body);

      const application = await this.applicationService.submitApplication(
        id, 
        parsedData, 
        req.user.id, 
        req.user.role
      );

      res.status(200).json({
        data: application,
        error: null,
        meta: { timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  };
}
