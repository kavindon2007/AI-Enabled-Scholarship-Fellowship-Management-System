-- CreateTable
CREATE TABLE "scheme_versions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "schemeId" UUID NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "eligibilityRules" JSONB NOT NULL,
    "formConfig" JSONB NOT NULL,
    "docChecklist" JSONB NOT NULL,
    "quotaConfig" JSONB NOT NULL,
    "scholarshipFormula" JSONB NOT NULL,
    "notificationTemplates" JSONB NOT NULL,
    "slaConfig" JSONB NOT NULL,
    "effectiveFrom" TIMESTAMPTZ(6) NOT NULL,
    "effectiveTo" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scheme_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rule_definitions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "schemeVersionId" UUID NOT NULL,
    "ruleCode" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "logic" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rule_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rule_provenance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ruleDefinitionId" UUID NOT NULL,
    "sourceDocument" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "extractedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rule_provenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_versions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "applicationId" UUID NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "formData" JSONB NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "riskFlags" JSONB,
    "snapshotAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorId" UUID,

    CONSTRAINT "application_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_versions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "documentId" UUID NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "storagePath" TEXT NOT NULL,
    "originalFilename" VARCHAR(255) NOT NULL,
    "fileSizeBytes" INTEGER NOT NULL,
    "mimeType" VARCHAR(50) NOT NULL,
    "checksumSha256" VARCHAR(64),
    "uploadedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" UUID,

    CONSTRAINT "document_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_records" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "documentId" UUID,
    "applicationId" UUID NOT NULL,
    "entityType" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "verifiedBy" UUID NOT NULL,
    "verifiedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evidence" JSONB,

    CONSTRAINT "verification_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_attempts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "verificationRecordId" UUID NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "attemptedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resultStatus" VARCHAR(20) NOT NULL,
    "responsePayload" JSONB,

    CONSTRAINT "verification_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_transitions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "applicationId" UUID NOT NULL,
    "applicationVersion" INTEGER NOT NULL,
    "fromState" VARCHAR(30) NOT NULL,
    "toState" VARCHAR(30) NOT NULL,
    "actorId" UUID NOT NULL,
    "reason" TEXT,
    "transitionedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflow_transitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deficiencies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "applicationId" UUID NOT NULL,
    "raisedBy" UUID NOT NULL,
    "raisedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "fieldRef" VARCHAR(100),
    "status" VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    "resolvedAt" TIMESTAMPTZ(6),
    "resolvedBy" UUID,

    CONSTRAINT "deficiencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "correlationId" VARCHAR(100),
    "actorId" UUID,
    "actorType" VARCHAR(50),
    "action" VARCHAR(100) NOT NULL,
    "resourceType" VARCHAR(50) NOT NULL,
    "resourceId" VARCHAR(100),
    "details" JSONB,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "applications" ADD COLUMN "schemeVersionId" UUID;
ALTER TABLE "applications" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN "checksumSha256" VARCHAR(64);
ALTER TABLE "documents" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "scheme_versions_schemeId_versionNumber_key" ON "scheme_versions"("schemeId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "application_versions_applicationId_versionNumber_key" ON "application_versions"("applicationId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "document_versions_documentId_versionNumber_key" ON "document_versions"("documentId", "versionNumber");

-- CreateIndex
CREATE INDEX "audit_events_action_idx" ON "audit_events"("action");

-- CreateIndex
CREATE INDEX "audit_events_actorId_idx" ON "audit_events"("actorId");

-- CreateIndex
CREATE INDEX "audit_events_resourceType_resourceId_idx" ON "audit_events"("resourceType", "resourceId");

-- AddForeignKey
ALTER TABLE "scheme_versions" ADD CONSTRAINT "scheme_versions_schemeId_fkey" FOREIGN KEY ("schemeId") REFERENCES "schemes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "rule_definitions" ADD CONSTRAINT "rule_definitions_schemeVersionId_fkey" FOREIGN KEY ("schemeVersionId") REFERENCES "scheme_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "rule_provenance" ADD CONSTRAINT "rule_provenance_ruleDefinitionId_fkey" FOREIGN KEY ("ruleDefinitionId") REFERENCES "rule_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "applications" ADD CONSTRAINT "applications_schemeVersionId_fkey" FOREIGN KEY ("schemeVersionId") REFERENCES "scheme_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "application_versions" ADD CONSTRAINT "application_versions_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "verification_attempts" ADD CONSTRAINT "verification_attempts_verificationRecordId_fkey" FOREIGN KEY ("verificationRecordId") REFERENCES "verification_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "workflow_transitions" ADD CONSTRAINT "workflow_transitions_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "deficiencies" ADD CONSTRAINT "deficiencies_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
