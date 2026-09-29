from fastapi import APIRouter
from app.schemas.eligibility_schemas import EvaluateEligibilityRequest, EligibilityResult
from app.services.eligibility_service import evaluate_eligibility

router = APIRouter(prefix="/ai/eligibility", tags=["eligibility"])

@router.post("/evaluate", response_model=EligibilityResult)
async def evaluate(request: EvaluateEligibilityRequest) -> EligibilityResult:
    """
    Evaluates an application against eligibility rules for a specific scheme.
    """
    # Validation happens via Pydantic on the request object
    result = await evaluate_eligibility(request)
    return result
