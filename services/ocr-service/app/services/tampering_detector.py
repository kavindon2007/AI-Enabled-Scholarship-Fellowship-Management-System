from app.schemas.ocr_schemas import TamperingResult, DocumentMetadata

class TamperingDetector:
    async def analyze(self, file_url: str) -> tuple[TamperingResult, DocumentMetadata]:
        # Mock implementation of pHash, EXIF analysis, ELA, etc.
        metadata = DocumentMetadata(
            phash="a1b2c3d4e5f60789",
            file_size_bytes=1048576,
            mime_type="image/jpeg"
        )
        tampering = TamperingResult(
            is_tampered=False,
            confidence=0.99,
            flags=[]
        )
        return tampering, metadata

def get_tampering_detector() -> TamperingDetector:
    return TamperingDetector()
