-- AlterTable SchemeVersion
ALTER TABLE "scheme_versions" 
ADD COLUMN "status" VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
ADD COLUMN "schemeDescription" TEXT,
ADD COLUMN "localizationMetadata" JSONB,
ADD COLUMN "applicationWindowStart" TIMESTAMPTZ(6),
ADD COLUMN "applicationWindowEnd" TIMESTAMPTZ(6),
ADD COLUMN "verificationChain" JSONB,
ADD COLUMN "selectionMode" VARCHAR(30) NOT NULL DEFAULT 'NONE',
ADD COLUMN "selectionParameters" JSONB,
ADD COLUMN "renewalMode" VARCHAR(30) NOT NULL DEFAULT 'NO_RENEWAL',
ADD COLUMN "renewalRules" JSONB,
ADD COLUMN "disbursementMode" VARCHAR(30) NOT NULL DEFAULT 'STATE_DBT',
ADD COLUMN "paymentComponents" JSONB,
ADD COLUMN "ruleSource" TEXT,
ADD COLUMN "lastVerifiedAt" TIMESTAMPTZ(6),
ADD COLUMN "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Drop obsolete columns from SchemeVersion
ALTER TABLE "scheme_versions" DROP COLUMN "docChecklist";

-- AlterTable RuleDefinition
ALTER TABLE "rule_definitions"
ADD COLUMN "ruleName" VARCHAR(200) NOT NULL DEFAULT 'Legacy Rule',
ADD COLUMN "ruleType" VARCHAR(50) NOT NULL DEFAULT 'CUSTOM',
ADD COLUMN "sourceField" VARCHAR(100) NOT NULL DEFAULT 'unknown',
ADD COLUMN "operator" VARCHAR(20) NOT NULL DEFAULT 'EQ',
ADD COLUMN "value" JSONB,
ADD COLUMN "failureMode" VARCHAR(50) NOT NULL DEFAULT 'HARD_STOP',
ADD COLUMN "failureMessage" JSONB,
ADD COLUMN "conditions" JSONB,
ADD COLUMN "exceptions" JSONB,
ADD COLUMN "priority" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "isEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "rule_definitions" DROP COLUMN "logic";
ALTER TABLE "rule_definitions" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable RuleProvenance
ALTER TABLE "rule_provenance"
RENAME COLUMN "sourceDocument" TO "sourceReference";

ALTER TABLE "rule_provenance"
ADD COLUMN "sourceType" VARCHAR(50) NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN "sourceTitle" TEXT,
ADD COLUMN "sourcePage" VARCHAR(50),
ADD COLUMN "sourceSection" VARCHAR(100),
ADD COLUMN "publishedDate" DATE,
ADD COLUMN "effectiveDate" DATE,
ADD COLUMN "verifiedAt" TIMESTAMPTZ(6),
ADD COLUMN "verificationStatus" VARCHAR(50) NOT NULL DEFAULT 'PENDING_AMENDMENT_CHECK',
ADD COLUMN "verifiedBy" UUID,
ADD COLUMN "notes" TEXT;

-- CreateTable DocumentRequirement
CREATE TABLE "document_requirements" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "schemeVersionId" UUID NOT NULL,
    "documentType" VARCHAR(50) NOT NULL,
    "displayName" VARCHAR(200) NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isConditional" BOOLEAN NOT NULL DEFAULT false,
    "condition" TEXT,
    "allowedMimeTypes" VARCHAR(50)[],
    "maxSizeBytes" INTEGER NOT NULL,
    "requiresOcr" BOOLEAN NOT NULL DEFAULT false,
    "requiresVerification" BOOLEAN NOT NULL DEFAULT false,
    "verificationAuthority" VARCHAR(100),
    "expiryPolicy" VARCHAR(50),
    "replacementAllowed" BOOLEAN NOT NULL DEFAULT true,
    "helpText" TEXT,
    "localization" JSONB,

    CONSTRAINT "document_requirements_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "document_requirements_schemeVersionId_documentType_key" ON "document_requirements"("schemeVersionId", "documentType");
ALTER TABLE "document_requirements" ADD CONSTRAINT "document_requirements_schemeVersionId_fkey" FOREIGN KEY ("schemeVersionId") REFERENCES "scheme_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable OCRJob
CREATE TABLE "ocr_jobs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "documentVersionId" UUID NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "processingProfile" VARCHAR(50) NOT NULL,
    "language" VARCHAR(10) NOT NULL DEFAULT 'en',
    "startedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMPTZ(6),
    "errorMessage" TEXT,

    CONSTRAINT "ocr_jobs_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ocr_jobs" ADD CONSTRAINT "ocr_jobs_documentVersionId_fkey" FOREIGN KEY ("documentVersionId") REFERENCES "document_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable OCRAttempt
CREATE TABLE "ocr_attempts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ocrJobId" UUID NOT NULL,
    "engine" VARCHAR(50) NOT NULL,
    "engineVersion" VARCHAR(50),
    "status" VARCHAR(30) NOT NULL,
    "rawText" TEXT,
    "confidence" DECIMAL(4,3),
    "processingDurationMs" INTEGER,
    "startedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMPTZ(6),

    CONSTRAINT "ocr_attempts_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ocr_attempts" ADD CONSTRAINT "ocr_attempts_ocrJobId_fkey" FOREIGN KEY ("ocrJobId") REFERENCES "ocr_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable OCRResult
CREATE TABLE "ocr_results" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ocrJobId" UUID NOT NULL,
    "documentVersionId" UUID NOT NULL,
    "overallConfidence" DECIMAL(4,3),
    "pageCount" INTEGER NOT NULL DEFAULT 1,
    "rawTextPreview" TEXT,
    "signatureDetected" BOOLEAN,
    "stampDetected" BOOLEAN,
    "processedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ocr_results_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ocr_results_ocrJobId_key" ON "ocr_results"("ocrJobId");
ALTER TABLE "ocr_results" ADD CONSTRAINT "ocr_results_ocrJobId_fkey" FOREIGN KEY ("ocrJobId") REFERENCES "ocr_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ocr_results" ADD CONSTRAINT "ocr_results_documentVersionId_fkey" FOREIGN KEY ("documentVersionId") REFERENCES "document_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable OCRFieldResult
CREATE TABLE "ocr_field_results" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ocrResultId" UUID NOT NULL,
    "fieldKey" VARCHAR(100) NOT NULL,
    "rawValue" TEXT NOT NULL,
    "normalizedValue" TEXT,
    "confidence" DECIMAL(4,3),
    "pageNumber" INTEGER NOT NULL DEFAULT 1,
    "boundingBox" JSONB,
    "engineSource" VARCHAR(50) NOT NULL,
    "status" VARCHAR(30) NOT NULL,

    CONSTRAINT "ocr_field_results_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "ocr_field_results" ADD CONSTRAINT "ocr_field_results_ocrResultId_fkey" FOREIGN KEY ("ocrResultId") REFERENCES "ocr_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable FieldCorrection
CREATE TABLE "field_corrections" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ocrFieldResultId" UUID NOT NULL,
    "originalValue" TEXT,
    "correctedValue" TEXT NOT NULL,
    "correctedByActorId" UUID NOT NULL,
    "correctedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "field_corrections_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "field_corrections" ADD CONSTRAINT "field_corrections_ocrFieldResultId_fkey" FOREIGN KEY ("ocrFieldResultId") REFERENCES "ocr_field_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;
