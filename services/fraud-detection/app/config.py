from typing import Literal
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuration settings for Fraud Detection Service."""

    service_name: str = Field(default="fraud-detection-service", description="Name of microservice")
    environment: Literal["development", "staging", "production", "test"] = Field(
        default="development", description="Runtime environment"
    )
    debug: bool = Field(default=False, description="Debug mode flag")
    host: str = Field(default="0.0.0.0", description="Host address to bind")
    port: int = Field(default=8003, description="Port to listen on")

    # Risk thresholds
    low_risk_threshold: float = Field(default=0.25, ge=0.0, le=1.0, description="Upper bound for LOW risk")
    medium_risk_threshold: float = Field(default=0.60, ge=0.0, le=1.0, description="Upper bound for MEDIUM risk")
    high_risk_threshold: float = Field(default=0.85, ge=0.0, le=1.0, description="Upper bound for HIGH risk")

    # Database and Cache
    postgres_dsn: str = Field(
        default="postgresql://sfms_user:sfms_pass@localhost:5432/sfms_fraud",
        description="PostgreSQL Connection URL",
    )
    redis_url: str = Field(
        default="redis://localhost:6379/0",
        description="Redis Connection URL",
    )

    # ML Model Config
    model_version: str = Field(default="xgboost-v1.4-production", description="Active XGBoost Model Version")
    model_artifact_path: str = Field(
        default="/models/fraud_xgboost_v1.json",
        description="Path to serialized XGBoost model weights",
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()
