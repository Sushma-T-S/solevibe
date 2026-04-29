import React from 'react'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[#172337] text-white" role="contentinfo" aria-label="Footer">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div className="space-y-3">
            <h3 className="text-gray-400 text-sm font-medium uppercase">About</h3>
            <ul className="space-y-2 text-sm" role="list">
              <li><Link to="/" className="hover:text-white text-gray-300 transition">About Us</Link></li>
              <li><Link to="/" className="hover:text-white text-gray-300 transition">Careers</Link></li>
              <li><Link to="/" className="hover:text-white text-gray-300 transition">SoleVibe Stories</Link></li>
              <li><Link to="/" className="hover:text-white text-gray-300 transition">SoleVibe Go</Link></li>
              <li><Link to="/" className="hover:text-white text-gray-300 transition">SoleVibe Points</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-gray-400 text-sm font-medium uppercase">Help</h3>
            <ul className="space-y-2 text-sm" role="list">
              <li><Link to="/" className="hover:text-white text-gray-300 transition">Payments</Link></li>
              <li><Link to="/" className="hover:text-white text-gray-300 transition">Shipping</Link></li>
              <li><Link to="/" className="hover:text-white text-gray-300 transition">Cancellation & Returns</Link></li>
              <li><Link to="/" className="hover:text-white text-gray-300 transition">FAQ</Link></li>
              <li><Link to="/" className="hover:text-white text-gray-300 transition">Report Infringement</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-gray-400 text-sm font-medium uppercase">Consumer Policy</h3>
            <ul className="space-y-2 text-sm" role="list">
              <li><Link to="/" className="hover:text-white text-gray-300 transition">Terms Of Use</Link></li>
              <li><Link to="/" className="hover:text-white text-gray-300 transition">Security</Link></li>
              <li><Link to="/" className="hover:text-white text-gray-300 transition">Privacy</Link></li>
              <li><Link to="/" className="hover:text-white text-gray-300 transition">Sitemap</Link></li>
              <li><Link to="/" className="hover:text-white text-gray-300 transition">Grievance Redressal</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-gray-400 text-sm font-medium uppercase">Social</h3>
            <ul className="space-y-2 text-sm" role="list">
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white text-gray-300 transition">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white text-gray-300 transition">Twitter</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white text-gray-300 transition">YouTube</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white text-gray-300 transition">Instagram</a></li>
            </ul>
          </div>

          <div className="space-y-3 border-l border-gray-600 pl-4">
            <h3 className="text-gray-400 text-sm font-medium uppercase">Mail Us</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>SoleVibe Internet Private Limited,</p>
              <p>Buildings Alya, Bekin &</p>
              <p>Technology Park, Bengaluru,</p>
              <p>Karnataka, IN</p>
              <p className="mt-2">support@solevibe.com</p>
              <p className="mt-2">Phone: +91 1234567890</p>
            </div>
          </div>

          <div className="space-y-3 border-l border-gray-600 pl-4">
            <h3 className="text-gray-400 text-sm font-medium uppercase">Registered Office</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>SoleVibe Internet Private Limited,</p>
              <p>1st Floor, Emporium,</p>
              <p>Near Metro Station,</p>
              <p>Bengaluru - 560001</p>
              <p>Karnataka, India</p>
              <p className="mt-2 text-green-400">CIN: U51109KA2012PTC066107</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-[#2874f0] italic">SoleVibe</h1>
              <span className="text-gray-400 text-sm">© {new Date().getFullYear()} All rights reserved</span>
            </div>

            <nav aria-label="Social media links">
              <div className="flex items-center gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-[#1877f2] transition text-xl">
                  <FaFacebook />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-[#e4405f] transition text-xl">
                  <FaInstagram />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-[#1da1f2] transition text-xl">
                  <FaTwitter />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-[#ff0000] transition text-xl">
                  <FaYoutube />
                </a>
              </div>
            </nav>
          </div>
        </div>

        <nav className="border-t border-gray-600 mt-6 pt-4 flex flex-wrap justify-center gap-4 text-xs text-gray-400" aria-label="Footer links">
          <Link to="/" className="hover:text-white">Become a Seller</Link>
          <span aria-hidden="true">|</span>
          <Link to="/" className="hover:text-white">Advertise</Link>
          <span aria-hidden="true">|</span>
          <Link to="/" className="hover:text-white">Gift Cards</Link>
          <span aria-hidden="true">|</span>
          <Link to="/" className="hover:text-white">SoleVibe Cares</Link>
          <span aria-hidden="true">|</span>
          <Link to="/" className="hover:text-white">Help Center</Link>
          <span aria-hidden="true">|</span>
          <Link to="/" className="hover:text-white">Bug Bounty</Link>
        </nav>
      </div>
    </footer>
  )
}

export default Footer

