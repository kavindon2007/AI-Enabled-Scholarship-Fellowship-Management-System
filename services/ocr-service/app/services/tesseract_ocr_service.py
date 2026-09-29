from app.schemas.ocr_schemas import ExtractedField

class TesseractOCRService:
    async def extract_text(self, file_url: str) -> dict[str, ExtractedField]:
        # Fallback local Tesseract mock
        return {
            "raw_text": ExtractedField(value="Mock raw text from Tesseract...", confidence=0.85)
        }

def get_tesseract_ocr_service() -> TesseractOCRService:
    return TesseractOCRService()
