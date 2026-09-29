from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "eligibility-engine"
    environment: str = "development"
    debug: bool = False

    postgres_dsn: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/ai_sfms"
    kafka_brokers: str = "localhost:9092"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
