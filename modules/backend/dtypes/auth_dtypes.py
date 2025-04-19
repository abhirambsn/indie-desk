from pydantic import BaseModel

class SignupRequest(BaseModel):
    first_name: str
    last_name: str
    username: str
    password: str
    role: str

class LoginRequest(BaseModel):
    username: str
    password: str

class User(BaseModel):
    first_name: str
    last_name: str
    username: str
    hashed_password: str
    role: str
