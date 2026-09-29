export type GrievanceId = string & { readonly __brand: "GrievanceId" };
export type ApplicantId = string & { readonly __brand: "ApplicantId" };
export type OfficerId = string & { readonly __brand: "OfficerId" };

export const TICKET_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "ESCALATED",
  "RESOLVED",
  "CLOSED",
  "FORWARDED_TO_CPGRAMS"
] as const;
export type TicketStatus = typeof TICKET_STATUSES[number];

export const PRIORITY_LEVELS = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export type PriorityLevel = typeof PRIORITY_LEVELS[number];

export const CATEGORY_TYPES = [
  "PAYMENT_DELAY",
  "DOCUMENT_REJECTION",
  "ELIGIBILITY_ISSUE",
  "TECHNICAL_ISSUE",
  "OTHER"
] as const;
export type CategoryType = typeof CATEGORY_TYPES[number];

export interface ApiResponse<T> {
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: any[];
  } | null;
  meta: {
    requestId: string;
    timestamp: string;
  };
}

// Representing database model / repository return type for a Grievance
export interface GrievanceRecord {
  id: GrievanceId;
  applicantId: ApplicantId;
  category: CategoryType;
  description: string;
  status: TicketStatus;
  priority: PriorityLevel;
  assignedOfficerId: OfficerId | null;
  cpgramsRegistrationNumber: string | null;
  resolutionText: string | null;
  slaBreachAt: Date;
  isEscalated: boolean;
  createdAt: Date;
  updatedAt: Date;
}
