from pydantic import BaseModel, ConfigDict, Field
from typing import Literal, List, Optional
from datetime import datetime
from uuid import UUID

class QuotaAllocation(BaseModel):
    category: Literal["GENERAL", "OBC", "SC", "ST", "PVTG", "DIVYANGJAN", "FEMALE"]
    allocated: bool
    description: str

    model_config = ConfigDict(strict=True)

class MeritListEntry(BaseModel):
    application_id: UUID
    student_id: UUID
    score: float
    rank: int
    quotas_applied: List[QuotaAllocation]
    status: Literal["SELECTED", "WAITLISTED", "REJECTED"]

    model_config = ConfigDict(strict=True)

class MeritListRequest(BaseModel):
    scheme_id: UUID
    academic_year: str = Field(..., pattern=r"^\d{4}-\d{2}$")
    total_slots: int = Field(..., gt=0)

    model_config = ConfigDict(strict=True)

class QuotaApplicationRequest(BaseModel):
    merit_list_id: UUID

    model_config = ConfigDict(strict=True)

class MeritList(BaseModel):
    id: UUID
    scheme_id: UUID
    academic_year: str
    entries: List[MeritListEntry]
    created_at: datetime
    status: Literal["DRAFT", "PUBLISHED", "APPROVED"]
    approved_by: Optional[UUID] = None
    approved_at: Optional[datetime] = None

    model_config = ConfigDict(strict=True)

class MeritListApprovalRequest(BaseModel):
    officer_id: UUID
    comments: Optional[str] = None

    model_config = ConfigDict(strict=True)

class ApplicationScore(BaseModel):
    application_id: UUID
    student_id: UUID
    base_score: float
    category: Literal["GENERAL", "OBC", "SC", "ST", "PVTG"]
    is_female: bool
    is_divyangjan: bool

    model_config = ConfigDict(strict=True)
