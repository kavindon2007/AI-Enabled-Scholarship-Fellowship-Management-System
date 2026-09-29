# Fraud Detection Service

AI-SFMS comprehensive fraud detection and risk scoring engine powered by XGBoost.

## Overview

The fraud-detection service implements a 7-signal ML pipeline to detect scholarship application fraud patterns across:

1. **Authority Verifier** - Digital signature & issuing authority validation
2. **pHash Deduplicator** - Perceptual hash collision detection for document reuse
3. **Cross-Scheme Checker** - Concurrent benefit double-dipping detection
4. **Income Anomaly Detector** - Economic contradiction analysis
5. **Institution AISHE Verifier** - Ghost college & blacklist validation
6. **Bank Account Validator** - DBT eligibility & account clustering
7. **Academic Merit Verifier** - Marks-attendance correlation analysis

## API Endpoints

### POST /ai/fraud/score
Compute comprehensive fraud risk score for an application.

**Request Body:**
```json
{
  "application_id": "uuid",
  "applicant_id": "uuid",
  "scheme_id": "uuid",
  "scheme_code": "NSP_POST_MATRIC_SC_2026",
  "academic_year": "2026-27",
  "documents": [...],
  "bank_account": {...},
  "academic_details": {...},
  "income_details": {...}
}
```

**Response:**
```json
{
  "data": {
    "fraud_risk_score": 0.7234,
    "risk_level": "HIGH",
    "recommendation": "PRIORITY_INVESTIGATION",
    "signals": [...],
    "feature_vector": {...},
    "top_risk_factors": [...]
  },
  "error": null,
  "meta": {...}
}
```

### GET /ai/fraud/score/{applicationId}
Retrieve previously computed fraud evaluation.

## Risk Classification

- **LOW** (< 0.25): AUTO_APPROVE
- **MEDIUM** (0.25 - 0.60): ROUTINE_REVIEW
- **HIGH** (0.60 - 0.85): PRIORITY_INVESTIGATION
- **CRITICAL** (> 0.85): REJECT_SUSPECTED_FRAUD

## Development

```bash
# Install dependencies
poetry install

# Run service
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload

# Run tests
poetry run pytest tests/

# Type checking
poetry run mypy app/
```

## Environment Variables

```env
SERVICE_NAME=fraud-detection-service
ENVIRONMENT=development
PORT=8003
POSTGRES_DSN=postgresql://user:pass@localhost:5432/sfms_fraud
REDIS_URL=redis://localhost:6379/0
MODEL_VERSION=xgboost-v1.4-production
LOW_RISK_THRESHOLD=0.25
MEDIUM_RISK_THRESHOLD=0.60
HIGH_RISK_THRESHOLD=0.85
```

## Architecture

```
app/
├── main.py              # FastAPI app factory
├── config.py            # Pydantic settings
├── routes/              # HTTP endpoint layer
├── services/            # Business logic orchestration
│   ├── fraud_service.py
│   ├── xgboost_scorer.py
│   └── signals/         # 7 signal processors
├── repositories/        # Data access layer
├── schemas/             # Pydantic DTOs
└── errors/              # Domain exceptions
```
