import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminView = () => {
  const [matches, setMatches] = useState([]);
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [matchDate, setMatchDate] = useState('');
  const [pressLink, setPressLink] = useState('');
  const [auctionLink, setAuctionLink] = useState('');

  const fetchMatches = async () => {
    const response = await axios.get('/api/matches');
    setMatches(response.data.matches);
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleAddMatch = async () => {
    await axios.post('/api/add-match', { team1, team2, matchDate });
    fetchMatches();
  };

  const handleAddPressConference = async (matchId) => {
    await axios.post('/api/add-press-conference', { matchId, pressLink });
    fetchMatches();
  };

  const handleAddAuction = async (matchId) => {
    await axios.post('/api/add-auction', { matchId, auctionLink });
    fetchMatches();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center py-8">Admin Dashboard</h1>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Add Match Schedule</h2>
        <input
          type="text"
          placeholder="Team 1"
          value={team1}
          onChange={(e) => setTeam1(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          placeholder="Team 2"
          value={team2}
          onChange={(e) => setTeam2(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="date"
          value={matchDate}
          onChange={(e) => setMatchDate(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleAddMatch}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Match
        </button>
      </div>

      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Match Schedules</h2>
        {matches.map((match) => (
          <div key={match._id} className="bg-white p-4 mb-4 rounded shadow">
            <h3 className="text-xl font-bold">{match.team1} vs {match.team2}</h3>
            <p className="text-gray-600">Date: {new Date(match.matchDate).toLocaleDateString()}</p>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Press Conference Link"
                value={pressLink}
                onChange={(e) => setPressLink(e.target.value)}
                className="w-full p-2 mb-2 border rounded"
              />
              <button
                onClick={() => handleAddPressConference(match._id)}
                className="bg-green-500 text-white p-2 rounded"
              >
                Add Press Conference
              </button>
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Auction Link"
                value={auctionLink}
                onChange={(e) => setAuctionLink(e.target.value)}
                className="w-full p-2 mb-2 border rounded"
              />
              <button
                onClick={() => handleAddAuction(match._id)}
                className="bg-purple-500 text-white p-2 rounded"
              >
                Add Auction
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminView;