from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.deps import CurrentUser, get_current_user
from app.auth.security import create_access_token, hash_password, verify_password
from app.config import settings
from app.database import get_session
from app.models.orm import ClinicRow, UserRow
from app.models.user import Role

router = APIRouter()


class SendOtpReq(BaseModel):
    mobile: str
    role: Role = Role.patient


class VerifyOtpReq(BaseModel):
    mobile: str
    otp: str
    role: Role = Role.patient
    name: str | None = None


class PasswordLoginReq(BaseModel):
    email: EmailStr
    password: str
    role: Role


class ClinicSignupReq(BaseModel):
    doctor_name: str
    clinic_name: str
    mobile: str
    email: EmailStr
    password: str = Field(min_length=6)
    city: str | None = None
    specialization: str | None = None
    plan: str = "growth"


class TokenResp(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


@router.post("/otp/send")
async def send_otp(req: SendOtpReq):
    # In production: integrate SMS gateway; in demo we always return ok.
    return {"ok": True, "demo_code": settings.otp_demo_code if settings.app_env != "production" else None}


@router.post("/otp/verify", response_model=TokenResp)
async def verify_otp(req: VerifyOtpReq, session: AsyncSession = Depends(get_session)):
    if req.otp != settings.otp_demo_code:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid OTP")
    existing = await session.scalar(
        select(UserRow).where(UserRow.mobile == req.mobile, UserRow.role == req.role.value)
    )
    if not existing:
        user = UserRow(name=req.name or "Patient", mobile=req.mobile, role=req.role.value)
        session.add(user)
        await session.commit()
        user_id, clinic_id, name = user.id, None, user.name
    else:
        user_id, clinic_id, name = existing.id, existing.clinic_id, existing.name

    token = create_access_token(user_id, req.role.value, clinic_id)
    return TokenResp(
        access_token=token,
        user={"id": user_id, "name": name, "role": req.role.value, "mobile": req.mobile, "clinic_id": clinic_id},
    )


@router.post("/login", response_model=TokenResp)
async def login(req: PasswordLoginReq, session: AsyncSession = Depends(get_session)):
    user = await session.scalar(
        select(UserRow).where(UserRow.email == req.email, UserRow.role == req.role.value)
    )
    if not user or not user.password_hash or not verify_password(req.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")
    token = create_access_token(user.id, req.role.value, user.clinic_id)
    return TokenResp(
        access_token=token,
        user={
            "id": user.id,
            "name": user.name,
            "role": req.role.value,
            "email": user.email,
            "clinic_id": user.clinic_id,
        },
    )


@router.post("/signup/clinic", response_model=TokenResp)
async def signup_clinic(req: ClinicSignupReq, session: AsyncSession = Depends(get_session)):
    existing = await session.scalar(
        select(UserRow).where(UserRow.email == req.email, UserRow.role == Role.clinic_admin.value)
    )
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "Account already exists for this email")

    clinic = ClinicRow(
        name=req.clinic_name,
        doctor_name=req.doctor_name,
        mobile=req.mobile,
        email=req.email,
        city=req.city,
        specialization=req.specialization,
        plan=req.plan,
    )
    session.add(clinic)
    await session.flush()

    user = UserRow(
        name=req.doctor_name,
        role=Role.clinic_admin.value,
        mobile=req.mobile,
        email=req.email,
        password_hash=hash_password(req.password),
        clinic_id=clinic.id,
    )
    session.add(user)
    await session.commit()

    token = create_access_token(user.id, Role.clinic_admin.value, clinic.id)
    return TokenResp(
        access_token=token,
        user={
            "id": user.id,
            "name": req.doctor_name,
            "role": Role.clinic_admin.value,
            "email": req.email,
            "clinic_id": clinic.id,
            "clinic_name": req.clinic_name,
        },
    )


@router.get("/me")
async def me(user: CurrentUser = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    row = await session.get(UserRow, user.user_id)
    if not row:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    return {
        "id": row.id,
        "name": row.name,
        "role": row.role,
        "email": row.email,
        "mobile": row.mobile,
        "clinic_id": row.clinic_id,
    }
