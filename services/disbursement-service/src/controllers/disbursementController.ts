import { Request, Response, NextFunction } from 'express';
import { DisbursementService } from '../services/disbursementService';
import { 
  InitiateDisbursementSchema, 
  SeedingCheckSchema, 
  PennyDropSchema 
} from '../schemas/disbursementSchemas';
import { NpciBaseService } from '../services/npciBaseService';
import { PennyDropService } from '../services/pennyDropService';
import { SeedingAlertService } from '../services/seedingAlertService';

export class DisbursementController {
  constructor(
    private disbursementService: DisbursementService,
    private npciService: NpciBaseService,
    private pennyDropService: PennyDropService,
    private seedingAlertService: SeedingAlertService
  ) {}

  public initiate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = InitiateDisbursementSchema.parse(req.body);
      const result = await this.disbursementService.initiateDisbursement(data);
      res.status(201).json({
        data: result,
        error: null,
        meta: { requestId: req.headers['x-correlation-id'], timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  };

  public getByApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { applicationId } = req.params;
      const result = await this.disbursementService.getDisbursementsByApplication(applicationId);
      res.status(200).json({
        data: result,
        error: null,
        meta: { requestId: req.headers['x-correlation-id'], timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  };

  public seedingCheck = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = SeedingCheckSchema.parse(req.body);
      const result = await this.npciService.checkAadhaarSeeding(data.aadhaarNumber);
      res.status(200).json({
        data: result,
        error: null,
        meta: { requestId: req.headers['x-correlation-id'], timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  };

  public pennyDrop = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = PennyDropSchema.parse(req.body);
      const result = await this.pennyDropService.performPennyDrop(data.accountNumber, data.ifscCode);
      res.status(200).json({
        data: result,
        error: null,
        meta: { requestId: req.headers['x-correlation-id'], timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  };

  public getSeedingAlerts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.seedingAlertService.checkPreFailureAlerts();
      res.status(200).json({
        data: { message: 'Alerts check initiated' },
        error: null,
        meta: { requestId: req.headers['x-correlation-id'], timestamp: new Date().toISOString() }
      });
    } catch (error) {
      next(error);
    }
  };
}
