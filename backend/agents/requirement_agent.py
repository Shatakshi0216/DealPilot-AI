import os
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

class ShoppingRequirements(BaseModel):
    product: str = Field(description="The specific product the user wants to buy (e.g., iPhone 17 Pro)")
    location: str = Field(description="The user's geographical target location for retail store pickup or local shipping (e.g., Mumbai)")
    budget: int = Field(description="The user's maximum budget constraint in Indian Rupees (INR)")
    payment_cards: list[str] = Field(default=[], description="List of credit or debit cards the user has (e.g., ['HDFC Credit Card'])")
    urgency_days: int = Field(default=10, description="The number of days the user is willing to wait to purchase (e.g., 10)")

class RequirementAgent:
    """
    Requirement Agent parses unstructured user descriptions into structured shopping profiles
    using Google's Gemini LLM with Pydantic structured outputs.
    """
    def __init__(self):
        # Retrieve client from environment. Uses GEMINI_API_KEY environment variable.
        self.api_key = os.environ.get("GEMINI_API_KEY")
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None

    def analyze_request(self, user_prompt: str) -> ShoppingRequirements:
        print(f"[RequirementAgent] Extracting shopping requirements from prompt: '{user_prompt}'")
        
        # Fallback simulation if no GEMINI_API_KEY is found (ensures code is runnable in test environments)
        if not self.client:
            print("[RequirementAgent] WARNING: GEMINI_API_KEY not found. Running in simulation mode.")
            # Simulating structured parsing
            return ShoppingRequirements(
                product="iPhone 17 Pro",
                location="Mumbai",
                budget=110000,
                payment_cards=["HDFC Credit Card"],
                urgency_days=10
            )
            
        try:
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=f"Extract shopping criteria from this user query: {user_prompt}",
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ShoppingRequirements,
                    temperature=0.1
                )
            )
            parsed_data = ShoppingRequirements.model_validate_json(response.text)
            print(f"[RequirementAgent] Extracted successfully: {parsed_data.model_dump()}")
            return parsed_data
        except Exception as e:
            print(f"[RequirementAgent] Error during content generation: {e}. Falling back to default.")
            return ShoppingRequirements(
                product="Generic Product",
                location="Global",
                budget=50000,
                payment_cards=[],
                urgency_days=7
            )
