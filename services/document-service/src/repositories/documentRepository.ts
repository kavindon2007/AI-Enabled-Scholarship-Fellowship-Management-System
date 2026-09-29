// Layer: Repository (Data Access)
// Responsibility: Encapsulate all database queries, external API calls, and file-system access (MinIO)

import AWS from 'aws-sdk';
import { Pool } from 'pg';
import { getProducer } from '../events/kafka.js';
import { config } from '../config/index.js';
import { DocumentMetadata, DocumentId } from '../types/index.js';
import { NotFoundError } from '../errors/AppError.js';

// Setup S3 client for MinIO
const s3 = new AWS.S3({
  endpoint: config.MINIO_ENDPOINT,
  accessKeyId: config.MINIO_ACCESS_KEY,
  secretAccessKey: config.MINIO_SECRET_KEY,
  s3ForcePathStyle: true,
  region: config.MINIO_REGION,
  sslEnabled: config.MINIO_USE_SSL,
});

// Setup Postgres Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://sfms_admin:CHANGE_ME_IN_PRODUCTION@localhost:5432/sfms_applications'
});

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
    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO documents (
          id, "applicationId", "docType", "storagePath", 
          "originalFilename", "fileSizeBytes", "mimeType", 
          "uploadedAt", "source", "version"
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          metadata.id, 
          metadata.applicationId, 
          metadata.documentType, 
          metadata.s3Key, 
          metadata.fileName, 
          metadata.fileSize, 
          metadata.mimeType, 
          metadata.uploadedAt || new Date(),
          'MANUAL_UPLOAD',
          1
        ]
      );
    } finally {
      client.release();
    }
  }

  /**
   * Run a query to fetch document metadata
   */
  async getMetadataById(id: DocumentId): Promise<DocumentMetadata> {
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT * FROM documents WHERE id = $1', [id]);
      if (res.rows.length === 0) {
        throw new NotFoundError(`Document with id ${id} not found.`);
      }
      const row = res.rows[0];
      return {
        id: row.id,
        applicationId: row.applicationId,
        documentType: row.docType,
        fileName: row.originalFilename,
        fileSize: row.fileSizeBytes,
        mimeType: row.mimeType,
        s3Key: row.storagePath,
        uploadedAt: row.uploadedAt,
        uploadedBy: row.verifiedByOfficerId // Using this as proxy for now
      };
    } finally {
      client.release();
    }
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
