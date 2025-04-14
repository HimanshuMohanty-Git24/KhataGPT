from PIL import Image
import io
import base64
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

def convert_to_jpg(image_file):
    """
    Convert any image format to JPG
    
    Args:
        image_file: Image file (file-like object or path)
        
    Returns:
        BytesIO object containing JPG image
    """
    img = Image.open(image_file)
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Save as JPG in memory
    jpg_buffer = io.BytesIO()
    img.save(jpg_buffer, format="JPEG")
    jpg_buffer.seek(0)
    
    return jpg_buffer

def get_image_base64(image_buffer):
    """
    Convert image buffer to base64 string
    
    Args:
        image_buffer: BytesIO buffer containing image
        
    Returns:
        Base64 encoded string
    """
    return base64.b64encode(image_buffer.getvalue()).decode('utf-8')

def resize_image_if_needed(img, max_size=1600):
    """
    Resize image if it's too large while maintaining aspect ratio
    
    Args:
        img: PIL Image object
        max_size: Maximum dimension (width or height)
        
    Returns:
        Resized PIL Image object
    """
    width, height = img.size
    
    # Check if resizing is needed
    if width > max_size or height > max_size:
        if width > height:
            new_width = max_size
            new_height = int(height * (max_size / width))
        else:
            new_height = max_size
            new_width = int(width * (max_size / height))
        
        img = img.resize((new_width, new_height), Image.LANCZOS)
    
    return img

def combine_images_to_pdf(image_buffers):
    """
    Combine multiple images into a single PDF document
    
    Args:
        image_buffers: List of BytesIO objects containing image data
        
    Returns:
        BytesIO object containing the PDF
    """
    if not image_buffers or len(image_buffers) == 0:
        raise ValueError("No images provided to combine into PDF")
    
    # Create a new PDF in memory
    pdf_buffer = io.BytesIO()
    
    try:
        # Convert all input images to PIL Images and save to PDF
        images = []
        for buffer in image_buffers:
            buffer.seek(0)  # Reset buffer pointer
            img = Image.open(buffer)
            
            # Convert to RGB mode if not already (required for PDF)
            if img.mode != 'RGB':
                img = img.convert('RGB')
                
            # Resize if too large
            img = resize_image_if_needed(img)
            images.append(img)
        
        # Save the first image as PDF and append others
        if images:
            # First image
            first_img = images[0]
            # Save all images to PDF
            first_img.save(
                pdf_buffer, 
                format="PDF",
                save_all=True,
                append_images=images[1:] if len(images) > 1 else []
            )
            pdf_buffer.seek(0)
        
        return pdf_buffer
    except Exception as e:
        raise ValueError(f"Failed to combine images into PDF: {str(e)}")