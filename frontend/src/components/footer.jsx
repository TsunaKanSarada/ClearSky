import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, User } from "lucide-react";

const Footer = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "ホーム", icon: Home },
    { to: "/about", label: "About", icon: FileText },
    { to: "/profile", label: "プロフィール", icon: User },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
      <nav className="max-w-screen-xl mx-auto px-4">
        <ul className="flex justify-around items-center">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex flex-col items-center p-2 ${
                    isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
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
