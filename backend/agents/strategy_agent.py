from .research_agent import MarketListing
from pydantic import BaseModel

class DealStrategy(BaseModel):
    action: str  # 'BUY_NOW', 'WAIT_AND_MONITOR', 'NEGOTIATE_LOCAL'
    best_current_price: int
    projected_savings: int
    rationale: str
    target_dealer_emails: list[str]

class StrategyAgent:
    """
    Strategy Agent identifies coupon and card savings pathways, evaluates budget metrics,
    and structures negotiation RFQs for the Communication Agent.
    """
    def __init__(self):
        pass

    def evaluate_deal(self, listings: list[MarketListing], target_budget: int, card: str, urgency: int) -> DealStrategy:
        print("[StrategyAgent] Formulating optimal shopping strategy...")
        
        if not listings:
            return DealStrategy(
                action="WAIT_AND_MONITOR",
                best_current_price=0,
                projected_savings=0,
                rationale="No listings available to evaluate.",
                target_dealer_emails=[]
            )
            
        # Find best online price
        sorted_listings = sorted(listings, key=lambda x: x.base_price)
        best_listing = sorted_listings[0]
        best_price = best_listing.base_price
        
        # Calculate potential card discounts
        card_discount = 0
        card_lower = card.lower()
        if "hdfc" in card_lower and "iphone" in best_listing.store_name.lower():
            card_discount = 6000  # iPhone HDFC promotion
        elif "icici" in card_lower:
            card_discount = 4000
            
        final_online_price = best_price - card_discount
        savings = card_discount
        
        # Determine strategy action
        if final_online_price <= target_budget:
            action = "BUY_NOW"
            rationale = f"Best price of ₹{final_online_price.toLocaleString() if hasattr(final_online_price, 'toLocaleString') else final_online_price} (after ₹{card_discount} card offer) is within your budget of ₹{target_budget}. Purchase recommended."
            target_emails = []
        elif urgency > 3:
            # We have time to watch the price and negotiate with local brick-and-mortar stores
            action = "NEGOTIATE_LOCAL"
            savings += int(best_price * 0.05)  # Estimate local match + charger bundle value
            rationale = f"Best price (₹{final_online_price}) exceeds budget (₹{target_budget}). However, urgency window ({urgency} days) allows DealPilot to email local dealers to match the price and bundle accessories."
            
            # Map local dealer addresses
            if "iphone" in best_listing.store_name.lower():
                target_emails = ["store@croma.com", "local_dealer@vijaysales.com"]
            else:
                target_emails = ["sales@laptopworld.com", "manager@vijaysales.com"]
        else:
            action = "WAIT_AND_MONITOR"
            rationale = "Current price exceeds budget. Urgent window is too small for email cycles; setting up continuous price-watch alerts."
            target_emails = []
            
        strategy = DealStrategy(
            action=action,
            best_current_price=final_online_price,
            projected_savings=savings,
            rationale=rationale,
            target_dealer_emails=target_emails
        )
        print(f"[StrategyAgent] Strategy resolved: {strategy.action} | Projected Savings: ₹{strategy.projected_savings}")
        return strategy
