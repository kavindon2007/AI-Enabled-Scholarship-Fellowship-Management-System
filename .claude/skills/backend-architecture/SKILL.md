# AI-SFMS Backend Architecture Skill

Enforce type-safety, clean database migrations, and structural separation of concerns for the AI-SFMS codebase. This project uses **Python (FastAPI)** for AI/ML services, **Node.js (Express)** for application APIs, **PostgreSQL 15**, **MongoDB 7**, **Redis 7**, **Elasticsearch 8**, and **Apache Kafka** for messaging.

---

## 1. Structural Separation of Concerns

### Python (FastAPI) Services — AI/ML Layer

Organize every FastAPI service (`ocr-service`, `eligibility-engine`, `fraud-detection`, `selection-service`) in this directory layout:

```
services/<service-name>/
├── app/
│   ├── __init__.py
│   ├── main.py                # FastAPI app factory, lifespan, middleware
│   ├── config.py              # Pydantic BaseSettings — all env vars
│   ├── routes/                # One router file per domain resource
│   │   ├── __init__.py
│   │   └── ocr.py             # e.g. POST /ai/ocr, POST /ai/classify-document
│   ├── services/              # Business logic — NO framework imports
│   │   ├── __init__.py
│   │   └── ocr_service.py
│   ├── repositories/          # Data access — DB queries, MinIO, external APIs
│   │   ├── __init__.py
│   │   └── ocr_repository.py
│   ├── models/                # SQLAlchemy / ODMantic ORM models
│   │   ├── __init__.py
│   │   └── document.py
│   ├── schemas/               # Pydantic request/response models (DTOs)
│   │   ├── __init__.py
│   │   └── ocr_schemas.py
│   ├── errors/                # Custom exception classes
│   │   ├── __init__.py
│   │   └── exceptions.py
│   ├── middleware/             # Auth guards, rate limiters, correlation-id
│   │   └── auth.py
│   ├── workers/               # Celery tasks / Kafka consumers
│   │   └── ocr_worker.py
│   └── utils/
│       └── helpers.py
├── migrations/                # Alembic migrations
│   ├── env.py
│   └── versions/
├── tests/
│   ├── unit/
│   └── integration/
├── alembic.ini
├── pyproject.toml
└── Dockerfile
```

**Hard rules:**
- `routes/` files import from `services/` only — never from `repositories/` or ORM models.
- `services/` files import from `repositories/` only — never use `Request`, `Response`, or any FastAPI/Starlette type.
- `repositories/` files return Pydantic `schemas/` DTOs or plain dicts — never leak ORM model instances.
- `schemas/` define every request body, response body, and internal DTO as a Pydantic `BaseModel` — no raw dicts crossing layer boundaries.
- Dependency injection via FastAPI `Depends()` wires repositories into services and services into routes.

### Node.js (Express) Services — Application Layer

Organize every Express service (`application-service`, `document-service`, `communication-service`, `grievance-service`, `disbursement-service`) in this directory layout:

```
services/<service-name>/
├── src/
│   ├── index.ts               # Express app bootstrap
│   ├── config/
│   │   └── index.ts           # env vars via zod schema validation
│   ├── routes/                # Express Router files — one per resource
│   │   └── applications.ts
│   ├── controllers/           # Thin — parse req, call service, send res
│   │   └── applicationController.ts
│   ├── services/              # Business logic — NO Express types
│   │   └── applicationService.ts
│   ├── repositories/          # Data access — Knex/Prisma queries, Kafka producers
│   │   └── applicationRepository.ts
│   ├── models/                # Prisma schema or Knex table types
│   │   └── application.ts
│   ├── schemas/               # Zod request/response validation schemas
│   │   └── applicationSchemas.ts
│   ├── errors/                # Custom error classes with HTTP status mapping
│   │   └── AppError.ts
│   ├── middleware/
│   │   ├── auth.ts            # NIC SSO / JWT verification
│   │   ├── errorHandler.ts    # Central error-to-HTTP mapper
│   │   └── rateLimiter.ts
│   ├── events/                # Kafka producers and consumers
│   │   └── applicationEvents.ts
│   ├── types/                 # Shared TypeScript interfaces
│   │   └── index.ts
│   └── utils/
│       └── helpers.ts
├── migrations/                # Knex or Prisma migrations
├── tests/
│   ├── unit/
│   └── integration/
├── tsconfig.json
├── package.json
└── Dockerfile
```

