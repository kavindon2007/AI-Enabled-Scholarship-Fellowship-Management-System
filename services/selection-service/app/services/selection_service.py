from fastapi import Depends
from uuid import UUID, uuid4
from datetime import datetime, timezone
from app.repositories.selection_repository import SelectionRepository
from app.services.merit_calculator import MeritCalculator
from app.services.quota_engine import QuotaEngine
from app.schemas.selection_schemas import MeritListRequest, MeritList, MeritListApprovalRequest

def get_selection_repository() -> SelectionRepository:
    return SelectionRepository()

def get_merit_calculator() -> MeritCalculator:
    return MeritCalculator()

def get_quota_engine() -> QuotaEngine:
    return QuotaEngine()

class SelectionService:
    def __init__(
        self,
        repository: SelectionRepository = Depends(get_selection_repository),
        calculator: MeritCalculator = Depends(get_merit_calculator),
        quota_engine: QuotaEngine = Depends(get_quota_engine),
    ) -> None:
        self.repository = repository
        self.calculator = calculator
        self.quota_engine = quota_engine

    async def generate_merit_list(self, request: MeritListRequest) -> MeritList:
        applications = await self.repository.get_eligible_applications(request.scheme_id, request.academic_year)
        scored_applications = self.calculator.calculate_scores(applications)
        
        entries = self.quota_engine.apply_quotas(scored_applications, request.total_slots)
        
        merit_list = MeritList(
            id=uuid4(),
            scheme_id=request.scheme_id,
            academic_year=request.academic_year,
            entries=entries,
            created_at=datetime.now(timezone.utc),
            status="DRAFT"
        )
        
        return await self.repository.save_merit_list(merit_list)

    async def get_merit_list(self, scheme_id: UUID, academic_year: str) -> MeritList:
        return await self.repository.get_merit_list(scheme_id, academic_year)
        
    async def get_merit_list_by_id(self, merit_list_id: UUID) -> MeritList:
        return await self.repository.get_merit_list_by_id(merit_list_id)

    async def approve_merit_list(self, merit_list_id: UUID, approval: MeritListApprovalRequest) -> MeritList:
        return await self.repository.update_merit_list_status(
            merit_list_id=merit_list_id,
            status="APPROVED",
            approved_by=approval.officer_id
        )
