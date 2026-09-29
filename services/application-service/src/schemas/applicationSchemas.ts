import { z } from 'zod';
import { AcademicYearSchema, UuidSchema } from '@ai-sfms/shared-types';

export const CreateApplicationSchema = z.object({
  schemeId: UuidSchema,
  academicYear: AcademicYearSchema,
  applicantId: UuidSchema, // Usually derived from auth token, placing here for mocking auth.
});

export type CreateApplicationDTO = z.infer<typeof CreateApplicationSchema>;

export const UpdateApplicationSchema = z.object({
  formData: z.record(z.unknown()), // Depending on the scheme layout
});

export type UpdateApplicationDTO = z.infer<typeof UpdateApplicationSchema>;

export const SubmitApplicationSchema = z.object({
  documentIds: z.array(UuidSchema).min(1, "At least one document is required required for submission"),
});

export type SubmitApplicationDTO = z.infer<typeof SubmitApplicationSchema>;
