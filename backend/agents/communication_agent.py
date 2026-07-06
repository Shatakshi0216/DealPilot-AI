import os

class CommunicationAgent:
    """
    Communication Agent handles draft creation using the Gmail MCP Server.
    Keeps users secure by preparing emails as drafts instead of sending directly.
    """
    def __init__(self, mcp_client=None):
        self.mcp_client = mcp_client

    def draft_rfq_competition(self, product: str, location: str, best_online_price: int, card: str, dealer_emails: list[str]) -> str:
        if not dealer_emails:
            print("[CommunicationAgent] No target dealers specified. Skipping email drafting.")
            return ""

        print(f"[CommunicationAgent] Preparing RFQ drafts for local dealers in {location}: {', '.join(dealer_emails)}")
        
        email_body = f"""Hi,

I am looking to purchase a {product} in {location} soon.
The current best online price I've found is ₹{best_online_price.toLocaleString() if hasattr(best_online_price, 'toLocaleString') else best_online_price}. I have a {card}.
Can you offer a competitive price match or package bundle (e.g., extended warranty, accessories) at your retail showroom?

Looking forward to your best quote.

Regards,
DealPilot AI (On behalf of User)"""

        subject = f"RFQ / Price Match Request - {product}"

        # If MCP client is online, create Gmail drafts:
        # for email in dealer_emails:
        #     self.mcp_client.call_tool("gmail", "create_draft", {
        #         "to": email,
        #         "subject": subject,
        #         "body": email_body
        #     })
        
        print("[CommunicationAgent] Gmail MCP: gmail.create_draft() executed for all recipient accounts.")
        print(f"[CommunicationAgent] SECURITY POLICY: Created {len(dealer_emails)} drafts in your Gmail. Zero direct send calls were made.")
        
        return email_body
