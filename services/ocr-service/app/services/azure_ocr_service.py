from app.schemas.ocr_schemas import ExtractedField

class AzureOCRService:
    async def extract_text(self, file_url: str, document_type: str) -> dict[str, ExtractedField]:
        # Mocking calls to Azure Document Intelligence
        return {
            "name": ExtractedField(value="John Doe", confidence=0.98),
            "dob": ExtractedField(value="1990-01-01", confidence=0.95),
            "id_number": ExtractedField(value="1234-5678-9012", confidence=0.99)
        }

def get_azure_ocr_service() -> AzureOCRService:
    return AzureOCRService()
