import { prisma } from '../utils/prisma';
import {
  ApplicationId,
  SchemeId,
  ApplicantId,
  toApplicationId,
  toSchemeId,
  toApplicantId,
  ApplicationStatus
} from '@ai-sfms/shared-types';
import { ApplicationDTO, SchemeDTO } from "../types";
export class ApplicationRepository {
  async getScheme(schemeId: SchemeId): Promise<SchemeDTO | null> {
    const scheme = await prisma.scheme.findUnique({
      where: { id: schemeId },
      select: {
        id: true,
        schemeCode: true,
        applicationWindowStart: true,
        applicationWindowEnd: true,
        formConfig: true,
      }
    });

    if (!scheme) return null;

    return {
      id: toSchemeId(scheme.id),
      schemeCode: scheme.schemeCode,
      applicationWindowStart: scheme.applicationWindowStart,
      applicationWindowEnd: scheme.applicationWindowEnd,
      formConfig: scheme.formConfig,
    };
  }

  async create(data: {
    schemeId: SchemeId;
    applicantId: ApplicantId;
    academicYear: string;
    status: ApplicationStatus;
  }): Promise<ApplicationDTO> {
    const application = await prisma.application.create({
      data: {
        schemeId: data.schemeId,
        applicantId: data.applicantId,
        academicYear: data.academicYear,
        formData: {},
        status: data.status,
      },
      select: {
        id: true,
        schemeId: true,
        applicantId: true,
        academicYear: true,
        formData: true,
        status: true,
        riskScore: true,
      }
    });

    return {
      id: toApplicationId(application.id),
      schemeId: toSchemeId(application.schemeId),
      applicantId: toApplicantId(application.applicantId),
      academicYear: application.academicYear,
      formData: application.formData,
      status: application.status as ApplicationStatus,
      riskScore: application.riskScore,
    };
  }

  async getById(id: ApplicationId): Promise<ApplicationDTO | null> {
    const application = await prisma.application.findUnique({
      where: { id },
      select: {
        id: true,
        schemeId: true,
        applicantId: true,
        academicYear: true,
        formData: true,
        status: true,
        riskScore: true,
      }
    });

    if (!application) return null;

    return {
      id: toApplicationId(application.id),
      schemeId: toSchemeId(application.schemeId),
      applicantId: toApplicantId(application.applicantId),
      academicYear: application.academicYear,
      formData: application.formData,
      status: application.status as ApplicationStatus,
      riskScore: application.riskScore,
    };
  }

  async update(id: ApplicationId, data: { formData?: unknown; status?: ApplicationStatus; submittedAt?: Date }): Promise<ApplicationDTO> {
    const application = await prisma.application.update({
      where: { id },
      data: {
        ...(data.formData !== undefined && { formData: data.formData as any }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.submittedAt !== undefined && { submittedAt: data.submittedAt }),
      },
      select: {
        id: true,
        schemeId: true,
        applicantId: true,
        academicYear: true,
        formData: true,
        status: true,
        riskScore: true,
      }
    });

    return {
      id: toApplicationId(application.id),
      schemeId: toSchemeId(application.schemeId),
      applicantId: toApplicantId(application.applicantId),
      academicYear: application.academicYear,
      formData: application.formData,
      status: application.status as ApplicationStatus,
      riskScore: application.riskScore,
    };
  }

  async findByApplicantAndScheme(applicantId: string, schemeId: string): Promise<ApplicationDTO | null> {
    const application = await prisma.application.findFirst({
      where: { 
        applicantId,
        schemeId,
        status: { notIn: ['REJECTED', 'DISBURSED'] } // Exclude terminal states if allowed to re-apply
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        schemeId: true,
        applicantId: true,
        academicYear: true,
        formData: true,
        status: true,
        riskScore: true,
      }
    });

    if (!application) return null;

    return {
      id: toApplicationId(application.id),
      schemeId: toSchemeId(application.schemeId),
      applicantId: toApplicantId(application.applicantId),
      academicYear: application.academicYear,
      formData: application.formData,
      status: application.status as ApplicationStatus,
      riskScore: application.riskScore,
    };
  }
}
