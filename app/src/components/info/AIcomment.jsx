import React, { useState, useEffect } from "react";

const AIImageWithComment = ({ comment }) => {
  // comment が渡されていなければ空文字列とする
  const fullText = comment || "";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    // comment（fullText）が変わったら表示文字列をリセット
    setDisplayedText("");
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 50); // 50ミリ秒ごとに1文字ずつ表示
    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <div className="flex flex-col items-center w-full h-[27vh] bg-gradient-to-r from-pink-50 to-purple-50">
      {/* 丸い画像 */}
      <div className="w-28 h-28 rounded-full shadow-lg flex items-center justify-center overflow-hidden bg-pink-200 border-4 border-white mt-4">
        <img
          src="images/1.png"  // 画像のパスを適宜指定してください
          alt="AI"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* コメント表示エリア */}
      <div className="flex-grow w-full flex justify-center">
        <div className="bg-white rounded-2xl shadow-md text-sm font-medium text-pink-600 w-[80%] h-full flex items-center justify-center border border-pink-200">
          {displayedText}
        </div>
      </div>
    </div>
  );
};

export default AIImageWithComment;
