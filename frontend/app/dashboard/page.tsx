import "./dashboard.css"

export default function Dashboard() {
    return <div className="container">
        <div className="dashboard-title">Dashboard</div>
        <h1>Daily Mood Tracker</h1>
        <div className="history">
            <div className="day">
                <div className="emoji">😊</div>
                <div className="name">Sun</div>
            </div>
            <div className="day">
                <div className="emoji">😥</div>
                <div className="name">Mon</div>
            </div>
            <div className="day">
                <div className="emoji">😭</div>
                <div className="name">Tue</div>
            </div>
            <div className="day">
                <div className="emoji">😐</div>
                <div className="name">Wed</div>
            </div>
            <div className="day">
                <div className="emoji">😭</div>
                <div className="name">Thu</div>
            </div>
            <div className="day">
                <div className="emoji">😁</div>
                <div className="name">Fri</div>
            </div>
            <div className="day">
                <div className="emoji">😊</div>
                <div className="name">Sat</div>
            </div>
        </div>

        <h1>Your personal recap</h1>
        <div className="btns">
            <button className="btn">Your psychological resume</button>
            <button className="btn">Update Your psychological resume</button>
            <button className="btn">Your psychological Analysis</button>
        </div>
    </div>
}