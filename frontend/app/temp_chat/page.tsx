'use client'

import { useState } from "react"
import "./chat.css"
import { useParams } from "next/navigation";

type Message = {
    sender: string;
    content: string;
    timestamp?: string;
};

export default function ChatPage() {
    const [msgInput, setMsgInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([]);

    // const params = useParams()
    // const chatId = params.id;

    const send = () => {
        const newMessage: Message = {
            sender: "user",
            content: msgInput
        };
        setMsgInput("")
        
        setMessages(prev => [...prev, newMessage])
        fetch('http://127.0.0.1:8000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: localStorage.getItem('user_id'),
                chat_id: localStorage.getItem('chat_id'),
                message: msgInput,
                new_chat: false,
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                
                const newMessage: Message = {
                    sender: "system",
                    content: data.reply
                };

                setMessages(prev => [...prev, newMessage])

                if("helpline" in data) {
                    const helpMsg: Message = {
                        sender: "system",
                        content: data.helpline + " or visit https://dghs.mohfw.gov.in/national-mental-health-programme.php"
                    };

                    setMessages(prev => [...prev, helpMsg])
                }
            })
            .catch(error => console.error('Error:', error));
    }

    return (
        <div className="ui-container">
            <div className="side-panel">
                <div className="panel-content"></div>
                <div className="controls">
                    <p>Emergency</p>
                    <p>Consult a doctor</p>
                    <p>History</p>
                    <p>Settings</p>
                </div>
            </div>
            <div className="main-container">
                <div className="title">
                    <h1>SoulLift</h1>
                </div>
                <div className="msg-container">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender}`}>
                            <div className="content">
                                {message.content}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="input-container">
                    <input
                        type="text"
                        value={msgInput}
                        placeholder="Type a message..."
                        onChange={e => setMsgInput(e.currentTarget.value)} />
                    <button onClick={() => send()}>Send</button>
                </div>
            </div>
        </div>
    )
}