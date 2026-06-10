from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import CurrentUser, get_current_user, require_roles
from app.database import get_session
from app.models.orm import ClinicRow, row_to_dict

router = APIRouter()


@router.get("/")
async def list_clinics(
    user: CurrentUser = Depends(require_roles("super_admin")),
    session: AsyncSession = Depends(get_session),
):
    rows = (await session.scalars(select(ClinicRow).limit(500))).all()
    return [row_to_dict(r) for r in rows]


@router.get("/me")
async def my_clinic(
    user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if not user.clinic_id:
        raise HTTPException(404, "No clinic for this user")
    row = await session.get(ClinicRow, user.clinic_id)
    if not row:
        raise HTTPException(404, "Clinic not found")
    return row_to_dict(row)
