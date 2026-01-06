import React from "react";

const Rapid = ({ data, loading, error }) => {

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
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                No ratings available
                            </td>
                        </tr>
                    ) : (
                        data.map((player, index) => (
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

export default Rapid;
