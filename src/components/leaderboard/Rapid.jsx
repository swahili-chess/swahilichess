import React, { useEffect, useState } from "react";

const Rapid = () => {
    const [rapid, setRapid] = useState();


    useEffect(() => {
        fetch('https://api.swahilichess.com/lichess/top-ten')
            .then((response) => response.json())
            .then((json) => {
                setRapid(json["rapid"]);
            });
    }, []);

    return (
        <api>
            <table class="table">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Name</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        rapid ?
                            Object.keys(rapid).map((key, index) => (
                                <tr>
                                    <td>{index + 1}.</td>
                                    <td>{key}</td>
                                    <td>{rapid[key]}</td>
                                </tr>
                            ))
                            : "loading"}
                </tbody>
            </table>
        </api>
    );
};

export default Rapid;