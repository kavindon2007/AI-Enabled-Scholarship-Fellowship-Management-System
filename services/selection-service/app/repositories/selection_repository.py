from uuid import UUID, uuid4
from typing import List, Optional, Dict, Any, Literal
from app.schemas.selection_schemas import MeritList, MeritListEntry, ApplicationScore
from app.errors.exceptions import NotFoundError
from datetime import datetime, timezone

# In-memory mock for now as we don't have the sqlalchemy setup completely modelled
_merit_lists: Dict[UUID, MeritList] = {}

class SelectionRepository:
    async def get_eligible_applications(self, scheme_id: UUID, academic_year: str) -> List[ApplicationScore]:
        # Mock data source
        return [
            ApplicationScore(
                application_id=uuid4(),
                student_id=uuid4(),
                base_score=85.5,
                category="SC",
                is_female=True,
                is_divyangjan=False
            ),
            ApplicationScore(
                application_id=uuid4(),
                student_id=uuid4(),
                base_score=92.0,
                category="GENERAL",
                is_female=False,
                is_divyangjan=False
            ),
            ApplicationScore(
                application_id=uuid4(),
                student_id=uuid4(),
                base_score=78.0,
                category="ST",
                is_female=True,
                is_divyangjan=True
            ),
            ApplicationScore(
                application_id=uuid4(),
                student_id=uuid4(),
                base_score=65.5,
                category="PVTG",
                is_female=False,
                is_divyangjan=False
            ),
        ]

    async def save_merit_list(self, merit_list: MeritList) -> MeritList:
        _merit_lists[merit_list.id] = merit_list
        return merit_list

    async def get_merit_list(self, scheme_id: UUID, academic_year: str) -> MeritList:
        for ml in _merit_lists.values():
            if ml.scheme_id == scheme_id and ml.academic_year == academic_year:
                return ml
        raise NotFoundError(f"Merit list for scheme {scheme_id} year {academic_year} not found")

    async def get_merit_list_by_id(self, merit_list_id: UUID) -> MeritList:
        if merit_list_id not in _merit_lists:
            raise NotFoundError(f"Merit list with id {merit_list_id} not found")
        return _merit_lists[merit_list_id]

    async def update_merit_list_status(self, merit_list_id: UUID, status: Literal["DRAFT", "PUBLISHED", "APPROVED"], approved_by: UUID) -> MeritList:
        if merit_list_id not in _merit_lists:
            raise NotFoundError(f"Merit list with id {merit_list_id} not found")

        ml = _merit_lists[merit_list_id]
        ml.status = status
        ml.approved_by = approved_by
        ml.approved_at = datetime.now(timezone.utc)
        return ml
