import { Request, Response, NextFunction } from 'express';
import { CreateApplicationSchema, UpdateApplicationSchema, SubmitApplicationSchema } from '../schemas/applicationSchemas';
import { ApplicationService } from '../services/applicationService';

export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  createApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = CreateApplicationSchema.parse(req.body);

      const application = await this.applicationService.createApplication(parsedData);

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
      const { id } = req.params;
      if (!id) throw new Error("Application ID is required");

      const application = await this.applicationService.getApplication(id);

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
      const { id } = req.params;
      if (!id) throw new Error("Application ID is required");

      const parsedData = UpdateApplicationSchema.parse(req.body);

      const application = await this.applicationService.updateApplication(id, parsedData);

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
      const { id } = req.params;
      if (!id) throw new Error("Application ID is required");

      const parsedData = SubmitApplicationSchema.parse(req.body);

      const application = await this.applicationService.submitApplication(id, parsedData);

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
