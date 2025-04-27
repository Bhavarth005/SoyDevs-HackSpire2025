from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel
from typing import Dict
from requests import request

class QuizAnswersRequest(BaseModel):
    quiz_answers: Dict
    user_id: str

router = APIRouter()
client = MongoClient("localhost", 27017)
db = client.SoulLift

@router.post("/analysis-test")
async def analyze_answers(payload: QuizAnswersRequest):
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="Session not found")

    session = db.Sessions.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")

    # user_id = session["user_id"]
    try:
        user_profile = build_user_profile_from_answers(payload.quiz_answers)
        user_profile["user_id"] = payload.user_id
        
        result = db.user_profiles.update_one(
                    {"user_id": payload.user_id},
                    {"$set": user_profile},
                    upsert=True
                )

        return {"user_profile": user_profile}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def map_mood(answer: str) -> str:
    mapping = {
        "Mostly positive and upbeat": "positive",
        "Neutral, a bit of everything": "neutral",
        "A little down or tired": "low",
        "Struggling significantly with mood": "struggling"
    }
    return mapping.get(answer, "unknown")

def map_resilience(answer: str) -> str:
    mapping = {
        "Very easily": "high",
        "Sometimes": "moderate",
        "Rarely": "low",
        "Almost never": "very low"
    }
    return mapping.get(answer, "unknown")

def map_anxiety(answer: str) -> str:
    mapping = {
        "Rarely": "low",
        "Sometimes": "moderate",
        "Often": "high",
        "Almost constantly": "very high"
    }
    return mapping.get(answer, "unknown")

def map_social_support(answer: str) -> str:
    mapping = {
        "Very connected": "strong",
        "Somewhat connected": "moderate",
        "A bit isolated": "weak",
        "Very isolated": "very weak"
    }
    return mapping.get(answer, "unknown")

def map_self_talk(answer: str) -> str:
    mapping = {
        "I try to stay kind and patient": "positive",
        "I'm critical but fair": "neutral",
        "I'm usually harsh on myself": "harsh",
        "I don't know, I shut down": "shut down"
    }
    return mapping.get(answer, "unknown")

def map_life_satisfaction(answer: str) -> str:
    mapping = {
        "Very satisfied": "high",
        "Somewhat satisfied": "moderate",
        "Unsatisfied": "low",
        "Deeply unhappy": "very low"
    }
    return mapping.get(answer, "unknown")

def build_user_profile_from_answers(quiz_answers: dict) -> dict:
    user_profile = {
        "baseline_mood": map_mood(quiz_answers.get("baseline_mood")),
        "resilience_level": map_resilience(quiz_answers.get("resilience_level")),
        "coping_styles": quiz_answers.get("coping_styles", []),
        "anxiety_tendency": map_anxiety(quiz_answers.get("anxiety_tendency")),
        "social_support_level": map_social_support(quiz_answers.get("social_support_level")),
        "self_talk_style": map_self_talk(quiz_answers.get("self_talk_style")),
        "life_satisfaction_score": map_life_satisfaction(quiz_answers.get("life_satisfaction_score")),
        "soul_lift_goals": quiz_answers.get("soul_lift_goals", []),
        "future_hope_message": quiz_answers.get("future_hope_message", ""),
        "coping_hint_text": quiz_answers.get("coping_hint_text", "")
    }
    return user_profile
