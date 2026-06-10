"""Cashback service — rules:
- earn on bookings (campaign rate)
- use only as booking-fee adjustment
- max 50% of booking fee per use
- never withdrawable
"""

from app.database import session_scope
from app.models.cashback import DEFAULT_CASHBACK, CashbackCampaignType
from app.models.orm import TransactionRow, UserRow
from app.models.transaction import TxReason

MAX_USE_RATIO = 0.5


async def earn(user_id: str, campaign_type: CashbackCampaignType, amount: float | None = None) -> dict:
    amt = amount if amount is not None else DEFAULT_CASHBACK[campaign_type]
    async with session_scope() as session:
        user = await session.get(UserRow, user_id)
        if not user:
            return {"ok": False, "earned": 0}
        user.cashback_balance = (user.cashback_balance or 0) + amt
        session.add(
            TransactionRow(
                user_id=user_id,
                reason=TxReason.cashback_earn.value,
                amount=amt,
                note=campaign_type.value,
            )
        )
        await session.commit()
    return {"ok": True, "earned": amt}


async def get_balance(user_id: str) -> float:
    async with session_scope() as session:
        user = await session.get(UserRow, user_id)
        return round(float(user.cashback_balance or 0), 2) if user else 0.0


async def compute_use(user_id: str, booking_fee: float) -> float:
    """Return how much cashback can be applied to this booking."""
    bal = await get_balance(user_id)
    return round(min(bal, booking_fee * MAX_USE_RATIO), 2)


async def apply_use(user_id: str, amount: float, booking_ref: str | None = None) -> dict:
    if amount <= 0:
        return {"applied": 0}
    async with session_scope() as session:
        user = await session.get(UserRow, user_id)
        if not user:
            return {"applied": 0}
        user.cashback_balance = (user.cashback_balance or 0) - amount
        session.add(
            TransactionRow(
                user_id=user_id,
                reason=TxReason.cashback_use.value,
                amount=-amount,
                ref_id=booking_ref,
            )
        )
        await session.commit()
    return {"applied": amount}
