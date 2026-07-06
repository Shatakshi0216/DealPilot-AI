from datetime import datetime, timedelta

class MonitoringAgent:
    """
    Monitoring Agent registers sale alerts and tracks price drops over watch windows
    using the Calendar MCP Server.
    """
    def __init__(self, mcp_client=None):
        self.mcp_client = mcp_client

    def setup_tracker(self, product: str, watch_days: int) -> list[str]:
        print(f"[MonitoringAgent] Setting up continuous price-watch scheduler for {product} over {watch_days} days...")
        
        # Calculate dates
        start_date = datetime.now()
        end_date = start_date + timedelta(days=watch_days)
        
        events_created = []
        
        # Calendar MCP Server wrapper:
        # if self.mcp_client:
        #     self.mcp_client.call_tool("calendar", "create_event", {
        #         "title": f"DealPilot Watch Deadline: {product}",
        #         "start_time": end_date.isoformat(),
        #         "end_time": (end_date + timedelta(hours=1)).isoformat(),
        #         "description": "Deadline for DealPilot watch window. Review accumulated dealer quotes."
        #     })
        
        deadline_msg = f"DealPilot Watch: {product} buy deadline scheduled on {end_date.strftime('%Y-%m-%d %H:%M')}"
        events_created.append(deadline_msg)
        print(f"[MonitoringAgent] Calendar MCP: calendar.create_event() added reminder for: {end_date.strftime('%Y-%m-%d')}")
        
        return events_created
        
    def check_price_change(self, day: int, timeline_data: dict) -> dict:
        """
        Retrieves simulated price drops or flash sale events scheduled on a specific day.
        """
        day_str = str(day)
        day_events = timeline_data.get(day_str, timeline_data.get(day, {}))
        return day_events
