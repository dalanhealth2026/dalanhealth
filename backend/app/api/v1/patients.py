from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import CurrentUser, get_current_user
from app.database import get_session
from app.models.orm import PatientRow, row_to_dict

router = APIRouter()


class PatientIn(BaseModel):
    name: str
    mobile: str
    age: int | None = None
    gender: str | None = None
    address: str | None = None
    email: str | None = None


@router.get("/lookup")
async def lookup(
    mobile: str,
    user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if not user.clinic_id:
        raise HTTPException(400, "Clinic context required")
    row = await session.scalar(
        select(PatientRow).where(PatientRow.clinic_id == user.clinic_id, PatientRow.mobile == mobile)
    )
    if not row:
        return {"found": False}
    return {"found": True, "patient": row_to_dict(row)}


@router.post("/")
async def create_patient(
    p: PatientIn,
    user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if not user.clinic_id:
        raise HTTPException(400, "Clinic context required")
    row = PatientRow(**p.model_dump(), clinic_id=user.clinic_id)
    session.add(row)
    await session.commit()
    return row_to_dict(row)


@router.get("/")
async def list_patients(
    q: str | None = None,
    user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if not user.clinic_id:
        raise HTTPException(400, "Clinic context required")
    stmt = select(PatientRow).where(PatientRow.clinic_id == user.clinic_id)
    if q:
        stmt = stmt.where(or_(PatientRow.name.ilike(f"%{q}%"), PatientRow.mobile.like(f"%{q}%")))
    rows = (await session.scalars(stmt.order_by(PatientRow.created_at.desc()).limit(200))).all()
    return [row_to_dict(r) for r in rows]
