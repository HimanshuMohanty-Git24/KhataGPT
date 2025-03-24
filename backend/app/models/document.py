from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId
from pymongo import DESCENDING, TEXT
from app.database import db

# Collection reference
documents_collection = db.documents

class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
        
    @classmethod
    def validate(cls, v, info=None):  # Updated with info parameter
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)
        
    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

class DocumentBase(BaseModel):
    title: str
    doc_type: str = "unknown"
    extracted_text: Optional[str] = None

class DocumentCreate(DocumentBase):
    image_base64: Optional[str] = None
    
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True,
    )

class DocumentResponse(DocumentBase):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    image_base64: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None  # Updated to be optional
    last_chat_at: Optional[datetime] = None
    chat_count: int = 0
    
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True,
    )

# New model specifically for listing documents
class DocumentListResponse(BaseModel):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    title: str
    doc_type: str = "unknown"
    created_at: datetime
    last_chat_at: Optional[datetime] = None
    chat_count: int = 0
    
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True,
    )

class Document:
    @staticmethod
    def create_document(document: DocumentCreate) -> dict:
        """Create a new document"""
        doc_dict = document.model_dump(by_alias=True)
        
        # Add timestamps
        now = datetime.now()
        doc_dict["created_at"] = now
        doc_dict["updated_at"] = now
        doc_dict["last_chat_at"] = None
        doc_dict["chat_count"] = 0
        
        # Insert document
        result = documents_collection.insert_one(doc_dict)
        
        # Return the created document
        created_doc = documents_collection.find_one({"_id": result.inserted_id})
        return created_doc
    
    @staticmethod
    def get_all_documents():
        """Get all documents with minimal info"""
        return list(documents_collection.find(
            {},
            {"title": 1, "doc_type": 1, "created_at": 1, "last_chat_at": 1, "chat_count": 1}
        ).sort("created_at", -1))
    
    @staticmethod
    def get_document(document_id: str) -> dict:
        """Get a document by ID"""
        return documents_collection.find_one({"_id": ObjectId(document_id)})
    
    @staticmethod
    def get_document_by_id(document_id: str) -> dict:
        """Alias for get_document to ensure compatibility with chat service"""
        return Document.get_document(document_id)
    
    @staticmethod
    def update_document(document_id: str, data: dict) -> dict:
        """Update a document"""
        # Add updated timestamp
        data["updated_at"] = datetime.now()
        
        # Update the document
        documents_collection.update_one(
            {"_id": ObjectId(document_id)},
            {"$set": data}
        )
        
        # Return the updated document
        return documents_collection.find_one({"_id": ObjectId(document_id)})
    
    @staticmethod
    def delete_document(document_id: str) -> bool:
        """Delete a document"""
        result = documents_collection.delete_one({"_id": ObjectId(document_id)})
        return result.deleted_count > 0
    
    @staticmethod
    def search_documents(search_term: str):
        """Search documents by title and extracted text"""
        # Check for existing text index
        existing_indexes = documents_collection.index_information()
        text_index_exists = False
        
        # Look for any text index
        for idx_name, idx_info in existing_indexes.items():
            if any('_fts' in key for key, _ in idx_info.get('key', [])):
                text_index_exists = True
                break
        
        # Create a combined text index if none exists
        if not text_index_exists:
            documents_collection.create_index(
                [("title", TEXT), ("extracted_text", TEXT)],
                name="title_text_extracted_text_text"
            )
        
        # Search for documents
        return list(documents_collection.find(
            {"$text": {"$search": search_term}},
            {"title": 1, "doc_type": 1, "created_at": 1, "last_chat_at": 1, "chat_count": 1, "score": {"$meta": "textScore"}}
        ).sort([("score", {"$meta": "textScore"})]))
    
    @staticmethod
    def increment_chat_count(document_id: str):
        """Increment chat count for a document"""
        documents_collection.update_one(
            {"_id": ObjectId(document_id)},
            {
                "$inc": {"chat_count": 1},
                "$set": {"last_chat_at": datetime.now()}
            }
        )
    
    @staticmethod
    def update_chat_stats(document_id: str):
        """Update chat stats for a document - alias for increment_chat_count"""
        return Document.increment_chat_count(document_id)