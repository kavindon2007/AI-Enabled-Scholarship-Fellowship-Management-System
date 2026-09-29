// Layer: Service (Business Logic)
// Responsibility: Business rules, orchestration, calling repositories. No req/res objects.

import { randomUUID } from 'crypto';
import { DocumentRepository } from '../repositories/documentRepository.js';
import { DocumentMetadata, DocumentId, UploadResult } from '../types/index.js';
import { UploadDocumentBody } from '../schemas/documentSchemas.js';

export class DocumentService {
  private repository: DocumentRepository;

  constructor(repository: DocumentRepository = new DocumentRepository()) {
    this.repository = repository;
  }

  /**
   * Uploads a document to object storage, creates metadata, and fires an event
   */
  async processUpload(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    fileSize: number,
    metadataBody: UploadDocumentBody
  ): Promise<UploadResult> {
    const documentId = randomUUID();
    const s3Key = `applications/${metadataBody.applicationId}/docs/${documentId}-${fileName}`;

    // 1. Upload to Object Storage
    await this.repository.uploadFile(s3Key, fileBuffer, mimeType);

    // 2. Prepare metadata
    const metadata: DocumentMetadata = {
      id: documentId,
      applicationId: metadataBody.applicationId,
      documentType: metadataBody.documentType,
      fileName,
      fileSize,
      mimeType,
      s3Key,
      uploadedAt: new Date(),
      uploadedBy: metadataBody.uploadedBy,
    };

    // 3. Save to database
    await this.repository.saveMetadata(metadata);

    // 4. Publish Kafka Event for OCR / Review Workflow
    await this.repository.publishDocumentUploaded(metadata);

    return {
      documentId: metadata.id,
      s3Key: metadata.s3Key,
      fileName: metadata.fileName,
      fileSize: metadata.fileSize,
    };
  }

  /**
   * Retrieves document metadata
   */
  async getDocumentInfo(id: string): Promise<DocumentMetadata> {
    return this.repository.getMetadataById(id as DocumentId);
  }

  /**
   * Downloads document content plus metadata
   */
  async downloadDocument(id: string): Promise<{ buffer: Buffer; metadata: DocumentMetadata }> {
    const metadata = await this.repository.getMetadataById(id as DocumentId);
    const buffer = await this.repository.downloadFile(metadata.s3Key);
    return { buffer, metadata };
  }
}
