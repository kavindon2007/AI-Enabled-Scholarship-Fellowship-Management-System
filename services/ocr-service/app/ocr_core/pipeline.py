import asyncio
from typing import Dict, Any
import numpy as np
import cv2

from app.ocr_core.engines.fusion import run_ocr_fusion
from app.ocr_core.extraction.field_extractor import extract_st_certificate_fields

async def process_document_pipeline(image_path: str, doc_type: str = "ST_CERTIFICATE") -> Dict[str, Any]:
    """Simulates a complete OCR pipeline execution."""
    
    # Normally we'd fetch image from minio, but for demo we can mock or read local
    image = cv2.imread(image_path)
    if image is None:
        # Mock image if not found for demo purposes
        image = np.zeros((800, 600, 3), dtype=np.uint8)
        
    # 1. OCR Engines & Fusion
    texts, confidence = run_ocr_fusion(image)
    
    # 2. Field Extraction
    if doc_type == "ST_CERTIFICATE":
        fields = extract_st_certificate_fields(texts)
    else:
        # Fallback empty
        fields = {}
        
    return {
        "engine": "Fusion (EasyOCR + Tesseract)",
        "overall_confidence": round(confidence, 2),
        "fields": fields,
        "vision": {
            "signature": True,
            "stamp": True
        }
    }
