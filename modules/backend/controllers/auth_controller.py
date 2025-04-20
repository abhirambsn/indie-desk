from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from dtypes.auth_dtypes import SignupRequest, LoginRequest
from services.auth_service import signup, delete_project_user, login, create_project_support_user, get_profile, get_users_of_project, get_profile_from_username

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

@router.get("/{project_id}/users")
async def project_users(project_id: str, data: Annotated[dict, Depends(get_profile)]):
    user_role = data.get("role")
    if str(user_role).lower() not in ["admin", "support"]:
        raise HTTPException(status_code=403, detail="You don't have permission to access this resource")
    return get_users_of_project(project_id)

@router.post("/{project_id}/users")
async def add_project_user(project_id: str, data:SignupRequest, auth_data: Annotated[dict, Depends(get_profile)]):
    user_role = auth_data.get("role")
    if str(user_role).lower() not in ["admin"]:
        raise HTTPException(status_code=403, detail="You don't have permission to access this resource")
    return await create_project_support_user(project_id, data)

@router.delete("/{project_id}/users/{user_id}")
async def delete_project_user(project_id: str, user_id: str, auth_data: Annotated[dict, Depends(get_profile)]):
    user_role = auth_data.get("role")
    if str(user_role).lower() not in ["admin"]:
        raise HTTPException(status_code=403, detail="You don't have permission to access this resource")
    return await delete_project_user(project_id, user_id)