import React from 'react';

const RotatingImage = () => {
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
        src="/images/AI.png" 
        alt="Rotating" 
        className="rotating-image animate-spin" 
      />
    </div>
  );
};

export default RotatingImage;
