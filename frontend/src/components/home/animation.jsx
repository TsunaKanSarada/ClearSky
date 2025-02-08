// animations.jsx
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { auth } from "../../service/firebase";
import "./animation.css";

const Dashboard = forwardRef((props, ref) => {
  const [user, setUser] = useState(null);

  // 各種アニメーションの state
  const [isBouncing, setIsBouncing] = useState(false);
  const [isJello, setIsJello] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [isWalkingFromBack, setIsWalkingFromBack] = useState(false);
  const [isPoyon, setIsPoyon] = useState(false);
  const [isSulk, setIsSulk] = useState(false);
  const [isAngry, setIsAngry] = useState(false);
  const [isJoy, setIsJoy] = useState(false);
  const [isFear, setIsFear] = useState(false);
  const [isFallingFromTop, setIsFallingFromTop] = useState(false);
  const [isJumpingUp, setIsJumpingUp] = useState(false);
  const [isQuestion, setIsQuestion] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // 各種アニメーションハンドラ
  const handleBounce = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 7000);
  };
  const handleJello = () => {
    setIsJello(true);
    setTimeout(() => setIsJello(false), 7000);
  };
  const handleWalk = () => {
    setIsWalking(true);
    setTimeout(() => setIsWalking(false), 7000);
  };
  const handleWalkFromBack = () => {
    setIsWalkingFromBack(true);
    setTimeout(() => setIsWalkingFromBack(false), 7000);
  };
  const handlePoyon = () => {
    setIsPoyon(true);
    setTimeout(() => setIsPoyon(false), 7000);
  };
  const handleSulk = () => {
    setIsSulk(true);
    setTimeout(() => setIsSulk(false), 7000);
  };
  const handleAngry = () => {
    setIsAngry(true);
    setTimeout(() => setIsAngry(false), 7000);
  };
  const handleJoy = () => {
    setIsJoy(true);
    setTimeout(() => setIsJoy(false), 7000);
  };
  const handleFear = () => {
    setIsFear(true);
    setTimeout(() => setIsFear(false), 7000);
  };
  const handleFallFromTop = () => {
    setIsFallingFromTop(true);
    setTimeout(() => setIsFallingFromTop(false), 7000);
  };
  const handleJumpUp = () => {
    setIsJumpingUp(true);
    setTimeout(() => setIsJumpingUp(false), 7000);
  };
  const handleQuestion = () => {
    setIsQuestion(true);
    setTimeout(() => setIsQuestion(false), 7000);
  };

  // 親コンポーネント(外部)からこれらの関数を呼び出せるようにする
  useImperativeHandle(ref, () => ({
    handleBounce,
    handleJello,
    handleWalk,
    handleWalkFromBack,
    handlePoyon,
    handleSulk,
    handleAngry,
    handleJoy,
    handleFear,
    handleFallFromTop,
    handleJumpUp,
    handleQuestion,
  }));

  // 現在どのアニメーションも実行中でないかを判定する関数
  const isAnyAnimationActive = () =>
    isBouncing ||
    isJello ||
    isWalking ||
    isWalkingFromBack ||
    isPoyon ||
    isSulk ||
    isAngry ||
    isJoy ||
    isFear ||
    isFallingFromTop ||
    isJumpingUp ||
    isQuestion;

  // クリック時にランダムなアニメーション（handleWalk, handleJumpUp, handleFallFromTop を除く）を呼び出す関数
  const handleRandomAnimation = () => {
    // すでにアニメーション中なら何もしない
    if (isAnyAnimationActive()) return;

    const animationHandlers = [
      handleBounce,
      handleJello,
      handlePoyon,
      handleSulk,
      handleAngry,
      handleJoy,
      handleFear,
      handleQuestion,
    ];
    const randomIndex = Math.floor(Math.random() * animationHandlers.length);
    animationHandlers[randomIndex]();
  };

  // コンポーネントがマウントされた際に、up, fall (dawn), walk, backwalk の中からランダムで1つのアニメーションを実行
  useEffect(() => {
    const initialAnimations = [
      handleWalk,
      handleFallFromTop,
      handleJumpUp,
      handleWalkFromBack, // backwalkとして追加
    ];
    const randomIndex = Math.floor(Math.random() * initialAnimations.length);
    initialAnimations[randomIndex]();
  }, []);

  if (!user) return null;

  return (
    <div className="flex flex-col items-center">
      {/* コンテナと画像のサイズを大きく変更 */}
      <div className="w-[90%] h-[45vh] relative">
        <img
          src="/images/1.png"
          alt="Example"
          onClick={handleRandomAnimation}
          className={`
            w-full h-full object-contain
            ${isBouncing ? "animate-bounce-once" : ""}
            ${isJello ? "animate-jello" : ""}
            ${isWalking ? "animate-walk" : ""}
            ${isWalkingFromBack ? "animate-walk-from-back" : ""}
            ${isPoyon ? "animate-poyon" : ""}
            ${isSulk ? "animate-sulk" : ""}
            ${isAngry ? "animate-angry" : ""}
            ${isJoy ? "animate-joy" : ""}
            ${isFear ? "animate-fear" : ""}
            ${isFallingFromTop ? "animate-fall-down" : ""}
            ${isJumpingUp ? "animate-jump-up" : ""}
            ${isQuestion ? "animate-angry6" : ""}
          `}
        />
        {/* 各種状態のオーバーレイ */}
        {isSulk && (
          <div className="absolute top-0 right-0">
            <span className="text-5xl animate-teardrop">💧</span>
          </div>
        )}
        {isAngry && (
          <div className="absolute top-0 right-0">
            <span className="text-5xl animate-angryOverlay">💢</span>
          </div>
        )}
        {(isPoyon || isJoy) && (
          <div className="absolute top-0 right-0">
            <span className="text-5xl animate-sparkle">✨</span>
          </div>
        )}
        {(isJello || isBouncing) && (
          <div className="absolute top-0 right-0">
            <span className="text-5xl animate-pulse">💕</span>
          </div>
        )}
        {isFear && (
          <div className="absolute top-0 right-0">
            <span className="text-5xl animate-sweat">💦</span>
          </div>
        )}
        {isQuestion && (
          <div className="absolute top-0 right-0">
            <span className="text-5xl animate-question">❔</span>
          </div>
        )}
      </div>
    </div>
  );
});

export default Dashboard;
