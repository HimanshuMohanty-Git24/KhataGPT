from datetime import datetime
from app.models.document import Document, documents_collection

def create_text_search_index():
    """Create text search indexes for efficient document searching"""
    # Check for existing text index
    existing_indexes = documents_collection.index_information()
    for idx_name, idx_info in existing_indexes.items():
        if any('_fts' in key for key, _ in idx_info.get('key', [])):
            print(f"Text index already exists: {idx_name}")
            return

    # Create text index on title and extracted_text
    documents_collection.create_index(
        [("title", "text"), ("extracted_text", "text")],
        name="title_text_extracted_text_text"
    )
    print("Successfully created text search indexes on 'title' and 'extracted_text' fields")