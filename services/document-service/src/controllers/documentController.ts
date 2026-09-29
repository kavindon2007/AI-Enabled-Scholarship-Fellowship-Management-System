// Layer: Controller
// Responsibility: Parse `req` calling `schemas/` and `services/`, then format `res`.

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { DocumentService } from '../services/documentService.js';
import { UploadDocumentSchema, GetDocumentParamsSchema } from '../schemas/documentSchemas.js';
import { ValidationError } from '../errors/AppError.js';

const documentService = new DocumentService();

export class DocumentController {
  
  /**
   * POST /api/documents/upload
   */
  async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new ValidationError('File is missing in the request');
      }

      // Validate body using Zod schema
      const { body } = UploadDocumentSchema.parse(req);

      const result = await documentService.processUpload(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        body
      );

      res.status(201).json({
        data: result,
        error: null,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ValidationError('Invalid form data', error.errors));
      } else {
        next(error);
      }
    }
  }

  /**
   * GET /api/documents/:id
   */
  async getInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { params } = GetDocumentParamsSchema.parse(req);

      const document = await documentService.getDocumentInfo(params.id);

      res.status(200).json({
        data: document,
        error: null,
        meta: { timestamp: new Date().toISOString() },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ValidationError('Invalid params', error.errors));
      } else {
        next(error);
      }
    }
  }

  /**
   * GET /api/documents/:id/download
   */
  async download(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { params } = GetDocumentParamsSchema.parse(req);

      const { buffer, metadata } = await documentService.downloadDocument(params.id);

      res.set('Content-Type', metadata.mimeType);
      res.set('Content-Disposition', `attachment; filename="${metadata.fileName}"`);
      res.status(200).send(buffer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ValidationError('Invalid params', error.errors));
      } else {
        next(error);
      }
    }
  }
}
