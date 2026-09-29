from typing import Dict, Protocol
from app.schemas.ocr_schemas import ExtractedField

class OCRProvider(Protocol):
    async def extract_text(self, file_url: str, document_type: str) -> Dict[str, ExtractedField]:
        ...

class MockAzureOCRProvider:
    def __init__(self, mode: str = "SUCCESS"):
        self.mode = mode

    async def extract_text(self, file_url: str, document_type: str) -> Dict[str, ExtractedField]:
        if self.mode == "SUCCESS":
            return {
                "name": ExtractedField(value="John Doe", confidence=0.98),
                "dob": ExtractedField(value="1990-01-01", confidence=0.95),
                "id_number": ExtractedField(value="1234-5678-9012", confidence=0.99)
            }
        elif self.mode == "FAILURE":
            raise Exception("AZURE_OCR_API_ERROR_SIMULATED")
        else:
            return {}

class AzureOCRService:
    def __init__(self, provider: OCRProvider = None):
        self.provider = provider or MockAzureOCRProvider("SUCCESS")

    async def extract_text(self, file_url: str, document_type: str) -> Dict[str, ExtractedField]:
        return await self.provider.extract_text(file_url, document_type)

def get_azure_ocr_service() -> AzureOCRService:
    return AzureOCRService()
