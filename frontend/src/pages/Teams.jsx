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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center py-8 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        Teams
      </h1>

      {/* GICPL-OG Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          GICPL-OG (Diwali)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {Object.keys(teamsData["GICPL-OG"]).map((team) => (
            <div
              key={team}
              className="bg-white p-6 rounded-lg shadow-2xl transform transition-all hover:scale-105 hover:shadow-3d cursor-pointer"
              onClick={() => handleCardClick("GICPL-OG", team)}
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
        <h2 className="text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
          GICPL-H
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {Object.keys(teamsData["GICPL-H"]).map((team) => (
            <div
              key={team}
              className="bg-white p-6 rounded-lg shadow-2xl transform transition-all hover:scale-105 hover:shadow-3d cursor-pointer"
              onClick={() => handleCardClick("GICPL-H", team)}
            >
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {team}
              </h3>
              <p className="text-gray-600 mt-2">Lead by <span className="font-semibold text-blue-600">{teamsData["GICPL-H"][team].captain}</span></p>
            </div>
          ))}
        </div>
      </section>

      {/* Display Selected Team Details */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8">
          <div className="bg-white p-8 rounded-lg max-w-2xl w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              {selectedTeam.team}
            </h2>
            <p className="text-gray-700 mb-4">Captained by <span className="font-semibold text-blue-600">{selectedTeam.captain}</span></p>
            {typeof selectedTeam.players === "string" ? (
              <p className="text-red-500">{selectedTeam.players}</p>
            ) : (
              <ul className="list-disc list-inside">
                {selectedTeam.players.map((player, index) => (
                  <li key={index} className="text-gray-700">{player}</li>
                ))}
              </ul>
            )}
            <button
              className="mt-6 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all"
              onClick={() => setSelectedTeam(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}