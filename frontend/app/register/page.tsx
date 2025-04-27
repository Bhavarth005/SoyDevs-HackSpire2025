'use client'

import { useState } from 'react'
import './login.css'

export default function LoginPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [gender, setGender] = useState("")
    const [password, setPassword] = useState("")
    const [contact, setContact] = useState("")
    const [age, setAge] = useState("age")

    const handleLogin = () => {
        console.log("Sending request");
        console.log(JSON.stringify({
            name: name,
            age: parseInt(age),
            gender: gender,
            email: email,
            passwd: password,
            emergency_contact: contact
        }));
        
        
        fetch('http://192.168.212.48:8000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // or other content types like 'application/x-www-form-urlencoded'
            },
            body: JSON.stringify({
                name: name,
                age: parseInt(age),
                email: email,
                gender: gender,
                passwd: password,
                emergency_contact: contact
            }),
        })
        .then(response => response.json())  // You can use .json() to parse the JSON response
        .then(data => {
            if("user_id" in data) {
                localStorage.setItem("user_id", data.user_id)
                window.location.href = "/qna"
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        
    }

    return (
        <div className="container">
            <div className="left">
                <h1><i>SoulLift.ai</i></h1>
            </div>
            <div className="right">
                <div className="dialog">
                    <div className="title">Login to SoulLift.ai</div>

                    <div className="content">
                        <input type="text" onChange={e => setName(e.currentTarget.value)} placeholder="Name" />
                        <input type="number" onChange={e => setAge(e.currentTarget.value)} placeholder="Age" />
                        <input type="text" onChange={e => setGender(e.currentTarget.value)} placeholder="Gender" />
                        <input type="email" onChange={e => setEmail(e.currentTarget.value)} placeholder="Email" />
                        <input type="password" onChange={e => setPassword(e.currentTarget.value)} placeholder="Password" />
                        <input type="number" onChange={e => setContact(e.currentTarget.value)} placeholder="Emergency contact" />

                    </div>

                    <div className="btn-container">
                        <div className="left"></div>
                        <div className="right">
                            <button className="btn" onClick={handleLogin}>Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}