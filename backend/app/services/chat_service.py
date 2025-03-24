import os
from app.models.document import Document
from app.utils.search_utils import search_duckduckgo
import google.generativeai as genai

# Configure the Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Base prompt template for document chat
CHAT_SYSTEM_PROMPT = """
You are an expert document assistant. You help users understand and extract information from various documents like receipts, bills, menus, forms, etc.

Your current task is to answer questions about the document content provided in the context.
Always refer to the document content to provide accurate answers.

RESPONSE STYLE:
- Start with a direct, concise answer to the user's question
- Present information with relevant metrics when possible (calories, prices, comparisons)
- Use bullet points and clear formatting for easy scanning
- Highlight key facts with bold text when appropriate

HANDLING DOCUMENT CONTENT:
- If information is clearly stated in the document, provide it directly.
- If the information is partially available, provide what's available and clearly indicate what's missing.
- If information is completely absent from the document, clearly state that it's not in the document.

HANDLING RELATED QUERIES:
- For questions that require external information (like nutritional info, price comparisons, reviews), use search to supplement document data
- For menu items, provide estimated calorie counts or nutritional data when requested
- For prices on receipts/invoices, provide market rate comparisons when asked
- For products or services in documents, include quality/review information when relevant

BLENDING INFORMATION:
- When using search results to supplement document data, clearly organize your response:
  1. First give direct information from the document
  2. Then provide supplemental data from search with a clear separator
  3. Finally, offer a brief, actionable conclusion or recommendation

DO NOT:
- Do not make up information that isn't in the document or search results
- Do not provide personal opinions unless supported by search data
- Do not ignore the document content in favor of just search results

FORMAT:
- Format your responses in clear, well-structured markdown
- Use headings, lists, and formatting to make information easily scannable
- Keep responses concise but comprehensive
"""

def should_use_search_tool(query, doc_content):
    """
    Determine if we should use the search tool based on the query
    
    Args:
        query: User query
        doc_content: Document content
        
    Returns:
        Boolean indicating whether to use search
    """
    try:
        # Use Gemini to decide if we need to search
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        Analyze this query and tell me if it requires external information beyond what might be in the document content.
        Reply with "YES" if external search would be useful for any of these cases:
        - Asking about nutritional information not typically included in menus
        - Asking about market prices or price comparisons
        - Asking about reviews or ratings
        - Asking about alternatives or similar products/services
        - Asking about additional details that wouldn't typically be in this kind of document
        - Asking about historical or future information related to items in the document
        - Asking which items are healthiest, best value, or other comparative judgments
        - Asking about ingredients, allergens, or health impacts not typically detailed in documents
        
        Reply with "NO" if the document content should be sufficient.
        
        Document content snippet:
        {doc_content[:500]}...
        
        User query: {query}
        
        Reply only with YES or NO.
        """
        
        response = model.generate_content(prompt)
        result = response.text.strip().upper()
        
        return "YES" in result
    except Exception as e:
        print(f"Error in should_use_search_tool: {e}")
        return False

def process_chat_with_document(document_id, user_message):
    """
    Process a chat message in the context of a document
    
    Args:
        document_id: The document ID
        user_message: User's message
        
    Returns:
        AI response, used tools list
    """
    try:
        # Get document content
        doc = Document.get_document_by_id(document_id)
        if not doc:
            return "Sorry, I couldn't find the document you're referring to.", []
        
        # Document content
        doc_content = doc['extracted_text']
        doc_title = doc['title']
        doc_type = doc['doc_type']
        
        used_tools = []
        search_results = ""
        
        # Check if we need to search
        if should_use_search_tool(user_message, doc_content):
            # Generate a more targeted search query based on what we're looking for
            model = genai.GenerativeModel('gemini-1.5-flash')
            search_prompt = f"""
            Create a specific, targeted web search query to find information about:
            
            User Question: {user_message}
            
            Context: This is about a {doc_type} titled "{doc_title}" that includes information such as:
            {doc_content[:300]}...
            
            If looking for nutritional information, include "calories nutritional facts" in the query.
            If looking for price comparisons, include "typical price market rate" in the query.
            If looking for quality assessment, include "reviews ratings" in the query.
            
            Return only the search query text, no additional explanation.
            """
            
            search_response = model.generate_content(search_prompt)
            search_query = search_response.text.strip()
            
            # Fallback if query generation fails
            if not search_query:
                search_query = f"{user_message} {doc_title} {doc_type}"
                
            results = search_duckduckgo(search_query)
            
            if results and not any('error' in r for r in results):
                search_results = "\n\nSearch results:\n"
                for result in results:
                    search_results += f"- {result['title']}: {result['snippet']}\n"
                
                used_tools.append({
                    "tool_name": "search",
                    "query": search_query,
                    "results": results
                })
        
        # Initialize the Gemini model
        model = genai.GenerativeModel('gemini-2.0-pro-exp-02-05')
        
        # Build the prompt with document content
        prompt = f"""{CHAT_SYSTEM_PROMPT}

Document Type: {doc_type}
Document Title: {doc_title}

Document Content:
{doc_content}

{search_results}

User Question: {user_message}

Instructions for response:
1. Begin with a direct, concise answer to the question
2. Include specific metrics where possible (prices, calories, ratings)
3. Format your response with clear sections and bullet points
4. For nutrition/price/quality questions, provide a clear conclusion with specific numbers
5. When using search results, clearly indicate what's from external sources
"""
        
        # Get response from Gemini
        response = model.generate_content(prompt)
        return response.text, used_tools
    except Exception as e:
        return f"Error processing your question: {str(e)}", []