import React, { useState, useEffect } from "react";
import './leaderboard.css';
import Rapid from "./Rapid";
import Blitz from "./Blitz";
import Bullet from "./Bullet";
import stopwatch from "../../assets/stopwatch.png";
import fire from "../../assets/fire.png";

const Leaderboard = () => {
    const [activeTab, setActiveTab] = useState("rapid");
    const [rapidData, setRapidData] = useState([]);
    const [blitzData, setBlitzData] = useState([]);
    const [bulletData, setBulletData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(import.meta.env.VITE_LEADERBOARD_URL)
            .then((response) => response.json())
            .then((json) => {
                setRapidData(json["rapid"] || []);
                setBlitzData(json["blitz"] || []);
                setBulletData(json["bullet"] || []);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load ratings");
                setLoading(false);
            });
    }, []);

    return (
        <section className="leaderboard section" id="leaderboard">
            <h2 className="section__title">Leaderboard</h2>
            <span className="section__subtitle">LiChess ratings</span>

            <div className="leaderboard__tabs-container container">
                <div className="leaderboard__tabs">
                    <button 
                        className={activeTab === "rapid" ? "leaderboard__tab active-tab" : "leaderboard__tab"}
                        onClick={() => setActiveTab("rapid")}
                    >
                        <img src={stopwatch} alt="" className="leaderboard__tab-icon" />
                        <span>Rapid</span>
                    </button>
                    <button 
                        className={activeTab === "blitz" ? "leaderboard__tab active-tab" : "leaderboard__tab"}
                        onClick={() => setActiveTab("blitz")}
                    >
                        <img src={fire} alt="" className="leaderboard__tab-icon" />
                        <span>Blitz</span>
                    </button>
                    <button 
                        className={activeTab === "bullet" ? "leaderboard__tab active-tab" : "leaderboard__tab"}
                        onClick={() => setActiveTab("bullet")}
                    >
                        <img src={fire} alt="" className="leaderboard__tab-icon" />
                        <span>Bullet</span>
                    </button>
                </div>

                <div className="leaderboard__content-wrapper">
                    <div className={activeTab === "rapid" ? "leaderboard__tab-content active-content" : "leaderboard__tab-content"}>
                        <Rapid data={rapidData} loading={loading} error={error} />
                    </div>
                    <div className={activeTab === "blitz" ? "leaderboard__tab-content active-content" : "leaderboard__tab-content"}>
                        <Blitz data={blitzData} loading={loading} error={error} />
                    </div>
                    <div className={activeTab === "bullet" ? "leaderboard__tab-content active-content" : "leaderboard__tab-content"}>
                        <Bullet data={bulletData} loading={loading} error={error} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Leaderboard;