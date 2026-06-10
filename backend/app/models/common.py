from datetime import datetime, timezone

from pydantic import BaseModel, ConfigDict, Field

# Legacy alias from the MongoDB era — ids are plain UUID strings now.
PyObjectId = str


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class BaseDoc(BaseModel):
    """Shared shape for API-facing Pydantic schemas. The persistent schema
    lives in app/models/orm.py (SQLAlchemy); these classes describe payloads."""

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
    id: str | None = None
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)
