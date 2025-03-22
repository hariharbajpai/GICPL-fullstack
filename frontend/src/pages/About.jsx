import React from "react";

const teamData = {
  Forefathers: [
    { name: "Fr. Nikhil Yadav", role: "Founder & Pioneer" },
    { name: "Fr. Ansh Agarwal", role: "Founder & Tactician" },
    { name: "Fr. Sahar Pathak", role: "Founder & Strategist" },
    { name: "Fr. Aryan Agarwal", role: "Founder & Organizer" },
    { name: "Fr. Abhay Shukla", role: "Founder & Pioneer" },
  ],
  "Managing Team": [
    { name: "Harihar Bajpai", role: "Media Manager" },
    { name: "Rishabh Pandey", role: "Videographer" },
  ],
  Treasurer: [
    { name: "Harihar Bajpai", role: "Treasurer" },
    { name: "Ayush Yadav", role: "Treasurer" },
  ],
};

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* History Section */}
      {/* History Section */}
      <section className="mb-16">
        <h1 className="text-5xl font-extrabold text-center mb-8 text-indigo-700">
          🏏 The Legendary Journey of GICPL 🏆
        </h1>
        <div className="max-w-4xl mx-auto text-gray-800 text-lg leading-relaxed font-medium">
          <p className="mb-6">
            It all began during the dark times of <span className="font-bold text-red-500">COVID-19</span>
            in <span className="font-bold">June-July 2020</span>. From a small gathering of <span className="font-bold text-indigo-600">8-10 passionate players</span>
            in a corner of the GIC ground, emerged a <strong>legacy</strong> that would define cricket for years to come.
          </p>
          <p className="mb-6">
            The inaugural <strong>7-match series</strong> saw two fierce rivals go head-to-head:
            <span className="text-red-500 font-bold"> NKT </span>(led by Fr. Nikhil Yadav) vs.
            <span className="text-blue-500 font-bold"> SKS </span>(captained by Fr. Abhay Shukla).
            A <strong>thrilling</strong> series that ended <strong>4-3 in favor of NKT</strong>, setting the stage for one of the greatest rivalries ever!
          </p>
          <p className="mb-6">
            🎯 <strong>2021</strong>: The tides turned! SKS, under Fr. Abhay Shukla’s brilliant leadership, took revenge, leveling the stakes!
          </p>
          <p className="mb-6">
            ⚡️ <strong>2022</strong>: The game evolved with an <strong>auction system</strong>, turning casual matches into a professional league.
            Teams like <strong>Sahar ke Shaampoo</strong> and <strong>Ansh ke Ande</strong> entered the battlefield, raising the competition!
          </p>
          <p className="mb-6">
            🏆 <strong>Today, GICPL is a phenomenon!</strong> With grand <strong>auctions, press conferences, gala dinners, media teams, and a dedicated treasurer</strong>,
            the league now boasts <strong>two seasons every year</strong>:
          </p>
          <ul className="list-disc list-inside text-indigo-700 font-semibold">
            <li>🔥 <strong>Main Season</strong> (Diwali) – Featuring the legendary <span className="text-red-500">NKT vs SKS</span> rivalry</li>
            <li>⚔️ <strong>GICPL-H</strong> – Auctions with <strong>new captains</strong> every edition</li>
          </ul>
          <p className="mt-6">
            🎯 <strong>What’s Next?</strong> <strong>Leather ball</strong> matches under <strong>ICC rules</strong> debuting in <strong>GICPL-H 2025</strong>!
            The legacy continues… and the <strong>rivalry never dies!</strong> 💥
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-4xl font-bold text-center mb-12 text-indigo-700">🔹 Iconic Quotes 🔹</h2>

        {/* Main Card */}
        <div className="flex justify-center mb-10">
          <div
            className="relative rounded-lg shadow-lg w-full max-w-4xl h-56 md:h-64 bg-cover bg-center transition-transform duration-300 ease-out hover:scale-105 hover:rotate-1"
            style={{ backgroundImage: "url('/image1.png')", perspective: "1000px" }}
          >
            <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col justify-center items-center p-4">
              <p className="text-white text-xl italic mb-3 font-semibold text-center">
                "GICPL M*d*rch*d kya kya din dikhata hai"
              </p>
              <p className="text-white font-bold text-lg">- Fr. Abhay Shukla</p>
            </div>
          </div>
        </div>

        {/* Row of 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quote Card 2 */}
          <div
            className="relative rounded-lg shadow-md h-56 md:h-64 bg-cover bg-center transition-transform duration-300 ease-out hover:scale-105 hover:rotate-2"
            style={{ backgroundImage: "url('/image2.jpg')", perspective: "1000px" }}
          >
            <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col justify-center items-center p-4">
              <p className="text-white italic text-lg mb-3 text-center">
                "GICPL is the only tournament which proves the fact: Catches win matches!"
              </p>
              <p className="text-white font-semibold">- Harihar Bajpai</p>
            </div>
          </div>

          {/* Quote Card 3 */}
          <div
            className="relative rounded-lg shadow-md h-56 md:h-64 bg-cover bg-center transition-transform duration-300 ease-out hover:scale-105 hover:rotate-1"
            style={{ backgroundImage: "url('/image3.jpg')", perspective: "1000px" }}
          >
            <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col justify-center items-center p-4">
              <p className="text-white italic text-lg mb-3 text-center">
                "Vo series mein humne auction hagg diya tha"
              </p>
              <p className="text-white font-semibold">- Fr. Nikhil Yadav</p>
            </div>
          </div>

          {/* Quote Card 4 */}
          <div
            className="relative rounded-lg shadow-md h-56 md:h-64 bg-cover bg-center transition-transform duration-300 ease-out hover:scale-105 hover:-rotate-1"
            style={{ backgroundImage: "url('/image4.JPG')", perspective: "1000px" }}
          >
            <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col justify-center items-center p-4">
              <p className="text-white italic text-lg mb-3 text-center">
                "2000 rs dedo aur re-auction kara lo."
              </p>
              <p className="text-white font-semibold">- Fr. Aryan Agarwal</p>
            </div>
          </div>
        </div>
      </section>



      {/* Team Section */}
      <section className="mt-16">
        {Object.entries(teamData).map(([section, members]) => (
          <div key={section} className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">{section}</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md w-72 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <p className="text-blue-600 font-bold text-lg">{member.name}</p>
                  <p className="text-gray-800 text-sm mt-2">{`Role: ${member.role}`}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
