import React, { useState, useEffect, useRef } from 'react';

// 吹き出しコンポーネント（指定したメッセージをランダムに表示）
const SpeechBubble = ({ messages, interval = 3000, className = '' }) => {
  // 初回表示もランダムなメッセージにする
  const [index, setIndex] = useState(() => Math.floor(Math.random() * messages.length));

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(() => Math.floor(Math.random() * messages.length));
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
  // 100個分のメッセージ（必要に応じてここを編集できます）
  commentMessages = [
    "冬の朝、キラキラ雪が笑顔を運んでくるよ！",
    "寒い日も、ポカポカハートで元気いっぱいだよ！",
    "雪の結晶みたいに、あなたはキラリ輝いてるよ！",
    "冬風がふんわり、幸せのメロディーを奏でるよ！",
    "星空の下、夢がポンポン広がっちゃうよ！",
    "こたつでホッと、ほっこりタイムを楽しもう！",
    "冬の夜は、キラキラ星でいっぱいだよ！",
    "雪だるまみたいな笑顔で、今日も元気モリモリだよ！",
    "寒さなんてへっちゃら、心はいつもホットだよ！",
    "朝日がパッと、あなたの笑顔を照らすよ！",
    "雪舞う季節、キュンとする瞬間がいっぱいだよ！",
    "ふわふわ雪みたいに、心も柔らかにね！",
    "冬風がエールを送って、元気をくれるよ！",
    "寒い日も、温もりあふれる笑顔でね！",
    "星がキラリ、夢がふわっと叶いそうだよ！",
    "冬の空が、あなたの輝きをさらに引き出すよ！",
    "雪のパウダーで、心もおしゃれに輝くよ！",
    "寒さも楽しく、ポカポカハートで乗り切ろう！",
    "冬景色が、元気プラスのパワーをくれるよ！",
    "こたつの温もりで、心もぽかぽかになるね！",
    "雪の魔法で、笑顔がキュンと輝くよ！",
    "冬風に乗って、元気な一歩を踏み出そうよ！",
    "寒い日も、笑顔でふわっと包み込もうね！",
    "星空が、あなたの未来を明るく照らしてくれるよ！",
    "雪の煌めきに、心がときめいちゃうよ！",
    "寒さも笑顔で、跳ね返しちゃおう！",
    "冬の朝は、キラリと輝く宝物だよ！",
    "雪の結晶みたいに、あなたは特別だよ！",
    "冬風が、幸せのメロディーを運んでくるよ！",
    "星がポンと輝く夜、夢が溢れ出すよ！",
    "こたつでまったり、元気いっぱいのひとときをね！",
    "冬の空気が、笑顔をホットにしてくれるよ！",
    "雪舞う日、心が踊るハッピータイムだよ！",
    "寒い日も、温かハートがオーラみたいに輝くよ！",
    "冬の夜空に、笑顔がぎゅっと詰まってるよ！",
    "雪の結晶のように、あなたはピカピカだよ！",
    "冬風にのって、笑顔がスイスイ広がるよ！",
    "寒さも忘れちゃう、ポカポカ楽しい日々だよ！",
    "朝日が明るい未来を、キラリ照らすよ！",
    "雪のパウダーが、元気な気持ちを運んできてくれるよ！",
    "寒い季節も、心はいつもぽかぽか元気だよ！",
    "冬の星たちが、夢のプレゼントを届けるよ！",
    "こたつの中は、笑顔と温もりでいっぱいだよ！",
    "雪の音が、ハートにポンと響いちゃうね！",
    "冬風が、エネルギーをふんわり包むよ！",
    "寒さも元気に変えて、今日も笑顔でいこう！",
    "冬の夜は、星がキラリお祝いしてるよ！",
    "雪だるまみたいに、あなたもニコニコ輝くよ！",
    "寒い朝でも、心はホッと温かいよね！",
    "冬景色が、ハッピーを届けてくれるよ！",
    "こたつでほっこり、笑顔がパッと広がるよ！",
    "雪の結晶が、あなたの輝きをそっと包むよ！",
    "冬風が、ポカポカ夢を運んでくるよ！",
    "寒い日も、元気な笑顔でキラリ輝こう！",
    "冬の星空が、心をキラキラさせるよ！",
    "雪のパウダーで、楽しい一日が始まるよ！",
    "冬の朝は、希望がぽかぽか広がるよ！",
    "寒さなんて、笑顔でスッと消えちゃうよ！",
    "冬風が、元気のリズムを奏でるよ！",
    "こたつでリラックス、笑顔がニコニコ輝くよ！",
    "雪の結晶みたいに、あなたの個性が光るよ！",
    "冬夜に、夢がふんわり舞い上がるよ！",
    "寒い日も、心はホットで輝いてるよ！",
    "冬の星が、あなたに魔法みたいな元気をかけるよ！",
    "雪の煌めきが、笑顔にプラスの輝きをくれるよ！",
    "冬風にのって、元気がポンと湧いてくるよ！",
    "こたつの温もりが、心をふんわり包んでくれるよ！",
    "朝日が、あなたにスマイルを届けるよ！",
    "寒い日も、笑顔が魔法みたいに輝くよ！",
    "星空が、あなたの未来をキラリ照らすよ！",
    "雪のパウダーが、元気いっぱいに満たしてくれるよ！",
    "冬風が、ピカピカ笑顔を運んでくるよ！",
    "こたつでほっこり、心がポカポカになるね！",
    "雪の結晶みたいに、あなたはユニークに輝くよ！",
    "冬の朝は、エネルギーがグングン湧いてくるよ！",
    "寒い日も、笑顔でフワッと乗り越えようね！",
    "冬の星が、明るい希望をくれるよ！",
    "雪の煌めきに、心がキュンとしちゃうよ！",
    "冬風が、笑顔をふわっと包み込むよ！",
    "こたつでほっこり、笑顔がふんわり広がるよ！",
    "雪の結晶が、あなたの夢をそっと応援するよ！",
    "朝日が、心にポカポカの魔法をかけるよ！",
    "寒い日も、笑顔がピカピカに輝くよ！",
    "星空が、あなたの未来をキラリと照らすよ！",
    "雪のパウダーが、元気な気持ちで満たしてくれるよ！",
    "冬風が、あなたにピカピカの笑顔を届けるよ！",
    "こたつの温もりで、心がぽかぽかになるね！",
    "雪の結晶みたいに、あなたは特別に輝くよ！",
    "冬の朝は、元気がポンポン跳ねるよ！",
    "寒い日も、笑顔でフワッと乗り越えようね！",
    "星が、明るい希望をくれるよ！",
    "雪の煌めきに、心がニコッとしちゃうよ！",
    "冬風が、笑顔のリズムを刻むよ！",
    "こたつでまったり、笑顔がふわふわ広がるね！",
    "雪の結晶が、キラリ輝く勇気をくれるよ！",
    "朝日が、心にポカポカ魔法をかけるよ！",
    "寒い日も、笑顔でピカピカ輝こうね！",
    "星空が、素敵な未来を描いてくれるよ！",
    "雪のパウダーが、明るい元気を与えてくれるよ！"
  ],  
  
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

  // キャラクター用の画像（images/1.png ～ images/8.png）
  const totalImages = Array.from({ length: 8 }, (_, i) => `images/${i + 1}.png`);
  // 配列をシャッフルする関数
  const shuffleArray = (array) => {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  // キャラクター5体分、重複なくランダムに選択
  const selectedImages = shuffleArray(totalImages).slice(0, 4);

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
          images={selectedImages} 
          speed={25} 
          imageSize={70} 
          happyDuration={1000} 
          collisionPauseDuration={2500}
          // Chat側でコメントメッセージを上書きせず、AnimatedImagesのデフォルト（100個のメッセージ）を使用
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
