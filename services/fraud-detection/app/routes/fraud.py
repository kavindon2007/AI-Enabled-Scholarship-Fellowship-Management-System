from datetime import datetime, timezone
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, Path, status
from app.repositories.fraud_repository import FraudRepository
from app.schemas.fraud_schemas import (
    FraudEvaluationResponse,
    FraudScoreEnvelope,
    FraudScoreRequest,
)
from app.services.fraud_service import FraudService

router = APIRouter(prefix="/ai/fraud", tags=["Fraud Detection"])

# Shared singleton repository instance for application lifecycle
_repository_instance = FraudRepository()


def get_fraud_service() -> FraudService:
    """Dependency provider delivering FraudService with repository wiring."""
    return FraudService(repository=_repository_instance)


@router.post(
    "/score",
    response_model=FraudScoreEnvelope,
    status_code=status.HTTP_200_OK,
    summary="Compute 7-Signal Fraud Risk Score",
    description="Analyzes certificate tamper, pHash duplicates, cross-scheme clashes, income anomalies, ghost institutions, bank clusters, and academic merit to compute an XGBoost risk score.",
)
async def compute_fraud_score(
    request: FraudScoreRequest,
    service: FraudService = Depends(get_fraud_service),
) -> FraudScoreEnvelope:
    """Endpoint to trigger ML fraud scoring on an incoming scholarship application."""
    result: FraudEvaluationResponse = await service.evaluate_fraud_score(request)
    return FraudScoreEnvelope(
        data=result,
        error=None,
        meta={
            "requestId": str(uuid4()),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )


@router.get(
    "/score/{applicationId}",
    response_model=FraudScoreEnvelope,
    status_code=status.HTTP_200_OK,
    summary="Fetch Fraud Risk Evaluation",
    description="Retrieves the detailed fraud evaluation report and feature vector for a specific application.",
)
async def get_fraud_score(
    application_id: UUID = Path(..., alias="applicationId", description="Application UUID"),
    service: FraudService = Depends(get_fraud_service),
) -> FraudScoreEnvelope:
    """Endpoint to fetch previously computed fraud score details."""
    result: FraudEvaluationResponse = await service.get_fraud_score(application_id)
    return FraudScoreEnvelope(
        data=result,
        error=None,
        meta={
            "requestId": str(uuid4()),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )
