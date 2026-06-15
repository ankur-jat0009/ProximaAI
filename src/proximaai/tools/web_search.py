"""
Web Search Tool - Performs internet searches for job-related information.
"""

from typing import List, Dict, Any, Optional
from langchain.tools import BaseTool
import requests
import json
from urllib.parse import quote_plus
import time


class WebSearchTool(BaseTool):
    """Tool for performing web searches."""
    
    def __init__(self, api_key: Optional[str] = None):
        super().__init__(
            name="web_search",
            description="""
            Performs web searches to find current information about companies, job markets, 
            industry trends, and career-related topics.
            
            Input should be a search query string.
            Returns relevant search results with URLs and snippets.
            """
        )
        # Store api_key in a way that doesn't conflict with Pydantic
        self._api_key = api_key
        # For now, we'll use a simple approach. In production, you'd want to use
        # a proper search API like Google Custom Search, SerpAPI, or similar
    
    @property
    def api_key(self) -> Optional[str]:
        """Get the API key."""
        return self._api_key
    
    def _run(self, query: str) -> str:
        """Perform a web search."""
        try:
            # This is a placeholder implementation
            # In production, you'd integrate with a real search API
            search_results = self._perform_search(query)
            return json.dumps(search_results, indent=2)
        except Exception as e:
            return f"Error performing search: {str(e)}"
    
    def _perform_search(self, query: str) -> List[Dict[str, Any]]:
        """Perform the actual search using Tavily."""
        api_key = self._api_key or os.environ.get("TAVILY_API_KEY")
        if not api_key:
            return [{"title": "Error", "snippet": "TAVILY_API_KEY not found.", "url": ""}]

        try:
            response = requests.post(
                "https://api.tavily.com/search",
                json={
                    "api_key": api_key,
                    "query": query,
                    "search_depth": "smart",
                    "max_results": 5
                }
            )
            response.raise_for_status()
            data = response.json()
            
            results = []
            for result in data.get("results", []):
                results.append({
                    "title": result.get("title"),
                    "url": result.get("url"),
                    "snippet": result.get("content"),
                    "source": "tavily"
                })
            return results
        except Exception as e:
            return [{"title": "Search Error", "snippet": str(e), "url": ""}]


class CompanyResearchTool(BaseTool):
    """Tool for researching specific companies."""
    
    def __init__(self):
        super().__init__(
            name="company_research",
            description="""
            Researches specific companies to find information about their culture, 
            recent news, financial performance, and job opportunities.
            
            Input should be a company name.
            Returns comprehensive company information.
            """
        )
    
    def _run(self, company_name: str) -> str:
        """Research a specific company."""
        try:
            # Perform multiple searches for comprehensive company info
            searches = [
                f"{company_name} company culture",
                f"{company_name} recent news",
                f"{company_name} job opportunities",
                f"{company_name} financial performance"
            ]
            
            results = {}
            for search in searches:
                results[search] = self._perform_search(search)
            
            return json.dumps(results, indent=2)
        except Exception as e:
            return f"Error researching company: {str(e)}"
    
    def _perform_search(self, query: str) -> List[Dict[str, Any]]:
        """Perform search (placeholder implementation)."""
        # Mock implementation - replace with actual search API
        return [
            {
                "title": f"Results for: {query}",
                "url": f"https://example.com/search?q={quote_plus(query)}",
                "snippet": f"Information about {query}",
                "source": "company_research"
            }
        ]
