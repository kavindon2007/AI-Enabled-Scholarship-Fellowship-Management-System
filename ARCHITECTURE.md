# Architecture and Service Boundaries Audit

## Overview
This document summarizes the current state of the AI-SFMS monorepo, delineating the physical service boundaries, identifying mock components, and outlining the necessary steps to transition to a production-grade infrastructure.

## Service Boundaries
The repository is split into distinct microservices, communicating largely via synchronous HTTP APIs and asynchronous Kafka events. 

- **application-service**: Core domain. Manages `Application`, `SchemeVersion`, `RuleDefinition`, etc. Persistence via PostgreSQL + Prisma.
- **document-service**: Manages file uploads (S3/MinIO) and metadata (PostgreSQL). Emits `document-uploaded` Kafka events.
- **ocr-service**: Python/FastAPI service wrapping OCR providers (Azure Document Intelligence, local Tesseract fallback). Consumes `document-uploaded`, emits `ocr-complete`.
- **eligibility-engine**: Python/FastAPI service evaluating applications against `SchemeVersion` rules.
- **fraud-detection**: Python service for scoring risk based on heuristics and ML.
- **selection-service**: Python service handling merit lists and quotas.
- **disbursement-service**: Integrates with PFMS and NPCI for DBTs.
- **grievance-service**: Integrates with CPGRAMS.
- **communication-service**: Manages SMS/Email notifications (SMTP, SMS Gateway).

## Current Mocks & Workarounds Removed
During the audit, the following mock implementations were formalized or replaced:
1. **document-service**: Removed in-memory `MOCK_DB`. Replaced with a PostgreSQL `pg` pool.
2. **document-service (Storage)**: Extracted raw AWS SDK calls into a formal `StorageProvider` (MinIO).
3. **authMiddleware**: Replaced silent, bypass-able mock JWT headers with a centralized `requireAuth` enforcing `req.user` ownership.
4. **disbursement-service**: Transformed random `Math.random()` endpoints for PFMS, NPCI Base, and Penny Drop into deterministic adapter providers (`MockPfmsProvider`, `MockNpciBaseProvider`).
5. **ocr-service**: Transformed hardcoded OCR responses into a deterministic `MockAzureOCRProvider`.
6. **grievance-service**: Transformed hardcoded CPGRAMS registration returns into a `MockCpgramsProvider`.
7. **frontend**: Removed hardcoded applications and schemes in `Dashboard.tsx`, routing them properly through an `apiClient`.

## Data Persistence Strategy
- **PostgreSQL**: Used for all core relational data (Applications, Documents, Audit Events, Schemes, Rules).
- **MongoDB**: Used by the `ocr-service` for unstructured raw extraction payloads and bounding box storage.
- **Redis**: Used for short-term caching (e.g., scheme configurations, rate limiting).
- **MinIO**: S3-compatible blob storage for all applicant documents.

## Next Steps
- Implement full Prisma migrations for all domains.
- Instantiate actual Kafka consumers across all Python and Node services.
- Finalize the `eligibility-engine` rule parser to evaluate JSON logic against applicant data.
