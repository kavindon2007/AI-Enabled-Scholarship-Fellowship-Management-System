import asyncio
from celery import Celery # type: ignore
from asgiref.sync import async_to_sync # type: ignore
from app.config import settings
from app.schemas.ocr_schemas import OCRJobRequest
from app.services.ocr_service import get_ocr_service
from app.repositories.ocr_repository import get_ocr_repository
from app.services.azure_ocr_service import get_azure_ocr_service
from app.services.tesseract_ocr_service import get_tesseract_ocr_service
from app.services.tampering_detector import get_tampering_detector

celery_app = Celery(
    "ocr_worker",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend
)

@celery_app.task(name="app.workers.ocr_worker.process_ocr_task", bind=True, max_retries=3)
def process_ocr_task(self, payload: dict) -> dict: # type: ignore
    request = OCRJobRequest(**payload)

    repo = get_ocr_repository()
    azure_ocr = get_azure_ocr_service()
    tesseract = get_tesseract_ocr_service()
    tampering = get_tampering_detector()

    service = get_ocr_service(repo, azure_ocr, tesseract, tampering)

    try:
        # Run async function in sync wrapper
        loop = asyncio.get_event_loop()
        if loop.is_closed():
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)

        loop.run_until_complete(service.process_document(request))
        return {"status": "SUCCESS", "document_id": str(request.document_id)}
    except Exception as e:
        self.retry(exc=e, countdown=10)
        return {"status": "FAILED", "error": str(e)}
