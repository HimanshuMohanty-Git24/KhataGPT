from fastapi import APIRouter, HTTPException, Query, File, UploadFile, Form, Body
from fastapi.responses import JSONResponse
from typing import Optional, List
import base64
from io import BytesIO
from pathlib import Path
import os

from app.models.document import Document, DocumentResponse, DocumentCreate, DocumentListResponse
from app.services.document_processor import DocumentProcessor
from app.config import API_PREFIX


# Create router
router = APIRouter(tags=["Documents"])

@router.get("/")
async def get_documents(search: str = None):
    """
    Get all documents or search documents by title and content
    """
    try:
        if search:
            print(f"API search request received for: '{search}'")
            documents = Document.search_documents(search)
            print(f"Found {len(documents)} documents matching '{search}'")
            
            # Log sample document to debug content issues
            if documents and len(documents) > 0:
                sample = documents[0]
                has_extracted_text = 'extracted_text' in sample and sample['extracted_text']
                print(f"Sample doc has extracted_text: {has_extracted_text}")
                if has_extracted_text:
                    content_preview = sample['extracted_text'][:100] + "..." if len(sample['extracted_text']) > 100 else sample['extracted_text']
                    print(f"Content preview: {content_preview}")
        else:
            documents = Document.get_all_documents()
        
        # Return documents with all fields
        return documents
    except Exception as e:
        print(f"Error in get_documents: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=DocumentResponse)
async def create_document(file: UploadFile = File(None), document: DocumentCreate = None):
    """Create a new document"""
    # Handle file upload case
    if file:
        # Read file content
        contents = await file.read()
        
        # Convert to base64
        base64_string = base64.b64encode(contents).decode()
        
        # Create document with base64 image - use a placeholder title that will be replaced
        document = DocumentCreate(
            title="Document being processed...",  # Temporary title
            doc_type="unknown",
            image_base64=base64_string
        )
    
    # Process the document
    if document and document.image_base64:
        # Process document image, extract text, etc.
        processor = DocumentProcessor()
        processed_data = processor.process_document(document)
        
        # Always generate a title based on content, regardless of what was provided
        from app.services.document_service import generate_document_title
        processed_data.title = generate_document_title(processed_data.extracted_text)
        
        # Create document with processed data
        created_doc = Document.create_document(processed_data)
        return created_doc
    elif document:
        # Create document without processing
        created_doc = Document.create_document(document)
        return created_doc
    else:
        raise HTTPException(status_code=400, detail="No document data provided")

@router.get("/", response_model=List[DocumentListResponse])
async def get_all_documents(
    search: Optional[str] = Query(None, description="Search term for documents")
):
    """Get all documents or search by term"""
    if search:
        documents = Document.search_documents(search)
        # Serialize before returning
        serialized_documents = [serialize_mongo_doc(doc) for doc in documents]
        return serialized_documents
    else:
        documents = Document.get_all_documents()
        # Serialize before returning
        serialized_documents = [serialize_mongo_doc(doc) for doc in documents]
        return serialized_documents

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str):
    """Get a document by ID"""
    document = Document.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@router.put("/{document_id}", response_model=DocumentResponse)
async def update_document(document_id: str, data: dict):
    """Update a document"""
    document = Document.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    updated_doc = Document.update_document(document_id, data)
    return updated_doc

@router.delete("/{document_id}")
async def delete_document(document_id: str):
    """Delete a document"""
    document = Document.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    result = Document.delete_document(document_id)
    if result:
        return {"message": "Document deleted successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to delete document")

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    doc_type: Optional[str] = Form("unknown")
):
    """Upload a document file"""
    # Read file content
    contents = await file.read()
    
    # Convert to base64
    base64_string = base64.b64encode(contents).decode()
    
    # Create document with base64 image - use a placeholder title
    document = DocumentCreate(
        title="Document being processed...",  # Always use placeholder, title will be generated later
        doc_type=doc_type,
        image_base64=base64_string
    )
    
    # Process and create document
    processor = DocumentProcessor()
    processed_data = processor.process_document(document)
    
    # The title should be set by the processor from the content
    created_doc = Document.create_document(processed_data)
    
    return created_doc

@router.post("/{document_id}/increment-chat")
async def increment_chat_count(document_id: str):
    """Increment chat count for a document"""
    document = Document.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    Document.increment_chat_count(document_id)
    return {"message": "Chat count incremented"}