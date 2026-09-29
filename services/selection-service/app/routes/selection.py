from fastapi import APIRouter, Depends, status
from uuid import UUID
from app.schemas.selection_schemas import MeritListRequest, MeritList, MeritListApprovalRequest, QuotaApplicationRequest
from app.services.selection_service import SelectionService
from typing import Any

router = APIRouter(prefix="/ai/selection", tags=["Selection"])

def get_selection_service(service: SelectionService = Depends()) -> SelectionService:
    return service

@router.post(
    "/generate-merit-list",
    response_model=MeritList,
    status_code=status.HTTP_201_CREATED
)
async def generate_merit_list(
    request: MeritListRequest,
    service: SelectionService = Depends(get_selection_service)
) -> MeritList:
    return await service.generate_merit_list(request)

@router.get(
    "/merit-list/{scheme_id}/{academic_year}",
    response_model=MeritList
)
async def get_merit_list(
    scheme_id: UUID,
    academic_year: str,
    service: SelectionService = Depends(get_selection_service)
) -> MeritList:
    return await service.get_merit_list(scheme_id, academic_year)

@router.post(
    "/apply-quotas",
    response_model=MeritList
)
async def apply_quotas(
    request: QuotaApplicationRequest,
    service: SelectionService = Depends(get_selection_service)
) -> MeritList:
    return await service.get_merit_list_by_id(request.merit_list_id)

@router.patch(
    "/merit-list/{id}/approve",
    response_model=MeritList
)
async def approve_merit_list(
    id: UUID,
    approval: MeritListApprovalRequest,
    service: SelectionService = Depends(get_selection_service)
) -> MeritList:
    return await service.approve_merit_list(id, approval)
