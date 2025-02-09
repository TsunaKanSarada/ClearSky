import React, { useState, useEffect, useRef } from 'react';

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

// キャラクターのアニメーション画像
const AnimatedImages = ({
  images, 
  speed = 25,
  imageSize = 70,
  happyDuration = 1000,
  collisionPauseDuration = 2500,
  commentMessages = ['こんにちは！', '元気ですか？', 'さようなら！'],
  containerRef, // コンテナの ref を受け取る
  bottomOffset = 0 // 下部の余白（例：フッター分の高さ）
}) => {
  // コンテナのサイズを取得する関数（containerRef が取得できればそのサイズ、なければ window サイズ）
  const getContainerDimensions = () => {
    if (containerRef && containerRef.current) {
      return {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      };
    }
    return { width: window.innerWidth, height: window.innerHeight };
  };

  const [dimensions, setDimensions] = useState(getContainerDimensions);

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getContainerDimensions());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef]);

  // 初期位置の計算では、コンテナのサイズと下部の余白を利用
  const [imageStates, setImageStates] = useState(() =>
    images.map(src => ({
      src,
      x: Math.random() * (getContainerDimensions().width - imageSize),
      y: Math.random() * (getContainerDimensions().height - imageSize - bottomOffset),
      angle: Math.random() * 2 * Math.PI,
      speed: speed,
      isHappy: false,
      happyStart: null,
      collisionPausedUntil: null,
      escapeAngle: null,
      collisionAnimation: null,
      nextTurn: performance.now() + (Math.random() * 7000 + 3000)
    }))
  );

  useEffect(() => {
    let lastTime = performance.now();
    const animate = () => {
      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;
      setImageStates(prevStates => {
        const newStates = prevStates.map(img => {
          if (img.isHappy) {
            if (now - img.happyStart >= happyDuration) {
              return {
                ...img,
                isHappy: false,
                happyStart: null,
                collisionAnimation: null,
                angle: img.escapeAngle !== null ? img.escapeAngle : Math.random() * 2 * Math.PI,
                escapeAngle: null,
                collisionPausedUntil: now + collisionPauseDuration
              };
            }
            return img;
          } else {
            let newCollisionPausedUntil = img.collisionPausedUntil;
            if (img.collisionPausedUntil && now >= img.collisionPausedUntil) {
              newCollisionPausedUntil = null;
            }
            let newAngle = img.angle;
            let newNextTurn = img.nextTurn;
            if (now >= img.nextTurn) {
              let delta = Math.random() * (Math.PI / 2);
              if (Math.random() < 0.5) delta = -delta;
              newAngle = img.angle + delta;
              newNextTurn = now + (Math.random() * 7000 + 3000);
            }
            let newX = img.x + img.speed * Math.cos(newAngle) * (dt / 1000);
            let newY = img.y + img.speed * Math.sin(newAngle) * (dt / 1000);
            // X 座標の境界判定
            if (newX < 0) {
              newX = 0;
              newAngle = Math.PI - newAngle;
            } else if (newX > dimensions.width - imageSize) {
              newX = dimensions.width - imageSize;
              newAngle = Math.PI - newAngle;
            }
            // Y 座標の境界判定（下部は bottomOffset 分余裕を持つ）
            if (newY < 0) {
              newY = 0;
              newAngle = -newAngle;
            } else if (newY > dimensions.height - imageSize - bottomOffset) {
              newY = dimensions.height - imageSize - bottomOffset;
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

        // 衝突判定
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
                const escapeAngle1 = Math.atan2(dy, dx);
                const escapeAngle2 = Math.atan2(-dy, -dx);
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
  }, [dimensions, imageSize, speed, happyDuration, collisionPauseDuration, bottomOffset]);

  return (
    <>
      {imageStates.map((img, index) => (
        <div
          key={index}
          className="absolute"
          style={{ left: img.x, top: img.y, width: imageSize, height: imageSize }}
        >
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

// 家具オブジェクトを表示するコンポーネント
const Furniture = ({ items, imageSize = 100 }) => {
  return (
    <>
      {items.map((item, index) => (
        <img
          key={index}
          src={item.src}
          alt={item.alt}
          style={{
            position: 'absolute',
            left: item.x,
            top: item.y,
            width: imageSize,
            height: 'auto',
            zIndex: 5
          }}
        />
      ))}
    </>
  );
};

// メインコンポーネント
const Chat = () => {
  // コンテナのサイズを取得するための ref を作成
  const containerRef = useRef(null);
  
  const commentMessages = ['こんにちは！', '元気ですか？', 'さようなら！'];
  const images = [
    'images/1.png',
    'https://msp.c.yimg.jp/images/v2/FUTi93tXq405grZVGgDqGx3lkZSjyeBCfNRaWv814q3sjF0XGskROvrQzmV-skw38xPhvOOa8YokQ0h9FkFsJsO7xemoXyeCPviNTbLRJIsWP-KZB2zdOzqLulms2dCKG-Orhs_3m-aHzZqRuktp5xXN4PuvyfgN2gqFMZ3j7i9wvScTSIm_bI3upwCixwKa7PfBGj5h_aBppwZkH7cDhkqB5haO23jB3ObqiBs3IQJGdU1V2-11ttbA9ywa686b9O15wed-1FDFdJG68e6V7ls_bXW-Sl7LCQD7QRipkqx28w0siE5bz1nbsB10FNOt06tOUotJt0Bu0OPtIdPiSfF6SRVIsJ_NbxYiLv_-eMkd5ZGUo8ngQnzUWlr_NeKt7IxdFxrJETr60M5lfrJMN_MT4bzjmvGKJENIfRZBbCbDu8XpqF8ngj74jU2y0SSLFj_imQds3Ts6i7pZrNnQihvjq4bP95vmh82akbpLaecVzeD7r8n4DdoKhTGd4-4vcL0nE0iJv2yN7qcAoscCmuz3wRo-Yf2gaacGZB-3A4ZKgeYWjtt4wdzm6ogbNyECRnVNVdvtdbbWwPcsGuvOm_TtecHnftRQxXSRuvHule5bP211vkpeywkA-0EYqZKsdvMNLIhOW89Z27AddBTTrdOrTlKLSbdAbtDj7SHT4kmDZNRaifXhNCs_BugWVA5o/E381ADE38193E38195E38293-E381BBE381BBE38188E381BFE381AEE8A1A8E68385-1024x1024.png?errorImage=false',
    'https://thumb.ac-illust.com/09/090cd61d1f5d3c8877455f89d1c74713_t.jpeg'
  ];

  // 家具オブジェクトを指定された位置に配置
  const furnitureItems = [
    { src: 'images/sofa.png', alt: 'ソファ', x: '15%', y: '15%' },
    { src: 'images/table.png', alt: 'テーブル', x: '40%', y: '40%' },
    { src: 'images/chair.png', alt: 'チェア', x: '50%', y: '60%' }
  ];

  return (
    // 薄いピンク色をベースに、白い水玉パターンの背景
    // コンテナの div に ref を設定
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundColor: "#ffe4e1",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 15%, transparent 16%), radial-gradient(circle, rgba(255,255,255,0.8) 15%, transparent 16%)",
        backgroundPosition: "0 0, 20px 20px",
        backgroundSize: "40px 40px"
      }}
    >
      {/* 家具オブジェクトレイヤー（静的なオブジェクト） */}
      <Furniture items={furnitureItems} imageSize={120} />
      
      {/* キャラクターなどのアニメーション画像レイヤー */}
      <div className="relative z-10">
        <AnimatedImages 
          images={images} 
          speed={25} 
          imageSize={70} 
          happyDuration={1000} 
          collisionPauseDuration={2500}
          commentMessages={commentMessages}
          containerRef={containerRef}
          bottomOffset={120}
        />
      </div>
      
      <style>
        {`
          @keyframes poyon {
            0%   { transform: scale(1.0) translate(0%, 0%); }
            15%  { transform: scale(0.9) translate(0%, 5%); }
            30%  { transform: scale(1.3) translate(0%, 10%) translateY(-20px); }
            50%  { transform: scale(0.85) translate(0%, -10%); }
            70%  { transform: scale(1.05) translate(0%, 5%); }
            100% { transform: scale(1.0) translate(0%, 0%); }
          }
          .animate-poyon {
            animation: poyon 1.5s ease infinite;
          }
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
          @keyframes collision2 {
            0%   { transform: scale(1); }
            50%  { transform: scale(1.5); }
            100% { transform: scale(1); }
          }
          .animate-collision2 {
            animation: collision2 0.8s ease-in-out;
          }
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
    </div>
  );
};

export default Chat;
