import os
import sys
from dotenv import load_dotenv

# Add current folder to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agents import (
    RequirementAgent,
    ResearchAgent,
    TrustAgent,
    StrategyAgent,
    CommunicationAgent,
    MonitoringAgent
)

def run_dealpilot_flow(user_query: str):
    """
    Executes the multi-agent DealPilot workflow.
    """
    print("="*60)
    print("           DEALPILOT AI: MULTI-AGENT EXECUTION LOOP            ")
    print("="*60)
    
    # 1. Parse requirements
    req_agent = RequirementAgent()
    criteria = req_agent.analyze_request(user_query)
    
    print(f"\n[Flow] Criteria Vetted: {criteria.product} in {criteria.location} | Budget: ₹{criteria.budget}")
    
    # 2. Search listings
    research_agent = ResearchAgent()
    listings = research_agent.search_prices(criteria.product)
    
    # 3. Vetting and trust scoring
    trust_agent = TrustAgent(min_rating_threshold=3.5)
    safe_listings = trust_agent.vet_listings(listings)
    
    # 4. Strategy resolution
    strategy_agent = StrategyAgent()
    strategy = strategy_agent.evaluate_deal(
        safe_listings, 
        criteria.budget, 
        criteria.payment_cards[0] if criteria.payment_cards else "None", 
        criteria.urgency_days
    )
    
    # 5. Communication (draft emails)
    comm_agent = CommunicationAgent()
    email_draft_body = comm_agent.draft_rfq_competition(
        criteria.product,
        criteria.location,
        strategy.best_current_price,
        criteria.payment_cards[0] if criteria.payment_cards else "None",
        strategy.target_dealer_emails
    )
    
    # 6. Monitoring & alerts
    monitor_agent = MonitoringAgent()
    calendar_alerts = monitor_agent.setup_tracker(criteria.product, criteria.urgency_days)
    
    print("\n" + "="*60)
    print("                      DECISION RESULTS                        ")
    print("="*60)
    print(f"Action Resolved: {strategy.action}")
    print(f"Final Price Estimate: ₹{strategy.best_current_price.toLocaleString() if hasattr(strategy.best_current_price, 'toLocaleString') else strategy.best_current_price}")
    print(f"Estimated Savings Strategy: ₹{strategy.projected_savings}")
    print(f"Rationale: {strategy.rationale}")
    if strategy.target_dealer_emails:
        print(f"Target Dealers Drafted: {', '.join(strategy.target_dealer_emails)}")
    print("="*60 + "\n")

if __name__ == "__main__":
    # Load API keys if present
    load_dotenv()
    
    # Default test query
    test_prompt = "I want to buy an iPhone 17 Pro in Mumbai. My budget is ₹1,10,000. I have an HDFC credit card. I can wait 10 days."
    
    # Check for CLI arguments
    if len(sys.argv) > 1:
        test_prompt = " ".join(sys.argv[1:])
        
    run_dealpilot_flow(test_prompt)
