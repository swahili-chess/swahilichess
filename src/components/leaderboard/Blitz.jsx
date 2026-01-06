import React, { useEffect, useState } from "react";
import { leaderboard_url } from "../../constants";

const Blitz = () => {
    const [blitz, setBlitz] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(leaderboard_url)
            .then((response) => response.json())
            .then((json) => {
                setBlitz(json["blitz"] || []);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load ratings");
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Name</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>
                                Loading ratings...
                            </td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                {error}
                            </td>
                        </tr>
                    ) : blitz.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                No ratings available
                            </td>
                        </tr>
                    ) : (
                        blitz.map((player, index) => (
                            <tr key={index}>
                                <td>{index + 1}.</td>
                                <td>{player.username}</td>
                                <td>{player.rating}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Blitz;
