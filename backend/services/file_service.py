from models.database_model import MongoDB
from dtypes.file_dtypes import FileMeta, FileResponse
from fastapi import HTTPException, UploadFile, File
from bson import ObjectId
from typing import Optional
from datetime import datetime
import os

async def file_upload(file: UploadFile = File(...)):
    """
    Uploads a file to MongoDB and stores metadata.
    Returns a response with file details.
    """
    try:
        # Save to temp file first
        temp_file_path = f"/tmp/{file.filename}"
        with open(temp_file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Create metadata
        file_meta = FileMeta(
            filename=file.filename,
            uploaded_by="system",  # Optional: Replace with actual user
            content_type=file.content_type,
            upload_date=str(datetime.utcnow()),
            gridfs_id=""  # Placeholder, will update after inserting
        )

        # Insert into MongoDB using GridFS
        file_id = MongoDB.insert_file(
            db_name="iddb",
            file_path=temp_file_path,
            filename=file.filename,
            metadata=file_meta.model_dump(exclude={"gridfs_id"})
        )

        # Clean up temp file
        os.remove(temp_file_path)

        # Update gridfs_id in response
        file_meta.gridfs_id = str(file_id)

        return file_meta

    except Exception as e:
        print("❌ File Upload Error:", e)
        raise HTTPException(status_code=500, detail="File upload failed")

async def file_retrieve(file_id: str, output_path: Optional[str] = None):
    """
    Retrieves a file from MongoDB using its GridFS id.
    Returns the file path where it was saved or raises an error if not found.
    """
    try:
        # Convert the file_id string to ObjectId
        gridfs_id = ObjectId(file_id)

        # Retrieve the file from GridFS
        file_path = MongoDB.get_file(
            db_name="iddb", 
            file_id=gridfs_id, 
            output_path=output_path
        )

        return {"file_path": file_path}
    
    except Exception as e:
        print("❌ File Retrieval Error:", e)
        raise HTTPException(status_code=500, detail="File retrieval failed")
