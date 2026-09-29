from fastapi import FastAPI
from app.config import settings
from app.routes.eligibility import router as eligibility_router

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        debug=settings.debug,
    )

    # Register routers
    app.include_router(eligibility_router)

    @app.get("/health")
    async def health_check() -> dict[str, str | dict[str, str]]:
        return {
            "status": "ok",
            "dependencies": {
                "postgres": "ok",
                "kafka": "ok",
                "redis": "ok"
            }
        }

    return app

app = create_app()
