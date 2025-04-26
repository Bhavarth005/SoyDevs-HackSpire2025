# services/emotion_analysis.py

from fastapi import APIRouter
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
if not GOOGLE_API_KEY:
    raise Exception("Missing GEMINI_API_KEY environment variable!")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.3,
    google_api_key=GOOGLE_API_KEY
)

# Input model
class EmotionRequest(BaseModel):
    message: str

# Output model
class EmotionResponse(BaseModel):
    emotion: str
    score: float

emotion_prompt = PromptTemplate.from_template(
    """
    You are an emotion analysis expert.

    Analyze the following user's message.
    Classify the dominant emotion into one of these: [joy, sadness, fear, anger, neutral].
    Also, estimate a confidence score between 0 (not confident) and 1 (very confident).

    Return your response in JSON format like:
    {{"emotion": "emotion_label", "score": confidence_score}}

    User message:
    "{input_text}"
    """
)

@router.post("/analyze-emotion", response_model=EmotionResponse)
async def analyze_emotion(payload: EmotionRequest):
    formatted_prompt = emotion_prompt.format(input_text=payload.message)

    result = llm.invoke(formatted_prompt)
    
    # Extract the JSON part
    try:
        result_json = result.content.strip()
        emotion_data = eval(result_json)  # Small hack (if clean JSON returned)
        
        return EmotionResponse(
            emotion=emotion_data["emotion"],
            score=emotion_data["score"]
        )
    except Exception as e:
        raise Exception(f"Failed to parse LLM response: {str(e)}")
