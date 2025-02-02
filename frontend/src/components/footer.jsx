import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, User } from "lucide-react";

const Footer = () => {
  const location = useLocation();

  const links = [
    { to: "/chat", label: "chat", icon: FileText },
    { to: "/home", label: "ホーム", icon: Home },
    { to: "/info", label: "infomation", icon: User },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
      <nav className="max-w-screen-xl mx-auto px-4">
        {/* relative を指定して、ホームボタンを浮かせて配置しやすくする */}
        <ul className="flex justify-around items-center relative">
          {links.map((link) => {
            const isActive = location.pathname === link.to;

            // ホームボタンを特別にスタイリング
            if (link.to === "/") {
              return (
                <li key={link.to} className="relative">
                  <Link
                    to={link.to}
                    className={`
                      flex flex-col items-center
                      w-14 h-14 
                      rounded-full 
                      shadow-md 
                      border-4 border-white 
                      ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }
                      /* ボタンを少し上に浮かせる */
                      -translate-y-3
                      flex justify-center items-center
                      transition-transform duration-200
                    `}
                  >
                    <link.icon className="w-6 h-6" />
                    {/* ホームだけはラベルを表示する or 非表示はお好みで */}
                    <span className="text-xs mt-1">{link.label}</span>
                  </Link>
                </li>
              );
            }

            // ホーム以外（About, Profile）は普通のスタイル
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex flex-col items-center p-2 ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <link.icon className="w-6 h-6" />
                  <span className="text-xs mt-1">{link.label}</span>
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