**Hard rules:**
- `controllers/` parse `req` and call `services/` — never import a repository.
- `services/` contain all business logic and call `repositories/` — never reference `req`, `res`, or `next`.
- `repositories/` return typed DTOs from `types/` — never raw Knex `Row` objects or Prisma models with relations attached.
- All request bodies validated through Zod schemas in `schemas/` before reaching a controller.

---

## 2. Type-Safety Rules

### Python — Enforced Everywhere

1. **Every function signature must have full type annotations** — parameters and return type. No `Any` except at serialization boundaries (e.g., raw JSON from Kafka).

2. **Pydantic `BaseModel` for all DTOs:**
   ```python
   class EligibilityResult(BaseModel):
       application_id: UUID
       scheme_id: UUID
       outcome: Literal["PASS", "FAIL", "DEFICIENT"]
       rule_results: list[RuleVerdict]
       evaluated_at: datetime

       model_config = ConfigDict(strict=True)
   ```
   Use `Literal` for enums with a small fixed set. Use `enum.Enum` subclasses for larger domain enums (scheme codes, document types).

3. **Pydantic `BaseSettings` for config** — every environment variable declared with a type, default, and validation. Never use raw `os.getenv()`.

4. **`strict=True` on all Pydantic models** — no silent coercion (string "123" will not silently become int 123).

5. **SQLAlchemy models use `Mapped[T]` annotations** (SQLAlchemy 2.0 style). Never use the legacy `Column()` without a type.

6. **mypy / pyright strict mode** — include a `pyproject.toml` section:
   ```toml
   [tool.mypy]
   strict = true
   plugins = ["pydantic.mypy", "sqlalchemy.ext.mypy.plugin"]
   disallow_untyped_defs = true
   warn_return_any = true
   ```

7. **Celery task signatures** — every Celery task function must declare typed parameters and return type. Task result payloads are Pydantic models serialized to JSON.

### TypeScript (Node.js) — Enforced Everywhere

