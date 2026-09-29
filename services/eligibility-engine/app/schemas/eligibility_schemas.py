from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from typing import Literal
from datetime import datetime

class ApplicantData(BaseModel):
    annual_income: float
    caste_category: str
    previous_year_marks_percentage: float
    is_domicile: bool
    disabled: bool
    disability_percentage: float | None = None

class EvaluateEligibilityRequest(BaseModel):
    application_id: UUID
    scheme_id: UUID
    applicant_data: ApplicantData

    model_config = ConfigDict(strict=True)

class RuleVerdict(BaseModel):
    rule_id: str
    rule_name: str
    passed: bool
    message: str | None = None

    model_config = ConfigDict(strict=True)

class EligibilityResult(BaseModel):
    application_id: UUID
    scheme_id: UUID
    outcome: Literal["PASS", "FAIL", "DEFICIENT"]
    rule_results: list[RuleVerdict]
    evaluated_at: datetime

    model_config = ConfigDict(strict=True)
