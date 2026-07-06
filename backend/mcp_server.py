import asyncio
from mcp.server.models import InitializationOptions
import mcp.types as types
from mcp.server import NotificationOptions, Server
from mcp.server.stdio import stdio_server

# Initialize DealPilot MCP Server
server = Server("dealpilot-mcp-server")

@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    """
    Exposes DealPilot custom negotiation and local dealer crawling tools
    to MCP-compatible LLM clients.
    """
    return [
        types.Tool(
            name="search_local_dealers",
            description="Find local brick-and-mortar authorized stores and email contacts in a specific location.",
            inputSchema={
                "type": "object",
                "properties": {
                    "product": {"type": "string", "description": "Product name (e.g. iPhone 17 Pro)"},
                    "location": {"type": "string", "description": "City or area (e.g. Mumbai)"}
                },
                "required": ["product", "location"]
            }
        ),
        types.Tool(
            name="draft_negotiation_email",
            description="Draft a competitive price-match request (RFQ) based on current online prices and payment cards.",
            inputSchema={
                "type": "object",
                "properties": {
                    "product": {"type": "string", "description": "Product name"},
                    "location": {"type": "string", "description": "User's current city"},
                    "target_price": {"type": "integer", "description": "Best online baseline price to match"},
                    "card": {"type": "string", "description": "Credit card promotions available"}
                },
                "required": ["product", "location", "target_price"]
            }
        )
    ]

@server.call_tool()
async def handle_call_tool(
    name: str, arguments: dict | None
) -> list[types.TextContent]:
    """
    Handles tool invocation requests from the LLM client.
    """
    if not arguments:
        return [types.TextContent(type="text", text="Error: Arguments are required")]

    if name == "search_local_dealers":
        product = arguments.get("product")
        location = arguments.get("location")
        
        # Simulated database lookup
        loc_lower = location.lower()
        if "mumbai" in loc_lower:
            dealers = [
                {"store": "Croma Retail Mumbai", "email": "store@croma.com", "authorized": True},
                {"store": "Vijay Sales (Local Reseller)", "email": "local_dealer@vijaysales.com", "authorized": True}
            ]
        elif "delhi" in loc_lower:
            dealers = [
                {"store": "Laptop World Nehru Place", "email": "sales@laptopworlddelhi.com", "authorized": True},
                {"store": "Vijay Sales Delhi", "email": "manager@vijaysales.com", "authorized": True}
            ]
        else:
            dealers = [
                {"store": f"{location} Digital Hub", "email": f"local_dealer@{location.lower()}sales.com", "authorized": True}
            ]
            
        import json
        return [
            types.TextContent(
                type="text",
                text=json.dumps({"dealers": dealers, "status": "Success"})
            )
        ]

    elif name == "draft_negotiation_email":
        product = arguments.get("product")
        location = arguments.get("location")
        target_price = arguments.get("target_price")
        card = arguments.get("card", "None")

        email_draft = f"""Subject: RFQ / Price Match Request - {product}
To: local_retailer@{location.lower()}.com

Dear Store Manager,

I am looking to buy the {product} in {location} soon.
The current best online price I've found is ₹{target_price.toLocaleString() if hasattr(target_price, 'toLocaleString') else target_price}. I have a {card}.
Can you offer a competitive price match or package deal including store accessories if I buy directly from your showroom?

Regards,
DealPilot AI"""

        return [
            types.TextContent(
                type="text",
                text=email_draft
            )
        ]

    else:
        raise ValueError(f"Unknown tool: {name}")

async def main():
    # Run the server using stdio transport
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="dealpilot-mcp-server",
                server_version="1.0.0",
                capabilities=server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={},
                ),
            ),
        )

if __name__ == "__main__":
    asyncio.run(main())
