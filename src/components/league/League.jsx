import React from "react";
import './league.css';
import Table from "./Table";

const League = () => {
    return (
        <section className="league container section" id="league">
            <h2 className="section__title">As it stands</h2>
            <span className="section__subtitle">League table</span>

            <div className="league__container">
                <Table />
            </div>
        </section>
    );
};

export default League;