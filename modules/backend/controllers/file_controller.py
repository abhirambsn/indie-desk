from fastapi import APIRouter, UploadFile, File
from services.file_service import file_upload, file_retrieve
from dtypes.file_dtypes import FileResponse

router = APIRouter(prefix="/api/v1/files", tags=["Files"])

@router.post("/upload", response_model=FileResponse)
async def upload_file(file: UploadFile = File(...)):
    """
    Endpoint to upload a file to the server and MongoDB.
    Returns the filename and content type after successful upload.
    """
    return await file_upload(file)

@router.get("/retrieve/{file_id}", response_model=dict)
async def retrieve_file(file_id: str, output_path: str = None):
    """
    Endpoint to retrieve a file from MongoDB using its GridFS ID.
    Returns the file path where the file was saved.
    """
    return await file_retrieve(file_id, output_path)