-- AlterTable
ALTER TABLE "applicants" 
RENAME COLUMN "name" TO "fullName";

ALTER TABLE "applicants" 
RENAME COLUMN "casteCategory" TO "communityName";

ALTER TABLE "applicants" 
RENAME COLUMN "stateOfDomicile" TO "domicileStateUtCode";

ALTER TABLE "applicants"
ADD COLUMN "originalName" VARCHAR(200),
ADD COLUMN "normalizedName" VARCHAR(200),
ADD COLUMN "applicantType" VARCHAR(50),
ADD COLUMN "identityVerificationStatus" VARCHAR(30) NOT NULL DEFAULT 'UNVERIFIED',
ADD COLUMN "mobileVerificationStatus" VARCHAR(30) NOT NULL DEFAULT 'UNVERIFIED',
ADD COLUMN "emailVerificationStatus" VARCHAR(30) NOT NULL DEFAULT 'UNVERIFIED',
ADD COLUMN "preferredLanguage" VARCHAR(10) NOT NULL DEFAULT 'en',
ADD COLUMN "communityStatus" VARCHAR(30) NOT NULL DEFAULT 'SELF_DECLARED',
ADD COLUMN "pvtgStatus" VARCHAR(30) NOT NULL DEFAULT 'NOT_APPLICABLE',
ADD COLUMN "communityVerificationStatus" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
ADD COLUMN "communityVerificationSource" VARCHAR(50),
ADD COLUMN "communityVerifiedAt" TIMESTAMPTZ(6),
ADD COLUMN "profileVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "profileCompletion" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Map existing ekYC verified status to Identity Verification status
UPDATE "applicants" SET "identityVerificationStatus" = 'VERIFIED' WHERE "eKycVerified" = true;
UPDATE "applicants" SET "mobileVerificationStatus" = 'VERIFIED' WHERE "contactMobile" IS NOT NULL;
UPDATE "applicants" SET "emailVerificationStatus" = 'VERIFIED' WHERE "contactEmail" IS NOT NULL;
UPDATE "applicants" SET "communityStatus" = 'SELF_DECLARED', "communityVerificationStatus" = 'PENDING';

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "applicantId" UUID NOT NULL,
    "addressType" VARCHAR(20) NOT NULL,
    "addressLine1" VARCHAR(200) NOT NULL,
    "addressLine2" VARCHAR(200),
    "villageTownCity" VARCHAR(100) NOT NULL,
    "district" VARCHAR(100) NOT NULL,
    "stateUtCode" VARCHAR(10) NOT NULL,
    "postalCode" VARCHAR(20) NOT NULL,
    "countryCode" VARCHAR(5) NOT NULL DEFAULT 'IN',
    "verificationStatus" VARCHAR(30) NOT NULL DEFAULT 'UNVERIFIED',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education_records" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "applicantId" UUID NOT NULL,
    "level" VARCHAR(50) NOT NULL,
    "qualification" VARCHAR(100),
    "institutionId" VARCHAR(100),
    "institutionName" VARCHAR(255) NOT NULL,
    "boardUniversity" VARCHAR(200),
    "academicYear" VARCHAR(20),
    "startDate" DATE,
    "endDate" DATE,
    "marksObtained" DECIMAL(8,2),
    "marksMaximum" DECIMAL(8,2),
    "rawCgpa" DECIMAL(5,2),
    "gradingScale" DECIMAL(5,2),
    "convertedPercentage" DECIMAL(5,2),
    "conversionSource" VARCHAR(50),
    "conversionVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" VARCHAR(30) NOT NULL DEFAULT 'UNVERIFIED',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "education_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disability_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "applicantId" UUID NOT NULL,
    "hasDisability" BOOLEAN NOT NULL DEFAULT false,
    "disabilityType" VARCHAR(100),
    "disabilityPercentage" DECIMAL(5,2),
    "certificateReference" VARCHAR(100),
    "verificationStatus" VARCHAR(30) NOT NULL DEFAULT 'UNVERIFIED',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "disability_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guardian_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "applicantId" UUID NOT NULL,
    "guardianRelationship" VARCHAR(50) NOT NULL,
    "guardianName" VARCHAR(200) NOT NULL,
    "incomeSource" VARCHAR(100),
    "familyMemberCount" INTEGER,
    "isSingleParent" BOOLEAN NOT NULL DEFAULT false,
    "isOrphan" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guardian_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "addresses_applicantId_idx" ON "addresses"("applicantId");
CREATE INDEX "education_records_applicantId_idx" ON "education_records"("applicantId");
CREATE UNIQUE INDEX "disability_profiles_applicantId_key" ON "disability_profiles"("applicantId");
CREATE UNIQUE INDEX "guardian_profiles_applicantId_key" ON "guardian_profiles"("applicantId");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "education_records" ADD CONSTRAINT "education_records_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "disability_profiles" ADD CONSTRAINT "disability_profiles_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "guardian_profiles" ADD CONSTRAINT "guardian_profiles_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "bank_accounts"
ADD COLUMN "verificationStatus" VARCHAR(30) NOT NULL DEFAULT 'UNVERIFIED',
ADD COLUMN "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "applications"
ADD COLUMN "profileSnapshot" JSONB,
ADD COLUMN "profileVersionSnapshot" INTEGER;

ALTER TABLE "application_versions"
ADD COLUMN "profileSnapshot" JSONB,
ADD COLUMN "profileVersionSnapshot" INTEGER;
