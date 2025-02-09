import React, { useState, useEffect } from "react";

const AIImageWithComment = () => {
  const fullText = "AIのコメント"; // 表示させたい全文字列
  const [displayedText, setDisplayedText] = useState(""); // 現在表示中のテキスト

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      // index 番目までの文字列を表示する
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 50); // 100ミリ秒ごとに文字を追加
    return () => clearInterval(interval); // クリーンアップ
  }, [fullText]);

  return (
    <div className="flex flex-col items-center w-full h-[27vh] bg-gradient-to-r from-pink-50 to-purple-50">
      {/* 画像を丸い円形コンテナで囲む */}
      <div className="w-28 h-28 rounded-full shadow-lg flex items-center justify-center overflow-hidden bg-pink-200 border-4 border-white mt-4">
        <img
          src="images/1.png"  // 画像のパスを指定してください
          alt="AI"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* コメント（flex-growで残りの高さを埋め、下端まで広がるようにする） */}
      <div className="flex-grow w-full flex justify-center">
        <div className="bg-white rounded-2xl shadow-md text-sm font-medium text-pink-600 w-[80%] h-full flex items-center justify-center border border-pink-200">
          {displayedText}
        </div>
      </div>
    </div>
  );
};

export default AIImageWithComment;
