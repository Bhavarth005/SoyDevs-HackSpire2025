from bson import ObjectId
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.memory import ConversationBufferWindowMemory
from langchain.chains import ConversationChain
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from dotenv import load_dotenv
import os

import pymongo

app = FastAPI()

load_dotenv()
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
if not GOOGLE_API_KEY:
    raise Exception("Missing GOOGLE_API_KEY environment variable!")

client = pymongo.MongoClient("localhost", 27017)
db = client.SoulLift

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.7,
    google_api_key=GOOGLE_API_KEY
)

sessions = {} 

class ChatRequest(BaseModel):
    user_id: str
    chat_id: str
    message: str
    new_chat: bool

# Build System Prompt Correctly
def build_system_prompt(user_profile: dict) -> str:
    name = user_profile.get("name", "User")
    age = user_profile.get("age", "Unknown")
    gender = user_profile.get("gender", "Not specified")
    mental_conditions = ", ".join(user_profile.get("mental_health_conditions", [])) or "No known conditions"
    preferred_tone = user_profile.get("preferred_tone", "supportive and understanding")

    return (
        f"You are SoulLift, an empathetic AI designed to offer psychological first-aid support.\n\n"
        f"User Profile:\n"
        f"- Name: {name}\n"
        f"- Age: {age}\n"
        f"- Gender: {gender}\n"
        f"- Mental Health Conditions: {mental_conditions}\n"
        f"- Preferred Conversation Tone: {preferred_tone}\n\n"
        f"Your Primary Objectives:\n"
        f"1. Engage the user in kind, respectful, and emotionally supportive conversations.\n"
        f"2. Reflect understanding of their feelings without making clinical diagnoses.\n"
        f"3. Encourage positive habits like breathing exercises, talking to trusted people, self-care.\n"
        f"4. If the user seems extremely distressed or hopeless, gently suggest contacting a professional helpline.\n"
        f"5. Always maintain a warm, safe, non-judgmental tone.\n\n"
        f"Important:\n"
        f"- DO NOT label, diagnose, or pathologize.\n"
        f"- DO NOT offer medical advice or therapy sessions.\n"
        f"- DO NOT promise solutions.\n\n"
        f"Begin the conversation by creating a comfortable, welcoming environment based on the user's profile."
    )


@app.post("/chat")
async def chat_endpoint(payload: ChatRequest):
    if payload.new_chat or payload.chat_id not in sessions:
        memory = ConversationBufferWindowMemory(
            memory_key="chat_history",
            k=10,
            return_messages=True
        )
        user_data = db.Users.find_one({"_id": ObjectId(payload.user_id)})
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
        system_prompt_text = build_system_prompt(user_profile)

        prompt = ChatPromptTemplate.from_messages([
            SystemMessagePromptTemplate.from_template(system_prompt_text),
            MessagesPlaceholder(variable_name="chat_history"),
            HumanMessagePromptTemplate.from_template("{input}")
        ])

        chain = ConversationChain(
            llm=llm,
            memory=memory,
            prompt=prompt,
            verbose=True
        )


        sessions[payload.chat_id] = chain

    chain = sessions[payload.chat_id]

    reply = chain.predict(input=payload.message)

    return {"reply": reply}


@app.get("/")
async def health_check():
    return {"message": "AI Service Running"}
