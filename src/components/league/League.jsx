import React from "react";
import './league.css';
import Table from "./Table";

const League = () => {
    return (
        <section className="league container section" id="league">
            <h2 className="section__title">League Standing</h2>
            <span className="section__subtitle">As it stands</span>

            <div className="league__container">
                <Table />
            </div>
        </section>
    );
};

export default League;