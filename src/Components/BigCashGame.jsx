import React from "react";
import { Link } from "react-router-dom"; 

const BigCashGame = () => {
  return (
    <div className="w-full mt-6 flex items-center justify-center mx-auto">
      <div className="flex justify-center items-center">
        <div className="relative w-[344px] h-[166px]  bg-custom-t-gradient rounded-[16px] shadow-md flex flex-col items-center justify-between p-4">
          <div
            className="w-[120px] h-[80px] bg-cover bg-center"
          ></div>
          <div className="text-center">
            <h3 className="text-white font-bold font-mtn-brighter-bold  text-[18px] text-center leading-[18.2px]">BigCash Trivia Game</h3>
            <p className="text-gray-400 text-[14px] font-mtn-brighter-regular font-regular text-center leading-[18.2px] mt-2">Test your trivia knowledge!</p>
          </div>
          <Link to="/bigcash-trivia">
            <button className="mt-4 bg-[#19BFC1] text-white px-4 py-2 rounded-lg font-mtn-brighter-medium font-medium text-[16px] text-center">
              Play Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BigCashGame;
