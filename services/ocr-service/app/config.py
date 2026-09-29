from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "OCR Service"
    mongodb_uri: str
    redis_uri: str
    celery_broker_url: str
    celery_result_backend: str
    azure_ocr_api_key: str | None = None
    azure_ocr_endpoint: str | None = None
    tesseract_cmd_path: str = "tesseract"
    kafka_bootstrap_servers: str = "localhost:9092"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
