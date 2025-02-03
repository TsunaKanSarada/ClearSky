import React, { useState, useEffect } from "react"
import { Sun, Moon, User, Cloud } from "lucide-react"

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

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
          ? "bg-blue-900 text-yellow-200" // ダークモード時: 背景を黒、文字色を星のようなカラー（やや黄味がかった色）
          : "bg-sky-400 text-white" // ライトモード時: 背景を水色、文字色を黒に
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ヘッダーの左側 */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <Cloud
                className={`h-10 w-10 mr-2 animate-pulse-slow ${
                  isDarkMode ? "text-yellow-200" : "text-white"
                }`}
              />
              <span className="text-3xl font-extrabold">
                ClearSky
              </span>
            </a>
          </div>
          {/* ヘッダーの右側 */}
          <div className="flex items-center">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="h-8 w-8 text-yellow-300" />
              ) : (
                <Moon className="h-8 w-8 text-white" />
              )}
            </button>
            <button
              className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200 "
              aria-label="User menu"
            >
              <User className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header