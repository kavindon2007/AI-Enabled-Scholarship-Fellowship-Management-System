import { ApplicationRepository } from '../repositories/applicationRepository';
import { ApplicationDTO } from '../types';
import { CreateApplicationDTO, UpdateApplicationDTO, SubmitApplicationDTO } from '../schemas/applicationSchemas';
import { NotFoundError, ConflictError, ValidationError, UnauthorizedError } from '../errors/AppError';
import {
  ApplicationId,
  toApplicationId,
  toSchemeId,
  toApplicantId,
  ApplicationSubmittedEvent,
  KAFKA_TOPICS
} from '@ai-sfms/shared-types';
import { kafkaProducer } from '../events/kafka';
import { randomUUID } from 'crypto';

export class ApplicationService {
  private repository: ApplicationRepository;

  constructor(repository: ApplicationRepository) {
    this.repository = repository;
  }

  async createApplication(data: CreateApplicationDTO, actorId: string, role: string): Promise<ApplicationDTO> {
    if (role !== 'APPLICANT' && data.applicantId !== actorId) {
      throw new UnauthorizedError('Officers cannot create applications on behalf of applicants');
    }
  
    const scheme = await this.repository.getScheme(toSchemeId(data.schemeId));

    if (!scheme) {
      throw new NotFoundError(`Scheme ${data.schemeId} not found`);
    }

    const now = new Date();
    if (now < scheme.applicationWindowStart || now > scheme.applicationWindowEnd) {
      throw new ConflictError(`Application window is closed for scheme ${scheme.schemeCode}`);
    }

    // Enforce one active application per applicant per scheme/year
    const existing = await this.repository.findByApplicantAndScheme(data.applicantId, data.schemeId);
    if (existing && existing.academicYear === data.academicYear) {
      throw new ConflictError(`Active application already exists for this scheme and year`);
    }

    return this.repository.create({
      schemeId: toSchemeId(data.schemeId),
      applicantId: toApplicantId(data.applicantId),
      academicYear: data.academicYear,
      status: 'DRAFT',
    });
  }

  async getApplication(id: string, actorId: string, role: string): Promise<ApplicationDTO> {
    const application = await this.repository.getById(toApplicationId(id));

    if (!application) {
      throw new NotFoundError(`Application ${id} not found`);
    }
    
    if (role === 'APPLICANT' && application.applicantId !== actorId) {
      throw new UnauthorizedError(`Cannot access application owned by another applicant`);
    }

    return application;
  }

  async updateApplication(id: string, data: UpdateApplicationDTO, actorId: string, role: string): Promise<ApplicationDTO> {
    const application = await this.getApplication(id, actorId, role);

    if (role === 'APPLICANT' && application.applicantId !== actorId) {
      throw new UnauthorizedError(`Cannot update application owned by another applicant`);
    }

    if (application.status !== 'DRAFT' && application.status !== 'DEFICIENCY_RAISED' && application.status !== 'RESUBMITTED') {
      throw new ConflictError(`Cannot update application in status ${application.status}`);
    }

    return this.repository.update(application.id, {
      formData: data.formData,
    });
  }

  async submitApplication(id: string, data: SubmitApplicationDTO, actorId: string, role: string): Promise<ApplicationDTO> {
    const application = await this.getApplication(id, actorId, role);

    if (role === 'APPLICANT' && application.applicantId !== actorId) {
      throw new UnauthorizedError(`Cannot submit application owned by another applicant`);
    }

    if (application.status !== 'DRAFT' && application.status !== 'DEFICIENCY_RAISED') {
      throw new ConflictError(`Application can only be submitted from DRAFT or DEFICIENCY_RAISED state`);
    }

    const scheme = await this.repository.getScheme(application.schemeId);
    if (!scheme) {
       throw new NotFoundError(`Scheme not found for this application`);
    }

    // Fetch Canonical Applicant Profile for snapshot
    const profile = await this.repository.getApplicantProfile(application.applicantId);
    if (!profile) {
      throw new ConflictError(`Applicant profile not found`);
    }

    // Transition status
    const newStatus = application.status === 'DEFICIENCY_RAISED' ? 'RESUBMITTED' : 'SUBMITTED';

    const updatedApplication = await this.repository.update(application.id, {
      status: newStatus,
      submittedAt: new Date(),
      profileSnapshot: profile,
      profileVersionSnapshot: profile.profileVersion,
    });

    // Emit Kafka Event
    const event: ApplicationSubmittedEvent = {
      type: 'application-submitted',
      eventId: randomUUID(),
      timestamp: new Date().toISOString(),
      correlationId: randomUUID(),
      payload: {
        applicationId: updatedApplication.id,
        applicantId: updatedApplication.applicantId,
        schemeId: updatedApplication.schemeId,
        schemeCode: scheme.schemeCode,
        academicYear: updatedApplication.academicYear,
        documentIds: data.documentIds,
      }
    };

    await kafkaProducer.publish(KAFKA_TOPICS.APPLICATION_SUBMITTED, event);

    return updatedApplication;
  }
}
