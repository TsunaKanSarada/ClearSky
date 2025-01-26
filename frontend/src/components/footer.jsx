import React from "react";
import { Facebook, Twitter, Instagram, Mail, Cloud } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            <a href="/" className="flex items-center mb-4">
              <Cloud className="h-8 w-8 text-blue-500 mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                ClearSky
              </span>
            </a>
            <p className="text-sm text-center md:text-left">
              Providing accurate weather forecasts and climate information since 2023.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-blue-500 transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="/forecast" className="hover:text-blue-500 transition-colors duration-200">
                  Forecast
                </a>
              </li>
              <li>
                <a href="/maps" className="hover:text-blue-500 transition-colors duration-200">
                  Maps
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-blue-500 transition-colors duration-200">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="/faq" className="hover:text-blue-500 transition-colors duration-200">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-blue-500 transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-blue-500 transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-blue-500 transition-colors duration-200">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-blue-500 transition-colors duration-200"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-blue-500 transition-colors duration-200"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-blue-500 transition-colors duration-200"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="mailto:info@clearsky.com"
                aria-label="Email"
                className="hover:text-blue-500 transition-colors duration-200"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ClearSky. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
