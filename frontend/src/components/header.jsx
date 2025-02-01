// Header.jsx
import React, { useState, useEffect } from "react"
import { Menu, X, User, Sun, Moon, Cloud } from "lucide-react"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  // Optional: Persist dark mode preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <header
      className={`w-full shadow-md ${
        isDarkMode
          ? // ダークモード時: 背景を黒、文字色を星のようなカラー（やや黄味がかった色）
            "bg-blue-900 text-yellow-200"
          : // ライトモード時: 背景を水色、文字色を黒に
            "bg-sky-400 text-white"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ヘッダーの左側 */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <Cloud
                className={`h-8 w-8 mr-2 animate-pulse-slow ${
                  isDarkMode ? "text-yellow-200" : "text-white"
                }`}
              />
              <span className="text-2xl font-extrabold">
                ClearSky
              </span>
            </a>
          </div>
          {/* ナビゲーション */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <a
                  href="/"
                  className="hover:opacity-80 transition-colors duration-200 text-lg font-medium"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/forecast"
                  className="hover:opacity-80 transition-colors duration-200 text-lg font-medium"
                >
                  Forecast
                </a>
              </li>
              <li>
                <a
                  href="/maps"
                  className="hover:opacity-80 transition-colors duration-200 text-lg font-medium"
                >
                  Maps
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:opacity-80 transition-colors duration-200 text-lg font-medium"
                >
                  About
                </a>
              </li>
            </ul>
          </nav>
          {/* ヘッダーの右側 */}
          <div className="flex items-center">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200 mr-3"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="h-6 w-6 text-yellow-300" />
              ) : (
                <Moon className="h-6 w-6 text-white" />
              )}
            </button>
            <button
              className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200 mr-3"
              aria-label="User menu"
            >
              <User className="h-6 w-6" />
            </button>
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md hover:bg-white/20 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* モバイルメニュー */}
      <div
        className={`md:hidden transition-max-height duration-300 overflow-hidden ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="/"
            className="block px-4 py-2 rounded-md hover:bg-teal-600 hover:text-white transition-colors duration-200 text-base font-medium"
          >
            Home
          </a>
          <a
            href="/forecast"
            className="block px-4 py-2 rounded-md hover:bg-teal-600 hover:text-white transition-colors duration-200 text-base font-medium"
          >
            Forecast
          </a>
          <a
            href="/maps"
            className="block px-4 py-2 rounded-md hover:bg-teal-600 hover:text-white transition-colors duration-200 text-base font-medium"
          >
            Maps
          </a>
          <a
            href="/about"
            className="block px-4 py-2 rounded-md hover:bg-teal-600 hover:text-white transition-colors duration-200 text-base font-medium"
          >
            About
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
