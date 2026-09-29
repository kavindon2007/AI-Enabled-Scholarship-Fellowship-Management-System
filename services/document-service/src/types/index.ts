// Layer: Types
// Responsibility: Shared TypeScript interfaces and domain types

export interface DocumentMetadata {
  id: string;
  applicationId: string;
  documentType: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  s3Key: string;
  uploadedAt: Date;
  uploadedBy?: string;
}

export interface UploadResult {
  documentId: string;
  s3Key: string;
  fileName: string;
  fileSize: number;
}

// Branded types for domain IDs to prevent mixing them up
export type DocumentId = string & { readonly __brand: 'DocumentId' };
export type ApplicationId = string & { readonly __brand: 'ApplicationId' };
