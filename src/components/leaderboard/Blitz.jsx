import React, { useEffect, useState } from "react";

const Blitz = () => {
    const [blitz, setBlitz] = useState();


    useEffect(() => {
        fetch('https://api.chess.tz/lichess/leaderboard')
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
