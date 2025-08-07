import React from "react";
import { motion } from 'framer-motion';

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
      <section className="mb-20">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold text-center mb-12 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-md"
        >
          🏏 The Legendary Journey of GICPL 🏆
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-gray-800 text-lg md:text-xl leading-relaxed font-medium shadow-xl bg-white/70 backdrop-blur-xl rounded-2xl p-8"
        >
          <motion.p className="mb-6 hover:scale-[1.01] transition-transform">
            It all began during the dark times of{" "}
            <span className="font-bold text-red-500">COVID-19</span> in{" "}
            <span className="font-bold">June-July 2020</span>. From a small gathering of{" "}
            <span className="font-bold text-indigo-600">8-10 passionate players</span> in a corner
            of the GIC ground, emerged a <strong>legacy</strong> that would define cricket for years to come.
          </motion.p>

          <motion.p className="mb-6 hover:scale-[1.01] transition-transform">
            The inaugural <strong>7-match series</strong> saw two fierce rivals go head-to-head:{" "}
            <span className="text-red-500 font-bold">NKT</span> (led by Fr. Nikhil Yadav) vs.{" "}
            <span className="text-blue-500 font-bold">SKS</span> (captained by Fr. Abhay Shukla). A{" "}
            <strong>thrilling</strong> series that ended <strong>4-3 in favor of NKT</strong>,
            setting the stage for one of the greatest rivalries ever!
          </motion.p>

          <motion.p className="mb-6 hover:scale-[1.01] transition-transform">
            🎯 <strong>2021</strong>: The tides turned! SKS, under Fr. Abhay Shukla’s brilliant leadership, took revenge, leveling the stakes!
          </motion.p>

          <motion.p className="mb-6 hover:scale-[1.01] transition-transform">
            ⚡️ <strong>2022</strong>: The game evolved with an <strong>auction system</strong>, turning casual matches into a professional league.
            Teams like <strong>Sahar ke Shaampoo</strong> and <strong>Ansh ke Ande</strong> entered the battlefield, raising the competition!
          </motion.p>

          <motion.p className="mb-6 hover:scale-[1.01] transition-transform">
            🏆 <strong>Today, GICPL is a phenomenon!</strong> With grand <strong>auctions, press conferences, gala dinners, media teams, and a dedicated treasurer</strong>,
            the league now boasts <strong>two seasons every year</strong>:
          </motion.p>

          <ul className="list-disc list-inside text-indigo-700 font-semibold mb-6">
            <li>
              🔥 <strong>Main Season</strong> (Diwali) – Featuring the legendary{" "}
              <span className="text-red-500">NKT vs SKS</span> rivalry
            </li>
            <li>
              ⚔️ <strong>GICPL-H</strong> – Auctions with <strong>new captains</strong> every edition
            </li>
          </ul>

          <motion.p className="mt-6 hover:scale-[1.01] transition-transform text-green-800 font-semibold">
            🎯 <strong>What’s Next?</strong> <span className="text-indigo-700 font-bold">Leather ball</span> matches under{" "}
            <span className="text-indigo-700 font-bold">ICC rules</span> debuting in <strong>GICPL-H 2025</strong>!<br />
            The legacy continues… and the <strong className="text-red-500">rivalry never dies!</strong> 💥
          </motion.p>
        </motion.div>
      </section>

      <section className="my-20 px-4 sm:px-8">
        <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500 drop-shadow-md">
          🔹 Iconic Quotes 🔹
        </h2>

        {/* Main Card */}
        <div className="flex justify-center mb-14">
          <div
            className="relative w-full max-w-4xl h-64 rounded-2xl shadow-2xl bg-cover bg-center transition-transform duration-500 transform hover:scale-[1.04] hover:rotate-1"
            style={{ backgroundImage: "url('/image1.png')" }}
          >
            <div className="absolute inset-0 bg-black/50 rounded-2xl flex flex-col justify-center items-center px-6 py-4">
              <p className="text-white text-2xl italic mb-4 font-semibold text-center">
                "GICPL M*d*rch*d kya kya din dikhata hai"
              </p>
              <p className="text-white font-bold text-lg tracking-wide">- Fr. Abhay Shukla</p>
            </div>
          </div>
        </div>

        {/* Row of 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Quote Card 2 */}
          <div
            className="relative h-64 rounded-2xl shadow-lg bg-cover bg-center transition-transform duration-500 transform hover:scale-[1.04] hover:rotate-2"
            style={{ backgroundImage: "url('/image2.jpg')" }}
          >
            <div className="absolute inset-0 bg-black/50 rounded-2xl flex flex-col justify-center items-center px-4">
              <p className="text-white italic text-lg mb-3 text-center font-medium">
                "GICPL is the only tournament which proves the fact: Catches win matches!"
              </p>
              <p className="text-white font-semibold tracking-wide">- Harihar Bajpai</p>
            </div>
          </div>

          {/* Quote Card 3 */}
          <div
            className="relative h-64 rounded-2xl shadow-lg bg-cover bg-center transition-transform duration-500 transform hover:scale-[1.04] hover:rotate-1"
            style={{ backgroundImage: "url('/image3.jpg')" }}
          >
            <div className="absolute inset-0 bg-black/50 rounded-2xl flex flex-col justify-center items-center px-4">
              <p className="text-white italic text-lg mb-3 text-center font-medium">
                "Vo series mein humne auction hagg diya tha"
              </p>
              <p className="text-white font-semibold tracking-wide">- Fr. Nikhil Yadav</p>
            </div>
          </div>

          {/* Quote Card 4 */}
          <div
            className="relative h-64 rounded-2xl shadow-lg bg-cover bg-center transition-transform duration-500 transform hover:scale-[1.04] hover:-rotate-1"
            style={{ backgroundImage: "url('/image4.JPG')" }}
          >
            <div className="absolute inset-0 bg-black/50 rounded-2xl flex flex-col justify-center items-center px-4">
              <p className="text-white italic text-lg mb-3 text-center font-medium">
                "2000 rs dedo aur re-auction kara lo."
              </p>
              <p className="text-white font-semibold tracking-wide">- Fr. Aryan Agarwal</p>
            </div>
          </div>
        </div>
      </section>




  {/* Team Section */}
<section className="mt-24 px-4 sm:px-8">
  {Object.entries(teamData).map(([section, members]) => (
    <div key={section} className="mb-20">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 drop-shadow-md">
        {section}
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        {members.map((member, index) => (
          <div
            key={index}
            className="relative bg-white/80 border border-gray-200 p-6 rounded-2xl shadow-xl w-72 text-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute -top-3 -right-3 bg-indigo-100 text-indigo-600 font-bold px-3 py-1 rounded-full text-xs shadow-sm">
              #{index + 1}
            </div>
            <p className="text-indigo-700 font-semibold text-xl">{member.name}</p>
            <p className="text-gray-700 text-sm mt-2 font-medium">Role: {member.role}</p>
          </div>
        ))}
      </div>
    </div>
  ))}
</section>


    </div>
  );
}
