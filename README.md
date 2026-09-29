# AI-SFMS — AI-Enabled Scholarship & Fellowship Management System

Ministry of Tribal Affairs, Government of India

## Tech Stack

- **Application APIs**: Node.js (Express + TypeScript + Prisma)
- **AI/ML Services**: Python (FastAPI + Celery)
- **Databases**: PostgreSQL 15, MongoDB 7, Redis 7, Elasticsearch 8
- **Messaging**: Apache Kafka
- **Storage**: MinIO (S3-compatible)
- **Frontend**: React + Vite (PWA)

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Python >= 3.11
- Docker & Docker Compose

### Setup

```bash
# Install dependencies
pnpm install

# Start infrastructure
pnpm docker:up

# Run database migrations
pnpm migrate

# Start all services in development
pnpm dev
```

### Project Structure

```
ai-sfms/
├── packages/shared-types/       # Shared Zod schemas, branded IDs, Kafka events
├── services/
│   ├── application-service/     # Node.js — application lifecycle
│   ├── document-service/        # Node.js — document upload, MinIO, DigiLocker
│   ├── communication-service/   # Node.js — SMS, email, in-app notifications
│   ├── grievance-service/       # Node.js — grievance management, SLA engine
│   ├── disbursement-service/    # Node.js — PFMS, DBT, seeding checks
│   ├── ocr-service/             # Python — OCR pipeline, Azure AI + Tesseract
│   ├── eligibility-engine/      # Python — configurable rule engine
│   ├── fraud-detection/         # Python — XGBoost risk scoring, 7 signals
│   └── selection-service/       # Python — merit lists, quota allocation
└── frontend/
    └── applicant-portal/        # React PWA — applicant-facing portal
```

## Schemes

1. Pre-Matric Scholarship (Class IX-X)
2. Post-Matric Scholarship (Class XI to Post-Graduation)
3. National Fellowship for ST (NFST)
4. National Overseas Scholarship (NOS)
5. Top Class Education Scholarship
