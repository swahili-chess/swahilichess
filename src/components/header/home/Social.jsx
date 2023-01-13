import React from "react";
import whatsapp from "../../../assets/bxl-whatsapp.png";
import github from "../../../assets/bxl-github.png";
import link from "../../../assets/bx-link.png";

const Social = () => {
    return (
        <div className="home__social">
            <a href="https://chat.whatsapp.com/ELHXyyug2VbA9XFfR8l7vi" className="home__social-icon" target="_blank">
                <img src={whatsapp} alt="" />
            </a>

            <a href="https://github.com/orgs/ChessSwahili" className="home__social-icon" target="_blank">
                <img src={github} alt="" />
            </a>

            <a href="https://chesswahili.com" className="home__social-icon" target="_blank">
                <img src={link} alt="" />
            </a>
        </div>
    )
}

export default Social;