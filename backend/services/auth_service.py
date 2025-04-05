from backend.models.database_model import MongoDB
from backend.dtypes.auth_dtypes import SignupRequest, LoginRequest, User
from fastapi import HTTPException
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os

# ✅ Using Argon2 instead of bcrypt
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def get_password_hash(password: str) -> str:
    """Hashes the password using Argon2"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies the password using Argon2"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def signup(data: SignupRequest):
    collection = MongoDB.get_collection("iddb", "users")
    
    if collection.find_one({"username": data.username}):
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed = get_password_hash(data.password)
    user = User(
        username=data.username,
        first_name=data.first_name,
        last_name=data.last_name,
        hashed_password=hashed,
        role=data.role
    )
    collection.insert_one(user.model_dump())
    return {"message": "User registered successfully"}

async def login(data: LoginRequest):
    collection = MongoDB.get_collection("iddb", "users")
    
    user = collection.find_one({"username": data.username})
    if not user or not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user["username"], "role": user["role"]})
    return {"access_token": token, "token_type": "bearer"}
