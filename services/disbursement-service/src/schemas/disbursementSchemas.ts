import { z } from 'zod';

export const InitiateDisbursementSchema = z.object({
  applicationId: z.string().uuid(),
  amount: z.number().positive(),
  schemeId: z.string().uuid()
});

export type InitiateDisbursementRequest = z.infer<typeof InitiateDisbursementSchema>;

export const SeedingCheckSchema = z.object({
  applicationId: z.string().uuid(),
  aadhaarNumber: z.string().length(12)
});

export type SeedingCheckRequest = z.infer<typeof SeedingCheckSchema>;

export const PennyDropSchema = z.object({
  applicationId: z.string().uuid(),
  accountNumber: z.string().min(9).max(18),
  ifscCode: z.string().length(11)
});

export type PennyDropRequest = z.infer<typeof PennyDropSchema>;
