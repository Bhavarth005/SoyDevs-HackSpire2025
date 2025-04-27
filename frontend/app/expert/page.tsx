import "./chat.css";

export default function ChatPage() {
    return <div className="chat-page">
        <div className="side-panel">
            <div className="top">
                <h1>Consult our experts</h1>
                <hr />
                <p>Our experts are always there to help you in your tough times</p>
            </div>
            <div className="bottom">
                <hr />
                <p>Book a call</p>
                <hr />
                <p>Book an appointment</p>
            </div>
        </div>
        <div className="main-content">
            <div className="doctor">
                <div className="profile"></div>
                <h2>Doctor 1</h2>
                <h3>Degree</h3>
            </div>
            <div className="doctor">
                <div className="profile"></div>
                <h2>Doctor 1</h2>
                <h3>Degree</h3>
            </div>
            <div className="doctor">
                <div className="profile"></div>
                <h2>Doctor 1</h2>
                <h3>Degree</h3>
            </div>
            <div style={{flexBasis: "100%"}}></div>
            <div className="doctor">
                <div className="profile"></div>
                <h2>Doctor 1</h2>
                <h3>Degree</h3>
            </div>
            <div className="doctor">
                <div className="profile"></div>
                <h2>Doctor 1</h2>
                <h3>Degree</h3>
            </div>
        </div>
    </div>
}