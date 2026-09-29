from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from app.schemas.ocr_schemas import OCRJobRequest, OCRJobResponse, OCRResultResponse, OCRResult
from app.services.ocr_service import OCRService, get_ocr_service
from app.repositories.ocr_repository import OCRRepository, get_ocr_repository
from app.services.azure_ocr_service import AzureOCRService, get_azure_ocr_service
from app.services.tesseract_ocr_service import TesseractOCRService, get_tesseract_ocr_service
from app.services.tampering_detector import TamperingDetector, get_tampering_detector
from app.workers.ocr_worker import process_ocr_task
from app.errors.exceptions import NotFoundError

router = APIRouter(prefix="/ai/ocr", tags=["OCR"])

def provide_ocr_service(
    repo: OCRRepository = Depends(get_ocr_repository),
    azure: AzureOCRService = Depends(get_azure_ocr_service),
    tesseract: TesseractOCRService = Depends(get_tesseract_ocr_service),
    tampering: TamperingDetector = Depends(get_tampering_detector)
) -> OCRService:
    return get_ocr_service(repo, azure, tesseract, tampering)

@router.post("/process", response_model=OCRJobResponse, status_code=status.HTTP_202_ACCEPTED)
async def process_document(request: OCRJobRequest) -> OCRJobResponse:
    # Validate payload then enqueue to Celery Worker
    task = process_ocr_task.delay(request.model_dump(mode='json'))
    return OCRJobResponse(
        job_id=task.id,
        status="PENDING",
        message="OCR processing request accepted and enqueued."
    )

@router.get("/status/{job_id}", response_model=OCRJobResponse)
async def get_job_status(job_id: str) -> OCRJobResponse:
    from app.workers.ocr_worker import celery_app
    res = celery_app.AsyncResult(job_id)
    state = res.state
    # Map Celery states to our literal
    status_map = {
        "PENDING": "PENDING",
        "STARTED": "PROCESSING",
        "SUCCESS": "COMPLETED",
        "FAILURE": "FAILED"
    }
    mapped_status = status_map.get(state, "PROCESSING")
    return OCRJobResponse(
        job_id=job_id,
        status=mapped_status # type: ignore
    )

@router.get("/results/{document_id}", response_model=OCRResultResponse)
async def get_results(
    document_id: UUID,
    service: OCRService = Depends(provide_ocr_service)
) -> OCRResultResponse:
    try:
        result = await service.get_result(document_id)
        return OCRResultResponse(data=result)
    except NotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
