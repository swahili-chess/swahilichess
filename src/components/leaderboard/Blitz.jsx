import React, { useEffect, useState } from "react";
import { leaderboard_url } from "../../constants";

const Blitz = () => {
    const [blitz, setBlitz] = useState();


    useEffect(() => {
        fetch(leaderboard_url)
            .then((response) => response.json())
            .then((json) => {
                setBlitz(json["blitz"]);
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
                        blitz ?
                            blitz.map((player, index) => (
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

export default Blitz;