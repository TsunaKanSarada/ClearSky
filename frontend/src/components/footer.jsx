import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, User } from "lucide-react";

const Footer = () => {
  const location = useLocation();

  const links = [
    { to: "/chat", label: "チャット", icon: FileText },
    { to: "/home", label: "ホーム", icon: Home },
    { to: "/info", label: "インフォ", icon: User },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <nav className="max-w-screen-xl mx-auto px-4 relative">
        <ul className="flex justify-around items-center relative">
          {links.map((link) => {
            const isActive = location.pathname === link.to;

            // ホームボタンは絶対配置してバーから上にはみ出すようにする
            if (link.to === "/home") {
              return (
                <li
                  key={link.to}
                  className="absolute left-1/2 -top-6 transform -translate-x-1/2"
                >
                  <Link
                    to={link.to}
                    className={`
                      flex flex-col items-center justify-center
                      w-16 h-16 
                      rounded-full 
                      shadow-md 
                      border-4
                      ${isActive
                        ? "bg-sky-400 text-white border-sky-400"
                        : "bg-sky-500 text-white border-sky-500 hover:bg-sky-600 hover:border-sky-600"}
                      transition-transform duration-200
                    `}
                  >
                    <link.icon className="w-8 h-8" />
                  </Link>
                </li>
              );
            }

            // サイドリンク（ホーム以外）には、ホームボタンとの間隔を少し広げるためにマージンを追加
            // "/chat" は左側、"/info" は右側に配置される前提です
            const sideMarginClass =
              link.to === "/chat" ? "mr-8" : link.to === "/info" ? "ml-8" : "";

            return (
              <li key={link.to} className={sideMarginClass}>
                <Link
                  to={link.to}
                  className={`flex flex-col items-center p-2 ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <link.icon className="w-8 h-8" />
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
