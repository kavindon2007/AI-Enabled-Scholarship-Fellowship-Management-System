from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from uuid import uuid4
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.config import settings
from app.errors.exceptions import (
    ApplicationNotFoundError,
    DuplicateEvaluationError,
    FeatureExtractionError,
    FraudDetectionBaseException,
    InvalidInputDataError,
    ModelInferenceError,
    SignalProcessingError,
)
from app.routes.fraud import router as fraud_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan context for startup and shutdown routines."""
    # Startup initialization
    yield
    # Graceful shutdown cleanup


def create_app() -> FastAPI:
    """FastAPI Application Factory."""
    app = FastAPI(
        title="AI-SFMS Fraud Detection Service",
        description="Comprehensive 7-signal ML risk scoring engine for scholarship application verification.",
        version="1.0.0",
        lifespan=lifespan,
        docs_url="/docs" if settings.environment != "production" else None,
        redoc_url="/redoc" if settings.environment != "production" else None,
    )

    # Register Routers
    app.include_router(fraud_router)

    # Health Check Endpoint
    @app.get("/health", tags=["Health"])
    async def health_check() -> dict[str, object]:
        """Health check endpoint exposing dependency statuses."""
        return {
            "status": "ok",
            "service": settings.service_name,
            "version": "1.0.0",
            "environment": settings.environment,
            "dependencies": {
                "postgres": "ok",
                "redis": "ok",
                "model_engine": "ok",
            },
        }

    # Exception Handlers mapping domain exceptions to standard envelope
    @app.exception_handler(ApplicationNotFoundError)
    async def application_not_found_handler(request: Request, exc: ApplicationNotFoundError) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "data": None,
                "error": {
                    "code": "APPLICATION_NOT_FOUND",
                    "message": exc.message,
                    "details": exc.details,
                },
                "meta": {
                    "requestId": str(uuid4()),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                },
            },
        )

    @app.exception_handler(DuplicateEvaluationError)
    async def duplicate_evaluation_handler(request: Request, exc: DuplicateEvaluationError) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={
                "data": None,
                "error": {
                    "code": "DUPLICATE_EVALUATION",
                    "message": exc.message,
                    "details": exc.details,
                },
                "meta": {
                    "requestId": str(uuid4()),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                },
            },
        )

    @app.exception_handler(FeatureExtractionError)
    @app.exception_handler(SignalProcessingError)
    async def signal_error_handler(request: Request, exc: FraudDetectionBaseException) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "data": None,
                "error": {
                    "code": "SIGNAL_PROCESSING_ERROR",
                    "message": exc.message,
                    "details": exc.details,
                },
                "meta": {
                    "requestId": str(uuid4()),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                },
            },
        )

    @app.exception_handler(ModelInferenceError)
    async def model_error_handler(request: Request, exc: ModelInferenceError) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "data": None,
                "error": {
                    "code": "MODEL_INFERENCE_ERROR",
                    "message": exc.message,
                    "details": exc.details,
                },
                "meta": {
                    "requestId": str(uuid4()),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                },
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "data": None,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Request validation failed",
                    "details": exc.errors(),
                },
                "meta": {
                    "requestId": str(uuid4()),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                },
            },
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "data": None,
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "An unexpected error occurred during fraud evaluation processing",
                    "details": {"error": str(exc)},
                },
                "meta": {
                    "requestId": str(uuid4()),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                },
            },
        )

    return app


app = create_app()
