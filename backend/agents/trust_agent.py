from .research_agent import MarketListing

class TrustAgent:
    """
    Trust Agent filters listings based on security, SSL status, and seller rating constraints.
    Ensures safe concierge purchasing.
    """
    def __init__(self, min_rating_threshold: float = 3.5):
        self.min_rating = min_rating_threshold

    def vet_listings(self, listings: list[MarketListing]) -> list[MarketListing]:
        print(f"[TrustAgent] Analyzing {len(listings)} retail avenues against min_rating={self.min_rating}...")
        vetted_listings = []
        
        for item in listings:
            # Security Rule 1: No HTTP sites (must have SSL)
            if item.url.startswith("http://"):
                print(f"[TrustAgent] REJECTED: '{item.store_name}' - Suspicious unsecured HTTP endpoint (anti-phishing filter)")
                continue
                
            # Security Rule 2: Low Rating check
            if item.seller_rating < self.min_rating:
                print(f"[TrustAgent] REJECTED: '{item.store_name}' - Poor seller score rating of {item.seller_rating}/5")
                continue
                
            # Vetted successfully
            print(f"[TrustAgent] CLEARED: '{item.store_name}' - Validated merchant (Rating: {item.seller_rating}/5)")
            vetted_listings.append(item)
            
        print(f"[TrustAgent] Vetting completed. Vetted listings: {len(vetted_listings)}/{len(listings)}")
        return vetted_listings
