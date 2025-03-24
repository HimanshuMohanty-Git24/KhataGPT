from fastapi import APIRouter, HTTPException, Body
from typing import List
from bson.objectid import ObjectId

from app.models.chat import Chat, ChatResponse, ChatCreate
from app.models.document import Document
from app.services.chat_service import process_chat_with_document

# Create router with the proper tag
router = APIRouter(tags=["Chat"])

@router.get("/{document_id}", response_model=List[ChatResponse])
async def get_chats_for_document(document_id: str):
    """Get all chat messages for a document"""
    # Verify document exists
    document = Document.get_document_by_id(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    chats = Chat.get_chats_for_document(document_id)
    return chats

@router.post("/", response_model=ChatResponse)
async def create_chat(chat: ChatCreate = Body(...)):
    """Create a new chat message"""
    try:
        # Verify document exists
        document = Document.get_document_by_id(chat.document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
            
        # Process chat with AI
        ai_response, used_tools = process_chat_with_document(
            chat.document_id, 
            chat.user_message
        )
        
        # Save to database
        chat_id = Chat.create_chat(
            chat.document_id,
            chat.user_message,
            ai_response,
            used_tools
        )
        
        # Update document chat stats
        Document.update_chat_stats(chat.document_id)
        
        # Return the chat
        return Chat.get_chat_by_id(chat_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

@router.delete("/{document_id}")
async def delete_chats_for_document(document_id: str):
    """Delete all chat messages for a document"""
    # Verify document exists
    document = Document.get_document_by_id(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    Chat.delete_chats_for_document(document_id)
    return {"message": "Chat history deleted successfully"}