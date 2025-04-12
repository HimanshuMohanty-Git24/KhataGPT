import base64
from io import BytesIO
from PIL import Image
import google.generativeai as genai
from app.config import GEMINI_API_KEY
from app.utils.image_utils import convert_to_jpg, resize_image_if_needed, get_image_base64

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# System prompt for document extraction
DOCUMENT_SYSTEM_PROMPT = """
You are an expert document analyzer. Extract all text and information from the provided document image.
Organize the information in a well-structured markdown format with appropriate headings, lists, and tables.
"""

class DocumentProcessor:
    """
    Process document images and extract information
    """
    
    def process_document(self, document_data):
        """
        Process a document from its image data
        
        Args:
            document_data: Document data containing image_base64
            
        Returns:
            Processed document data with extracted text
        """
        try:
            # Get image/PDF data
            if not document_data.image_base64:
                return document_data
                
            # Determine file type - default to image if not specified
            file_type = document_data.file_type if hasattr(document_data, "file_type") else "image"
            
            # Decode base64 to get binary data for processing
            file_binary = base64.b64decode(document_data.image_base64)
            
            if file_type == "pdf":
                # Process PDF with Gemini
                extracted_text = self.extract_text_from_pdf(document_data.image_base64)
                
                # Update document with extracted info
                document_data.extracted_text = extracted_text
                
                # No additional processing needed for PDF binary data
                # Keep original base64 for PDF viewing
            else:
                # Process as image (existing code)
                # Create a BytesIO object from the binary data
                image_io = BytesIO(file_binary)
                
                # Open the image
                img = Image.open(image_io)
                
                # Convert to JPG and resize if needed
                jpg_buffer = convert_to_jpg(BytesIO(file_binary))
                img = resize_image_if_needed(img)
                
                # Get base64 encoded image for Gemini
                processed_base64 = get_image_base64(jpg_buffer)
                
                # Extract text with Gemini
                extracted_text = self.extract_text_with_gemini(processed_base64)
                
                # Update document with extracted info
                document_data.extracted_text = extracted_text
                document_data.image_base64 = processed_base64  # Update with optimized image
            
            # Always generate a title from the content
            document_data.title = self.generate_document_title(document_data.extracted_text)
            
            # Detect document type if not specified
            if document_data.doc_type == "unknown":
                document_data.doc_type = self.detect_document_type(document_data.extracted_text)
            
            return document_data
        
        except Exception as e:
            # If there's an error, preserve original document but add error message
            print(f"Error processing document: {str(e)}")
            if not document_data.extracted_text:
                document_data.extracted_text = f"Error processing document: {str(e)}"
            return document_data

    def extract_text_with_gemini(self, image_base64):
        """Extract text from image using Gemini"""
        try:
            model = genai.GenerativeModel('gemini-2.0-pro-exp-02-05')
            response = model.generate_content([
                DOCUMENT_SYSTEM_PROMPT,
                {"mime_type": "image/jpeg", "data": image_base64}
            ])
            return response.text
        except Exception as e:
            return f"Error extracting text: {str(e)}"
    
    def extract_text_from_pdf(self, base64_pdf: str) -> str:
        """Extract text from PDF using Gemini"""
        try:
            # Convert base64 to binary
            pdf_bytes = base64.b64decode(base64_pdf)
            
            # Configure Gemini
            model = genai.GenerativeModel('gemini-2.0-pro-exp-02-05')
            
            # Create a prompt with PDF content
            response = model.generate_content([
                DOCUMENT_SYSTEM_PROMPT,
                {
                    "mime_type": "application/pdf",
                    "data": pdf_bytes
                }
            ])
            
            return response.text
        except Exception as e:
            print(f"Error extracting text from PDF: {e}")
            return f"Error extracting text from PDF: {str(e)}"
    
    def generate_document_title(self, extracted_text):
        """Generate a descriptive title for the document"""
        try:
            model = genai.GenerativeModel('gemini-2.0-flash')
            prompt = """
            Based on the following document text, generate a clear, descriptive title 
            (maximum 60 characters).
            
            The title should:
            1. Start with the document type (e.g., "Receipt:", "Invoice:", "Menu:")
            2. Include business/organization name if available
            3. Include key identifying details (date, reference numbers, etc.)
            4. Be specific enough to distinguish it from similar documents
            
            Examples of good titles:
            - "Receipt: Walmart Groceries - March 24, 2025"
            - "Menu: Riverfront Grill Food & Drinks"
            - "Invoice #INV-2025-03-24: Computer Accessories"
            
            Document text:
            """
            
            response = model.generate_content(prompt + extracted_text[:1000])
            title = response.text.strip()
            
            if len(title) > 60 or not title:
                from datetime import datetime
                now = datetime.now().strftime("%Y-%m-%d %H:%M")
                title = f"Document Scan ({now})"
                
            return title
        except Exception as e:
            from datetime import datetime
            now = datetime.now().strftime("%Y-%m-%d %H:%M")
            return f"Document Scan ({now})"
    
    def detect_document_type(self, extracted_text):
        """Detect document type from extracted text"""
        try:
            model = genai.GenerativeModel('gemini-2.0-flash')
            prompt = """
            Classify this document text into one category: receipt, invoice, bill, statement, 
            form, menu, contract, report, letter, or other.
            Return only the category name, nothing else.
            
            Document text:
            """
            response = model.generate_content(prompt + extracted_text[:1000])
            doc_type = response.text.strip().lower()
            
            valid_types = ["receipt", "invoice", "bill", "statement", "form", 
                           "menu", "contract", "report", "letter", "other"]
            
            if doc_type not in valid_types:
                return "other"
                
            return doc_type
        except Exception as e:
            return "other"