1. **`strict: true` in `tsconfig.json`** — includes `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `noUncheckedIndexedAccess`.

2. **Zod schemas derive TypeScript types** — never duplicate a type manually:
   ```typescript
   const ApplicationCreateSchema = z.object({
     schemeId: z.string().uuid(),
     academicYear: z.string().regex(/^\d{4}-\d{2}$/),
     formData: z.record(z.unknown()),
   });
   type ApplicationCreate = z.infer<typeof ApplicationCreateSchema>;
   ```

3. **No `any`** — use `unknown` and narrow with type guards. The only exception is third-party library interop where the library exports `any` and you immediately cast.

4. **Branded types for domain IDs:**
   ```typescript
   type ApplicationId = string & { readonly __brand: "ApplicationId" };
   type SchemeId = string & { readonly __brand: "SchemeId" };
   ```
   Prevents accidentally passing a `SchemeId` where an `ApplicationId` is expected.

5. **All Express handlers typed:**
   ```typescript
   type TypedHandler<TBody, TParams, TResponse> =
     RequestHandler<TParams, TResponse, TBody>;
   ```

6. **`as const` for fixed string unions** (statuses, risk levels, document types):
   ```typescript
   const APPLICATION_STATUSES = [
     "DRAFT", "SUBMITTED", "AI_SCREENING", "DEFICIENCY_RAISED",
     "RESUBMITTED", "OFFICER_REVIEW", "APPROVED", "REJECTED",
     "SHORTLISTED", "SELECTED", "DISBURSED",
   ] as const;
   type ApplicationStatus = typeof APPLICATION_STATUSES[number];
   ```

---

## 3. Database Migration Rules

### PostgreSQL — Alembic (Python services) / Knex or Prisma (Node.js services)

1. **Every schema change goes through a migration file** — never manually run `ALTER TABLE` in production or modify the ORM model without a corresponding migration.

2. **Migration naming convention:** `YYYYMMDD_HHMMSS_<short_description>.<ext>`
   - Alembic: auto-generated revision IDs are fine, but the `message` must be descriptive: `"add_seeding_status_to_bank_accounts"`, not `"update"`.
   - Knex: file names are `20260929_143000_add_seeding_status_to_bank_accounts.ts`.

3. **Every migration must have a rollback** (`downgrade()` in Alembic, `down()` in Knex). Test the rollback locally before committing.

4. **No destructive migrations without a two-step process:**
   - To rename a column: Step 1 migration adds the new column with a default. Step 2 migration (next release) drops the old column after all code references are updated.
   - To drop a table: Step 1 migration adds a `_deprecated` suffix. Step 2 migration (after verification) drops it.
   - To change a column type: Step 1 adds a new column with the target type and a data-copy trigger. Step 2 drops the old column.

5. **Data migrations are separate files** from schema migrations. A schema migration changes structure. A data migration backfills or transforms rows. Never mix them — a failed data backfill should not roll back a schema change.

6. **Default values:** Every new non-nullable column added to an existing table must have a `server_default` in the migration. Never add a `NOT NULL` column without a default to a populated table.

7. **Indexes:** Every column used in a `WHERE`, `JOIN`, or `ORDER BY` in a query must have an index. Add the index in the same migration that adds the column if it will be queried. For composite indexes, document the query pattern in a migration comment.

8. **Foreign keys:** Every `REFERENCES` constraint must have an `ON DELETE` policy explicitly stated — `CASCADE`, `SET NULL`, or `RESTRICT`. Never rely on the database default.

9. **JSONB columns:** When adding a JSONB column (like `form_data`, `risk_flags`, `eligibility_rules`), add a `CHECK` constraint or use a Pydantic/Zod schema for application-level validation. Document the expected JSON structure in a migration comment.

10. **Environment isolation:** Migrations run through a CI pipeline. The pipeline runs `upgrade` against a fresh database clone, runs all tests, then runs `downgrade` to verify rollback — all before merging.

### MongoDB — Schema Validation

1. **Every MongoDB collection must have a JSON Schema validator** set at creation:
   ```javascript
   db.createCollection("ocr_results", {
     validator: {
       $jsonSchema: {
         bsonType: "object",
         required: ["document_id", "application_id", "doc_type", "extracted_fields"],
         properties: {
           document_id: { bsonType: "string" },
           extracted_fields: { bsonType: "object" },
           confidence_scores: { bsonType: "object" },
         }
       }
     }
   });
   ```

2. **Schema changes are versioned migration scripts** stored in `migrations/mongodb/` and executed in order via a migration runner (e.g., `migrate-mongo`). Never change validators by hand in production.

3. **Index creation** is always a separate migration script. Use `createIndex` with `{ background: true }` for existing collections with data.

---

## 4. Secure Webhook and Auth Scaffolding

### Kafka Event Consumers (Internal Webhooks)

When generating a Kafka consumer (e.g., `document-uploaded`, `application-submitted`, `ocr-complete`):

1. **Typed event schemas** — define the event payload as a Pydantic model (Python) or Zod schema (TypeScript). Deserialize and validate before processing.
2. **Idempotency key** — every event must carry an `event_id` (UUID). The consumer checks a processed-events table/set before handling. Duplicate events are logged and skipped.
3. **Dead letter queue** — failed events (after 3 retries with exponential backoff) go to a `<topic>.dlq` topic. Never silently drop events.
4. **Consumer group isolation** — each microservice uses its own consumer group. Two services consuming the same topic must not share a group ID.

### External Webhook Receivers (DigiLocker callbacks, PFMS confirmations, CPGRAMS)

1. **Signature verification** — verify `X-Signature` / HMAC header using the provider's documented algorithm and a secret from environment variables. Reject before any processing on failure.
2. **Raw body capture** — use a raw body parser middleware (`express.raw()` / FastAPI `Request.body()`) before JSON parsing, specifically for signature verification.
3. **Replay protection** — reject events with a timestamp header older than 5 minutes (configurable).
4. **Immediate 200 OK** — respond instantly, enqueue the payload to Kafka for async processing.
5. **Payload logging** — log event type and ID only. Never log the full payload (may contain PII — Aadhaar data, bank account details).

### Authentication Scaffolding

1. **Applicant auth** — Aadhaar OTP eKYC only (no passwords). Session stored as a short-lived JWT (15 min access token) + server-side refresh token in Redis. Access token goes in `Authorization: Bearer` header. Refresh token in HTTP-only, Secure, SameSite=Strict cookie.
2. **Officer auth** — NIC SSO (OpenID Connect). Token validated at Kong API Gateway and re-validated at the service middleware layer. Role extracted from token claims.
3. **RBAC middleware** — Express middleware / FastAPI dependency that extracts the user's role and permissions from the JWT, then checks against the required permission for the route:
   ```python
   # Python
   def require_role(*roles: str) -> Callable:
       async def guard(user: AuthUser = Depends(get_current_user)):
           if user.role not in roles:
               raise ForbiddenError(f"Role {user.role} not permitted")
           return user
       return guard
   ```
   ```typescript
   // TypeScript
   const requireRole = (...roles: OfficerRole[]) =>
     (req: AuthRequest, _res: Response, next: NextFunction) => {
       if (!roles.includes(req.user.role)) {
         throw new ForbiddenError(`Role ${req.user.role} not permitted`);
       }
       next();
     };
   ```
4. **Resource-level authorization** — after role check, verify the user has access to the specific resource (e.g., an officer assigned to Pre-Matric cannot access NFST applications). Enforce in the service layer, not just the route.
5. **PostgreSQL Row-Level Security** — in addition to application-level RBAC, every table with officer-scoped data has RLS policies. Generate the `CREATE POLICY` statements in migrations.

### Secrets

- All secrets from environment variables or a secrets manager (HashiCorp Vault / AWS Secrets Manager).
- Generate a `.env.example` with every required variable and placeholder values.
- `.env` is in `.gitignore`. Verify this on every project scaffold.
- Aadhaar numbers are **never** stored in plain text. SHA-256 with per-record salt. Bank account numbers are AES-256-GCM encrypted at the repository layer before storage.

---

## 5. Cross-Cutting Rules

1. **Error handling** — every layer throws typed domain errors (`NotFoundError`, `ConflictError`, `ValidationError`, `ForbiddenError`). The route/controller layer maps them to HTTP status codes via a central error handler middleware. Never catch-and-swallow exceptions silently.

2. **Logging** — structured JSON logs (Python: `structlog`; Node.js: `pino`). Every log entry includes `correlation_id` (passed via `X-Correlation-ID` header or generated at API Gateway), `service_name`, `timestamp`. Never log PII (Aadhaar, bank account, names) — log IDs only.

3. **Health checks** — every service exposes `GET /health` returning:
   ```json
   { "status": "ok", "dependencies": { "postgres": "ok", "kafka": "ok", "redis": "ok" } }
   ```

4. **API response envelope** — all REST responses follow:
   ```json
   {
     "data": { ... },
     "error": null | { "code": "VALIDATION_ERROR", "message": "...", "details": [...] },
     "meta": { "requestId": "...", "timestamp": "..." }
   }
   ```

5. **Testing** — generate a unit test stub for every service file (mock repositories) and an integration test stub for every route file (test the HTTP layer). Fraud detection and eligibility engine services require property-based tests (Hypothesis for Python, fast-check for TypeScript) against the rule configurations.
