from datetime import datetime, timezone
from typing import Literal

from app.schemas.eligibility_schemas import (
    EvaluateEligibilityRequest,
    EligibilityResult,
    RuleVerdict
)
from app.services.rule_functions import (
    evaluate_income_limit,
    evaluate_marks_threshold,
    evaluate_domicile_status
)

async def evaluate_eligibility(request: EvaluateEligibilityRequest) -> EligibilityResult:
    """
    Evaluates the rules against applicant data to determine eligibility.
    Typically, rules would be dynamically loaded via repositories based on the scheme_id.
    """
    applicant_data = request.applicant_data

    # Evaluate standard rules
    rule_results: list[RuleVerdict] = [
        evaluate_income_limit(applicant_data),
        evaluate_marks_threshold(applicant_data),
        evaluate_domicile_status(applicant_data)
    ]

    # Determine outcome based on rule verdicts
    all_passed = all(rule.passed for rule in rule_results)

    # Logic for DEFICIENT could be based on particular soft rules or missing documents in a real scenario
    outcome: Literal["PASS", "FAIL", "DEFICIENT"] = "PASS" if all_passed else "FAIL"

    return EligibilityResult(
        application_id=request.application_id,
        scheme_id=request.scheme_id,
        outcome=outcome,
        rule_results=rule_results,
        evaluated_at=datetime.now(timezone.utc)
    )
