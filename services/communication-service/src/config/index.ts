// Layer: Config
// Responsibility: Environment variables parsing and validation via Zod

import { z } from 'zod';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env if present
dotenv.config({ path: path.join(__dirname, '../../.env') });

const ConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3003),

  // SMTP Mock or Real Credentials
  SMTP_HOST: z.string().default('smtp.ethereal.email'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  // SMS Service (e.g. Twilio)
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),

  // Internal Kafka Configuration (if needed later)
  KAFKA_BROKERS: z.string().default('localhost:9092'),
});

const _env = ConfigSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const config = _env.data;