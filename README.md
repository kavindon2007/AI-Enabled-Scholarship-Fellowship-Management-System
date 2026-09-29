
# AI-SFMS: AI-Enabled Scholarship & Fellowship Management System



<p align="center">
  <img src="./assets/banner.png" alt="AI-SFMS Project Banner" width="100%" />
</p>

**Ministry of Tribal Affairs (MoTA), Government of India**  
*Smart India Hackathon Project Repository*

---

## 🏛️ About The Project

The **AI-Enabled Scholarship & Fellowship Management System (AI-SFMS)** is a greenfield, cloud-native platform designed to streamline and automate the entire lifecycle of scholarship and fellowship schemes managed by the Ministry of Tribal Affairs. 

Covering 5 major schemes (Pre-Matric, Post-Matric, National Fellowship/NFST, National Overseas Scholarship/NOS, and Top Class Institutes), the platform eliminates manual bottlenecks, prevents silent DBT failures, and replaces hardcoded legacy validation with a dynamic, rule-driven evaluation engine.

---

## 🚀 Core Architecture & Tech Stack

* **Monorepo Manager:** `pnpm workspaces` (`services/*`, `packages/*`, `frontend/*`)
* **Backend Services (Node.js & Express):** High-throughput application APIs, document handling, communications, grievances, and disbursement orchestration written in **TypeScript (strict mode)**.
* **AI/ML & Analytics Services (Python & FastAPI):** Asynchronous OCR pipelines, configurable rule engines, and XGBoost-based fraud risk scoring running in an independent, high-performance runtime.
* **Databases & Storage:**
  * **PostgreSQL 15:** Transactional data, relational schemas, and Prisma ORM migrations.
  * **MongoDB 7:** Unstructured OCR JSON extractions and dynamic form configuration schemas.
  * **Redis 7:** Session caching, rate-limiting counters, and Celery task brokerage.
  * **MinIO (MeghRaj S3-compatible):** Secure object storage for documents with server-side AES-256 encryption.
  * **Elasticsearch 8:** WORM (Write Once Read Many) immutable audit logs and full-text search.
* **Message Broker:** Apache Kafka for decoupled, event-driven inter-service communication (`document-uploaded`, `ocr-complete`, `application-submitted`, etc.).
* **Frontend:** Vite + React Progressive Web App (PWA) supporting offline IndexedDB caching, dynamic JSON form rendering, and multi-language support (Hindi + 8 regional languages).

---

## 📂 Repository Structure

```text
ai-sfms/
├── pnpm-workspace.yaml          # Workspace definitions
├── package.json                 # Root orchestration scripts
├── tsconfig.base.json           # Shared TypeScript strict configuration
├── docker-compose.yml           # Full infrastructure (Postgres, Mongo, Redis, Kafka, MinIO, ES)
├── assets/                      # System branding, presentation files, and app logos
│   ├── logo.jpeg                # Main application logo / UI asset
│   └── banner.png               # Project banner graphic
├── services/
│   ├── application-service/     # Node.js Express — Student lifecycle & submissions
│   ├── document-service/        # Node.js Express — File uploads & DigiLocker sync
│   ├── communication-service/   # Node.js Express — Multi-channel notifications
│   ├── grievance-service/       # Node.js Express — SLA ticketing & CPGRAMS sync
│   ├── disbursement-service/    # Node.js Express — PFMS & DBT Pre-Failure Monitor
│   ├── ocr-service/             # Python FastAPI — Azure AI Doc Intelligence & Tesseract
│   ├── eligibility-engine/      # Python FastAPI — JSON-driven rule evaluation pipeline
│   ├── fraud-detection/         # Python FastAPI — XGBoost risk-scoring & pHash checks
│   └── selection-service/       # Python FastAPI — Merit ranking & quota allocation
├── packages/
│   └── shared-types/            # Shared Zod schemas, branded IDs, and Kafka event definitions
└── frontend/
    └── applicant-portal/        # Vite + React PWA (Offline-capable & multi-language)
```

## 🛠️ Getting Started & Local Development

### Prerequisites

-   Node.js (v18+) & `pnpm`
    
-   Python 3.10+ & `pip` / `poetry`
    
-   Docker & Docker Compose
    

### 1\. Environment Setup

Copy the environment template and populate your local credentials:

Bash

```
cp .env.example .env
```

### 2\. Launch Infrastructure Services

Spin up PostgreSQL, MongoDB, Redis, Kafka, MinIO, and Elasticsearch using Docker Compose:

Bash

```
docker compose up -d
```

### 3\. Install Dependencies

Install all monorepo workspace dependencies via pnpm:

Bash

```
pnpm install
```

### 4\. Run Database Migrations

Deploy Prisma database schemas to PostgreSQL:

Bash

```
pnpm migrate
```

### 5\. Start Development Servers

Run the full system in development mode:

Bash

```
pnpm dev
```

## 🌟 Key Technical Features

1.  **Configurable Rule Engine:** Scheme rules (income limits, caste checks, course levels) are stored as JSON configurations evaluated dynamically, requiring zero code changes for policy updates.
    
2.  **AI & OCR Pipeline:** Multi-language text extraction supporting 14 document types, backed by Azure AI Document Intelligence and local Tesseract fallback, complete with perceptual hashing (pHash) for tampering and duplicate detection.
    
3.  **DBT Pre-Failure Monitor:** Automated background jobs that query the NPCI BASE API 30 days prior to disbursement, catching inactive Aadhaar seeding early and routing unresolved cases to India Post Payments Bank (IPPB).
    
4.  **Offline-Capable PWA:** Tailored for low-connectivity environments with service workers and IndexedDB draft caching.
    

## 🖼️ Assets & Presentation Materials

-   The official application logo (`logo.jpeg`) and visual assets are located in the [`assets/`](https://www.google.com/search?q=./assets/) directory.
    
-   Presentation slide decks and pitch materials can be updated and aligned directly with these architectural specifications.
    

## 🛡️ Security & Compliance

-   **DPDP Act 2023 Compliant:** Explicit consent flows, data minimization, and secure 7-year retention policies.
    
-   **Zero Plain-Text PII:** Aadhaar numbers are securely hashed (`SHA-256` with salt); bank accounts are encrypted (`AES-256-GCM`).
    
-   **Database Row-Level Security (RLS):** Strict isolation ensuring officers only access authorized applications within their respective schemes and states.