import {
  ApplicationId,
  SchemeId,
  ApplicantId,
  ApplicationStatus
} from '@ai-sfms/shared-types';

export interface ApplicationDTO {
  id: ApplicationId;
  schemeId: SchemeId;
  applicantId: ApplicantId;
  academicYear: string;
  formData: unknown;
  profileSnapshot?: unknown;
  profileVersionSnapshot?: number;
  status: ApplicationStatus;
  riskScore: number;
}

export interface SchemeDTO {
  id: SchemeId;
  schemeCode: string;
  applicationWindowStart: Date;
  applicationWindowEnd: Date;
  formConfig: unknown;
}
