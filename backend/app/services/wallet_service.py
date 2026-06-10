"""Wallet service — recharges and consultation deductions.

Rule: deduct only on consultation_completed. Never on token, queue join or cancel.
"""

from sqlalchemy import select

from app.database import session_scope
from app.models.clinic import PLAN_RATE, Plan
from app.models.orm import ClinicRow, TransactionRow, row_to_dict
from app.models.transaction import TxReason

LOW_BALANCE_WARN = 1000
LOW_BALANCE_CRITICAL = 200


def _rate_for(plan: str | None) -> int:
    try:
        return PLAN_RATE[Plan(plan)]
    except (ValueError, KeyError):
        return PLAN_RATE[Plan.starter]


async def deduct_consultation(clinic_id: str, queue_entry_id: str) -> dict:
    async with session_scope() as session:
        clinic = await session.get(ClinicRow, clinic_id)
        if not clinic:
            return {"ok": False}
        rate = _rate_for(clinic.plan)
        clinic.wallet_balance = (clinic.wallet_balance or 0) - rate
        new_balance = clinic.wallet_balance
        session.add(
            TransactionRow(
                clinic_id=clinic_id,
                reason=TxReason.consultation_deduction.value,
                amount=-rate,
                balance_after=new_balance,
                ref_id=queue_entry_id,
            )
        )
        await session.commit()
    if new_balance < LOW_BALANCE_WARN:
        # In production: enqueue notification to clinic admin
        pass
    return {"ok": True, "balance": new_balance, "deducted": rate}


async def recharge(clinic_id: str, amount: float, note: str | None = None) -> dict:
    async with session_scope() as session:
        clinic = await session.get(ClinicRow, clinic_id)
        if not clinic:
            return {"ok": False}
        clinic.wallet_balance = (clinic.wallet_balance or 0) + amount
        new_balance = clinic.wallet_balance
        session.add(
            TransactionRow(
                clinic_id=clinic_id,
                reason=TxReason.recharge.value,
                amount=amount,
                balance_after=new_balance,
                note=note,
            )
        )
        await session.commit()
    return {"ok": True, "balance": new_balance}


async def history(clinic_id: str, limit: int = 100) -> list[dict]:
    async with session_scope() as session:
        rows = (
            await session.scalars(
                select(TransactionRow)
                .where(TransactionRow.clinic_id == clinic_id)
                .order_by(TransactionRow.created_at.desc())
                .limit(limit)
            )
        ).all()
        return [row_to_dict(r) for r in rows]
