import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/cricket-background.jpg')" }}
      >
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">Welcome to GICPL</h1>
          <p className="text-xl mb-8">Where Cricket Dreams Come Alive</p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSe2NsTFoZ_HZmw2C6zD8x0mUZulC95LvCQUzWavD2-8-ZfD8A/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition duration-300"
          >
            Register Here
          </a>
        </div>
      </section>

      {/* Information Cards Section */}
      <section
        key={Date.now()} // Ensures re-render
        className="py-16 bg-cover bg-center"
        style={{ backgroundImage: "url('/background2.jpg')" }}
      >
        <div className="container mx-auto px-4 flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Upcoming Matches */}
            <div className="bg-gray-700 bg-opacity-90 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">📅</div>
              <h2 className="text-2xl font-bold mb-4">Upcoming Matches</h2>
              <p className="mb-4">Check out the latest match schedules and fixtures.</p>
              <a href="/schedule" className="text-purple-400 hover:text-purple-300">
                View Schedule →
              </a>
            </div>

                {/* Card 2: Tournament Stats */}
                        <div className="bg-gray-700 bg-opacity-90 p-6 rounded-lg text-center">
                            <div className="text-4xl mb-4">📊</div>
                            <h2 className="text-2xl font-bold mb-4">Tournament Stats</h2>
                            <p className="mb-4">Explore performance analytics and detailed statistics.</p>
                            {/* <a href="/stats" className="text-purple-400 hover:text-purple-300">
                                View Stats →
                            </a> */}
                        </div>

            {/* Card 2: Team Profiles */}
            <div className="bg-gray-700 bg-opacity-90 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">👥</div>
              <h2 className="text-2xl font-bold mb-4">Team Profiles</h2>
              <p className="mb-4">Discover teams and player details.</p>
              <a href="/teams" className="text-purple-400 hover:text-purple-300">
                View Teams →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}