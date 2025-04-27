from datetime import datetime
from http.client import HTTPException
import uuid
from fastapi import FastAPI, Response
from pydantic import BaseModel
import pymongo
import httpx
import requests
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from services.analysis_test import router as test_router
from services.analyze_emotion import router as emotion_router


client = pymongo.MongoClient("localhost", 27017)
db = client.SoulLift

class LoginRequest(BaseModel):
    email: str
    passwd: str


class User(BaseModel):
    name: str
    age: int
    gender: str
    email: str
    passwd: str
    emergency_contact: str

class StartChatRequest(BaseModel):
    user_id: str

class ChatMessage(BaseModel):
    user_id: str
    chat_id: str
    message: str
    new_chat: bool

app = FastAPI()
app.include_router(emotion_router, prefix="/emotion")
app.include_router(test_router, prefix="/test")


app.add_middleware(CORSMiddleware, 
                   allow_origins=["*"],
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])

@app.post("/login")
async def login(credentials: LoginRequest, response: Response):
    user = db.Users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if credentials.passwd != user["passwd"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    session_id = str(uuid.uuid4())

    db.Sessions.insert_one({
        "session_id": session_id,
        "user_id": str(user["_id"])
    })

    # Set the session cookie
    response.set_cookie(key="session_id", value=session_id, httponly=True)

    return {"message": "Login successful"}

@app.get("/")
async def root():
    return {"message": "SoulLift backend is running"}

@app.post("/register")
async def register(user: User):
    collection = db.Users
    user_data = user.model_dump()
    result = collection.insert_one(user_data)
    return {"user_id": str(result.inserted_id)}

@app.post("/start-chat")
async def start_chat(payload: StartChatRequest):
    session_id = requests.request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="Session not found")

    session = db.Sessions.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")

    user_id = session["user_id"]
    chat_id = str(uuid.uuid4())
    db.Chats.insert_one({
        "chat_id": chat_id,
        "user_id": user_id,
        "messages": []
    })
    return {"chat_id": chat_id}

AI_SERVICE_URL = "http://localhost:8001/chat" 

class ChatRequest(BaseModel):
    user_id: str
    chat_id: str
    message: str
    user_profile: dict
    new_chat: bool

@app.post("/chat")
async def analyze(chat: ChatMessage):
    session_id = requests.request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="Session not found")

    session = db.Sessions.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")

    user_id = session["user_id"]
    user_message = chat.message
    
    user_profile = db.user_profiles.find_one({"user_id": chat.user_id})
    if not user_profile:
        return {"error": "User not found"}

    user_profile_payload = {
    "baseline_mood": user_profile.get("baseline_mood", "neutral"),
    "resilience_level": user_profile.get("resilience_level", "moderate"),
    "coping_styles": user_profile.get("coping_styles", []),
    "anxiety_tendency": user_profile.get("anxiety_tendency", "sometimes"),
    "social_support_level": user_profile.get("social_support_level", "somewhat connected"),
    "self_talk_style": user_profile.get("self_talk_style", "critical but fair"),
    "life_satisfaction_score": user_profile.get("life_satisfaction_score", "somewhat satisfied"),
    "soul_lift_goals": user_profile.get("soul_lift_goals", ["help me process emotions"]),
    "future_hope_message": user_profile.get("future_hope_message", ""),
    "coping_hint_text": user_profile.get("coping_hint_text", "")
}
    
    async with httpx.AsyncClient() as client:
        emotion_response = await client.post(
            "http://localhost:8000/emotion/analyze-emotion", 
            json={"message": user_message}
        )
    emotion_data = emotion_response.json()
    emotion = emotion_data.get("emotion")
    score = emotion_data.get("score")
    print(f"Detected Emotion: {emotion} with score {score}")

    # Step 3: Crisis Handling
    danger_emotions = ["sadness", "fear", "anger"]
    if (emotion in danger_emotions and score > 0.9):
        return {
            "reply": "Don't loose hope, life is much bigger than all these difficulties. Keep your head up and you'll be the best of yourself really soon.",
            "helpline": "You should call +91 9152987821 the national helpline support for mental health. They will help you fight these hard times, "
        }

    # Step 4: Normal Chat Flow - Send to AI Service
    async with httpx.AsyncClient() as client_http:
        response = await client_http.post(AI_SERVICE_URL, json=chat.model_dump())

    ai_reply = response.json().get("reply")

    # Step 5: Save User Message + AI Reply to MongoDB
    db.Chats.update_one(
        {"chat_id": chat.chat_id},
        {
            "$push": {
                "messages": [
                    {"sender": "user", "message": chat.message, "timestamp": datetime.now()},
                    {"sender": "bot", "message": ai_reply, "timestamp": datetime.now()}
                ]
            },
            "$setOnInsert": {
                "user_id": chat.user_id,
                "chat_id": chat.chat_id,
                "created_at": datetime.now()
            }
        },
        upsert=True
    )

    return {"reply": ai_reply, "emotion_data": {emotion: score}}


@app.get("/get-chat/{chat_id}")
async def get_chat(chat_id: str):
    session_id = requests.request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="Session not found")

    session = db.Sessions.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")

    user_id = session["user_id"]
    chat = db.Chats.find_one({"chat_id": chat_id})
    if not chat:
        return {"error": "Chat not found"}

    return {
        "chat_id": chat["chat_id"],
        "messages": chat["messages"]
    }

@app.get("/get-chats/{user_id}")
async def get_chats(user_id: str):
    session_id = requests.request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(status_code=401, detail="Session not found")

    session = db.Sessions.find_one({"session_id": session_id})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")

    user_id = session["user_id"]
    chats = db.Chats.find({"user_id": user_id})
    chat_list = [{"chat_id": chat["chat_id"]} for chat in chats]
    return {"chats": chat_list}

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",  
        port=8000,  
        reload=True
    )
