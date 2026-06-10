import secrets

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import CurrentUser, get_current_user
from app.database import get_session
from app.models.orm import InvoiceRow, row_to_dict

router = APIRouter()


class InvoiceIn(BaseModel):
    patient_id: str | None = None
    patient_name: str
    patient_mobile: str
    consultation_fee: float = 0
    medicine_fee: float = 0
    extra_charges: float = 0
    discount: float = 0
    notes: str | None = None


@router.post("/")
async def create_invoice(
    inv: InvoiceIn,
    user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if not user.clinic_id:
        raise HTTPException(400, "Clinic context required")
    total = max(0.0, inv.consultation_fee + inv.medicine_fee + inv.extra_charges - inv.discount)
    row = InvoiceRow(
        **inv.model_dump(),
        clinic_id=user.clinic_id,
        total=total,
        invoice_no=f"INV-{secrets.token_hex(3).upper()}",
    )
    session.add(row)
    await session.commit()
    return row_to_dict(row)


@router.get("/")
async def list_invoices(
    user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
    limit: int = 50,
):
    if not user.clinic_id:
        raise HTTPException(400, "Clinic context required")
    rows = (
        await session.scalars(
            select(InvoiceRow)
            .where(InvoiceRow.clinic_id == user.clinic_id)
            .order_by(InvoiceRow.created_at.desc())
            .limit(limit)
        )
    ).all()
    return [row_to_dict(r) for r in rows]
