import React, { useState } from "react";
import "./header.css";
import logo from '../../assets/logo.png';

const Header = () => {
    /*============== Toggle Menu =============*/
    const [Toggle, showMenu] = useState(false);
    return (
        <header className="header">
            <nav className="nav container">
                <a href="index.html" className="nav__logo">
                    <a href="#home" className="nav__logo">Chesswahili</a>
                </a>

                <div className={Toggle ? "nav__menu show-menu" : "nav__menu"}>
                    <ul className="nav__list grid">
                        <li className="nav__item">
                            <a href="#home" className="nav__link active-link">
                                <i className="uil uil-estate nav__icon"></i> Home
                            </a>
                        </li>

                        <li className="nav__item">
                            <a href="#about" className="nav__link">
                            <i class="uil uil-chat-bubble-user nav__icon"></i> About
                            </a>
                        </li>

                        <li className="nav__item">
                            <a href="#leaderboard" className="nav__link">
                                <i class="uil uil-presentation-line nav__icon"></i> Learderboard
                            </a>
                        </li>

                        <li className="nav__item">
                            <a href="#match" className="nav__link">
                                <i class="uil uil-stopwatch nav__icon"></i> Matches
                            </a>
                        </li>

                        <li className="nav__item">
                            <a href="#league" className="nav__link">
                                <i class="uil uil-list-ol nav__icon"></i> League
                            </a>
                        </li>

                        <li className="nav__item">
                            <a href="#contact" className="nav__link">
                                <i class="uil uil-message nav__icon"></i> Contact
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