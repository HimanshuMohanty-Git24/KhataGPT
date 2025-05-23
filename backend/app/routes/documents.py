from fastapi import APIRouter, HTTPException, Query, File, UploadFile, Form, Body
from fastapi.responses import JSONResponse
from typing import Optional, List
import base64
from io import BytesIO
from pathlib import Path
import os
from pydantic import BaseModel

from app.models.document import Document, DocumentResponse, DocumentCreate, DocumentListResponse
from app.services.document_processor import DocumentProcessor
from app.config import API_PREFIX
from app.utils.image_utils import combine_images_to_pdf


# Create router
router = APIRouter(tags=["Documents"])

# Define content update model


class ContentUpdateModel(BaseModel):
    content: str


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
                    content_preview = sample['extracted_text'][:100] + "..." if len(
                        sample['extracted_text']) > 100 else sample['extracted_text']
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

        # Determine file type
        file_extension = file.filename.split('.')[-1].lower()
        file_type = "pdf" if file_extension == "pdf" else "image"

        # Create document with appropriate metadata
        document = DocumentCreate(
            title="Document being processed...",  # Temporary title
            doc_type="unknown",
            image_base64=base64_string,
            file_type=file_type  # Set file type based on extension
        )

    # Process the document
    if document and document.image_base64:
        # Process document image, extract text, etc.
        processor = DocumentProcessor()
        processed_data = processor.process_document(document)

        # Always generate a title based on content, regardless of what was provided
        from app.services.document_service import generate_document_title
        processed_data.title = generate_document_title(
            processed_data.extracted_text)

        # Create document with processed data
        created_doc = Document.create_document(processed_data)
        return created_doc
    elif document:
        # Create document without processing
        created_doc = Document.create_document(document)
        return created_doc
    else:
        raise HTTPException(
            status_code=400, detail="No document data provided")


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


@router.put("/{document_id}/content", response_model=dict)
async def update_document_content(document_id: str, content_update: ContentUpdateModel):
    """Update only the content of a document"""
    try:
        document = Document.get_document(document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        # Update only the extracted_text field
        update_data = {"extracted_text": content_update.content}

        # Call the Document model's update method
        result = Document.update_document(document_id, update_data)

        if result:
            return {"message": "Document content updated successfully", "success": True}
        else:
            raise HTTPException(
                status_code=500, detail="Failed to update document content")
    except Exception as e:
        print(f"Error updating document content: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Error updating document content: {str(e)}")


@router.put("/{document_id}/title", response_model=dict)
async def update_document_title(document_id: str, title_update: dict):
    """Update only the title of a document"""
    try:
        document = Document.get_document(document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        if "title" not in title_update:
            raise HTTPException(status_code=400, detail="Title is required")

        # Update only the title field
        update_data = {"title": title_update["title"]}

        # Call the Document model's update method
        result = Document.update_document(document_id, update_data)

        if result:
            return {"message": "Document title updated successfully", "success": True}
        else:
            raise HTTPException(
                status_code=500, detail="Failed to update document title")
    except Exception as e:
        print(f"Error updating document title: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Error updating document title: {str(e)}")


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
        raise HTTPException(
            status_code=500, detail="Failed to delete document")


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    files: List[UploadFile] = File(...),  # Changed from file to files (List)
    title: Optional[str] = Form(None),
    doc_type: Optional[str] = Form("unknown")
):
    """Upload one or more document files"""

    # Check if we have multiple image files
    is_batch_image_upload = len(files) > 1 and all(
        file.content_type.startswith("image/") for file in files
    )

    if is_batch_image_upload:
        # Process multiple images as a batch and convert to PDF
        image_buffers = []
        for file in files:
            content = await file.read()
            image_buffers.append(BytesIO(content))

        # Combine images into a single PDF
        pdf_buffer = combine_images_to_pdf(image_buffers)
        pdf_content = pdf_buffer.getvalue()

        # Convert to base64
        base64_string = base64.b64encode(pdf_content).decode()

        # Create document with PDF data
        document = DocumentCreate(
            title="Document being processed...",
            doc_type=doc_type,
            image_base64=base64_string,
            file_type="pdf"  # Always set as PDF for batch uploads
        )
    else:
        # Process single file (existing logic)
        file = files[0]  # Take the first file if only one was uploaded
        contents = await file.read()

        # Convert to base64
        base64_string = base64.b64encode(contents).decode()

        # Determine file type
        file_extension = file.filename.split('.')[-1].lower()
        file_type = "pdf" if file_extension == "pdf" else "image"

        # Create document with base64 data
        document = DocumentCreate(
            title="Document being processed...",
            doc_type=doc_type,
            image_base64=base64_string,
            file_type=file_type
        )

    # Process and create document using existing logic
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
