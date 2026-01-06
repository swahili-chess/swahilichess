import React, { useState } from "react";
import './leaderboard.css';
import Rapid from "./Rapid";
import Blitz from "./Blitz";
import stopwatch from "../../assets/stopwatch.png";
import fire from "../../assets/fire.png";

const Leaderboard = () => {
    const [activeTab, setActiveTab] = useState("rapid");

    return (
        <section className="leaderboard section" id="leaderboard">
            <h2 className="section__title">Leaderboard</h2>
            <span className="section__subtitle">LiChess ratings - Top 10</span>

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
                </div>

                <div className="leaderboard__content-wrapper">
                    <div className={activeTab === "rapid" ? "leaderboard__tab-content active-content" : "leaderboard__tab-content"}>
                        <Rapid />
                    </div>
                    <div className={activeTab === "blitz" ? "leaderboard__tab-content active-content" : "leaderboard__tab-content"}>
                        <Blitz />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Leaderboard;