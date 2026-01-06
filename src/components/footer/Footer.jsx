import React from "react";
import "./footer.css";

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer__container container">
                <h1 className="footer__title">Chess</h1>

                <ul className="footer__list">
                    <li>
                        <a href="#leaderboard"
                            className="footer__link">Leaderboard</a>
                    </li>

                    <li>
                        <a href="#calendar"
                            className="footer__link">Calendar</a>
                    </li>
                </ul>

                <div className="footer__social">
                    <a href="https://chat.whatsapp.com/ELHXyyug2VbA9XFfR8l7vi"
                        className="footer__social-link"
                        target="_blank"
                        rel="noreferrer"
                        >
                        <i class="bx bxl-whatsapp"></i>
                    </a>

                    <a href="https://github.com/orgs/swahili-chess"
                        className="footer__social-link"
                        target="_blank"
                        rel="noreferrer">
                        <i class="bx bxl-github"></i>
                    </a>

                    <a href="https://chess.tz"
                        className="footer__social-link"
                        target="_blank"
                        rel="noreferrer">
                        <i class="bx bxl-google"></i>
                    </a>
                </div>

                <span className="footer__copy">
                    &#169;2026 Chess. All rights reserved.
                </span>
            </div>
        </div>
    );
};

export default Footer;
