from typing import Dict, Protocol
from app.schemas.ocr_schemas import ExtractedField

class TesseractProvider(Protocol):
    async def extract_text(self, file_url: str) -> Dict[str, ExtractedField]:
        ...

class MockTesseractProvider:
    def __init__(self, mode: str = "SUCCESS"):
        self.mode = mode

    async def extract_text(self, file_url: str) -> Dict[str, ExtractedField]:
        if self.mode == "SUCCESS":
            return {
                "raw_text": ExtractedField(value="Mock raw text from Tesseract...", confidence=0.85)
            }
        elif self.mode == "FAILURE":
            raise Exception("TESSERACT_OCR_API_ERROR_SIMULATED")
        else:
            return {}

class TesseractOCRService:
    def __init__(self, provider: TesseractProvider = None):
        self.provider = provider or MockTesseractProvider("SUCCESS")

    async def extract_text(self, file_url: str) -> Dict[str, ExtractedField]:
        return await self.provider.extract_text(file_url)

def get_tesseract_ocr_service() -> TesseractOCRService:
    return TesseractOCRService()
