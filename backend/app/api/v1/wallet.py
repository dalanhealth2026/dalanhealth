from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import CurrentUser, get_current_user
from app.database import get_session
from app.models.orm import ClinicRow
from app.services import wallet_service

router = APIRouter()


class RechargeReq(BaseModel):
    amount: float = Field(gt=0)
    note: str | None = None


@router.get("/balance")
async def get_balance(
    user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if not user.clinic_id:
        raise HTTPException(400, "Clinic context required")
    clinic = await session.get(ClinicRow, user.clinic_id)
    if not clinic:
        raise HTTPException(404, "Clinic not found")
    return {
        "balance": clinic.wallet_balance or 0,
        "plan": clinic.plan or "starter",
        "warn": wallet_service.LOW_BALANCE_WARN,
        "critical": wallet_service.LOW_BALANCE_CRITICAL,
    }


@router.post("/recharge")
async def recharge(req: RechargeReq, user: CurrentUser = Depends(get_current_user)):
    if not user.clinic_id:
        raise HTTPException(400, "Clinic context required")
    return await wallet_service.recharge(user.clinic_id, req.amount, req.note)


@router.get("/history")
async def history(user: CurrentUser = Depends(get_current_user)):
    if not user.clinic_id:
        raise HTTPException(400, "Clinic context required")
    return await wallet_service.history(user.clinic_id)
