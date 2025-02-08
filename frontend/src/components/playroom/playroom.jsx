
import React, { useState, useEffect } from 'react';

// 吹き出しコンポーネント（指定したメッセージを順次表示）
const SpeechBubble = ({ messages, interval = 3000, className = '' }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % messages.length);
    }, interval);
    return () => clearInterval(timer);
  }, [messages, interval]);

  return (
    <div className={`bg-white w-40 py-2 rounded-lg shadow-md text-sm text-pink-500 ${className} text-center`}>
      {messages[index]}
    </div>
  );
};

// 複数画像の状態を一括管理するコンポーネント
const AnimatedImages = ({
  images, 
  speed = 25,         // 1秒あたりの移動ピクセル数
  imageSize = 70,      // px 単位（Tailwind の w-24,h-24 と同等）
  happyDuration = 1000,    // 衝突時の喜び状態の持続時間（ms）
  collisionPauseDuration = 2500,  // happy 状態終了後、衝突判定を一時停止する期間（ms）
  commentMessages = ['こんにちは！', '元気ですか？', 'さようなら！'] // 吹き出しのメッセージ
}) => {
  // 画面サイズ（リサイズに対応）
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 各画像の初期状態。nextTurn は3～10秒後にランダムな角度変更を行うタイミング
  const [imageStates, setImageStates] = useState(() =>
    images.map(src => ({
      src,
      x: Math.random() * (window.innerWidth - imageSize),
      y: Math.random() * (window.innerHeight - imageSize),
      angle: Math.random() * 2 * Math.PI, // 0～2π のランダム角度
      speed: speed,
      isHappy: false,         // 衝突時に一時的に true にする
      happyStart: null,       // happy 状態開始時刻（ms）
      collisionPausedUntil: null,  // 衝突判定を一時停止する期限（ms）
      escapeAngle: null,      // 衝突後に歩いて離れる方向（ラジアン）
      collisionAnimation: null, // 衝突時のアニメーションクラス（後でランダム設定）
      nextTurn: performance.now() + (Math.random() * 7000 + 3000) // 次のランダムターンのタイミング（3～10秒後）
    }))
  );

  useEffect(() => {
    let lastTime = performance.now();
    const animate = () => {
      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;
      setImageStates(prevStates => {
        // 各画像の状態更新
        const newStates = prevStates.map(img => {
          if (img.isHappy) {
            // happy 状態中は移動停止。happyDuration 経過後に通常状態へ戻す
            if (now - img.happyStart >= happyDuration) {
              return {
                ...img,
                isHappy: false,
                happyStart: null,
                collisionAnimation: null, // 衝突アニメーションの解除
                // escapeAngle があればその方向に、なければランダムな方向に切替え
                angle: img.escapeAngle !== null ? img.escapeAngle : Math.random() * 2 * Math.PI,
                escapeAngle: null,
                collisionPausedUntil: now + collisionPauseDuration
              };
            }
            return img;
          } else {
            // collisionPausedUntil が設定され、まだその期間内ならそのまま
            let newCollisionPausedUntil = img.collisionPausedUntil;
            if (img.collisionPausedUntil && now >= img.collisionPausedUntil) {
              newCollisionPausedUntil = null;
            }
            // 通常移動中：一定間隔でランダムに角度を変更（3～10秒ごと）
            let newAngle = img.angle;
            let newNextTurn = img.nextTurn;
            if (now >= img.nextTurn) {
              // 0～90°のランダムな角度変化（左右どちらかの方向）
              let delta = Math.random() * (Math.PI / 2);
              if (Math.random() < 0.5) delta = -delta;
              newAngle = img.angle + delta;
              newNextTurn = now + (Math.random() * 7000 + 3000); // 次回は3～10秒後
            }
            // 位置更新（新しい角度で移動）
            let newX = img.x + img.speed * Math.cos(newAngle) * (dt / 1000);
            let newY = img.y + img.speed * Math.sin(newAngle) * (dt / 1000);
            // 画面境界で反射（バウンド）
            if (newX < 0) {
              newX = 0;
              newAngle = Math.PI - newAngle;
            } else if (newX > dimensions.width - imageSize) {
              newX = dimensions.width - imageSize;
              newAngle = Math.PI - newAngle;
            }
            if (newY < 0) {
              newY = 0;
              newAngle = -newAngle;
            } else if (newY > dimensions.height - imageSize) {
              newY = dimensions.height - imageSize;
              newAngle = -newAngle;
            }
            return { 
              ...img, 
              x: newX, 
              y: newY, 
              angle: newAngle, 
              collisionPausedUntil: newCollisionPausedUntil,
              nextTurn: newNextTurn
            };
          }
        });

        // 衝突判定（collisionPaused 中でない画像同士）
        // 衝突時は、3種類のアニメーションのうちランダムなものを割り当てる
        const randomCollisionAnimation = () => {
          const animations = ['animate-collision1', 'animate-collision2', 'animate-collision3'];
          return animations[Math.floor(Math.random() * animations.length)];
        };

        for (let i = 0; i < newStates.length; i++) {
          for (let j = i + 1; j < newStates.length; j++) {
            const img1 = newStates[i];
            const img2 = newStates[j];
            if ((img1.collisionPausedUntil && now < img1.collisionPausedUntil) ||
                (img2.collisionPausedUntil && now < img2.collisionPausedUntil)) {
              continue;
            }
            if (!img1.isHappy && !img2.isHappy) {
              const center1X = img1.x + imageSize / 2;
              const center1Y = img1.y + imageSize / 2;
              const center2X = img2.x + imageSize / 2;
              const center2Y = img2.y + imageSize / 2;
              const dx = center1X - center2X;
              const dy = center1Y - center2Y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < imageSize) {
                // 衝突発生 → 各画像の逃げる方向を計算し、ランダムな衝突アニメーションを設定
                const escapeAngle1 = Math.atan2(dy, dx);   // img1は img2 から離れる方向
                const escapeAngle2 = Math.atan2(-dy, -dx);   // img2は img1 から離れる方向
                newStates[i] = { 
                  ...img1, 
                  isHappy: true, 
                  happyStart: now, 
                  escapeAngle: escapeAngle1,
                  collisionAnimation: randomCollisionAnimation()
                };
                newStates[j] = { 
                  ...img2, 
                  isHappy: true, 
                  happyStart: now, 
                  escapeAngle: escapeAngle2,
                  collisionAnimation: randomCollisionAnimation()
                };
              }
            }
          }
        }
        return newStates;
      });
      requestAnimationFrame(animate);
    };
    const animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions, imageSize, speed, happyDuration, collisionPauseDuration]);

  return (
    <>
      {imageStates.map((img, index) => (
        // 各キャラクターを包むコンテナ（位置はキャラクターの左上座標）
        <div
          key={index}
          className="absolute"
          style={{ left: img.x, top: img.y, width: imageSize, height: imageSize }}
        >
          {/* 吹き出しをキャラクターの上に配置 */}
          <SpeechBubble 
            messages={commentMessages}
            interval={3000}
            className="transform -translate-x-1/3"
          />
          <img
            src={img.src}
            alt=""
            className={`transition-transform duration-500 ${
              img.isHappy
                ? (img.collisionAnimation || 'scale-150')
                : 'scale-100 animate-poyon'
            }`}
            style={{
              width: imageSize,
              height: imageSize
            }}
          />
        </div>
      ))}
    </>
  );
};

