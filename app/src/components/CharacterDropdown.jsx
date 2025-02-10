import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const CharacterDropdown = ({ selected, onSelect, characters = [1, 2, 3, 4, 5, 6, 7, 8] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ドロップダウン外をクリックしたときに閉じる処理
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (num) => {
    onSelect(num);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-3 py-2 border border-pink-300 bg-pink-100 rounded-full shadow-md text-pink-700 hover:bg-pink-200 transition-all focus:outline-none"
      >
        {selected ? (
          <img
            src={`/images/${selected}.png`}
            alt={`Character ${selected}`}
            className="h-12 w-12 object-cover rounded-full border-2 border-white"
          />
        ) : (
          <span className="text-sm font-medium">アシスタント選択</span>
        )}
        <svg
          className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute mt-2 left-0 right-0 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg ring-1 ring-pink-100 animate-fadeIn z-10 backdrop-blur-sm">
          <div className="grid grid-cols-4 gap-2">
            {characters.map((num) => (
              <button
                key={num}
                onClick={() => handleSelect(num)}
                className="focus:outline-none transform hover:scale-110 transition-all h-12 w-12 rounded-full bg-transparent"
              >
                <img
                  src={`/images/${num}.png`}
                  alt={`Character ${num}`}
                  className="h-12 w-12 object-cover rounded-full"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

CharacterDropdown.propTypes = {
  selected: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  characters: PropTypes.arrayOf(PropTypes.number),
};

export default CharacterDropdown;
