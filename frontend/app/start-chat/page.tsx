'use client';

import { useEffect } from 'react';

export default function StartChat() {
    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            console.error("No user_id found in localStorage.");
            return;
        }

        fetch("http://192.168.212.48:8000/start-chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: userId }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Got chat id:", data.chat_id);
                localStorage.setItem("chat_id", data.chat_id);
                window.location.href="/chat"
            })
            .catch((error) => console.error("Error:", error));
    }, []); // empty dependency array → run only once after page load

    return (
        <div>
            Starting chat...
        </div>
    );
}
