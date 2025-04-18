from models.database_model import MongoDB
from dtypes.file_dtypes import FileMeta, FileResponse
from fastapi import HTTPException, UploadFile, File
from bson import ObjectId
from typing import Optional
import os

async def file_upload(file: UploadFile = File(...), metadata: Optional[dict] = None):
    """
    Uploads a file to MongoDB and stores metadata.
    Returns a response with file details.
    """
    # Save the file to MongoDB using GridFS
    try:
        # Define the file path temporarily
        temp_file_path = f"/tmp/{file.filename}"

        with open(temp_file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        file_id = MongoDB.insert_file(
            db_name="files",
            file_path=temp_file_path,
            filename=file.filename,
            metadata=metadata
        )

        # Remove the temporary file after upload
        os.remove(temp_file_path)

        # Prepare the metadata response
        file_meta = FileMeta(
            filename=file.filename,
            gridfs_id=str(file_id),
            uploaded_by="system",  # You can add actual uploader's details here
            content_type=file.content_type,
            upload_date=file.content_type  # You can modify this if needed
        )

        return FileResponse(
            filename=file.filename,
            content_type=file.content_type
        )
    
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
            db_name="files", 
            file_id=gridfs_id, 
            output_path=output_path
        )

        return {"file_path": file_path}
    
    except Exception as e:
        print("❌ File Retrieval Error:", e)
        raise HTTPException(status_code=500, detail="File retrieval failed")
