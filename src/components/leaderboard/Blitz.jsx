import React, { useEffect, useState } from "react";

const Blitz = () => {
    const [blitz, setBlitz] = useState();


    useEffect(() => {
        fetch('https://api.chesswahili.com/lichess/top-ten')
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
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
                            Object.keys(blitz).map((key, index) => (
                                <tr>
                                    <td>{index + 1}.</td>
                                    <td>{key}</td>
                                    <td>{blitz[key]}</td>
                                </tr>
                            ))
                            : "loading"}
                </tbody>
            </table>
        </api>
    );
};

export default Blitz;