import React from "react";

const Info = () => {
    return (
        <div className="about__info grid">
            <div className="about__box">
                <i class="bx bx-award about__icon"></i>

                <h3 className="about__title">Est. Year</h3>
                <span className="about__subtitle">2023</span>
            </div>

            <div className="about__box">
                <i class="uil uil-stopwatch"></i>

                <h3 className="about__title">Matches</h3>
                <span className="about__subtitle"> 50 + games</span>
            </div>

            <div className="about__box">
                <i class="bx bx-support about__icon"></i>
                
                <h3 className="about__title">Support</h3>
                <span className="about__subtitle">Online 24/7</span>
            </div>
        </div>
    )
}

export default Info;