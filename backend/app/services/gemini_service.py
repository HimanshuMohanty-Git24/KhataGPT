import google.generativeai as genai
import os
from app.config import GEMINI_API_KEY

# Configure the Gemini API
genai.configure(api_key=GEMINI_API_KEY)

def get_gemini_response(image_data, prompt):
    """
    Get response from Gemini model for image analysis
    
    Args:
        image_data: The image data (base64 encoded)
        prompt: The system prompt for the model
        
    Returns:
        The model's response
    """
    try:
        # Initialize the Gemini model
        model = genai.GenerativeModel('gemini-2.0-pro-exp-02-05')
        
        # Create the content with the image and prompt
        response = model.generate_content([
            prompt,
            {"mime_type": "image/jpeg", "data": image_data}
        ])
        
        return response.text
    except Exception as e:
        return f"Error in processing with Gemini: {str(e)}"

def get_gemini_text_response(prompt, model_name='gemini-2.0-pro'):
    """
    Get response from Gemini model for text-only queries
    
    Args:
        prompt: The prompt for the model
        model_name: The name of the model to use
        
    Returns:
        The model's response
    """
    try:
        # Initialize the Gemini model
        model = genai.GenerativeModel(model_name)
        
        # Get response
        response = model.generate_content(prompt)
        
        return response.text
    except Exception as e:
        return f"Error in processing with Gemini: {str(e)}"