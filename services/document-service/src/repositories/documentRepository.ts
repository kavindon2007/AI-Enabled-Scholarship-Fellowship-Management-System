// Layer: Repository (Data Access)
// Responsibility: Encapsulate all database queries, external API calls, and file-system access (MinIO)

import AWS from 'aws-sdk';
import { getProducer } from '../events/kafka.js';
import { config } from '../config/index.js';
import { DocumentMetadata, DocumentId } from '../types/index.js';
import { NotFoundError } from '../errors/AppError.js';

// Setup Mock S3 client for MinIO
const s3 = new AWS.S3({
  endpoint: config.MINIO_ENDPOINT,
  accessKeyId: config.MINIO_ACCESS_KEY,
  secretAccessKey: config.MINIO_SECRET_KEY,
  s3ForcePathStyle: true,
  region: config.MINIO_REGION,
  sslEnabled: config.MINIO_USE_SSL,
});

// Since we're scaffolding, we'll keep a mock in-memory DB so tests can pass without full DB setup
// In production, this would use Knex or Prisma against PostgreSQL.
const MOCK_DB = new Map<string, DocumentMetadata>();

export class DocumentRepository {
  /**
   * Upload an object to S3 / MinIO
   */
  async uploadFile(s3Key: string, buffer: Buffer, mimeType: string): Promise<void> {
    await s3.putObject({
      Bucket: config.MINIO_BUCKET_NAME,
      Key: s3Key,
      Body: buffer,
      ContentType: mimeType,
    }).promise();
  }

  /**
   * Get an object stream or buffer from S3 / MinIO
   */
  async downloadFile(s3Key: string): Promise<Buffer> {
    try {
      const response = await s3.getObject({
        Bucket: config.MINIO_BUCKET_NAME,
        Key: s3Key,
      }).promise();
      
      return response.Body as Buffer;
    } catch (error: any) {
      if (error.code === 'NoSuchKey') {
        throw new NotFoundError(`File with key ${s3Key} not found in storage.`);
      }
      throw error;
    }
  }

  /**
   * Save document metadata in Database
   */
  async saveMetadata(metadata: DocumentMetadata): Promise<void> {
    MOCK_DB.set(metadata.id, metadata);
    // Real implementation:
    // await prisma.document.create({ data: metadata });
  }

  /**
   * Run a query to fetch document metadata
   */
  async getMetadataById(id: DocumentId): Promise<DocumentMetadata> {
    const doc = MOCK_DB.get(id);
    if (!doc) {
      throw new NotFoundError(`Document with id ${id} not found.`);
    }
    return doc;
  }

  /**
   * Publish document-uploaded event to Kafka
   */
  async publishDocumentUploaded(metadata: DocumentMetadata): Promise<void> {
    const producer = await getProducer();
    
    // Using @ai-sfms/shared-types Kafka event logic logically inside here
    await producer.send({
      topic: 'document-uploaded',
      messages: [
        {
          key: metadata.id,
          value: JSON.stringify({
            eventId: `evt_${Date.now()}`,
            timestamp: new Date().toISOString(),
            payload: {
              documentId: metadata.id,
              applicationId: metadata.applicationId,
              documentType: metadata.documentType,
              s3Key: metadata.s3Key,
            }
          }),
        },
      ],
    });
  }
}
