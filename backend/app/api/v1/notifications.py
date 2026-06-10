from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import CurrentUser, get_current_user
from app.database import get_session
from app.models.notification import NotificationChannel, NotificationEvent
from app.models.orm import NotificationRow, row_to_dict

router = APIRouter()


class SendReq(BaseModel):
    user_id: str | None = None
    event: NotificationEvent
    title: str
    body: str
    channel: NotificationChannel = NotificationChannel.push


@router.post("/send")
async def send(
    req: SendReq,
    user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    # Production: dispatch via Firebase / WhatsApp / SMS / Email with fallback.
    row = NotificationRow(
        user_id=req.user_id,
        clinic_id=user.clinic_id,
        event=req.event.value,
        channel=req.channel.value,
        title=req.title,
        body=req.body,
        delivered=True,
    )
    session.add(row)
    await session.commit()
    return row_to_dict(row)


@router.get("/me")
async def my_notifications(
    user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    rows = (
        await session.scalars(
            select(NotificationRow)
            .where(NotificationRow.user_id == user.user_id)
            .order_by(NotificationRow.created_at.desc())
            .limit(100)
        )
    ).all()
    return [row_to_dict(r) for r in rows]
