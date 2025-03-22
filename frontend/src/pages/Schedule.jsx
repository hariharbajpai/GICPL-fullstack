import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Schedule = () => {
  const [matches, setMatches] = useState([]);
  const [pressConferences, setPressConferences] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [date, setDate] = useState('');
  const [pressLink, setPressLink] = useState('');
  const [auctionLink, setAuctionLink] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/schedule/schedules');
      setMatches(response.data.data.matches);
      setPressConferences(response.data.data.pressConferences);
      setAuctions(response.data.data.auctions);
    } catch (err) {
      console.error('Error fetching schedules:', err);
    }
  };

  const addMatchSchedule = async () => {
    try {
      await axios.post('http://localhost:5000/api/schedule/match-schedule', { team1, team2, date }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchSchedules();
    } catch (err) {
      console.error('Error adding match schedule:', err);
    }
  };

  const addPressConference = async () => {
    try {
      await axios.post('http://localhost:5000/api/schedule/press-conference', { driveLink: pressLink }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchSchedules();
    } catch (err) {
      console.error('Error adding press conference:', err);
    }
  };

  const addAuction = async () => {
    try {
      await axios.post('http://localhost:5000/api/schedule/auction', { driveLink: auctionLink }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchSchedules();
    } catch (err) {
      console.error('Error adding auction:', err);
    }
  };

  const deleteMatchSchedule = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/schedule/match-schedule/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert(response.data.message);
      fetchSchedules();
    } catch (err) {
      console.error('Error deleting match schedule:', err);
      alert('An error occurred while deleting the match schedule');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center py-8">Match Schedule</h1>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Add Match Schedule</h2>
        <input type="text" placeholder="Team 1" value={team1} onChange={(e) => setTeam1(e.target.value)} className="w-full p-2 mb-2 border rounded" />
        <input type="text" placeholder="Team 2" value={team2} onChange={(e) => setTeam2(e.target.value)} className="w-full p-2 mb-2 border rounded" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 mb-2 border rounded" />
        <button onClick={addMatchSchedule} className="bg-blue-500 text-white p-2 rounded">Add Match</button>
      </div>

      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Match Schedules</h2>
        {matches.map((match) => (
          <div key={match._id} className="bg-white p-4 mb-2 rounded shadow flex justify-between items-center">
            <p>{match.team1} vs {match.team2} on {new Date(match.date).toLocaleDateString()}</p>
            <button onClick={() => deleteMatchSchedule(match._id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Add Press Conference Link</h2>
        <input type="text" placeholder="Google Drive Link" value={pressLink} onChange={(e) => setPressLink(e.target.value)} className="w-full p-2 mb-2 border rounded" />
        <button onClick={addPressConference} className="bg-blue-500 text-white p-2 rounded">Add Press Conference</button>
      </div>

      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Add Auction Link</h2>
        <input type="text" placeholder="Google Drive Link" value={auctionLink} onChange={(e) => setAuctionLink(e.target.value)} className="w-full p-2 mb-2 border rounded" />
        <button onClick={addAuction} className="bg-blue-500 text-white p-2 rounded">Add Auction</button>
      </div>
    </div>
  );
};

export default Schedule;