import AWS from 'aws-sdk';
import { config } from '../config/index.js';
import { NotFoundError } from '../errors/AppError.js';

export interface StorageProvider {
  uploadFile(key: string, buffer: Buffer, mimeType: string): Promise<void>;
  downloadFile(key: string): Promise<Buffer>;
  deleteFile(key: string): Promise<void>;
  getSignedUrl(key: string, expiresInSeconds: number): Promise<string>;
}

export class MinioStorageProvider implements StorageProvider {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      endpoint: config.MINIO_ENDPOINT,
      accessKeyId: config.MINIO_ACCESS_KEY,
      secretAccessKey: config.MINIO_SECRET_KEY,
      s3ForcePathStyle: true,
      region: config.MINIO_REGION,
      sslEnabled: config.MINIO_USE_SSL,
    });
  }

  async uploadFile(key: string, buffer: Buffer, mimeType: string): Promise<void> {
    await this.s3.putObject({
      Bucket: config.MINIO_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    }).promise();
  }

  async downloadFile(key: string): Promise<Buffer> {
    try {
      const response = await this.s3.getObject({
        Bucket: config.MINIO_BUCKET_NAME,
        Key: key,
      }).promise();
      
      return response.Body as Buffer;
    } catch (error: any) {
      if (error.code === 'NoSuchKey') {
        throw new NotFoundError(`File with key ${key} not found in storage.`);
      }
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3.deleteObject({
      Bucket: config.MINIO_BUCKET_NAME,
      Key: key,
    }).promise();
  }

  async getSignedUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
    return this.s3.getSignedUrlPromise('getObject', {
      Bucket: config.MINIO_BUCKET_NAME,
      Key: key,
      Expires: expiresInSeconds,
    });
  }
}

// Export singleton instance
export const storageProvider: StorageProvider = new MinioStorageProvider();
