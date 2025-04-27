'use client'

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import "./chat.css";

type Message = {
    sender: string;
    content: string;
    timestamp?: string;
};

export default function ChatPage() {
    const [showDialog, setShowDialog] = useState(false);
    const [situation, setSituation] = useState("")

    useEffect(() => {
        const cookies = document.cookie.split('; ').reduce((acc: Record<string, string>, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
        }, {});

        const today = new Date().toDateString();
        if (cookies.dialogShown !== today) {
            setShowDialog(true);
            document.cookie = `dialogShown=${today}; path=/; SameSite=Lax`;
        }
    }, []);


    const playMusic = (e) => {
        const music = new Audio('/audio.mp3'); // Path to your audio file
        music.play();
        (e as HTMLElement)
    }


    const [pieData, setPieData] = useState([
        {name: "admiration", value: 0},
        {name: "adoration", value: 0},
        {name: "aesthetic appreciation", value: 0},
        {name: "amusement", value: 0},
        {name: "anger", value: 0},
        {name: "anxiety", value: 0},
        {name: "awe", value: 0},
        {name: "awkwardness", value: 0},
        {name: "boredom", value: 0},
        {name: "calmness", value: 0},
        {name: "confusion", value: 0},
        {name: "craving", value: 0},
        {name: "disgust", value: 0},
        {name: "empathic pain", value: 0},
        {name: "entrancement", value: 0},
        {name: "excitement", value: 0},
        {name: "fear", value: 0},
        {name: "horror", value: 0},
        {name: "interest", value: 0},
        {name: "joy", value: 0},
        {name: "nostalgia", value: 0},
        {name: "relief", value: 0},
        {name: "romance", value: 0},
        {name: "sadness", value: 0},
        {name: "satisfaction", value: 0},
        {name: "surprise", value: 0},
    ]);

    const COLORS = ['#78b628', '#736a5f', '#20dee6', '#a6bd14', '#cc0000', '#1ace72', '#08a0be', '#39b843', '#db7810', '#93b6f7', '#2ca0fb', '#65e255', '#608d0d', '#2590be', '#95ccee', '#c0a2e0', '#f00', '#ee2222', '#5910a4', '#7a5607', '#28faa0', '#818e4a', '#7cb2ed', '#f21a37', '#ca24f5', '#109e2f'];

    const [msgInput, setMsgInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([]);

    const updateValue = (name, newValue) => {
        console.log(name, newValue);
        
        setPieData(prevData => 
            prevData.map(item => 
                item.name === name ? { ...item, value: newValue } : item
            )
        );
    };

    const send = () => {
        const newMessage: Message = {
            sender: "user",
            content: msgInput
        };
        setMsgInput("")

        console.log(JSON.stringify({
            user_id: localStorage.getItem('user_id'),
            chat_id: localStorage.getItem('chat_id'),
            message: msgInput,
            new_chat: false,
            ...(situation.length > 0 && { situation }) // Include situation only if length > 0
        }));
        

        setMessages(prev => [...prev, newMessage])
        fetch('http://192.168.212.48:8000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: localStorage.getItem('user_id'),
                chat_id: localStorage.getItem('chat_id'),
                message: msgInput,
                new_chat: false,
                ...(situation.length > 0 && { situation }) // Include situation only if length > 0
            })
        })
            .then(response => response.json())
            .then(data => {
                
                updateValue(data.emotion, parseFloat(data.score))

                const newMessage: Message = {
                    sender: "system",
                    content: data.reply
                };

                setMessages(prev => [...prev, newMessage])

                if ("helpline" in data) {
                    const helpMsg: Message = {
                        sender: "system",
                        content: data.helpline + " or visit https://dghs.mohfw.gov.in/national-mental-health-programme.php"
                    };

                    setMessages(prev => [...prev, helpMsg])
                }
            })
            .catch(error => console.error('Error:', error));
    }

    return <div className="chat-page">
        {showDialog && (
            <>
                <div className="backdrop"></div>
                <div className="dialog">
                    <div className="title">How are you feeling today?</div>
                    <div className="content emoji-box">
                        <button onClick={() => setShowDialog(false)}>😁</button>
                        <button onClick={() => setShowDialog(false)}>😊</button>
                        <button onClick={() => setShowDialog(false)}>😐</button>
                        <button onClick={() => setShowDialog(false)}>😥</button>
                        <button onClick={() => setShowDialog(false)}>😭</button>
                    </div>
                </div>
            </>
        )}
        <div className="side-panel">
            <div className="btn-add">+</div>
            <div className="btn-profile">U</div>

            <div className="top">
                <div className="pie" style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                fill="#8884d8"
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <h2>Mood Pie</h2>
                <h2>Joyful Piano Music</h2>
            </div>

            <div className="bottom">
                <div className="controls">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M220-240v-480h80v480h-80Zm520 0L380-480l360-240v480Z" /></svg>
                    <svg onClick={playMusic} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M320-200v-560l440 280-440 280Z" /></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Z" /></svg>
                </div>
                <div className="link-container">
                    <div className="link">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M400-120q-66 0-113-47t-47-113q0-66 47-113t113-47q23 0 42.5 5.5T480-418v-422h240v160H560v400q0 66-47 113t-113 47Z" /></svg>
                        <a href="#">Moody Music</a>
                    </div>
                    <div className="link">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160ZM480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Zm-40-360h80v-200h-80v200Zm40 120q17 0 28.5-11.5T520-360q0-17-11.5-28.5T480-400q-17 0-28.5 11.5T440-360q0 17 11.5 28.5T480-320Z" /></svg>
                        <a href="#">Emergency</a>
                    </div>
                    <div className="link">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M690-480h60v-68l59 34 30-52-59-34 59-34-30-52-59 34v-68h-60v68l-59-34-30 52 59 34-59 34 30 52 59-34v68ZM80-120q-33 0-56.5-23.5T0-200v-560q0-33 23.5-56.5T80-840h800q33 0 56.5 23.5T960-760v560q0 33-23.5 56.5T880-120H80Zm280-280q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM84-200h552q-42-75-116-117.5T360-360q-86 0-160 42.5T84-200Z" /></svg>
                        <a href="#">Consult an expert</a>
                    </div>
                    <div className="link">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-120q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q117 0 198.5-81.5T760-480q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120v-240h80v94q51-64 124.5-99T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z" /></svg>
                        <a href="#">History</a>
                    </div>
                    <div className="link">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Z" /></svg>
                        <a href="#">Dashboard</a>
                    </div>
                </div>
            </div>
        </div>
        <div className="main-content">
            <div className="header">
                <select onChange={e => setSituation(e.currentTarget.value)}>
                    <option value="">SoulLift.ai</option>
                    <option value="relationship_issues">relationship_issues</option>
                    <option value="career_stress">career_stress</option>
                    <option value="financial_problems">financial_problems</option>
                    <option value="academic_pressure">academic_pressure</option>
                    <option value="loneliness">loneliness</option>
                    <option value="grief_and_loss">grief_and_loss</option>
                    <option value="self_identity_struggles">self_identity_struggles</option>
                    <option value="anxiety_or_panic">anxiety_or_panic</option>
                    <option value="motivation_loss">motivation_loss</option>
                    <option value="personal_growth_journey">personal_growth_journey</option>
                    <option value="life_transitions">life_transitions</option>
                    <option value="health_concerns">health_concerns</option>
                    <option value="trauma_recovery">trauma_recovery</option>
                </select>
            </div>

            <div className="msg-area">
                {/* <div className="msg-center">
                    <img src="/smurfs.gif" alt="Smurfs" />
                    <h1>Tell me about your day</h1>
                </div> */}

                {messages.map((message, index) => (
                    <div key={index} className={`msg-container ${message.sender}`}>
                        <div className="msg">
                            {message.content}
                        </div>
                    </div>
                ))}
            </div>

            <div className="input-area">
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Type here"
                        value={msgInput}
                        onChange={e => setMsgInput(e.currentTarget.value)}
                        onKeyDown={e => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                send();
                            }
                        }}
                    />

                    <svg xmlns="http://www.w3.org/2000/svg" onClick={send} height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" /></svg>
                </div>
            </div>
        </div>
    </div>
}