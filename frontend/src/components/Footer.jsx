import React from "react";
import { Link } from "react-router-dom";
import { Ticket as Cricket, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white shadow-inner">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Logo and Description */}
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <Cricket className="h-10 w-10 text-purple-400 drop-shadow-md" />
              <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                GICPL
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              The premier cricket league fostering raw talent and promoting unshakable sportsmanship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-xl mb-6 text-purple-400 tracking-wide">Quick Links</h3>
            <ul className="space-y-3 text-base">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition duration-200">About Us</Link></li>
              <li><Link to="/teams" className="text-gray-400 hover:text-white transition duration-200">Teams</Link></li>
              <li><Link to="/schedule" className="text-gray-400 hover:text-white transition duration-200">Schedule</Link></li>
              <li><Link to="/gallery" className="text-gray-400 hover:text-white transition duration-200">Gallery</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-xl mb-6 text-purple-400 tracking-wide">Contact</h3>
            <ul className="text-gray-400 space-y-3 text-base">
              <li>
                Email: <a href="mailto:gicpl.official@gmail.com" className="hover:text-white">gicpl.official@gmail.com</a>
              </li>
              <li>
                Phone: <a href="tel:+917017645320" className="hover:text-white">+91 7017645320</a>
              </li>
              <li>
                Address: <span className="text-gray-300">Etawah, Uttar Pradesh, India</span>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="font-semibold text-xl mb-6 text-purple-400 tracking-wide">Follow Us</h3>
            <div className="flex space-x-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-400 hover:text-blue-500 transform hover:scale-110 transition"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-gray-400 hover:text-blue-400 transform hover:scale-110 transition"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/gicp.l?igsh=MTBybHg5MWdyc3JlNA%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-400 hover:text-pink-500 transform hover:scale-110 transition"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-gray-400 hover:text-red-500 transform hover:scale-110 transition"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500 tracking-wide">
            &copy; {new Date().getFullYear()} <span className="text-purple-400">GICPL</span>. All rights reserved. Made with 🖤 by Harihar Bajpai.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
