'use client'

export default function StartChat() {
    fetch("http://127.0.0.1:8000/start_chat",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: localStorage.getItem("user_id"),
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Got chat id:" + data.chat_id);
            localStorage.setItem("chat_id", data.chat_id);
            
        })
        .catch((error) => console.error("Error:", error));

}