import requests
from bs4 import BeautifulSoup
import json

def search_duckduckgo(query, max_results=3):
    """
    Search DuckDuckGo and return relevant results
    
    Args:
        query: Search query
        max_results: Maximum number of results to return
        
    Returns:
        A list of search results (title, link, snippet)
    """
    try:
        # Format the query for URL
        formatted_query = query.replace(' ', '+')
        
        # Perform the search
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
        }
        
        # Make the request to DuckDuckGo
        response = requests.get(
            f"https://html.duckduckgo.com/html/?q={formatted_query}",
            headers=headers
        )
        
        # Parse the HTML response
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract search results
        results = []
        for result in soup.select('.result'):
            title_elem = result.select_one('.result__title')
            link_elem = result.select_one('.result__url')
            snippet_elem = result.select_one('.result__snippet')
            
            if title_elem and link_elem and snippet_elem:
                title = title_elem.get_text(strip=True)
                link = link_elem.get('href') if link_elem.get('href') else link_elem.get_text(strip=True)
                snippet = snippet_elem.get_text(strip=True)
                
                results.append({
                    'title': title,
                    'link': link,
                    'snippet': snippet
                })
                
                if len(results) >= max_results:
                    break
        
        return results
    except Exception as e:
        return [{"error": f"Search failed: {str(e)}"}]