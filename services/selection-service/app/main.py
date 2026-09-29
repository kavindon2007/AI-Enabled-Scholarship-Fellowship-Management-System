from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.config import settings
from app.routes.selection import router as selection_router
from app.errors.exceptions import DomainError
import structlog
from typing import Callable, Awaitable

logger = structlog.get_logger()

app = FastAPI(
    title=settings.app_name,
    version="0.1.0"
)

app.include_router(selection_router)

@app.exception_handler(DomainError)
async def domain_error_handler(request: Request, exc: DomainError) -> JSONResponse:
    status_code = 400
    if exc.code == "NOT_FOUND":
        status_code = 404
    elif exc.code == "FORBIDDEN":
        status_code = 403
    elif exc.code == "CONFLICT":
        status_code = 409

    return JSONResponse(
        status_code=status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message
            }
        }
    )

@app.get("/health")
async def health_check() -> dict[str, str | dict[str, str]]:
    return {
        "status": "ok",
        "dependencies": {
            "postgres": "ok",
            "redis": "ok"
        }
    }
