from fastapi import APIRouter
from backend.dtypes.auth_dtypes import SignupRequest, LoginRequest
from backend.services.auth_service import signup, login

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup")
async def register(data: SignupRequest):
    return await signup(data)

@router.post("/login")
async def authenticate(data: LoginRequest):
    return await login(data)
