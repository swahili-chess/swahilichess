import React from "react";
import './about.css';
import AboutImg from "../../assets/about.png";
import Info from "./Info";

const About = () => {
    return (
        <section className="about section" id="about">
            <h2 className="section__title">About Us</h2>
            <span className="section__subtitle">Overview and Aim</span>

            <div className="about__container container grid">
                <img src={AboutImg} alt="" className="about__img" />

                <div className="about__data">
                    <Info />

                    <p className="about__description">
                        One of the main purposes of having a chess team is to teach you good sportsmanship.
                        How you act is more important than whether you win or lose.
                        Chess is more FUN when everyone is a good sport.
                        <br /><br /><br />Do your share.
                        </p>

                </div>
            </div>
        </section>
    )
}

export default About;