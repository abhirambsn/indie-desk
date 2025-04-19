from pymongo import MongoClient, errors
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
from typing import Any, Dict, Optional, List
import os
from gridfs import GridFS
from bson import ObjectId

load_dotenv()

class MongoDB:
    _client: Optional[MongoClient] = None

    @classmethod
    def _connect(cls):
        if cls._client is None:
            uri = os.getenv("MONGODB_URI")
            try:
                cls._client = MongoClient(uri, server_api=ServerApi('1'))
                cls._client.admin.command("ping")
                print("✅ MongoDB connection established.")
            except errors.PyMongoError as e:
                print("❌ MongoDB connection error:", e)
                raise

    @classmethod
    def get_collection(cls, db_name: str, collection_name: str):
        cls._connect()
        return cls._client[db_name][collection_name]

    @classmethod
    def insert_one(cls, db_name: str, collection_name: str, data: Dict[str, Any]):
        try:
            collection = cls.get_collection(db_name, collection_name)
            return collection.insert_one(data)
        except errors.PyMongoError as e:
            print("❌ Insert Error:", e)
            raise

    @classmethod
    def find_one(cls, db_name: str, collection_name: str, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        try:
            collection = cls.get_collection(db_name, collection_name)
            return collection.find_one(query)
        except errors.PyMongoError as e:
            print("❌ Find One Error:", e)
            raise

    @classmethod
    def find_many(cls, db_name: str, collection_name: str, query: Dict[str, Any]) -> List[Dict[str, Any]]:
        try:
            collection = cls.get_collection(db_name, collection_name)
            return list(collection.find(query))
        except errors.PyMongoError as e:
            print("❌ Find Many Error:", e)
            raise
    
    @classmethod
    def insert_file(cls, db_name: str, file_path: str, filename: Optional[str] = None, metadata: Optional[Dict[str, Any]] = None) -> ObjectId:
        try:
            cls._connect()
            db = cls._client[db_name]
            fs = GridFS(db)
            with open(file_path, "rb") as file:
                file_id = fs.put(file, filename=filename or os.path.basename(file_path), metadata=metadata)
                print(f"✅ File '{filename or os.path.basename(file_path)}' inserted with id: {file_id}")
                return file_id
        except Exception as e:
            print("❌ File Insert Error:", e)
            raise

    @classmethod
    def get_file(cls, db_name: str, file_id: ObjectId, output_path: Optional[str] = None) -> str:
        try:
            cls._connect()
            db = cls._client[db_name]
            fs = GridFS(db)
            grid_out = fs.get(file_id)
            output_path = output_path or grid_out.filename
            with open(output_path, "wb") as f:
                f.write(grid_out.read())
            print(f"✅ File retrieved and saved as: {output_path}")
            return output_path
        except Exception as e:
            print("❌ File Retrieval Error:", e)
            raise