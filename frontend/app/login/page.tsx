'use client'

import { useState } from 'react'
import './login.css'

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = () => {
        fetch('http://192.168.212.48:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // or other content types like 'application/x-www-form-urlencoded'
            },
            body: JSON.stringify({
                email: email,
                passwd: password,
                // Add other data you need to send
            }),
        })
        .then(response => response.json())  // You can use .json() to parse the JSON response
        .then(data => {
            if("user_id" in data) {
                console.log("SUCCESS");
                localStorage.setItem("user_id", data.user_id)
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
                        <input type="email" onChange={e => setEmail(e.currentTarget.value)} placeholder="Email" />
                        <input type="password" onChange={e => setPassword(e.currentTarget.value)} placeholder="Password" />
                    </div>

                    <div className="btn-container">
                        <div className="left"></div>
                        <div className="right">
                            <button className="btn">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}