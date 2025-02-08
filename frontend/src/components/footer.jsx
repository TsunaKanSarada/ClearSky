import React from "react";
import { Link, useLocation } from "react-router-dom";
import assistant from "/images/1.png";
import { Home, Sun } from "lucide-react"; // Home: おうち, Sun: 天気

const Footer = () => {
  const location = useLocation();

  const links = [
    { to: "/chat", label: "チャット", icon: Home },
    { to: "/home", label: "ホーム" },
    { to: "/info", label: "インフォ", icon: Sun },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <nav className="max-w-screen-xl mx-auto relative">
        <ul className="flex justify-around items-center relative">
          {links.map((link) => {
            const isActive = location.pathname === link.to;

            // ホームボタンは中央に配置し、独自のスタイルで表示
            if (link.to === "/home") {
              return (
                <li
                  key={link.to}
                  className="absolute left-1/2 transform -translate-x-1/2"
                >
                  <Link
                    to={link.to}
                    className={`
                      flex flex-col items-center justify-center
                      w-16 h-16
                      rounded-full 
                      shadow-md 
                      border-4
                      ${
                        isActive
                          ? "bg-sky-400 text-white border-sky-400"
                          : "bg-sky-500 text-white border-sky-500 hover:bg-sky-600 hover:border-sky-600"
                      }
                      transition-transform duration-200
                    `}
                  >
                    <img src={assistant} alt="ホーム" className="w-16 h-16" />
                  </Link>
                </li>
              );
            }

            // サイドボタン（/chat, /info）の場合
            const sideMarginClass =
              link.to === "/chat" ? "mr-8" : link.to === "/info" ? "ml-8" : "";

            // icon プロパティからコンポーネントを取得
            const Icon = link.icon;

            return (
              <li key={link.to} className={sideMarginClass}>
                <Link
                  to={link.to}
                  className={`flex flex-col items-center pt-1 ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {Icon && <Icon className="w-9 h-9" aria-label={link.label} />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
