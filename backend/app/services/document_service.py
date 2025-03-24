from datetime import datetime
import os
import base64
from io import BytesIO
from PIL import Image
import google.generativeai as genai

from app.config import GEMINI_API_KEY, ALLOWED_EXTENSIONS
from app.utils.image_utils import convert_to_jpg, resize_image_if_needed, get_image_base64

# Configure the Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# System prompt for Gemini document extraction
DOCUMENT_SYSTEM_PROMPT = """
You are an expert document analyzer. Your task is to extract all information from the uploaded document image.
The document could be a bill, receipt, menu, form, or any other type of document.

Please analyze the image carefully and extract ALL text and relevant information.
Then, organize the extracted information in a well-structured markdown format with:
- Clear headings and subheadings
- Properly formatted lists where appropriate
- Tables for tabular data
- Bold text for important information like totals, dates, or key identifiers

Be comprehensive in your extraction but organize the information logically.
If the document is a receipt or bill, include details like:
- Business name and contact information
- Date and time
- Items purchased with prices
- Subtotals, taxes, and totals
- Payment methods

If it's a menu, include:
- Restaurant name
- Categories of food
- Items with descriptions and prices

For other document types, use your judgment to organize the information in the most readable way.

IMPORTANT: Your response should ONLY contain the extracted and formatted information in markdown.
Do not include any explanations, introductions, or conclusions about the document.
"""

def get_now_formatted():
    """Return current datetime in a formatted string"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def process_document_image(file_contents):
    """
    Process an uploaded document image
    
    Args:
        file_contents: Bytes of the uploaded file
        
    Returns:
        Tuple of (base64_image, extracted_text)
    """
    # Load image
    img = Image.open(BytesIO(file_contents))
    
    # Convert to JPG
    jpg_buffer = convert_to_jpg(BytesIO(file_contents))
    
    # Resize if needed
    img = resize_image_if_needed(img)
    
    # Get base64 encoded image for Gemini
    base64_image = get_image_base64(jpg_buffer)
    
    # Extract text with Gemini
    extracted_text = extract_text_with_gemini(base64_image)
    
    return base64_image, extracted_text

def extract_text_with_gemini(image_base64):
    """
    Extract text from image using Gemini
    
    Args:
        image_base64: Base64 encoded image
        
    Returns:
        Extracted text
    """
    try:
        # Initialize the Gemini model - using the latest pro model
        model = genai.GenerativeModel('gemini-2.0-pro-exp-02-05')
        
        # Create the content with the image and prompt
        response = model.generate_content([
            DOCUMENT_SYSTEM_PROMPT,
            {"mime_type": "image/jpeg", "data": image_base64}
        ])
        
        return response.text
    except Exception as e:
        return f"Error in processing with Gemini: {str(e)}"

def generate_document_title(extracted_text):
    """
    Generate a descriptive title for the document using Gemini
    
    Args:
        extracted_text: The extracted text from the document
        
    Returns:
        A descriptive title for the document
    """
    try:
        # Initialize the Gemini model
        model = genai.GenerativeModel('gemini-1.5-pro')
        
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
        
        # Get a short summary of the text for the title
        response = model.generate_content(prompt + extracted_text[:1000])  # Limit text to first 1000 chars
        
        # Get the response and strip whitespace
        title = response.text.strip()
        
        # If title is too long or empty, provide a fallback
        if len(title) > 60 or not title:
            title = f"Document Scan ({get_now_formatted()})"
            
        return title
    except Exception as e:
        # If there's an error, return a generic title with timestamp
        return f"Document Scan ({get_now_formatted()})"
        
def detect_document_type(extracted_text):
    """
    Detect the document type from the extracted text
    
    Args:
        extracted_text: The extracted text from the document
        
    Returns:
        The detected document type (receipt, invoice, etc.)
    """
    try:
        # Initialize the Gemini model
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = """
        Classify the following document text into one of these categories:
        - receipt
        - invoice
        - bill
        - statement
        - form
        - menu
        - contract
        - report
        - letter
        -id card
        -document
        -ticket
        -certificate
        -license
        -permit
        -application
        -enrollment
        -registration
        -reservation
        -schedule
        -agenda
        -itinerary
        -manifesto
        - other
        
        Return only the category name, nothing else.
        
        Document text:
        """
        
        # Get the document type
        response = model.generate_content(prompt + extracted_text[:1000])  # Limit text to first 1000 chars
        
        # Return the document type
        doc_type = response.text.strip().lower()
        
        # Validate that it's one of our categories
        valid_types = ["receipt", "invoice", "bill", "statement", "form", 
                       "menu", "contract", "report", "letter", "other"]
        
        if doc_type not in valid_types:
            return "other"
            
        return doc_type
    except Exception as e:
        # If there's an error, return a generic type
        return "other"