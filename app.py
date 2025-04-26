from datetime import datetime
import uuid
from bson import ObjectId
from fastapi import FastAPI
from pydantic import BaseModel
import pymongo
from typing import List, Optional
import httpx
from transformers import pipeline
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

client = pymongo.MongoClient("localhost", 27017)
db = client.SoulLift


class User(BaseModel):
    name: str
    age: int
    gender: str
    mental_health_conditions: Optional[str] = None
    ongoing_medication: Optional[str] = None
    past_therapy: Optional[str] = None
    suicidal_thoughts: Optional[str] = None
    comfort_level: int
    humor_level: int

class StartChatRequest(BaseModel):
    user_id: str

class ChatMessage(BaseModel):
    user_id: str
    chat_id: str
    message: str
    new_chat: bool

app = FastAPI()


app.add_middleware(CORSMiddleware, 
                   allow_origins=["*"],
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"])


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/register")
async def register(user: User):
    collection = db.Users
    user_data = user.model_dump()
    result = collection.insert_one(user_data)
    return {"user_id": str(result.inserted_id)}

@app.post("/start_chat")
async def start_chat(payload: StartChatRequest):
    chat_id = str(uuid.uuid4())
    db.Chats.insert_one({
        "chat_id": chat_id,
        "user_id": payload.user_id,
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


emo = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", top_k=None)


def detect_emotion(text):
    scores = emo(text)[0]
    best = max(scores, key=lambda x: x["score"])
    return best["label"], best["score"]

@app.post("/chat")
async def analyze(chat: ChatMessage):
    user_message = chat.message
    
    user_data = db.Users.find_one({"_id": ObjectId(chat.user_id)})
    if not user_data:
        return {"error": "User not found"}

    user_profile = {
        "name": user_data.get("name", "User"),
        "age": user_data.get("age", 0),
        "gender": user_data.get("gender", "Not specified"),
        "mental_health_conditions": user_data.get("mental_health_conditions", ""),
        "ongoing_medication": user_data.get("ongoing_medication", ""),
        "past_therapy": user_data.get("past_therapy", ""),
        "suicidal_thoughts": user_data.get("suicidal_thoughts", ""),
        "comfort_level": user_data.get("comfort_level", 5),
        "humor_level": user_data.get("humor_level", 5)
    }
    
    emotion, score = detect_emotion(user_message)
    print(f"Detected Emotion: {emotion} with score {score}")

    # Step 2: Crisis Handling
    danger_emotions = ["sadness", "fear", "anger"]
    if emotion in danger_emotions and score > 0.85:
        return {
            "reply": "Don't loose hope, life is much bigger than all these difficulties. Keep your head up and you'll be the best of yourself really soon.",
            "helpline": "You should call +91 9152987821 the national helpline support for mental health. They will help you fight these hard times, "
        }
    
    # Step 3: Normal Chat Flow
    async with httpx.AsyncClient() as client_http:
        response = await client_http.post(AI_SERVICE_URL, json=chat.model_dump())

    ai_reply = response.json().get("reply")

    # Step 4: Save User Message + AI Reply to MongoDB
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

    return {"reply": ai_reply}

# @app.post("/chat")
async def chat(payload: ChatRequest):

    async with httpx.AsyncClient() as client:
        response = await client.post(AI_SERVICE_URL, json=payload.model_dump())

    ai_reply = response.json().get("reply")

    db.Chats.update_one(
        {"chat_id": payload.chat_id},
        {
            "$push": {
                "messages": [
                    {"sender": "user", "message": payload.message, "timestamp": datetime.now()},
                    {"sender": "bot", "message": ai_reply, "timestamp": datetime.now()}
                ]
            },
            "$setOnInsert": {
                "user_id": payload.user_id,
                "chat_id": payload.chat_id,
                "created_at": datetime.now()
            }
        },
        upsert=True
    )

    return {"reply": ai_reply}

@app.get("/get-chat/{chat_id}")
async def get_chat(chat_id: str):
    chat = db.Chats.find_one({"chat_id": chat_id})
    if not chat:
        return {"error": "Chat not found"}

    return {
        "chat_id": chat["chat_id"],
        "messages": chat["messages"]
    }

@app.get("/get-chats/{user_id}")
async def get_chats(user_id: str):
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
