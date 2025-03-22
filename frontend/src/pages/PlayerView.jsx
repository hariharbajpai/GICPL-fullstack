import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlayerView = () => {
  const [matches, setMatches] = useState([]);

  const fetchMatches = async () => {
    const response = await axios.get('/api/matches');
    setMatches(response.data.matches);
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center py-8">Match Schedules</h1>
      {matches.length === 0 ? (
        <p className="text-center text-gray-600">No matches scheduled yet</p>
      ) : (
        <div className="max-w-2xl mx-auto">
          {matches.map((match) => (
            <div key={match._id} className="bg-white p-6 mb-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-center">{match.team1} vs {match.team2}</h3>
              <p className="text-center text-gray-600 mt-2">Date: {new Date(match.matchDate).toLocaleDateString()}</p>
              <div className="mt-4">
                {match.pressConferenceLink ? (
                  <a
                    href={match.pressConferenceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-blue-500 text-white text-center p-2 rounded hover:bg-blue-600"
                  >
                    Press Conference Link
                  </a>
                ) : (
                  <p className="text-center text-gray-600">No press conference link available</p>
                )}
              </div>
              <div className="mt-4">
                {match.auctionLink ? (
                  <a
                    href={match.auctionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-purple-500 text-white text-center p-2 rounded hover:bg-purple-600"
                  >
                    Auction Link
                  </a>
                ) : (
                  <p className="text-center text-gray-600">No auction link available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerView;