"""Database layer — PostgreSQL via SQLAlchemy 2.0 async.

Production:  Neon PostgreSQL  → DATABASE_URL=postgresql+asyncpg://…
Local dev:   SQLite (zero setup) → default sqlite+aiosqlite:///./dalanhealth.db

Tables are created automatically at boot (`Base.metadata.create_all`) — fine
for a greenfield schema. When the schema starts evolving with real data in
production, introduce Alembic migrations and remove create_all.
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncIterator

from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.config import settings


class Base(DeclarativeBase):
    pass


def _normalize_url(url: str) -> str:
    """Accept common Postgres URL spellings (Neon/Railway hand out
    `postgres://` or `postgresql://`) and route them to the asyncpg driver."""
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+asyncpg://", 1)
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    return url


class Database:
    def __init__(self) -> None:
        self.engine: AsyncEngine | None = None
        self.session_factory: async_sessionmaker[AsyncSession] | None = None

    async def connect(self) -> None:
        url = _normalize_url(settings.database_url)
        # Neon's pooled endpoints run PgBouncer (transaction mode) — disable
        # asyncpg's prepared-statement cache, it's incompatible with PgBouncer.
        connect_args = {"statement_cache_size": 0} if url.startswith("postgresql+asyncpg") else {}
        self.engine = create_async_engine(
            url,
            echo=False,
            pool_pre_ping=True,
            connect_args=connect_args,
        )
        self.session_factory = async_sessionmaker(self.engine, expire_on_commit=False)

        # Import models so create_all sees every table.
        from app.models import orm  # noqa: F401

        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async def disconnect(self) -> None:
        if self.engine:
            await self.engine.dispose()

    async def ping(self) -> bool:
        try:
            if self.engine is None:
                return False
            async with self.engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            return True
        except Exception:
            return False


db = Database()


async def get_session() -> AsyncIterator[AsyncSession]:
    """FastAPI dependency — one session per request."""
    if db.session_factory is None:
        raise RuntimeError("Database not connected")
    async with db.session_factory() as session:
        yield session


@asynccontextmanager
async def session_scope() -> AsyncIterator[AsyncSession]:
    """For services that run outside a request dependency."""
    if db.session_factory is None:
        raise RuntimeError("Database not connected")
    async with db.session_factory() as session:
        yield session
