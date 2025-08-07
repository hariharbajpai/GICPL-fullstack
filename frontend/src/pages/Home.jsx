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
  key={Date.now()}
  className="py-20 bg-cover bg-center"
  style={{ backgroundImage: "url('/background2.jpg')" }}
>
  <div className="container mx-auto px-4 flex justify-center">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {/* Card Template */}
      {[
        {
          icon: "📅",
          title: "Upcoming Matches",
          desc: "Check out the latest match schedules and fixtures.",
          link: "/schedule",
          linkText: "View Schedule →"
        },
        {
          icon: "📊",
          title: "Tournament Stats",
          desc: "Explore performance analytics and detailed statistics.",
          link: null,
          linkText: null
        },
        {
          icon: "👥",
          title: "Team Profiles",
          desc: "Discover teams and player details.",
          link: "/Teams",
          linkText: "View Teams →"
        }
      ].map(({ icon, title, desc, link, linkText }, idx) => (
        <div
          key={idx}
          className="relative group p-6 bg-gray-700/70 backdrop-blur-lg border border-gray-600 shadow-2xl rounded-2xl text-center transition-transform duration-300 ease-in-out transform hover:-translate-y-3 hover:scale-[1.03]"
        >
          <div className="absolute -inset-1 rounded-2xl blur-xl bg-gradient-to-r from-purple-700 via-indigo-500 to-blue-500 opacity-30 group-hover:opacity-70 transition duration-500" />
          <div className="relative z-10">
            <div className="text-5xl mb-4 drop-shadow-md">{icon}</div>
            <h2 className="text-3xl font-extrabold text-white mb-4 tracking-wide">
              {title}
            </h2>
            <p className="text-gray-200 mb-4 leading-relaxed">{desc}</p>
            {link && (
              <a
                href={link}
                className="inline-block mt-2 text-purple-300 hover:text-purple-100 font-semibold transition-colors duration-200"
              >
                {linkText}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

    </div>
  );
}