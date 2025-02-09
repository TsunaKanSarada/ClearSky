import React from 'react';

const RotatingImage = () => {
  // 1から8までのランダムな数値を生成
  const randomImageNumber = Math.floor(Math.random() * 8) + 1;
  const imagePath = `/images/${randomImageNumber}.png`;

  return (
    <div className="rotating-container">
      <style jsx>{`
        .rotating-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 75vh;
          background-color: #f5f5f5;
        }
        @keyframes spinAnim {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spinAnim 1s linear infinite;
        }
        .rotating-image {
          width: 200px;
          height: 200px;
        }
      `}</style>
      <img 
        src={imagePath} 
        alt="Rotating" 
        className="rotating-image animate-spin" 
      />
    </div>
  );
};

export default RotatingImage;
