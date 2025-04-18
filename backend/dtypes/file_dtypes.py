from pydantic import BaseModel
from datetime import datetime

class FileMeta(BaseModel):
    filename: str
    gridfs_id: str
    uploaded_by: str
    content_type: str
    upload_date: datetime


class FileResponse(BaseModel):
    filename: str
    content_type: str
