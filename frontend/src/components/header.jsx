// Header.js
import React, { useState } from "react"
import { Menu, X, User, Sun, Moon, Cloud } from "lucide-react"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  return (
    <header
      className={`w-full ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ヘッダーの左側 */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <Cloud className="h-8 w-8 text-blue-500 mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                ClearSky
              </span>
            </a>
          </div>
          {/* ナビゲーション */}
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
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
          </nav>
          {/* ヘッダーの右側 */}
          <div className="flex items-center">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 mr-2"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="User menu"
              >
                <User className="h-5 w-5" />
              </button>
            </div>
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* モバイルメニュー */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="/"
            className="block px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Home
          </a>
          <a
            href="/forecast"
            className="block px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Forecast
          </a>
          <a
            href="/maps"
            className="block px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Maps
          </a>
          <a
            href="/about"
            className="block px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            About
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
