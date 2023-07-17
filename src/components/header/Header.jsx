import React, { useState } from "react";
import "./header.css";
import Match from '../match/Match'

const Header = () => {
    /*============== Change Background Header =============*/
    window.addEventListener("scroll", function () {
        const header = document.querySelector(".header");

        if (this.scrollY >= 80) header.classList.add
            ("show-header");
        else header.classList.remove("show-header");
    });

    /*============== Toggle Menu =============*/
    const [Toggle, showMenu] = useState(false);


    const [activeNav, setActiveNav] = useState("#home");

    return (
        <header className="header">
            <nav className="nav container">
                <a href="index.html" className="nav__logo">
                    <a href="#home" className="nav__logo"><h4>Chesswahili</h4></a>
                </a>

                <div className={Toggle ? "nav__menu show-menu" : "nav__menu"}>
                    <ul className="nav__list grid">
                        <li className="nav__item">
                            <a href="#home"
                                onClick={() => setActiveNav("#home")}
                                className={activeNav === "#home" ?
                                    "nav__link active-link" : "nav__link"}>
                                <i className="uil uil-estate nav__icon"></i>
                                <div className="nav_title">Home</div>
                            </a>
                        </li>

                        <li className="nav__item">
                            <a href="#leaderboard"
                                onClick={() => setActiveNav("#leaderboard")}
                                className={activeNav === "#leaderboard" ?
                                    "nav__link active-link" : "nav__link"}>
                                <i class="uil uil-presentation-line nav__icon"></i>
                                <div className="nav_title">Learderboard</div>
                            </a>
                        </li>

                        <li className="nav__item">
                            <a href="#match"
                                onClick={() => setActiveNav("#match")}
                                className={activeNav === "#match" ?
                                    "nav__link active-link" : "nav__link"}>
                                <i class="uil uil-stopwatch nav__icon"></i>
                                <div className="nav_title">Matches</div>
                            </a>
                        </li>

                        <li className="nav__item">
                            <a href="#league"
                                onClick={() => setActiveNav("#league")}
                                className={activeNav === "#league" ?
                                    "nav__link active-link" : "nav__link"}>
                                <i class="uil uil-list-ol nav__icon"></i>
                                <div className="nav_title">League</div>
                            </a>
                        </li>
                    </ul>

                    <i class="uil uil-times nav__close" onClick={() => showMenu(!Toggle)}></i>
                </div>

                <div className="nav__toggle" onClick={() => showMenu(!Toggle)}>
                    <i class="uil uil-apps"></i>
                </div>
            </nav>
        </header>
    )
}

export default Header