import React, { useState } from "react";
import './leaderboard.css';
import Rapid from "./Rapid";
import Blitz from "./Blitz";

const Leaderboard = () => {
    const [toggleState, setToggleState] = useState(0);

    const toggleTab = (index) => {
        setToggleState(index);
    }

    return (
        <section className="leaderboard section" id="leaderboard">
            <h2 className="section__title">Leaderboard</h2>
            <span className="section__subtitle">LiChess ratings - Top 10</span>

            <div className="leaderboard__container container grid">
                <div className="leaderboard__content">
                    <div>
                        <i class="uil uil-stopwatch leaderboard__icon"></i>
                        <h3 className="leaderboard__title">
                            Rapid
                        </h3>
                    </div>

                    <span className="leaderboard__button" onClick={() =>
                        toggleTab(1)}>
                        View ratings
                        <i className="uil uil-arrow-right 
                        leaderboard__button-icon"></i>
                    </span>

                    <div className={toggleState === 1 ? "leaderboard__modal active-modal" : "leaderboard__modal"}>
                        <div className="leaderboard__modal-content">
                            <i onClick={() => toggleTab(0)} className="uil 
                            uil-times leaderboard__modal-close"></i>

                            <h3 className="leaderboard__modal-title">Rapid</h3>

                            <ul className="srvices__modal-leaderboard grid">
                                <li className="leaderboard__modal-service">
                                    <p className="leaderboard__modal-info">
                                        <Rapid />
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="leaderboard__content">
                    <div>
                        <i class="uil uil-fire leaderboard__icon"></i>
                        <h3 className="leaderboard__title">
                            Blitz
                        </h3>
                    </div>

                    <span className="leaderboard__button" onClick={() =>
                        toggleTab(2)}>
                        View ratings
                        <i className="uil uil-arrow-right 
                        leaderboard__button-icon"></i>
                    </span>

                    <div className={toggleState === 2 ? "leaderboard__modal active-modal" : "leaderboard__modal"}>
                        <div className="leaderboard__modal-content">
                            <i onClick={() => toggleTab(0)}
                                className="uil uil-times
                            leaderboard__modal-close"></i>

                            <h3 className="leaderboard__modal-title">Blitz</h3>

                            <ul className="srvices__modal-leaderboard grid">
                                <li className="leaderboard__modal-service">
                                    <p className="leaderboard__modal-info">
                                        <Blitz />
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Leaderboard;