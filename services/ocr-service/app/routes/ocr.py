from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from typing import Dict, Any
from uuid import uuid4
import time

# Create a simple in-memory job store for demo purposes
# In a real app, this would be backed by PostgreSQL OCRJob model in application-service
jobs_db: Dict[str, Dict[str, Any]] = {}

router = APIRouter(prefix="/api/v1/ocr", tags=["OCR"])

async def mock_process_document(job_id: str, document_url: str, doc_type: str):
    from app.ocr_core.pipeline import process_document_pipeline
    
    jobs_db[job_id]["status"] = "PROCESSING"
    
    try:
        # Simulate download & processing time
        await __import__("asyncio").sleep(2)
        
        # We pass a mock path since we aren't downloading it for the demo
        result = await process_document_pipeline("mock_image.jpg", doc_type)
        
        jobs_db[job_id]["status"] = "COMPLETED"
        jobs_db[job_id]["result"] = result
    except Exception as e:
        jobs_db[job_id]["status"] = "FAILED"
        jobs_db[job_id]["error"] = str(e)


@router.post("/jobs", status_code=status.HTTP_202_ACCEPTED)
async def submit_ocr_job(request: Dict[str, Any], background_tasks: BackgroundTasks):
    """Submit a document for OCR extraction."""
    document_url = request.get("document_url", "")
    doc_type = request.get("doc_type", "ST_CERTIFICATE")
    
    job_id = f"OCR-{uuid4().hex[:8].upper()}"
    
    jobs_db[job_id] = {
        "job_id": job_id,
        "status": "PENDING",
        "document_url": document_url,
        "doc_type": doc_type,
        "created_at": time.time()
    }
    
    # Enqueue background processing
    background_tasks.add_task(mock_process_document, job_id, document_url, doc_type)
    
    return {
        "job_id": job_id,
        "status": "PENDING",
        "message": "OCR processing job accepted."
    }

@router.get("/jobs/{job_id}")
async def get_ocr_job_status(job_id: str):
    """Check status and get results of an OCR job."""
    if job_id not in jobs_db:
        raise HTTPException(status_code=404, detail="Job not found")
        
    return jobs_db[job_id]
