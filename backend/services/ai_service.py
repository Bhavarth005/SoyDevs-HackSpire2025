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
import uvicorn

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

situation_prompts = {
    "relationship_issues": "The user is dealing with relationship challenges. Be gentle, empathetic, and help them process their emotions.",
    "career_stress": "The user is experiencing job or career-related stress. Offer supportive and motivating conversation.",
    "financial_problems": "The user is worried about finances. Provide emotional support without offering financial advice.",
    "academic_pressure": "The user feels pressure from academic expectations. Be encouraging, validate their hard work and struggles.",
    "loneliness": "The user feels lonely and disconnected. Be a warm, supportive presence to remind them they are not alone.",
    "grief_and_loss": "The user is grieving a loss. Respond with compassion, patience, and sensitivity.",
    "self_identity_struggles": "The user is struggling with understanding themselves. Encourage exploration without judgment.",
    "anxiety_or_panic": "The user is feeling anxious. Help them feel grounded, calm, and safe.",
    "motivation_loss": "The user feels demotivated. Gently guide them towards hope and small steps forward.",
    "personal_growth_journey": "The user is seeking personal development. Be inspiring, but stay empathetic and realistic.",
    "life_transitions": "The user is going through a major life change. Offer reassurance and emotional steadiness.",
    "health_concerns": "The user has health-related worries. Validate their feelings and encourage self-care.",
    "trauma_recovery": "The user is processing trauma. Be extremely careful, listen more than advise, and respect their pace."
}


class ChatRequest(BaseModel):
    user_id: str
    chat_id: str
    message: str
    new_chat: bool

# Build System Prompt Correctly
def build_system_prompt(user_profile: dict) -> str:
    system_prompt = (
        f"You are SoulLift, an AI designed to be a dear friend to the person talking, but also you are soo good at psychology that you offer psychological help to the person talking, but only when it's needed.\n\n"
        f"User Profile:\n"
        f"- Name: {user_profile.get('name')}\n"
        f"- Age: {user_profile.get('age')}\n"
        f"- Gender: { user_profile.get('gender')}\n"
        f"- Baseline Mood: {user_profile.get('baseline_mood')}\n"
        f"- Resilience Level: {user_profile.get('resilience_level')}\n"
        f"- Coping Styles: {user_profile.get('coping_styles')}\n"
        f"- Anxiety Tendency: {user_profile.get('anxiety_tendency')}\n"
        f"- Social Support Level: {user_profile.get('social_support_level')}\n"
        f"- Self-Talk Style: {user_profile.get('self_talk_style')}\n"
        f"- Life Satisfaction Score: {user_profile.get('life_satisfaction_score')}\n"
        f"- SoulLift Goals: {user_profile.get('soul_lift_goals')}\n"
        f"- Future Hope Message: {user_profile.get('future_hope_message')}\n"
        f"- Coping Hint Text: {user_profile.get('coping_hint_text')}\n\n"
        
        f"Your Primary Objectives:\n"
        f"1. Engage the user in friendly and non chalant conversation, till you feel that the person needs for the psychologist in you.\n"
        f"2. Reflect understanding of their feelings without giving clinical diagnoses as your output, be the friend while helping them.\n"
        f"3.If needed, Encourage positive habits like breathing exercises, talking to trusted people, self-care.\n"

        f"4. Suggest them music, movies, tv shows or books best sitable to their mood.\n"

        f"5. If the user seems extremely distressed or hopeless, gently suggest contacting a professional helpline, but also keep trying to make them happy .\n"
        f"6. Always maintain a warm, safe, non-judgmental and non chalant tone.\n"
        f"7. Don't just start by saying that you know they're suffering through something; let the user share what they want to first. Always remember, you are a smart friend, and the smart ones wait for the other one to bring the topic up. Engage in normal, friendly conversation. The mental health conditions and medications provided to you are for reference only — no need to mention them unless the user does.\n"

        f"8.BE SMART ask them the right questions so that they can share what they are exactly feeling. It's your duty to bring their feeling out by asking the right continuing questions \n"

        f"Important:\n"
        f"- Be a friend to them, hold concise, engaging, and uplifting conversations. Don't sound like an AI chatbot and avoid being too formal.\n"
        f"- DO NOT label, diagnose, or pathologize.\n"
        f"- DO NOT offer medical advice or therapy sessions.\n"
        f"- DO NOT promise solutions.\n\n"
        f"Use the additional user profile insights to personalize conversations, subtly weaving in supportive remarks, coping suggestions, or positive reinforcements aligned with the user's coping styles, resilience level, and goals — but only when it naturally fits the flow of conversation or when the user expresses a related need.\n\n"
        f"Begin the conversation by creating a comfortable, welcoming environment based on the user's profile."
    )

    situation_key = user_profile.get('situation', None)
    if situation_key and situation_key in situation_prompts:
        situation_prompt = situation_prompts[situation_key]
        system_prompt += f"\n\n[Situation Context]: {situation_prompt}"

    return system_prompt


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

if __name__ == "__main__":
    uvicorn.run(
        "ai_service:app",  
        port=8001,  
        reload=True
    )