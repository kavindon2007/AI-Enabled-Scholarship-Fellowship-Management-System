export interface User {
  id: string;
  name: string;
  aadhaarNumber: string;
  phone: string;
  email?: string;
  isBankSeeded: boolean;
}

export interface Application {
  id: string;
  schemeId: string;
  schemeName: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Disbursed';
  submissionDate?: string;
  lastUpdated: string;
  data: Record<string, any>;
}

export interface Document {
  id: string;
  type: string;
  name: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  url: string;
  uploadedAt: string;
}

export interface Grievance {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export interface Payment {
  id: string;
  applicationId: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Success' | 'Failed';
  referenceNumber?: string;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  deadline: string;
  eligibilityCriteria: string[];
}
