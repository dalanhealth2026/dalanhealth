"""Queue engine — sequential token assignment and status transitions.

Single source of truth: backend. Clients render, never compute.
"""

from datetime import datetime, timezone

from sqlalchemy import func, select

from app.database import session_scope
from app.models.orm import QueueEntryRow, row_to_dict
from app.models.queue import QueueSource, QueueStatus

ACTIVE_STATUSES = [
    QueueStatus.waiting.value,
    QueueStatus.queued.value,
    QueueStatus.in_consultation.value,
]


def today_key() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


async def enqueue(
    clinic_id: str,
    patient_id: str,
    patient_name: str,
    patient_mobile: str,
    source: QueueSource,
) -> dict:
    date_key = today_key()
    async with session_scope() as session:
        max_token = await session.scalar(
            select(func.max(QueueEntryRow.token)).where(
                QueueEntryRow.clinic_id == clinic_id,
                QueueEntryRow.date_key == date_key,
            )
        )
        entry = QueueEntryRow(
            clinic_id=clinic_id,
            date_key=date_key,
            token=(max_token or 0) + 1,
            patient_id=patient_id,
            patient_name=patient_name,
            patient_mobile=patient_mobile,
            source=source.value if isinstance(source, QueueSource) else str(source),
            status=QueueStatus.waiting.value,
            joined_at=datetime.now(timezone.utc).strftime("%H:%M"),
        )
        session.add(entry)
        await session.flush()
        await _recompute_statuses(session, clinic_id, date_key)
        result = row_to_dict(entry)
        await session.commit()
    return result


async def _recompute_statuses(session, clinic_id: str, date_key: str) -> None:
    """Top of queue → Consultation, next → Queue, rest → Waiting (active only)."""
    rows = (
        await session.scalars(
            select(QueueEntryRow)
            .where(
                QueueEntryRow.clinic_id == clinic_id,
                QueueEntryRow.date_key == date_key,
                QueueEntryRow.status.in_(ACTIVE_STATUSES),
            )
            .order_by(QueueEntryRow.token)
        )
    ).all()
    for i, entry in enumerate(rows):
        target = (
            QueueStatus.in_consultation.value
            if i == 0
            else QueueStatus.queued.value
            if i == 1
            else QueueStatus.waiting.value
        )
        if entry.status != target:
            entry.status = target


async def _current(session, clinic_id: str, date_key: str) -> QueueEntryRow | None:
    return await session.scalar(
        select(QueueEntryRow).where(
            QueueEntryRow.clinic_id == clinic_id,
            QueueEntryRow.date_key == date_key,
            QueueEntryRow.status == QueueStatus.in_consultation.value,
        )
    )


async def complete_current(clinic_id: str) -> dict | None:
    """Mark current consultation completed, deduct wallet, advance queue."""
    date_key = today_key()
    async with session_scope() as session:
        current = await _current(session, clinic_id, date_key)
        if not current:
            return None
        current.status = QueueStatus.completed.value
        await _recompute_statuses(session, clinic_id, date_key)
        result = row_to_dict(current)
        await session.commit()

    # Wallet deduction happens here (only on completion).
    from app.services.wallet_service import deduct_consultation

    await deduct_consultation(clinic_id, result["id"])
    return result


async def skip_current(clinic_id: str) -> dict | None:
    """Send the current patient to the back of today's queue by bumping their
    token past the current max (replaces the old token=9999 hack)."""
    date_key = today_key()
    async with session_scope() as session:
        current = await _current(session, clinic_id, date_key)
        if not current:
            return None
        max_token = await session.scalar(
            select(func.max(QueueEntryRow.token)).where(
                QueueEntryRow.clinic_id == clinic_id,
                QueueEntryRow.date_key == date_key,
            )
        )
        current.token = (max_token or 0) + 1
        current.status = QueueStatus.waiting.value
        await _recompute_statuses(session, clinic_id, date_key)
        result = row_to_dict(current)
        await session.commit()
    return result


async def list_active(clinic_id: str) -> list[dict]:
    date_key = today_key()
    async with session_scope() as session:
        rows = (
            await session.scalars(
                select(QueueEntryRow)
                .where(
                    QueueEntryRow.clinic_id == clinic_id,
                    QueueEntryRow.date_key == date_key,
                    QueueEntryRow.status.in_(ACTIVE_STATUSES),
                )
                .order_by(QueueEntryRow.token)
            )
        ).all()
        return [row_to_dict(r) for r in rows]
