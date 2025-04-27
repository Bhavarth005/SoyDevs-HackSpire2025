'use client'

import { useEffect, useState } from "react";
import "./chat.css";

export default function ChatPage() {
    const questions: {
        q: string,
        o: string[]
    }[] = [
            {
                q: "In the past couple of weeks, how would you describe your general mood?",
                o: ["Mostly positive and upbeat", "Neutral, a bit of everything", "A little down or tired", "Struggling significantly with mood"]
            },
            {
                q: "How easily do you find joy in small things (like a nice sunset, a funny meme, or a good meal)?",
                o: ['Very easily', 'Sometimes', 'Rarely', 'Almost never']
            },
            {
                q: "When you're feeling stressed or overwhelmed, what do you usually turn to for comfort? (Choose all that apply)",
                o: ['Talking to friends or family', 'Listening to music', 'Physical activity (walking, exercise, yoga)', 'Gaming, binge-watching, scrolling', 'Journaling or self-reflection', 'Breathing exercises or meditation', 'Spending time in nature', 'Sleeping', 'Eating/snacking', 'Avoiding everything / shutting down']
            },
            {
                q: "How often do you feel anxious about things you can't control?",
                o: ['Rarely', 'Sometimes', 'Often', 'Almost constantly']
            },
            {
                q: "How connected do you feel to people around you?",
                o: ['Very connected', 'Somewhat connected', 'A bit isolated', 'Very isolated']
            },
            {
                q: "How do you usually speak to yourself internally when things go wrong?",
                o: ['I try to stay kind and patient', 'I\'m critical but fair', 'I\'m usually harsh on myself', 'I don\'t know, I shut down']
            },
            {
                q: "How satisfied are you with your current life situation overall?",
                o: ['Very satisfied', 'Somewhat satisfied', 'Unsatisfied', 'Deeply unhappy']
            },
            {
                q: "What are you hoping SoulLift can do for you? (Choose all that apply)",
                o: ['Just listen', 'Help me process my emotions', 'Unlock insights about myself', 'Teach me new coping skills', 'Guide me to set and reach goals', 'Challenge my thoughts and beliefs', 'Assign me helpful exercises', 'Help me build more positive habits', 'Be someone/something I can talk to anytime', 'I don\'t know yet',]
            },
            {
                q: "If you could tell your future self something, what would it be?",
                o: []
            },
            {
                q: "What's one thing you wish you felt more often?",
                o: []
            }
        ]

    const [stage, setStage] = useState(0);

    const [data, setData] = useState({
        quiz_answers: {
            baseline_mood: "",
            resilience_level: "",
            coping_styles: [],
            anxiety_tendency: "",
            social_support_level: "",
            self_talk_style: "",
            life_satisfaction_score: "",
            soul_lift_goals: [],
            future_hope_message: "",
            coping_hint_text: ""
        },
        user_id: "" // Initialize as an empty string
    });
    
    useEffect(() => {
        // Access localStorage only on the client side
        const userId = localStorage.getItem("user_id");
        setData(prevData => ({
            ...prevData,
            user_id: userId || "" // Set user_id from localStorage
        }));
    }, []);
    

    const keys = [
        "baseline_mood",
        "resilience_level",
        "coping_styles",
        "anxiety_tendency",
        "social_support_level",
        "self_talk_style",
        "life_satisfaction_score",
        "soul_lift_goals",
        "future_hope_message",
        "coping_hint_text",
    ]

    function getSelectedValue(questionIndex: number) {
        if(stage == 2 || stage == 7) {
            const allChecks = document.querySelectorAll("input[type='checkbox']")
            const items: string[] = []
            allChecks.forEach(c => {
                if((c as HTMLInputElement).checked) {
                    items.push((c as HTMLInputElement).value)
                }
            })

            return items;
        } 
        if(stage == 8 || stage == 9) {
            const element= document.querySelector("input[type='text']");
            if(element)
                return (element as HTMLInputElement).value;
            return ""
        }
        const selected = document.querySelector(`input[name="op${questionIndex}"]:checked`);
        if(selected)
            (selected as HTMLInputElement).checked = false;
        return selected ? (selected as HTMLInputElement).value : null;
    }

    const handleNext = () => {
        const updatedAnswers: any = { ...data.quiz_answers }; // Create a copy of the current answers
        updatedAnswers[keys[stage]] = getSelectedValue(stage); // Update the specific key
    
        setData(prevData => ({
            ...prevData,
            quiz_answers: updatedAnswers // Update the quiz_answers in state
        }));

        if (stage === questions.length - 1) {
            fetch('http://192.168.212.48:8000/test/analysis-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // or other content types like 'application/x-www-form-urlencoded'
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())  // You can use .json() to parse the JSON response
            .then(data => {
                alert("Data saved successfully")
                window.location.href="/start-chat";
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            return;
        }
        setStage(prev => prev + 1);
    };

    const handlePrev = () => {
        const selected = document.querySelector(`input[name="op${stage}"]:checked`);
        if(selected)
            (selected as HTMLInputElement).checked = false;
        setStage(prev => prev - 1)
    }

    return <>
        <div className="backdrop"></div>
        <div className="dialog">
            <div className="title">{questions[stage].q}</div>
            <div className="content">
                {stage != 2 && stage != 7 && questions[stage].o.map((option, index) => (
                    <div key={index}>
                        <input
                            type="radio"
                            name={"op" + stage}
                            value={option}
                            id={`op${index + 1}`}
                        />
                        <label htmlFor={`op${index + 1}`}>{option}</label>
                    </div>
                ))}

                {(stage == 2 || stage == 7) && questions[stage].o.map((option, index) => (
                    <div key={index}>
                    <input
                        type="checkbox"
                        value={option}
                        id={`op${index + 1}`}
                    />
                    <label htmlFor={`op${index + 1}`}>{option}</label>
                </div>
                ))}

                {(stage == 8 || stage == 9) && <input type="text" placeholder="Enter your answer" />}
            </div>
            <div className="btn-container">
                <div className="left">
                    {stage > 0 && <button className="btn" onClick={handlePrev}>Previous</button>}
                </div>
                <div className="right">
                    <button className="btn" onClick={handleNext}>
                        { stage == questions.length - 1 ? "Submit" : "Next"}
                    </button>
                </div>
            </div>
        </div>
        <div className="chat-page">
            <div className="side-panel">
                <div className="btn-add">+</div>
                <div className="btn-profile">U</div>

                <div className="top">
                    <div className="pie"></div>
                    <h2>Mood Pie</h2>
                    <h2>The quick brown....</h2>
                </div>

                <div className="bottom">
                    <div className="controls">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M220-240v-480h80v480h-80Zm520 0L380-480l360-240v480Z" /></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M320-200v-560l440 280-440 280Z" /></svg>
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
                    <h1>SoulLift.ai</h1>
                </div>

                <div className="msg-area">
                    <div className="msg-center">
                        <img src="/smurfs.gif" alt="Smurfs" />
                        <h1>Tell me about your day</h1>
                    </div>
                </div>

                <div className="input-area">
                    <div className="input-container">
                        <input type="text" placeholder="Type here" />
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" /></svg>
                    </div>
                </div>
            </div>
        </div>
    </>
}