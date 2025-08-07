import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Schedule = () => {
  const [matches, setMatches] = useState([]);
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [matchDate, setMatchDate] = useState('');

  const [pressLink, setPressLink] = useState('');
  const [auctionLink, setAuctionLink] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    fetchMatches();
    fetchGlobalLinks();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get('https://gicpl-fullstack-backend.onrender.com/api/matches');
      setMatches(response.data.data);
    } catch (err) {
      console.error('Error fetching matches:', err);
    }
  };

  const fetchGlobalLinks = async () => {
    try {
      const res = await axios.get('https://gicpl-fullstack-backend.onrender.com/api/global-links');
      setPressLink(res.data.pressConferenceLink || '');
      setAuctionLink(res.data.auctionLink || '');
    } catch (err) {
      console.error('Error fetching global links:', err);
    }
  };

  const addMatch = async () => {
    if (!team1.trim() || !team2.trim() || !matchDate.trim()) {
      alert('Team names and date are required.');
      return;
    }

    try {
      await axios.post(
        'https://gicpl-fullstack-backend.onrender.com/api/matches',
        { team1, team2, matchDate },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTeam1('');
      setTeam2('');
      setMatchDate('');
      fetchMatches();
    } catch (err) {
      console.error('Error adding match:', err);
      alert('Failed to add match.');
    }
  };

  const deleteMatch = async (id) => {
    try {
      await axios.delete(`https://gicpl-fullstack-backend.onrender.com/api/matches/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchMatches();
    } catch (err) {
      console.error('Error deleting match:', err);
      alert('Failed to delete match.');
    }
  };

  const updatePressLink = async () => {
    try {
      await axios.patch(
        'https://gicpl-fullstack-backend.onrender.com/api/global-links/press',
        { pressConferenceLink: pressLink },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Press link updated');
    } catch (err) {
      console.error('Error updating press link:', err);
      alert('Failed to update press link.');
    }
  };

  const deletePressLink = async () => {
    try {
      await axios.delete('https://gicpl-fullstack-backend.onrender.com/api/global-links/press', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPressLink('');
      alert('Press link deleted');
    } catch (err) {
      console.error('Error deleting press link:', err);
      alert('Failed to delete press link.');
    }
  };

  const updateAuctionLink = async () => {
    try {
      await axios.patch(
        'https://gicpl-fullstack-backend.onrender.com/api/global-links/auction',
        { auctionLink },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Auction link updated');
    } catch (err) {
      console.error('Error updating auction link:', err);
      alert('Failed to update auction link.');
    }
  };

  const deleteAuctionLink = async () => {
    try {
      await axios.delete('https://gicpl-fullstack-backend.onrender.com/api/global-links/auction', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAuctionLink('');
      alert('Auction link deleted');
    } catch (err) {
      console.error('Error deleting auction link:', err);
      alert('Failed to delete auction link.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center py-8">Match Schedule</h1>

      {/* 🔹 Add Match Section */}
      {user?.role === 'admin' && (
        <div className="max-w-2xl mx-auto mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform transition-transform hover:scale-[1.02]">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Add New Match</h2>
            <input type="text" placeholder="Team 1" value={team1} onChange={(e) => setTeam1(e.target.value)} className="w-full p-2 mb-2 border rounded" />
            <input type="text" placeholder="Team 2" value={team2} onChange={(e) => setTeam2(e.target.value)} className="w-full p-2 mb-2 border rounded" />
            <input type="date" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} className="w-full p-2 mb-4 border rounded" />
            <button onClick={addMatch} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full">Add Match</button>
          </div>
        </div>
      )}

      {/* 🔹 Match Cards Section */}
      <div className="max-w-4xl mx-auto mt-12">
        {/* <h2 className="text-3xl font-bold mb-6 text-center">Scheduled Matches</h2> */}
        {matches.length === 0 ? (
          <p className="text-center text-gray-600">No matches scheduled yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {matches.map((match) => (
              <div key={match._id} className="bg-white p-6 rounded-xl shadow-lg transform transition-transform hover:scale-[1.02] hover:shadow-2xl">
                <h3 className="text-2xl font-bold text-center mb-2 text-gray-800">{match.team1} vs {match.team2}</h3>
                <p className="text-center text-gray-600">Date: {new Date(match.matchDate).toLocaleDateString()}</p>
                {user?.role === 'admin' && (
                  <button onClick={() => deleteMatch(match._id)} className="mt-4 w-full bg-red-600 text-white p-2 rounded hover:bg-red-700">
                    Delete Match
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔹 Global Press Conference Card */}
      <div className="max-w-2xl mx-auto mt-16">
        <div className="bg-white shadow-xl rounded-2xl p-6 transform transition-transform hover:scale-[1.02] hover:shadow-2xl">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">🎙️ Press Conference Link</h2>
          {user?.role === 'admin' && (
            <>
              <input type="text" placeholder="Enter Press Conference Link" value={pressLink} onChange={(e) => setPressLink(e.target.value)} className="w-full p-2 mb-4 border rounded" />
              <div className="flex gap-2">
                <button onClick={updatePressLink} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full">Update</button>
                <button onClick={deletePressLink} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 w-full">Delete</button>
              </div>
            </>
          )}
          {pressLink && (
            <a href={pressLink} target="_blank" rel="noopener noreferrer" className="block mt-4 text-blue-700 underline">View Press Conference</a>
          )}
        </div>
      </div>

      {/* 🔹 Global Auction Link Card */}
      <div className="max-w-2xl mx-auto mt-10 mb-20">
        <div className="bg-white shadow-xl rounded-2xl p-6 transform transition-transform hover:scale-[1.02] hover:shadow-2xl">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">🛒 Auction Link</h2>
          {user?.role === 'admin' && (
            <>
              <input type="text" placeholder="Enter Auction Link" value={auctionLink} onChange={(e) => setAuctionLink(e.target.value)} className="w-full p-2 mb-4 border rounded" />
              <div className="flex gap-2">
                <button onClick={updateAuctionLink} className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 w-full">Update</button>
                <button onClick={deleteAuctionLink} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 w-full">Delete</button>
              </div>
            </>
          )}
          {auctionLink && (
            <a href={auctionLink} target="_blank" rel="noopener noreferrer" className="block mt-4 text-purple-700 underline">View Auction</a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
