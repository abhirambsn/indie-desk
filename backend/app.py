from fastapi import FastAPI
from dotenv import load_dotenv
from backend.controllers.auth_controller import router as auth_router

load_dotenv()

app = FastAPI()

# Include Auth Controller
app.include_router(auth_router)

@app.get("/")
def root():
    return {"message": "🚀 Sher!!! Cheetah hi kehde"}
