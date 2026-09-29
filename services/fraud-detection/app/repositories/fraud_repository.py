from datetime import datetime, timezone
from uuid import UUID
from app.schemas.fraud_schemas import (
    FeatureImportance,
    FeatureVector,
    FraudEvaluationResponse,
    RiskLevel,
    SignalResult,
)


class FraudRepository:
    """Repository handling persistent storage and retrieval of fraud evaluations and cluster indexes."""

    def __init__(self) -> None:
        # In-memory backing store for demo/unit tests (synchronized with DB in production)
        self._evaluations_store: dict[UUID, FraudEvaluationResponse] = {}
        self._doc_hash_registry: list[dict[str, str | UUID]] = []
        self._bank_cluster_registry: dict[str, list[UUID]] = {}
        self._active_scholarship_registry: dict[UUID, list[dict[str, str | UUID]]] = {}

    async def save_evaluation(self, evaluation: FraudEvaluationResponse) -> FraudEvaluationResponse:
        """Persist a completed fraud evaluation response."""
        self._evaluations_store[evaluation.application_id] = evaluation
        return evaluation

    async def get_by_application_id(self, application_id: UUID) -> FraudEvaluationResponse | None:
        """Retrieve evaluation response for a given application ID."""
        return self._evaluations_store.get(application_id)

    async def get_existing_hashes(self) -> list[dict[str, str | UUID]]:
        """Retrieve historical document perceptual hashes for deduplication."""
        return self._doc_hash_registry

    async def register_document_hashes(
        self, applicant_id: UUID, hashes: list[dict[str, str | UUID]]
    ) -> None:
        """Register newly analyzed document hashes into the global index."""
        self._doc_hash_registry.extend(hashes)

    async def get_bank_clusters(self) -> dict[str, list[UUID]]:
        """Retrieve the bank account clustering registry."""
        return self._bank_cluster_registry

    async def register_bank_account(self, account_hash: str, applicant_id: UUID) -> None:
        """Register an applicant under a bank account hash cluster."""
        if account_hash not in self._bank_cluster_registry:
            self._bank_cluster_registry[account_hash] = []
        if applicant_id not in self._bank_cluster_registry[account_hash]:
            self._bank_cluster_registry[account_hash].append(applicant_id)

    async def get_active_scholarships_for_applicant(
        self, applicant_id: UUID
    ) -> list[dict[str, str | UUID]]:
        """Retrieve concurrent or historical scholarship records for an applicant."""
        return self._active_scholarship_registry.get(applicant_id, [])
