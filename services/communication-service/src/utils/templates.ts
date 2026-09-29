// Layer: Utils
// Responsibility: Basic templating utility for SMS/Email messages

type Template = {
  subject?: string;
  body: string;
};

const TEMPLATE_STORE: Record<string, Template> = {
  'APPLICATION_SUBMITTED': {
    subject: 'AI-SFMS: Application Submitted Successfully',
    body: 'Dear Applicant, your application {{applicationId}} has been submitted successfully for scheme {{schemeName}}.',
  },
  'DEFICIENCY_RAISED': {
    subject: 'AI-SFMS: Action Required on your Application',
    body: 'Dear Applicant, deficiencies have been found on your application {{applicationId}}. Please login and resolve them.',
  },
  'APPLICATION_APPROVED': {
    subject: 'AI-SFMS: Application Approved',
    body: 'Congratulations! Your application {{applicationId}} has been approved.',
  }
};

export const getTemplate = (templateId: string, payload: Record<string, unknown> = {}): Template => {
  const template = TEMPLATE_STORE[templateId];
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  // Simple string replacement for placeholders like {{key}}
  const replacePlaceholders = (text: string) => {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return payload[key] !== undefined ? String(payload[key]) : match;
    });
  };

  return {
    subject: template.subject ? replacePlaceholders(template.subject) : undefined,
    body: replacePlaceholders(template.body),
  };
};
