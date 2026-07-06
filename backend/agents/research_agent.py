from pydantic import BaseModel
import json

class MarketListing(BaseModel):
    store_name: str
    base_price: int
    url: str
    seller_rating: float
    vendor_type: str  # e.g., 'Third-party', 'Official Store'

class ResearchAgent:
    """
    Research Agent queries the Browser MCP Server to retrieve web listings
    for the desired product.
    """
    def __init__(self, mcp_client=None):
        self.mcp_client = mcp_client

    def search_prices(self, product: str) -> list[MarketListing]:
        print(f"[ResearchAgent] Querying Browser MCP for listings on: '{product}'")
        
        # If we have an active MCP client, we would do:
        # response = self.mcp_client.call_tool("browser", "search_products", {"query": product})
        # For this capstone codebase, we implement a structured retrieval simulator:
        
        # Simulated database search based on query type
        prod_lower = product.lower()
        if "iphone" in prod_lower:
            return [
                MarketListing(store_name="Amazon India", base_price=114999, url="https://amazon.in/dp/iphone17pro", seller_rating=4.8, vendor_type="Third-party (Cloudtail)"),
                MarketListing(store_name="Flipkart", base_price=113499, url="https://flipkart.com/iphone-17-pro", seller_rating=4.6, vendor_type="Third-party (RetailNet)"),
                MarketListing(store_name="Reliance Digital", base_price=111999, url="https://reliancedigital.in/iphone-17-pro", seller_rating=4.5, vendor_type="Official Store"),
                MarketListing(store_name="Croma", base_price=112499, url="https://croma.com/apple-iphone-17-pro", seller_rating=4.5, vendor_type="Official Store"),
                MarketListing(store_name="MumbaiPhones.net", base_price=94999, url="http://mumbaiphones.net/buy-now", seller_rating=1.2, vendor_type="Unknown Merchant (No SSL)"),
                MarketListing(store_name="FastGadgets.in", base_price=99999, url="https://fastgadgets.in/iphone", seller_rating=2.1, vendor_type="Unknown Merchant")
            ]
        elif "laptop" in prod_lower or "rog" in prod_lower or "zephyrus" in prod_lower:
            return [
                MarketListing(store_name="Amazon India", base_price=98990, url="https://amazon.in/dp/rog-zephyrus", seller_rating=4.7, vendor_type="Third-party"),
                MarketListing(store_name="Flipkart", base_price=97500, url="https://flipkart.com/rog-zephyrus", seller_rating=4.4, vendor_type="Third-party"),
                MarketListing(store_name="Reliance Digital", base_price=95999, url="https://reliancedigital.in/rog-zephyrus", seller_rating=4.3, vendor_type="Official Store"),
                MarketListing(store_name="Croma", base_price=96500, url="https://croma.com/rog-zephyrus", seller_rating=4.4, vendor_type="Official Store"),
                MarketListing(store_name="SuperCheapLaptops.co", base_price=75000, url="http://supercheaplaptops.co", seller_rating=1.0, vendor_type="Scam Registry")
            ]
        else:
            # Fallback for custom queries: generates dynamic listings centered on a estimated price
            estimated_base = 50000
            return [
                MarketListing(store_name="Amazon India", base_price=int(estimated_base * 1.08), url="https://amazon.in", seller_rating=4.8, vendor_type="Third-party"),
                MarketListing(store_name="Flipkart", base_price=int(estimated_base * 1.06), url="https://flipkart.com", seller_rating=4.5, vendor_type="Third-party"),
                MarketListing(store_name="Reliance Digital", base_price=int(estimated_base * 1.04), url="https://reliancedigital.in", seller_rating=4.4, vendor_type="Official Store"),
                MarketListing(store_name="Croma", base_price=int(estimated_base * 1.05), url="https://croma.com", seller_rating=4.4, vendor_type="Official Store"),
                MarketListing(store_name="DoubtfulDeals.net", base_price=int(estimated_base * 0.7), url="http://doubtfuldeals.net", seller_rating=1.5, vendor_type="Suspicious Domain")
            ]
