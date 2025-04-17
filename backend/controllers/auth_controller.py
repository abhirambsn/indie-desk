from fastapi import APIRouter, Depends
from typing import Annotated
from dtypes.auth_dtypes import SignupRequest, LoginRequest
from services.auth_service import signup, login, get_profile, get_profile_from_username

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

@router.post("/signup")
async def register(data: SignupRequest):
    return await signup(data)

@router.post("/token")
async def authenticate(data: LoginRequest):
    return await login(data)

@router.get("/me")
async def my_profile(data: Annotated[dict, Depends(get_profile)]):
    username = data.get("sub")
    return get_profile_from_username(username)