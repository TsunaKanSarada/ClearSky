import React, { useState, useEffect, useRef } from "react";
import { Sun, Moon, User, Cloud } from "lucide-react";
import { signOutUser } from "../service/auth";
import CharacterDropdown from "../components/CharacterDropdown";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState("");

  const userMenuRef = useRef(null);

  // マウント時に現在時刻からダークモードを設定
  useEffect(() => {
    const hour = new Date().getHours();
    // 例: 6時未満、または18時以上はダークモード
    if (hour < 6 || hour >= 18) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  // ダークモードのクラス付与
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // ダークモード切り替え（ボタン用）
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // ユーザーメニュー表示/非表示
  const handleUserMenuToggle = () => {
    setShowUserMenu((prev) => !prev);
  };

  // サインアウト処理
  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      alert(`FAILED SIGNOUT: ${error.message}`);
    }
  };

  // ユーザーメニュー外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`w-full shadow-md ${
        isDarkMode
          ? "bg-blue-900 text-yellow-200" // ダークモード時
          : "bg-sky-400 text-white"        // ライトモード時
      } transition-colors duration-300`}
    >
      {/* ▼ フェードインアニメーション定義 */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}
      </style>
      {/* ▲ */}

      <div className="container mx-auto px-1 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* ヘッダー左側 */}
          <div className="flex items-center">
            <a href="/home" className="flex items-center">
              <Cloud
                className={`h-8 w-8 mr-2 animate-pulse-slow ${
                  isDarkMode ? "text-yellow-200" : "text-white"
                }`}
              />
              <span className="text-xl font-extrabold">ClearSky</span>
            </a>
          </div>

          {/* ヘッダー右側 */}
          <div className="flex items-center relative">
            {/* ダークモード切り替えボタン */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="h-6 w-6 text-yellow-300" />
              ) : (
                <Moon className="h-6 w-6 text-white" />
              )}
            </button>

            {/* ユーザーメニュー */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={handleUserMenuToggle}
                className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                aria-label="User menu"
              >
                <User className="h-6 w-6" />
              </button>
              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-64 
                    bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-900 
                    rounded-2xl shadow-xl py-4 px-4 z-20 animate-fadeIn 
                    backdrop-blur-sm"
                >
                  {/* ▼ キャラクター選択用プルダウン ▼ */}
                  <div className="mb-3">
                    <p className="text-lg mb-2 font-bold text-pink-600 dark:text-pink-300">
                      アシスタントを変更
                    </p>
                    <CharacterDropdown
                      selected={selectedCharacter}
                      onSelect={setSelectedCharacter}
                    />
                  </div>
                  <hr className="my-2 border-pink-200 dark:border-gray-600" />
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2 text-sm font-medium 
                      text-pink-700 dark:text-pink-300 text-left 
                      hover:bg-pink-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  >
                    サインアウト
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
