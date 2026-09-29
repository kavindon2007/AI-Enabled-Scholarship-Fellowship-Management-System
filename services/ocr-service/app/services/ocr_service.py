from uuid import UUID
from datetime import datetime
import asyncio
from app.schemas.ocr_schemas import OCRJobRequest, OCRResult
from app.repositories.ocr_repository import OCRRepository
from app.services.azure_ocr_service import AzureOCRService
from app.services.tesseract_ocr_service import TesseractOCRService
from app.services.tampering_detector import TamperingDetector

class OCRService:
    def __init__(
        self,
        repository: OCRRepository,
        azure_ocr: AzureOCRService,
        tesseract_ocr: TesseractOCRService,
        tampering_detector: TamperingDetector
    ) -> None:
        self.repository = repository
        self.azure_ocr = azure_ocr
        self.tesseract_ocr = tesseract_ocr
        self.tampering_detector = tampering_detector

    async def get_result(self, document_id: UUID) -> OCRResult:
        return await self.repository.get_result(document_id)

    async def process_document(self, request: OCRJobRequest) -> None:
        # 1. Tampering Check
        tampering_result, metadata = await self.tampering_detector.analyze(request.file_url)

        # 2. Try Azure Doc Intel
        try:
            fields = await self.azure_ocr.extract_text(request.file_url, request.document_type)
        except Exception:
            # 3. Fallback to Tesseract
            fields = await self.tesseract_ocr.extract_text(request.file_url)

        # 4. Construct Result
        result = OCRResult(
            document_id=request.document_id,
            application_id=request.application_id,
            document_type=request.document_type,
            extracted_fields=fields,
            tampering_result=tampering_result,
            metadata=metadata,
            processed_at=datetime.utcnow()
        )

        # 5. Save to DB
        await self.repository.save_result(result)

        # 6. (Optional) Produce to Kafka topic ocr-complete
        # In a real app we'd trigger Kafka here

def get_ocr_service(
    repository: OCRRepository,
    azure_ocr: AzureOCRService,
    tesseract_ocr: TesseractOCRService,
    tampering_detector: TamperingDetector
) -> OCRService:
    return OCRService(repository, azure_ocr, tesseract_ocr, tampering_detector)
