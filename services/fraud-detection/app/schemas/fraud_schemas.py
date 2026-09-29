from datetime import datetime
from enum import Enum
from typing import Literal
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class RiskLevel(str, Enum):
    """Enumeration of fraud risk classification levels."""

    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class CertificateDocument(BaseModel):
    """Document certificate metadata and perceptual hash."""

    document_id: UUID
    doc_type: Literal["INCOME", "CASTE", "DOMICILE", "MARKSHEET", "BONAFIDE", "DISABILITY"]
    issuing_authority: str
    certificate_number: str
    issue_date: str
    digital_signature_present: bool
    qr_code_verified: bool
    phash: str = Field(description="Perceptual hash string of document image")

    model_config = ConfigDict(strict=True)


class BankAccountInput(BaseModel):
    """Applicant bank account details."""

    account_number_hash: str = Field(description="SHA-256 hash of bank account number")
    ifsc_code: str
    account_holder_name: str
    aadhaar_seeded: bool
    dbt_enabled: bool

    model_config = ConfigDict(strict=True)


class AcademicDetailsInput(BaseModel):
    """Applicant academic records for verification."""

    institution_aishe_code: str
    course_name: str
    current_year_of_study: int
    marks_percentage: float = Field(ge=0.0, le=100.0)
    attendance_percentage: float = Field(ge=0.0, le=100.0)
    board_or_university_code: str
    roll_number: str

    model_config = ConfigDict(strict=True)


class IncomeFamilyInput(BaseModel):
    """Family and income details."""

    annual_income: float = Field(ge=0.0)
    family_members_count: int = Field(ge=1)
    earning_members_count: int = Field(ge=0)
    ration_card_type: Literal["AAY", "BPL", "APL", "NONE"]
    itr_filed: bool
    declared_agriculture_land_acres: float = Field(ge=0.0)

    model_config = ConfigDict(strict=True)


class FraudScoreRequest(BaseModel):
    """Request DTO to initiate comprehensive fraud scoring."""

    application_id: UUID
    applicant_id: UUID
    scheme_id: UUID
    scheme_code: str
    academic_year: str = Field(pattern=r"^\d{4}-\d{2}$")
    documents: list[CertificateDocument]
    bank_account: BankAccountInput
    academic_details: AcademicDetailsInput
    income_details: IncomeFamilyInput
    existing_scholarship_ids: list[UUID] = Field(default_factory=list)

    model_config = ConfigDict(strict=True)


class SignalResult(BaseModel):
    """Output from an individual signal detection module."""

    signal_name: str
    risk_contribution: float = Field(ge=0.0, le=1.0, description="Normalized risk score 0.0 - 1.0")
    flagged: bool
    severity: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    reasons: list[str]
    metadata: dict[str, str | int | float | bool] = Field(default_factory=dict)

    model_config = ConfigDict(strict=True)


class FeatureVector(BaseModel):
    """Engineered 7-signal numerical feature vector passed to ML Scorer."""

    application_id: UUID
    f1_authority_tamper_score: float = Field(ge=0.0, le=1.0)
    f2_phash_duplicate_score: float = Field(ge=0.0, le=1.0)
    f3_cross_scheme_clash_score: float = Field(ge=0.0, le=1.0)
    f4_income_anomaly_score: float = Field(ge=0.0, le=1.0)
    f5_ghost_institution_score: float = Field(ge=0.0, le=1.0)
    f6_bank_clustering_score: float = Field(ge=0.0, le=1.0)
    f7_academic_discrepancy_score: float = Field(ge=0.0, le=1.0)

    model_config = ConfigDict(strict=True)

    def to_feature_list(self) -> list[float]:
        """Convert feature vector to ordered list for model inference."""
        return [
            self.f1_authority_tamper_score,
            self.f2_phash_duplicate_score,
            self.f3_cross_scheme_clash_score,
            self.f4_income_anomaly_score,
            self.f5_ghost_institution_score,
            self.f6_bank_clustering_score,
            self.f7_academic_discrepancy_score,
        ]


class FeatureImportance(BaseModel):
    """Explainability breakdown indicating which signal contributed to the score."""

    feature_name: str
    contribution_weight: float
    description: str

    model_config = ConfigDict(strict=True)


class FraudEvaluationResponse(BaseModel):
    """Comprehensive response body for fraud score evaluation."""

    application_id: UUID
    applicant_id: UUID
    scheme_id: UUID
    fraud_risk_score: float = Field(ge=0.0, le=1.0, description="Composite risk score between 0.0 and 1.0")
    risk_level: RiskLevel
    model_version: str
    evaluated_at: datetime
    signals: list[SignalResult]
    feature_vector: FeatureVector
    top_risk_factors: list[FeatureImportance]
    recommendation: Literal["AUTO_APPROVE", "ROUTINE_REVIEW", "PRIORITY_INVESTIGATION", "REJECT_SUSPECTED_FRAUD"]

    model_config = ConfigDict(strict=True)


class FraudScoreEnvelope(BaseModel):
    """Standardized API response wrapper."""

    data: FraudEvaluationResponse | None = None
    error: dict[str, object] | None = None
    meta: dict[str, str]

    model_config = ConfigDict(strict=True)
