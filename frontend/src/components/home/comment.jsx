import React from 'react';

const Comment = ({ children }) => {
  return (
    <div className="relative w-[80%] h-[40%] bg-gradient-to-br from-blue-100 to-sky-100 rounded-lg p-8 text-sky-900 mx-auto mt-[10%] text-center shadow-lg hover:scale-105 transition-transform duration-300">
      {children || "今日のアドバイス！"}
      <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-0 h-0 
                      border-l-[20px] border-l-transparent 
                      border-r-[20px] border-r-transparent 
                      border-t-[20px] border-t-sky-100" />
    </div>
  );
};

export default Comment;