// メインコンポーネント
const Chat = () => {
  const commentMessages = ['こんにちは！', '元気ですか？', 'さようなら！'];
  const images = [
    'images/1.png',
    'https://msp.c.yimg.jp/images/v2/FUTi93tXq405grZVGgDqGx3lkZSjyeBCfNRaWv814q3sjF0XGskROvrQzmV-skw38xPhvOOa8YokQ0h9FkFsJsO7xemoXyeCPviNTbLRJIsWP-KZB2zdOzqLulms2dCKG-Orhs_3m-aHzZqRuktp5xXN4PuvyfgN2gqFMZ3j7i9wvScTSIm_bI3upwCixwKa7PfBGj5h_aBppwZkH7cDhkqB5haO23jB3ObqiBs3IQJGdU1V2-11ttbA9ywa686b9O15wed-1FDFdJG68e6V7ls_bXW-Sl7LCQD7QRipkqx28w0siE5bz1nbsB10FNOt06tOUotJt0Bu0OPtIdPiSfF6SRVIsJ_NbxYiLv_-eMkd5ZGUo8ngQnzUWlr_NeKt7IxdFxrJETr60M5lfrJMN_MT4bzjmvGKJENIfRZBbCbDu8XpqF8ngj74jU2y0SSLFj_imQds3Ts6i7pZrNnQihvjq4bP95vmh82akbpLaecVzeD7r8n4DdoKhTGd4-4vcL0nE0iJv2yN7qcAoscCmuz3wRo-Yf2gaacGZB-3A4ZKgeYWjtt4wdzm6ogbNyECRnVNVdvtdbbWwPcsGuvOm_TtecHnftRQxXSRuvHule5bP211vkpeywkA-0EYqZKsdvMNLIhOW89Z27AddBTTrdOrTlKLSbdAbtDj7SHT4kmDZNRaifXhNCs_BugWVA5o/E381ADE38193E38195E38293-E381BBE381BBE38188E381BFE381AEE8A1A8E68385-1024x1024.png?errorImage=false',
    'https://thumb.ac-illust.com/09/090cd61d1f5d3c8877455f89d1c74713_t.jpeg'
  ];

  return (
    <div className="relative w-full h-screen bg-[url('https://aomaterial.com/wp-content/uploads/2024/06/cfbb2be920e3fce05ad2f650e22d713f.png')] overflow-hidden ">
      <style>
        {`
          @keyframes poyon {
            0%   { transform: scale(1.0) translate(0%, 0%); }
            15%  { transform: scale(0.9) translate(0%, 5%); }
            30%  { 
                  /* 複数の transform 指定がある場合は、最終的な指定が有効になります */
                  transform: scale(1.3) translate(0%, 10%) translateY(-20px); 
                }
            50%  { transform: scale(0.85) translate(0%, -10%); }
            70%  { transform: scale(1.05) translate(0%, 5%); }
            100% { transform: scale(1.0) translate(0%, 0%); }
          }
          .animate-poyon {
            animation: poyon 1.5s ease infinite;
          }
          /* 衝突時のアニメーションバリエーション１：シェイク＋回転 */
          @keyframes collision1 {
            0%   { transform: scale(1.2) rotate(0deg); }
            25%  { transform: scale(1.3) rotate(5deg); }
            50%  { transform: scale(1.2) rotate(-5deg); }
            75%  { transform: scale(1.3) rotate(5deg); }
            100% { transform: scale(1.2) rotate(0deg); }
          }
          .animate-collision1 {
            animation: collision1 0.8s ease-in-out;
          }
          /* 衝突時のアニメーションバリエーション２：バウンス */
          @keyframes collision2 {
            0%   { transform: scale(1); }
            50%  { transform: scale(1.5); }
            100% { transform: scale(1); }
          }
          .animate-collision2 {
            animation: collision2 0.8s ease-in-out;
          }
          /* 衝突時のアニメーションバリエーション３：左右ウィグル */
          @keyframes collision3 {
            0%   { transform: translateX(0); }
            25%  { transform: translateX(-10px); }
            50%  { transform: translateX(10px); }
            75%  { transform: translateX(-10px); }
            100% { transform: translateX(0); }
          }
          .animate-collision3 {
            animation: collision3 0.8s ease-in-out;
          }
        `}
      </style>
      <AnimatedImages 
        images={images} 
        speed={25} 
        imageSize={70} 
        happyDuration={1000} 
        collisionPauseDuration={2500}
        commentMessages={commentMessages}
      />
    </div>
  );
};

export default Chat;
