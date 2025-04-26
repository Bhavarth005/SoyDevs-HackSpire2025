'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StartChat() {
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem("user_id");

        if (!userId) {
            console.error("No user_id found in localStorage");
            return;
        }

        fetch("http://127.0.0.1:8000/start_chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: userId }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Got chat id: " + data.chat_id);
                localStorage.setItem("chat_id", data.chat_id);
                router.push("/temp_chat"); // ✅ use router.push instead of redirect()
            })
            .catch((error) => console.error("Error:", error));
    }, [router]);

    return (
        <div className="flex justify-center items-center h-screen">
            <p>Starting your chat...</p>
        </div>
    );
}
