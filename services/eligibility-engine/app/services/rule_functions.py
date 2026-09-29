from app.schemas.eligibility_schemas import ApplicantData, RuleVerdict

def evaluate_income_limit(applicant_data: ApplicantData, max_income: float = 250000.0) -> RuleVerdict:
    passed = applicant_data.annual_income <= max_income
    message = None
    if not passed:
        message = f"Annual income {applicant_data.annual_income} exceeds maximum limit of {max_income}."

    return RuleVerdict(
        rule_id="RUL_INCOME_01",
        rule_name="Annual Income Limit",
        passed=passed,
        message=message
    )

def evaluate_marks_threshold(applicant_data: ApplicantData, min_marks: float = 50.0) -> RuleVerdict:
    passed = applicant_data.previous_year_marks_percentage >= min_marks
    message = None
    if not passed:
        message = f"Previous year marks {applicant_data.previous_year_marks_percentage}% is below minimum required {min_marks}%."

    return RuleVerdict(
        rule_id="RUL_MARKS_01",
        rule_name="Previous Year Marks Minimum",
        passed=passed,
        message=message
    )

def evaluate_domicile_status(applicant_data: ApplicantData) -> RuleVerdict:
    passed = applicant_data.is_domicile
    message = None
    if not passed:
        message = "Applicant must be a domicile of the required region."

    return RuleVerdict(
        rule_id="RUL_DOMICILE_01",
        rule_name="Domicile Requirement",
        passed=passed,
        message=message
    )
