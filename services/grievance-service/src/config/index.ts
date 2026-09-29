import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3000").transform(Number),
  KAFKA_BROKERS: z.string().default("localhost:9092"),
  CPGRAMS_API_URL: z.string().url().default("https://mock-cpgrams.gov.in/api"),
  CPGRAMS_API_KEY: z.string().default("mock_key"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const config = _env.data;
