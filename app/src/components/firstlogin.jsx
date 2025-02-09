import React, { useState } from 'react';

const SleepTimeAndLocation = () => {
  // 睡眠時間（送信データとしては 0～5 の数値）
  // 0: 5時間以下, 1: 6時間, 2: 7時間, 3: 8時間, 4: 9時間, 5: 10時間以上
  const [sleepTime, setSleepTime] = useState(0);
  const sleepOptions = [
    "5時間以下",
    "6時間",
    "7時間",
    "8時間",
    "9時間",
    "10時間以上"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // 送信するデータをまとめる
    const data = {
      sleepTime: sleepTime,
      registeredAt: new Date(),
    };

    // ユーザーの現在位置情報の取得
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          data.location = { latitude, longitude };

          console.log("送信データ:", data);
          // ※ ここにデータベースへの保存処理などを追加してください
        },
        (error) => {
          console.error("位置情報の取得に失敗しました:", error);
          data.location = null;
          console.log("送信データ:", data);
          // ※ エラー時の処理などを追加してください
        }
      );
    } else {
      console.log("Geolocation APIがこのブラウザでサポートされていません。");
      data.location = null;
      console.log("送信データ:", data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-purple-200">
      {/* ヘッダー画像部分 */}
      <div className="mb-6 animate-fadeInSlow">
        {/* 背景と画像の色を同一にするため、背景色はそのままにし、白いボーダー（リング）を追加 */}
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center bg-pink-200 rounded-full ring-4 ring-white">
          <img
            src="images/1.png"
            alt="かわいいイラスト"
            className="w-3/4 h-3/4 object-contain rounded-full animate-bounce-once"
          />
        </div>
      </div>

      {/* フォーム部分 */}
      <div className="w-full max-w-md px-8 py-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl animate-fadeInSlow">
        <h2 className="text-2xl font-bold mb-4 text-pink-600 text-center">
          今日の睡眠はどれくらい？
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 睡眠時間の選択 */}
          <div>
            <div className="flex flex-wrap gap-2 justify-center">
              {sleepOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSleepTime(index)}
                  className={`px-4 py-2 rounded-full border transition-all transform focus:outline-none 
                    ${
                      sleepTime === index
                        ? "bg-pink-400 text-white border-pink-300 shadow-lg scale-105"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-pink-100 hover:border-pink-200"
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* 登録ボタン */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-pink-500 hover:bg-pink-400 text-white font-medium px-8 py-2 rounded-full shadow-md transform transition-all active:scale-95"
            >
              送信
            </button>
          </div>
        </form>
      </div>

      {/* アニメーション用スタイル */}
      <style>
        {`
          /* 1回だけバウンドするアニメーション */
          @keyframes bounceOnce {
            0%   { transform: translateY(0); }
            30%  { transform: translateY(-40px); }
            50%  { transform: translateY(0); }
            70%  { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }
          .animate-bounce-once {
            animation: bounceOnce 1.5s ease-in-out;
          }

          /* ゆっくりフェードインするアニメーション */
          @keyframes fadeInSlow {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          .animate-fadeInSlow {
            animation: fadeInSlow 1.2s ease-in forwards;
          }

          /* ゆっくり回転するアニメーション */
          @keyframes spinSlow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spinSlow 4s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default SleepTimeAndLocation;
