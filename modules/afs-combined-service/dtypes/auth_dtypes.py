from pydantic import BaseModel
from typing import Optional

class SignupRequest(BaseModel):
    first_name: str
    last_name: str
    username: str
    password: str
    role: str
    project_id: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class User(BaseModel):
    first_name: str
    last_name: str
    username: str
    hashed_password: str
    role: str
    project_id: Optional[str] = None
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
