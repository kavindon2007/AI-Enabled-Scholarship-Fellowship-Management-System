from datetime import datetime, timezone
from uuid import UUID

from app.config import settings
from app.errors.exceptions import ApplicationNotFoundError, FeatureExtractionError
from app.repositories.fraud_repository import FraudRepository
from app.schemas.fraud_schemas import (
    FeatureVector,
    FraudEvaluationResponse,
    FraudScoreRequest,
    SignalResult,
)
from app.services.signals.academic_merit_verifier import AcademicMeritVerifier
from app.services.signals.authority_verifier import AuthorityVerifier
from app.services.signals.bank_account_validator import BankAccountValidator
from app.services.signals.cross_scheme_checker import CrossSchemeChecker
from app.services.signals.income_anomaly_detector import IncomeAnomalyDetector
from app.services.signals.institution_aishe_verifier import InstitutionAisheVerifier
from app.services.signals.phash_deduplicator import PhashDeduplicator
from app.services.xgboost_scorer import XGBoostScorer


class FraudService:
    """Core orchestration service coordinating 7-signal evaluation, XGBoost inference, and fraud score persistence."""

    def __init__(
        self,
        repository: FraudRepository,
        scorer: XGBoostScorer | None = None,
        authority_verifier: AuthorityVerifier | None = None,
        phash_deduplicator: PhashDeduplicator | None = None,
        cross_scheme_checker: CrossSchemeChecker | None = None,
        income_anomaly_detector: IncomeAnomalyDetector | None = None,
        institution_aishe_verifier: InstitutionAisheVerifier | None = None,
        bank_account_validator: BankAccountValidator | None = None,
        academic_merit_verifier: AcademicMeritVerifier | None = None,
    ) -> None:
        self._repo = repository
        self._scorer = scorer or XGBoostScorer()
        self._authority_verifier = authority_verifier or AuthorityVerifier()
        self._phash_deduplicator = phash_deduplicator or PhashDeduplicator()
        self._cross_scheme_checker = cross_scheme_checker or CrossSchemeChecker()
        self._income_anomaly_detector = income_anomaly_detector or IncomeAnomalyDetector()
        self._institution_aishe_verifier = institution_aishe_verifier or InstitutionAisheVerifier()
        self._bank_account_validator = bank_account_validator or BankAccountValidator()
        self._academic_merit_verifier = academic_merit_verifier or AcademicMeritVerifier()

    async def evaluate_fraud_score(self, request: FraudScoreRequest) -> FraudEvaluationResponse:
        """Run full 7-signal pipeline, construct feature vector, score with XGBoost, and persist report."""
        try:
            # 1. Fetch auxiliary state from repository
            existing_hashes = await self._repo.get_existing_hashes()
            bank_clusters = await self._repo.get_bank_clusters()
            active_scholarships = await self._repo.get_active_scholarships_for_applicant(request.applicant_id)

            # 2. Execute 7 signal processors
            sig1: SignalResult = self._authority_verifier.verify(request.documents)
            sig2: SignalResult = self._phash_deduplicator.check_duplicates(
                request.applicant_id, request.documents, existing_hashes
            )
            sig3: SignalResult = self._cross_scheme_checker.check_conflicts(
                request.applicant_id,
                request.scheme_code,
                request.academic_year,
                active_scholarships,
            )
            sig4: SignalResult = self._income_anomaly_detector.evaluate_income(request.income_details)
            sig5: SignalResult = self._institution_aishe_verifier.verify_institution(request.academic_details)
            sig6: SignalResult = self._bank_account_validator.validate(
                request.applicant_id, request.bank_account, bank_clusters
            )
            sig7: SignalResult = self._academic_merit_verifier.verify_merit(request.academic_details)

            all_signals: list[SignalResult] = [sig1, sig2, sig3, sig4, sig5, sig6, sig7]

            # 3. Assemble strict FeatureVector
            feature_vector = FeatureVector(
                application_id=request.application_id,
                f1_authority_tamper_score=sig1.risk_contribution,
                f2_phash_duplicate_score=sig2.risk_contribution,
                f3_cross_scheme_clash_score=sig3.risk_contribution,
                f4_income_anomaly_score=sig4.risk_contribution,
                f5_ghost_institution_score=sig5.risk_contribution,
                f6_bank_clustering_score=sig6.risk_contribution,
                f7_academic_discrepancy_score=sig7.risk_contribution,
            )

            # 4. XGBoost Inference & Feature Importance
            risk_score, risk_level, top_factors, recommendation = self._scorer.score_features(feature_vector)

            # 5. Build evaluation response
            response = FraudEvaluationResponse(
                application_id=request.application_id,
                applicant_id=request.applicant_id,
                scheme_id=request.scheme_id,
                fraud_risk_score=risk_score,
                risk_level=risk_level,
                model_version=settings.model_version,
                evaluated_at=datetime.now(timezone.utc),
                signals=all_signals,
                feature_vector=feature_vector,
                top_risk_factors=top_factors,
                recommendation=recommendation,
            )

            # 6. Persist results and update registries
            await self._repo.save_evaluation(response)

            # Register document hashes & bank account for future comparisons
            new_hashes: list[dict[str, str | UUID]] = [
                {"applicant_id": request.applicant_id, "phash": doc.phash, "doc_type": doc.doc_type}
                for doc in request.documents
                if doc.phash
            ]
            await self._repo.register_document_hashes(request.applicant_id, new_hashes)
            await self._repo.register_bank_account(request.bank_account.account_number_hash, request.applicant_id)

            return response

        except Exception as exc:
            if not isinstance(exc, (FeatureExtractionError, ApplicationNotFoundError)):
                raise FeatureExtractionError(
                    f"Failed during fraud signal extraction: {str(exc)}",
                    details={"application_id": str(request.application_id)},
                ) from exc
            raise

    async def get_fraud_score(self, application_id: UUID) -> FraudEvaluationResponse:
        """Fetch previously calculated fraud evaluation response by application ID."""
        evaluation = await self._repo.get_by_application_id(application_id)
        if not evaluation:
            raise ApplicationNotFoundError(
                f"Fraud evaluation for application {application_id} not found",
                details={"application_id": str(application_id)},
            )
        return evaluation
