import React from "react";
import "./footer.css";

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer__container container">
                <h1 className="footer__title">Chesswahili</h1>

                <ul className="footer__list">
                    <li>
                        <a href="#leaderboard"
                            className="footer__link">Leaderboard</a>
                    </li>

                    <li>
                        <a href="#match"
                            className="footer__link">Matches</a>
                    </li>

                    <li>
                        <a href="#league"
                            className="footer__link">League</a>
                    </li>
                </ul>

                <div className="footer__social">
                    <a href="https://chat.whatsapp.com/ELHXyyug2VbA9XFfR8l7vi"
                        className="footer__social-link"
                        target="_blank">
                        <i class="bx bxl-whatsapp"></i>
                    </a>

                    <a href="https://github.com/orgs/ChessSwahili"
                        className="footer__social-link"
                        target="_blank">
                        <i class="bx bxl-github"></i>
                    </a>

                    <a href="https://chesswahili.com"
                        className="footer__social-link"
                        target="_blank">
                        <i class="bx bxl-google"></i>
                    </a>
                </div>

                <span className="footer__copy">
                    &#169;2023 Chesswahili. All rights reserved
                </span>
            </div>
        </div>
    );
};

export default Footer;