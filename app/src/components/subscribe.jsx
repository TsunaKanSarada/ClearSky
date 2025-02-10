import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as dbAPI from "../services/firestoreAPI"; // データ取得/書き込み関数

// キャラクター選択用のカスタムドロップダウンコンポーネント
const CharacterDropdown = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const characters = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleSelect = (num) => {
    onSelect(num);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full inline-block text-left">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center w-full rounded-lg border border-pink-300 shadow-md p-2 bg-pink-100 text-sm font-medium text-pink-700 hover:bg-pink-200 focus:outline-none transition-all"
        >
          {selected ? (
            <img
              src={`images/${selected}.png`}
              alt={`Character ${selected}`}
              className="h-16 w-16 object-contain rounded-full"
            />
          ) : (
            <span>アシスタントを選択</span>
          )}
          {/* ドロップダウン用の下向き矢印アイコン */}
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="absolute mt-2 left-0 right-0 rounded-xl shadow-lg bg-gradient-to-br from-pink-50 to-purple-50 p-2 ring-1 ring-pink-100 animate-fadeIn z-10">
          <div className="grid grid-cols-3 gap-2">
            {characters.map((num) => (
              <button
                key={num}
                onClick={() => handleSelect(num)}
                className="focus:outline-none transform hover:scale-105 transition-all p-1 rounded-lg bg-transparent"
              >
                <img
                  src={`images/${num}.png`}
                  alt={`Character ${num}`}
                  className="h-16 w-16 object-contain rounded-md"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CommentedImageAndProfileSurvey = () => {
  const navigate = useNavigate();

  // フォーム用のステート
  const [name, setName] = useState(''); // ユーザー名
  const [character, setCharacter] = useState('1'); // キャラクター 初期値は1（images/1.png）
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('0'); // 0: 男性, 1: 女性, 2: その他
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [DrinkingHabit, setDrinkingHabit] = useState('0'); // 0: なし, 1: ほぼ毎日, 2: 週に数回, 3: 月に数回
  const [smokingHabit, setSmokingHabit] = useState('0');   // 0: なし, 1: ほぼ毎日, 2: 週に数回, 3: 月に数回

  // handleSubmit 関数を async に変更し、エラーハンドリングを追加
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 入力データのまとめ
    const profileData = {
      name: name,
      character: Number(character),
      birthDate: birthDate ? new Date(birthDate) : null,
      gender: Number(gender),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      DrinkingHabit: Number(DrinkingHabit),
      smokingHabit: Number(smokingHabit),
      registeredAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('送信データ:', profileData);

    try {
      await dbAPI.storeFirstProfile(profileData);
      console.log('プロフィールの登録に成功しました:', profileData);
      // 登録成功後に /daily_question に遷移
      navigate("/daily_question");
    } catch (error) {
      console.error("プロフィールの登録に失敗しました:", error);
    }
  };

  return (
    // 全体背景：パステルカラーのやわらかいグラデーション
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 to-purple-100">
      {/* ▼ アニメーションの定義 */}
      <style>
        {`
          @keyframes bounceOnce {
            0%   { transform: translateY(0); }
            30%  { transform: translateY(-100px); }
            50%  { transform: translateY(0); }
            70%  { transform: translateY(-30px); }
            100% { transform: translateY(0); }
          }
          .animate-bounce-once {
            animation: bounceOnce 1s ease infinite;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}
      </style>
      {/* ▲ ここまで */}

      {/* 画面上部（30%）：選択されたキャラクター画像の表示 */}
      <div className="flex flex-col items-center justify-center pt-6 pb-2">
        <div className="w-full flex justify-center">
          <div className="relative bg-pink-100 rounded-lg p-4">
            <img
              src={`images/${character}.png`}
              alt="Selected Character"
              className="mx-auto w-1/2 max-w-lg rounded-lg animate-bounce-once"
            />
          </div>
        </div>
      </div>

      {/* 画面下部（70%）：フォーム */}
      <div className="h-[70%] flex justify-center items-start overflow-auto">
        <div className="w-full max-w-md mt-4 p-6 bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-4 text-center text-pink-600">
            プロフィールを入力してね♪
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
            {/* キャラクター選択 */}
            <div className="mb-2">
              <label className="block mb-1 font-semibold">アシスタント</label>
              <CharacterDropdown selected={character} onSelect={setCharacter} />
            </div>

            {/* ユーザー名 */}
            <div>
              <label className="block mb-1 font-semibold">ユーザー名</label>
              <input
                type="text"
                className="border border-pink-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 生年月日 */}
            <div>
              <label className="block mb-1 font-semibold">生年月日</label>
              <input
                type="date"
                className="border border-pink-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            {/* 性別 */}
            <div>
              <label className="block mb-1 font-semibold">性別</label>
              <select
                className="border border-pink-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="0">男性</option>
                <option value="1">女性</option>
                <option value="2">その他</option>
              </select>
            </div>

            {/* 身長 */}
            <div>
              <label className="block mb-1 font-semibold">身長(cm)</label>
              <input
                type="number"
                className="border border-pink-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
              />
            </div>

            {/* 体重 */}
            <div>
              <label className="block mb-1 font-semibold">体重(kg)</label>
              <input
                type="number"
                className="border border-pink-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
              />
            </div>

            {/* 飲酒習慣 */}
            <div>
              <label className="block mb-1 font-semibold">飲酒習慣</label>
              <select
                className="border border-pink-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                value={DrinkingHabit}
                onChange={(e) => setDrinkingHabit(e.target.value)}
              >
                <option value="0">なし</option>
                <option value="1">ほぼ毎日</option>
                <option value="2">週に数回</option>
                <option value="3">月に数回</option>
              </select>
            </div>

            {/* 喫煙習慣 */}
            <div>
              <label className="block mb-1 font-semibold">喫煙習慣</label>
              <select
                className="border border-pink-300 rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                value={smokingHabit}
                onChange={(e) => setSmokingHabit(e.target.value)}
              >
                <option value="0">なし</option>
                <option value="1">ほぼ毎日</option>
                <option value="2">週に数回</option>
                <option value="3">月に数回</option>
              </select>
            </div>

            {/* 送信ボタン */}
            <div className="text-center mt-6">
              <button
                type="submit"
                className="bg-pink-500 hover:bg-pink-400 text-white font-medium px-6 py-2 rounded-full shadow-md transition transform active:scale-95"
              >
                登録
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentedImageAndProfileSurvey;
