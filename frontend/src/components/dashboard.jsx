// Dashboard.js
import { signOutUser } from "../service/auth";
import { useState, useEffect } from "react";
import { auth } from "../service/firebase";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  const [rotation, setRotation] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isJello, setIsJello] = useState(false);
  // 追加のアニメーション用 state
  const [isShake, setIsShake] = useState(false);
  const [isZoom, setIsZoom] = useState(false);
  const [isSpin, setIsSpin] = useState(false);
  const [isSqueeze, setIsSqueeze] = useState(false);
  const [isBounceIn, setIsBounceIn] = useState(false);
  // 新規追加：横から歩くアニメーション用 state
  const [isWalking, setIsWalking] = useState(false);
  // 新規追加：奥から歩いてくるアニメーション用 state
  const [isWalkingFromBack, setIsWalkingFromBack] = useState(false);
  // 新規追加：ふわふわ浮遊アニメーション用 state
  const [isFuwafuwa, setIsFuwafuwa] = useState(false);
  // 新規追加：poyonアニメーション用 state
  const [isPoyon, setIsPoyon] = useState(false);
  // 新規追加：mochimochiアニメーション用 state
  const [isMochimochi, setIsMochimochi] = useState(false);

  // 新規追加：悲しそうなアニメーション（画像が落ち込む）のみ
  const [isSulk, setIsSulk] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      alert(`FAILED SIGNOUT: ${error.message}`);
    }
  };

  // 既存のアニメーションハンドラ
  const handleRotate = () => {
    setRotation((prev) => prev + 360);
  };

  const handleBounce = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 5000);
  };

  const handlePulse = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 3000);
  };

  const handleWiggle = () => {
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 1500);
  };

  const handleFlip = () => {
    setIsFlipping(true);
    setTimeout(() => setIsFlipping(false), 1000);
  };

  const handleJello = () => {
    setIsJello(true);
    setTimeout(() => setIsJello(false), 1500);
  };

  const handleShake = () => {
    setIsShake(true);
    setTimeout(() => setIsShake(false), 1500);
  };

  const handleZoom = () => {
    setIsZoom(true);
    setTimeout(() => setIsZoom(false), 800);
  };

  const handleSpin = () => {
    setIsSpin(true);
    setTimeout(() => setIsSpin(false), 1000);
  };

  const handleSqueeze = () => {
    setIsSqueeze(true);
    setTimeout(() => setIsSqueeze(false), 500);
  };

  const handleBounceIn = () => {
    setIsBounceIn(true);
    setTimeout(() => setIsBounceIn(false), 800);
  };

  const handleWalk = () => {
    setIsWalking(true);
    setTimeout(() => setIsWalking(false), 2000);
  };

  const handleWalkFromBack = () => {
    setIsWalkingFromBack(true);
    setTimeout(() => setIsWalkingFromBack(false), 3000);
  };

  const handleFuwafuwa = () => {
    setIsFuwafuwa(true);
    setTimeout(() => setIsFuwafuwa(false), 2000);
  };

  const handlePoyon = () => {
    setIsPoyon(true);
    setTimeout(() => setIsPoyon(false), 1500);
  };

  const handleMochimochi = () => {
    setIsMochimochi(true);
    setTimeout(() => setIsMochimochi(false), 1500);
  };

  // 新規追加：画像が落ち込む（sulk）アニメーションハンドラ
  // このハンドラ実行時、画像自体に落ち込むアニメーションを適用し、
  // 同時に画像の右上にがっかりするアニメーションを表示します
  const handleSulk = () => {
    setIsSulk(true);
    setTimeout(() => setIsSulk(false), 2000);
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center p-4">
      {/* CSSアニメーション定義 */}
      <style>
        {`
          /* 既存のアニメーション */
          @keyframes bounceOnce {
            0% { transform: translateY(0); }
            30% { transform: translateY(-100px); }
            50% { transform: translateY(0); }
            70% { transform: translateY(-30px); }
            100% { transform: translateY(0); }
          }
          .animate-bounce-once {
            animation: bounceOnce 1s ease;
            animation-iteration-count: 5;
          }
          @keyframes pulseCute {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          .animate-pulse-cute {
            animation: pulseCute 1s ease;
            animation-iteration-count: 3;
          }
          @keyframes wiggle {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          .animate-wiggle {
            animation: wiggle 0.5s ease-in-out;
            animation-iteration-count: 3;
          }
          @keyframes flip {
            0% { transform: perspective(400px) rotateY(0deg); }
            50% { transform: perspective(400px) rotateY(180deg); }
            100% { transform: perspective(400px) rotateY(360deg); }
          }
          .animate-flip {
            animation: flip 1s ease;
          }
          @keyframes jelloAnim {
            0% { transform: none; }
            30% { transform: skewX(12deg) skewY(12deg); }
            40% { transform: skewX(-12deg) skewY(-12deg); }
            50% { transform: skewX(10deg) skewY(10deg); }
            60% { transform: skewX(-10deg) skewY(-10deg); }
            70% { transform: skewX(8deg) skewY(8deg); }
            80% { transform: skewX(-8deg) skewY(-8deg); }
            90% { transform: skewX(6deg) skewY(6deg); }
            100% { transform: none; }
          }
          .animate-jello {
            animation: jelloAnim 1.5s ease;
          }
          /* 追加アニメーション */
          @keyframes shake {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(5deg); }
            50% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
            100% { transform: rotate(0deg); }
          }
          .animate-shake {
            animation: shake 0.5s ease;
            animation-iteration-count: 3;
          }
          @keyframes zoomAnim {
            0% { transform: scale(1); }
            50% { transform: scale(1.5); }
            100% { transform: scale(1); }
          }
          .animate-zoom {
            animation: zoomAnim 0.8s ease;
          }
          @keyframes spinAnim {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-spin {
            animation: spinAnim 1s linear;
          }
          @keyframes squeezeAnim {
            0% { transform: scaleX(1); }
            50% { transform: scaleX(0.7); }
            100% { transform: scaleX(1); }
          }
          .animate-squeeze {
            animation: squeezeAnim 0.5s ease;
          }
          @keyframes bounceInAnim {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); opacity: 1; }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); }
          }
          .animate-bouncein {
            animation: bounceInAnim 0.8s ease;
          }
          /* キャラクターが横から歩くアニメーション */
          @keyframes walkAnim {
            0% { transform: translateX(-200%) translateY(0); opacity: 0; }
            25% { transform: translateX(-150%) translateY(-10px); opacity: 0.5; }
            50% { transform: translateX(-100%) translateY(0); opacity: 1; }
            75% { transform: translateX(-50%) translateY(10px); opacity: 1; }
            100% { transform: translateX(0) translateY(0); opacity: 1; }
          }
          .animate-walk {
            animation: walkAnim 2s ease;
          }
          /* キャラクターが奥からこちらに歩いてくるアニメーション */
          @keyframes walkFromBackAnim {
            0% {
              transform: perspective(800px) translateZ(-300px) scale(0.3) translateY(100px);
              opacity: 0;
            }
            30% {
              transform: perspective(800px) translateZ(-225px) scale(0.5) translateY(-50px);
              opacity: 0.5;
            }
            50% {
              transform: perspective(800px) translateZ(-150px) scale(0.7) translateY(50px);
              opacity: 0.7;
            }
            70% {
              transform: perspective(800px) translateZ(-75px) scale(0.9) translateY(-50px);
              opacity: 0.9;
            }
            100% {
              transform: perspective(800px) translateZ(0) scale(1) translateY(0);
              opacity: 1;
            }
          }
          .animate-walk-from-back {
            animation: walkFromBackAnim 3s ease;
          }
          /* ふわふわ浮遊アニメーション */
          @keyframes fuwafuwa {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-30px); }
            100% { transform: translateY(0px); }
          }
          .animate-fuwafuwa {
            animation: fuwafuwa 2s ease;
          }
          /* poyonアニメーション */
          @keyframes poyon {
            0%   { transform: scale(1.0, 1.0) translate(0%, 0%); }
            15%  { transform: scale(0.9, 0.9) translate(0%, 5%); }
            30%  { 
                    transform: scale(1.3, 0.8) translate(0%, 10%);
                    transform: translateY(-50px); 
                }
            50%  { transform: scale(0.8, 1.3) translate(0%, -10%); }
            70%  { transform: scale(1.1, 0.9) translate(0%, 5%); }
            100% { transform: scale(1.0, 1.0) translate(0%, 0%); }
          }
          .animate-poyon {
            animation: poyon 1.5s ease;
          }
          /* mochimochiアニメーション */
          @keyframes mochimochi {
            0% {
              transform: scale(1, 0.8);
            }
            20% {
              transform: scale(0.8, 1.1);
            }
            90% {
              transform: scale(1, 1);
            }
            100% {
              transform: scale(1, 0.8);
            }
          }
          .animate-mochimochi {
            animation: mochimochi 1.5s ease;
          }
          /* 画像が落ち込むアニメーション */
          @keyframes sulkAnim {
            0% { transform: translateY(0); opacity: 1; }
            50% { transform: translateY(30px); opacity: 0.6; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-sulk {
            animation: sulkAnim 2s ease;
          }
          /* がっかりするアニメーション（画像右上に表示） */
          @keyframes disappointedAnim {
            0% { opacity: 0; transform: translate(10px, -10px); }
            50% { opacity: 1; transform: translate(0, 0); }
            100% { opacity: 0; transform: translate(10px, -10px); }
          }
          .animate-disappointed {
            animation: disappointedAnim 2s ease;
          }
        `}
      </style>

      {/* 画像を含む外側コンテナ（relative指定でオーバーレイ要素の基準にする） */}
      <div
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: "transform 0.5s ease"
        }}
        className="w-64 h-auto relative"
      >
        <img
          src="/images/AI.png"
          alt="Example"
          className={`w-full h-auto
            ${isBouncing ? "animate-bounce-once" : ""} 
            ${isPulsing ? "animate-pulse-cute" : ""} 
            ${isWiggling ? "animate-wiggle" : ""} 
            ${isFlipping ? "animate-flip" : ""} 
            ${isJello ? "animate-jello" : ""} 
            ${isShake ? "animate-shake" : ""} 
            ${isZoom ? "animate-zoom" : ""} 
            ${isSpin ? "animate-spin" : ""} 
            ${isSqueeze ? "animate-squeeze" : ""} 
            ${isBounceIn ? "animate-bouncein" : ""}
            ${isWalking ? "animate-walk" : ""}
            ${isWalkingFromBack ? "animate-walk-from-back" : ""}
            ${isFuwafuwa ? "animate-fuwafuwa" : ""}
            ${isPoyon ? "animate-poyon" : ""}
            ${isMochimochi ? "animate-mochimochi" : ""}
            ${isSulk ? "animate-sulk" : ""}
          `}
        />
        {/* がっかりするアニメーション（画像の右上に表示） */}
        {isSulk && (
          <div className="absolute top-0 right-0">
            <span className="animate-disappointed text-6xl">🌧</span>
          </div>
        )}
      </div>

      {/* ボタン群 */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        <button onClick={handleRotate} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200">
          画像を回転
        </button>
        <button onClick={handleBounce} className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors duration-200">
          画像を跳ねる
        </button>
        <button onClick={handlePulse} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors duration-200">
          画像をパルス
        </button>
        <button onClick={handleWiggle} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-200">
          画像を揺らす
        </button>
        <button onClick={handleFlip} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200">
          画像を反転
        </button>
        <button onClick={handleJello} className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors duration-200">
          画像をジェロ
        </button>
        <button onClick={handleShake} className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors duration-200">
          画像をシェイク
        </button>
        <button onClick={handleZoom} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors duration-200">
          画像をズーム
        </button>
        <button onClick={handleSpin} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200">
          画像をスピン
        </button>
        <button onClick={handleSqueeze} className="px-4 py-2 bg-lime-500 text-white rounded hover:bg-lime-600 transition-colors duration-200">
          画像をスクイーズ
        </button>
        <button onClick={handleBounceIn} className="px-4 py-2 bg-fuchsia-500 text-white rounded hover:bg-fuchsia-600 transition-colors duration-200">
          画像をバウンスイン
        </button>
        <button onClick={handleWalk} className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors duration-200">
          キャラクターが歩く
        </button>
        <button onClick={handleWalkFromBack} className="px-4 py-2 bg-magenta-500 text-white rounded hover:bg-magenta-600 transition-colors duration-200">
          キャラクターが奥から歩く（跳ねる）
        </button>
        <button onClick={handleFuwafuwa} className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 transition-colors duration-200">
          画像をふわふわ
        </button>
        <button onClick={handlePoyon} className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors duration-200">
          画像をポヨン
        </button>
        <button onClick={handleMochimochi} className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600 transition-colors duration-200">
          画像をもちもち
        </button>
        <button onClick={handleSignOut} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">
          サインアウト
        </button>
        {/* 画像が落ち込むボタン */}
        <button onClick={handleSulk} className="px-4 py-2 bg-darkslategray text-white rounded hover:bg-darkslategray transition-colors duration-200">
          画像が落ち込む
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
