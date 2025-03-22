import React from "react";
import { Link } from "react-router-dom";
import { Ticket as Cricket, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Cricket className="h-8 w-8" />
              <span className="font-bold text-xl">GICPL</span>
            </div>
            <p className="text-gray-400">
              The premier cricket league fostering talent and promoting sportsmanship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-purple-400">About Us</Link></li>
              <li><Link to="/teams" className="text-gray-400 hover:text-purple-400">Teams</Link></li>
              <li><Link to="/schedule" className="text-gray-400 hover:text-purple-400">Schedule</Link></li>
              <li><Link to="/gallery" className="text-gray-400 hover:text-purple-400">Gallery</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="text-gray-400 space-y-2">
              <li>Email: <a href="gicpl.official@gmail.com" className="hover:text-purple-400">gicpl.official@gmail.com</a></li>
              <li>Phone: <a href="tel:+15551234567" className="hover:text-purple-400">+91 7017645320</a></li>
              <li>Address: Etawah</li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-purple-400">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-purple-400">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#https://www.instagram.com/gicp.l?igsh=MTBybHg5MWdyc3JlNA%3D%3D" aria-label="Instagram" className="text-gray-400 hover:text-purple-400">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-purple-400">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} GICPL. All rights reserved. Made by Harihar Bajpai</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
