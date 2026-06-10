from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import CurrentUser, get_current_user
from app.database import get_session
from app.models.orm import PrescriptionRow, row_to_dict

router = APIRouter()


class MedicineIn(BaseModel):
    name: str
    dose: str | None = None
    frequency: str | None = None
    duration: str | None = None


class PrescriptionIn(BaseModel):
    patient_id: str | None = None
    patient_name: str
    symptoms: str | None = None
    diagnosis: str | None = None
    tests: str | None = None
    notes: str | None = None
    follow_up: str | None = None
    medicines: list[MedicineIn] = []


@router.post("/")
async def create_prescription(
    p: PrescriptionIn,
    user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if not user.clinic_id:
        raise HTTPException(400, "Clinic context required")
    data = p.model_dump()
    data["medicines"] = [m if isinstance(m, dict) else m for m in data["medicines"]]
    row = PrescriptionRow(**data, clinic_id=user.clinic_id)
    session.add(row)
    await session.commit()
    return row_to_dict(row)


@router.get("/")
async def list_prescriptions(
    user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
    limit: int = 50,
):
    if not user.clinic_id:
        raise HTTPException(400, "Clinic context required")
    rows = (
        await session.scalars(
            select(PrescriptionRow)
            .where(PrescriptionRow.clinic_id == user.clinic_id)
            .order_by(PrescriptionRow.created_at.desc())
            .limit(limit)
        )
    ).all()
    return [row_to_dict(r) for r in rows]
