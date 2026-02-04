import React, { useState } from "react";
import "./header.css";

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

    /*============== Smooth Scroll Navigation =============*/
    const handleNavClick = (e, sectionId) => {
        e.preventDefault();
        setActiveNav(sectionId);
        showMenu(false); // Close mobile menu
        
        const section = document.querySelector(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <header className="header">
            <nav className="nav container">
                <a href="#home" className="nav__logo" onClick={(e) => handleNavClick(e, "#home")}>
                    <h4>Chess</h4>
                </a>

                <div className={Toggle ? "nav__menu show-menu" : "nav__menu"}>
                    <ul className="nav__list grid">
                        <li className="nav__item">
                            <a href="#home"
                                onClick={(e) => handleNavClick(e, "#home")}
                                className={activeNav === "#home" ?
                                    "nav__link active-link" : "nav__link"}>
                                <i className="uil uil-estate nav__icon"></i>
                                <div className="nav_title">Home</div>
                            </a>
                        </li>

                        <li className="nav__item">
                            <a href="#leaderboard"
                                onClick={(e) => handleNavClick(e, "#leaderboard")}
                                className={activeNav === "#leaderboard" ?
                                    "nav__link active-link" : "nav__link"}>
                                <i className="uil uil-presentation-line nav__icon"></i>
                                <div className="nav_title">Leaderboard</div>
                            </a>
                        </li>

                        <li className="nav__item">
                            <a href="#calendar"
                                onClick={(e) => handleNavClick(e, "#calendar")}
                                className={activeNav === "#calendar" ?
                                    "nav__link active-link" : "nav__link"}>
                                <i className="uil uil-calendar-alt nav__icon"></i>
                                <div className="nav_title">Calendar</div>
                            </a>
                        </li>
                    </ul>

                    <i class="uil uil-times nav__close" onClick={() => showMenu(!Toggle)}></i>
                </div>

                <div className={Toggle ? "nav__toggle active" : "nav__toggle"} onClick={() => showMenu(!Toggle)}>
                    <span className="nav__toggle-bar"></span>
                    <span className="nav__toggle-bar"></span>
                    <span className="nav__toggle-bar"></span>
                </div>
            </nav>
        </header>
    )
}

export default Header