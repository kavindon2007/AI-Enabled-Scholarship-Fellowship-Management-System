from typing import Any
from uuid import UUID
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase # type: ignore
from app.config import settings
from app.schemas.ocr_schemas import OCRResult
from app.errors.exceptions import NotFoundError

class OCRRepository:
    def __init__(self) -> None:
        self.client: AsyncIOMotorClient[Any] = AsyncIOMotorClient(settings.mongodb_uri)
        self.db: AsyncIOMotorDatabase[Any] = self.client.get_database()
        self.collection = self.db["ocr_results"]

    async def save_result(self, result: OCRResult) -> None:
        doc = result.model_dump(mode='json')
        # upsert based on document_id
        await self.collection.update_one(
            {"document_id": str(result.document_id)},
            {"$set": doc},
            upsert=True
        )

    async def get_result(self, document_id: UUID) -> OCRResult:
        doc = await self.collection.find_one({"document_id": str(document_id)})
        if not doc:
            raise NotFoundError(f"OCR Result for document {document_id} not found")
        # Removing injected _id from Mongo
        doc.pop("_id", None)
        return OCRResult(**doc)

def get_ocr_repository() -> OCRRepository:
    return OCRRepository()
