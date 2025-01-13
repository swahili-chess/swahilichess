import React, { useEffect, useState } from "react";
import { leaderboard_url } from "../../constants";

const Rapid = () => {
    const [rapid, setRapid] = useState();


    useEffect(() => {
        fetch(leaderboard_url)
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
                            rapid.map((player, index) => (
                              <tr>
                                    <td>{index + 1}.</td>
                                    <td>{player.username}</td>
                                    <td>{player.rating}</td>
                                </tr>
                            ))
                            : "loading"}
                </tbody>
            </table>
        </api>
    );
};

export default Rapid;
