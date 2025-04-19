from ..models.database_model import MongoDB
from ..dtypes.auth_dtypes import SignupRequest, LoginRequest, User
from fastapi import HTTPException, Request
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os

# ✅ Using Argon2 instead of bcrypt
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days    

def get_password_hash(password: str) -> str:
    """Hashes the password using Argon2"""
    return pwd_context.hash(password)

def decode_jwt(token: str) -> dict:
    """Decodes the JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies the password using Argon2"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM), expire

def create_refresh_token(data: dict):   
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
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

    token, expires_at = create_access_token({"sub": user["username"], "role": user["role"]})
    refresh_token = create_refresh_token({"sub": user["username"], "role": user["role"]})   
    return {"access_token": token, "refresh_token": refresh_token, "expires_at": expires_at}

def get_profile(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = auth_header.split(" ")[1]
    return decode_jwt(token)

def get_profile_from_username(username: str):
    collection = MongoDB.get_collection("iddb", "users")
    user = collection.find_one({"username": username})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user['id'] = str(user["_id"])
    del user["_id"] 
    
    return dict(user, avatar_url=f"https://api.dicebear.com/9.x/initials/svg?seed={user['first_name']}+{user['last_name']}")