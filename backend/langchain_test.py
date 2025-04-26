import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, MessagesPlaceholder, HumanMessagePromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.schema import SystemMessage

# 1. Load API key
load_dotenv()
google_api_key = os.getenv("GEMINI_API_KEY")

# 2. Set up Gemini Flash without 'streaming' argument
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key=google_api_key
)

# 3. Define your system behavior
system_message = SystemMessage(
    content="You are a highly intelligent, friendly AI assistant. Always be helpful, concise, and positive."
)

# 4. Memory for conversation context (fixed for deprecation)
memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True,
)

# 5. Full Chat Prompt
prompt = ChatPromptTemplate.from_messages([
    SystemMessagePromptTemplate.from_template(system_message.content),
    MessagesPlaceholder(variable_name="chat_history"),  # Past chats
    HumanMessagePromptTemplate.from_template("{input}")  # Current user input
])

# 6. LLM Chain (proper structure, removed Runnable)
from langchain.chains import LLMChain

# Using LLMChain (fixed structure)
chain = LLMChain(
    llm=llm,
    prompt=prompt,
    memory=memory,
    verbose=False  # Debug info if needed
)

# 7. Main Chat Loop
print("🤖 Chatbot ready! Type 'exit' to quit.\n")

while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit"]:
        break

    # Get the response and display it
    response = chain.invoke({"input": user_input})
    print(f"Bot: {response['text']}")
