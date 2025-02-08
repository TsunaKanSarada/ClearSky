import React from "react";

const AIImageWithComment = () => {
  return (
    <div className="flex flex-col items-center h-[28vh]">
      {/* 画像を丸い円形コンテナで囲む */}
      <div className="w-28 h-28 rounded-full shadow flex items-center justify-center overflow-hidden bg-emerald-500">
        <img
          src="images/1.png"  // 画像のパスを指定してください
          alt="AI"
          className="w-24 h-24 object-cover rounded-full"
        />
      </div>

      {/* 新デザインの吹き出し */}
      <div className="relative mt-2">
        {/* 吹き出しのしっぽ（上側に出るように配置） */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full">
          <svg width="16" height="8" viewBox="0 0 16 8" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 0L0 8H16L8 0Z" className="fill-sky-200" />
          </svg>
        </div>
        {/* 固定サイズの吹き出し本体（横を狭く、縦を長く固定） */}
        <div className="bg-sky-200 rounded-xl shadow-lg text-sm font-bold w-60 h-24 flex items-center justify-center text-center mb-2">
          AIのコメント
        </div>
      </div>
    </div>
  );
};

export default AIImageWithComment;
