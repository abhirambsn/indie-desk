from fastapi import FastAPI
from dotenv import load_dotenv
from .controllers.auth_controller import router as auth_router
from .controllers.file_controller import router as file_router
load_dotenv()

app = FastAPI()

# Include Auth Controller
app.include_router(auth_router)
app.include_router(file_router)

@app.get("/")
def root():
    return {"message": "🚀 Sher!!! Cheetah hi kehde"}
