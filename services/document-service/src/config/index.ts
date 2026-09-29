// Layer: Config
// Responsibility: Validate and export environment-driven configuration (no secrets in code).

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  
  // Database
  DATABASE_URL: z.string().url().describe('Postgres connection string'),
  
  // MinIO / S3
  MINIO_ENDPOINT: z.string().describe('S3/MinIO endpoint URL'),
  MINIO_ACCESS_KEY: z.string().describe('Access key for MinIO/S3'),
  MINIO_SECRET_KEY: z.string().describe('Secret key for MinIO/S3'),
  MINIO_BUCKET_NAME: z.string().default('documents'),
  MINIO_REGION: z.string().default('us-east-1'),
  MINIO_USE_SSL: z.coerce.boolean().default(true),
  
  // Kafka
  KAFKA_BROKERS: z.string().transform(s => s.split(',')).describe('Comma-separated Kafka brokers'),
  KAFKA_CLIENT_ID: z.string().default('document-service'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const config = parsed.data;
