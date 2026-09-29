// Layer: Schemas
// Responsibility: Zod request/response validation schemas

import { z } from 'zod';

export const UploadDocumentSchema = z.object({
  body: z.object({
    applicationId: z.string().uuid('Invalid Application ID'),
    documentType: z.string().min(1, 'Document type is required'),
    uploadedBy: z.string().uuid('Invalid Officer/User ID').optional(),
  }),
});

export const GetDocumentParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid Document ID'),
  }),
});

export type UploadDocumentBody = z.infer<typeof UploadDocumentSchema>['body'];
export type GetDocumentParams = z.infer<typeof GetDocumentParamsSchema>['params'];
