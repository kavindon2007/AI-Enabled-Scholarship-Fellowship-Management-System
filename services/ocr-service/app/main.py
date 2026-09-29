from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes.ocr import router as ocr_router
from app.config import settings
from app.errors.exceptions import AppError

app = FastAPI(
    title=settings.app_name,
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    status_map = {
        "NOT_FOUND": 404,
        "VALIDATION_ERROR": 422,
        "CONFLICT": 409,
        "FORBIDDEN": 403,
        "INTERNAL_ERROR": 500
    }
    return JSONResponse(
        status_code=status_map.get(exc.code, 500),
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details
            }
        }
    )

app.include_router(ocr_router)

@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
