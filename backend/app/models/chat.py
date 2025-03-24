from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId
from pymongo import MongoClient, DESCENDING
import os
from app.config import MONGODB_URI, MONGODB_DB_NAME

# Custom ObjectId field for Pydantic v2
class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
        
    @classmethod
    def validate(cls, v, info=None):  # Add info parameter with default value
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)
        
    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

# MongoDB connection
client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB_NAME]
chats_collection = db["chats"]

# Pydantic models for API
class ToolInfo(BaseModel):
    tool_name: str
    query: Optional[str] = None
    results: Optional[List[Dict[str, Any]]] = None

class ChatBase(BaseModel):
    user_message: str
    ai_response: str
    used_tools: Optional[List[ToolInfo]] = []

class ChatCreate(ChatBase):
    document_id: str

class ChatResponse(ChatBase):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    document_id: str
    created_at: datetime
    
    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "_id": "60d21b4967d0d8992e610c85",
                "document_id": "60d21b4967d0d8992e610c85",
                "user_message": "What is the total amount?",
                "ai_response": "The total amount is $42.99 including tax.",
                "used_tools": [
                    {
                        "tool_name": "search",
                        "query": "typical restaurant bill tax percentage"
                    }
                ],
                "created_at": "2023-01-01T00:00:00.000Z"
            }
        }
    )

# MongoDB interface
class Chat:
    @staticmethod
    def create_chat(document_id, user_message, ai_response, used_tools=None):
        """Create a new chat message"""
        if used_tools is None:
            used_tools = []
            
        chat = {
            "document_id": ObjectId(document_id),
            "user_message": user_message,
            "ai_response": ai_response,
            "used_tools": used_tools,
            "created_at": datetime.now()
        }
        
        result = chats_collection.insert_one(chat)
        
        # Get the created chat and convert ObjectId to string
        created_chat = chats_collection.find_one({"_id": result.inserted_id})
        if created_chat:
            created_chat["document_id"] = str(created_chat["document_id"])
        
        return result.inserted_id
    
    @staticmethod
    def get_chats_for_document(document_id):
        """Get all chat messages for a document"""
        chats = list(chats_collection.find(
            {"document_id": ObjectId(document_id)}
        ).sort("created_at", 1))  # Sort by created_at in ascending order
        
        # Convert ObjectId to string for all chats
        for chat in chats:
            chat["document_id"] = str(chat["document_id"])
        
        return chats
    
    @staticmethod
    def delete_chats_for_document(document_id):
        """Delete all chat messages for a document"""
        return chats_collection.delete_many({"document_id": ObjectId(document_id)})
    
    @staticmethod
    def get_chat_by_id(chat_id):
        """Get a single chat by ID"""
        chat = chats_collection.find_one({"_id": ObjectId(chat_id)})
        if chat:
            # Convert ObjectId to string to avoid validation error
            chat["document_id"] = str(chat["document_id"])
        return chat