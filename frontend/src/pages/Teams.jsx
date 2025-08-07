import React, { useState } from 'react';

export default function Teams() {
  const [selectedTeam, setSelectedTeam] = useState(null);

  const teamsData = {
    "GICPL-OG": {
      "NKT (Nikhil Ke Trailblazers)": {
        captain: "Nikhil Yadav",
        players: ["Nikhil (C)", "Harihar (WK)", "Vitthal", "Akshat", "Ansh (VC)", "Rishabh", "Kaif", "Prajwal", "Harshit", "Utkarsh", "Shivam Malik"]
      },
      "SKS (Shukla Ke Sher)": {
        captain: "Abhay Shukla",
        players: ["Abhay (C)", "Ayush", "Kushagra", "Sahar", "Aryan (VC)", "Nishant", "Abhijeet", "Priyank", "Akash", "Dhruv", "Ayushman"]
      }
    },
    "GICPL-H": {
      "PKP (Prajwal ke punters)": {
        captain: "Prajwal Yadav",
        players: ["Prajwal (C)", "Harihar (WK)", "Rishabh", "Kaif", "Abhishek Ghoda", "Abhay", "Utkarsh", "Nikhil", "Shivam Malik"]
      },
      "HKH (Harshit ke Harijans)": {
        captain: "Harshit Sharma",
        players: ["Harshit (C)", "Ayush", "Sahar", "Aryan","Ansh (WK)", "Priyank", "Akash", "Kushagra", "Nishant"]
      },
      "AKA (Aryan ke Angaaray)": {
        captain: "Aryan Agarwal",
        players: ["Aryan (C)", "Abhay", "Harihar (WK)", "Vitthal", "Ansh", "Nishant (VC)", "Kushagra", "Ayushman", "Dhruv", "Kaif", "Akash"]
      },
      "SKS (Sahar ke Shampoo)": {
        captain: "Sahar Pathak",
        players: "NO OFFICIAL INFORMATION"
      },
      "AKA (Ansh ke Andee)": {
        captain: "Ansh Agarwal",
        players: "NO OFFICIAL INFORMATION"
      },
      "PKP (GICPL-H2)": {
        captain: "Prajwal Yadav",
        players: ["Prajwal (C)", "Akshat", "Rishabh", "Sahar", "Harshit", "Fake Manu (WK)", "Priyank (VC)", "Utkarsh", "NIkhil", "Annoy", "Shivam Malik"]
      }
    }
  };

  const handleCardClick = (section, team) => {
    setSelectedTeam({ section, team, ...teamsData[section][team] });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 drop-shadow-lg">
        🏏 GICPL Teams
      </h1>

      {/* GICPL-OG Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-500">
          GICPL-OG (Diwali)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {Object.keys(teamsData["GICPL-OG"]).map((team) => (
            <div
              key={team}
              onClick={() => handleCardClick("GICPL-OG", team)}
              className="bg-white p-6 rounded-2xl shadow-lg cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
            >
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {team}
              </h3>
              <p className="text-gray-600 mt-2">Captained by <span className="font-semibold text-blue-600">{teamsData["GICPL-OG"][team].captain}</span></p>
            </div>
          ))}
        </div>
      </section>

      {/* GICPL-H Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
          GICPL-H
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {Object.keys(teamsData["GICPL-H"]).map((team) => (
            <div
              key={team}
              onClick={() => handleCardClick("GICPL-H", team)}
              className="bg-white p-6 rounded-2xl shadow-lg cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
            >
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {team}
              </h3>
              <p className="text-gray-600 mt-2">Led by <span className="font-semibold text-blue-600">{teamsData["GICPL-H"][team].captain}</span></p>
            </div>
          ))}
        </div>
      </section>

      {/* Modal: Team Details */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl w-full animate-fadeIn scale-100 transition-transform">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              {selectedTeam.team}
            </h2>
            <p className="text-gray-700 mb-4">Captain: <span className="font-semibold text-blue-600">{selectedTeam.captain}</span></p>
            {typeof selectedTeam.players === "string" ? (
              <p className="text-red-500 font-semibold">{selectedTeam.players}</p>
            ) : (
              <ul className="list-disc list-inside text-gray-800 space-y-1">
                {selectedTeam.players.map((player, index) => (
                  <li key={index}>{player}</li>
                ))}
              </ul>
            )}
            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedTeam(null)}
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
