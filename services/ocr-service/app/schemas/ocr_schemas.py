from pydantic import BaseModel, ConfigDict, Field
from typing import Literal, Any
from uuid import UUID
from datetime import datetime

class Box(BaseModel):
    x: float
    y: float
    width: float
    height: float

    model_config = ConfigDict(strict=True)

class ExtractedField(BaseModel):
    value: str
    confidence: float
    box: Box | None = None

    model_config = ConfigDict(strict=True)

class OCRJobRequest(BaseModel):
    document_id: UUID
    application_id: UUID
    document_type: Literal["AADHAAR", "PAN", "INCOME_CERTIFICATE", "CASTE_CERTIFICATE", "BANK_PASSBOOK", "MARKSHEET"]
    file_url: str

    model_config = ConfigDict(strict=True)

class OCRJobResponse(BaseModel):
    job_id: str
    status: Literal["PENDING", "PROCESSING", "COMPLETED", "FAILED"]
    message: str | None = None

    model_config = ConfigDict(strict=True)

class DocumentMetadata(BaseModel):
    phash: str | None = None
    file_size_bytes: int
    mime_type: str

    model_config = ConfigDict(strict=True)

class TamperingResult(BaseModel):
    is_tampered: bool
    confidence: float
    flags: list[str] = []

    model_config = ConfigDict(strict=True)

class OCRResult(BaseModel):
    document_id: UUID
    application_id: UUID
    document_type: str
    extracted_fields: dict[str, ExtractedField] = {}
    tampering_result: TamperingResult
    metadata: DocumentMetadata
    processed_at: datetime

    model_config = ConfigDict(strict=True)

class OCRResultResponse(BaseModel):
    data: OCRResult

    model_config = ConfigDict(strict=True)
