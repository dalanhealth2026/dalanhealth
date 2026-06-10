from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.auth.deps import CurrentUser, get_current_user
from app.models.cashback import CashbackCampaignType
from app.services import cashback_service

router = APIRouter()


class EarnReq(BaseModel):
    campaign_type: CashbackCampaignType
    amount: float | None = None


class UsePreviewReq(BaseModel):
    booking_fee: float


@router.get("/balance")
async def balance(user: CurrentUser = Depends(get_current_user)):
    bal = await cashback_service.get_balance(user.user_id)
    return {"balance": bal}


@router.post("/earn")
async def earn(req: EarnReq, user: CurrentUser = Depends(get_current_user)):
    return await cashback_service.earn(user.user_id, req.campaign_type, req.amount)


@router.post("/preview-use")
async def preview_use(req: UsePreviewReq, user: CurrentUser = Depends(get_current_user)):
    applicable = await cashback_service.compute_use(user.user_id, req.booking_fee)
    return {"applicable": applicable, "patient_pays": round(req.booking_fee - applicable, 2)}
