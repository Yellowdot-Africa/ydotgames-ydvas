import React from "react";
import Game1 from "../assets/Images/game1.png";
import Game2 from "../assets/Images/game2.png";
import Game3 from "../assets/Images/game3.png";
import Frame1 from "../assets/Images/frame1.png";
import Frame2 from "../assets/Images/frame2.png";
import Frame3 from "../assets/Images/frame3.png";
import StarW from "../assets/Icons/Star-w.png";
import Star from "../assets/Icons/Starww.png";
import StarY from "../assets/Icons/Star-y.png";
import StarYs from "../assets/Icons/Star-ys.png";
import StarWs from "../assets/Icons/Star-ws.png";

import "../App.css";

const CarouselSection = () => {
  return (
    <div className="w-full ">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-[22px] w-max  mx-0 md:mx-auto">
          <div className="min-w-[157px] flex-shrink-0 ">
            <div className="relative rounded-[20px] pt-[7px] px-0 border border-[#FEFFD366] bg-[#2E3237]">
              <div
                className="relative w-[142px] h-[71px] mx-[7px] bg-cover bg-center rounded-[16px] flex flex-col items-center justify-between"
                style={{ backgroundImage: `url(${Frame1})` }}
              >
                <img
                  src={Game1}
                  alt="Game"
                  className="w-[59px] h-[58px] rounded-[12px]  absolute -top-2 z-10" 
                />
                <div className="absolute bottom-1 text-center">
                  <p className="font-mtn-brighter-xtra-bold font-extrabold text-[14px] leading-[18.2px] text-center text-[#002E38]">X Wing Fighter</p>
                </div>
              </div>
              <div className="flex items-center  mx-0 border-none mt-[10px] mb-0 px-0">
                <span className="bg-[#19BFC1]  rounded-bl-[20px] w-[103px] h-[30px] flex items-center justify-center">
                  <img src={StarW} alt="star" />
                  <img src={StarW} alt="star" />
                  <img src={StarW} alt="star" />
                  <img src={StarW} alt="star" />
                  <img src={StarW} alt="star" />

                  </span>
                <button className="bg-[#2A76D8] py-[7px] px-[15px]  rounded-br-[20px] ">
                 <p className="font-mtn-brighter-medium font-medium text-center text-[12px] leading-[15.6px] text-white">Play</p> 
                </button>
              </div>
            </div>
          </div>

          <div className="min-w-[194px] flex-shrink-0">
            <div className="relative rounded-[20px] pt-[7px]  border border-[#FEFFD366] bg-[#2E3237]">
              <div
                className="relative w-[176px] h-[88px] mx-[7px] bg-cover bg-center rounded-lg flex flex-col items-center justify-between"
                style={{ backgroundImage: `url(${Frame2})` }}
              >
                <img
                  src={Game2}
                  alt="Game"
                  className="w-[59px] h-[58px] rounded-[12px] absolute -top-2  z-10"
                />
                <div className="absolute bottom-2 text-center">
                  <p className="font-mtn-brighter-xtra-bold font-extrabold text-[18px] leading-[23.4px] text-center text-[#382C00]">Temple Run 2</p>
                </div>
              </div>
              <div className="flex items-center mt-[11px] mb-0">
                <span className="bg-[#CFA400] rounded-bl-[20px] w-[128px] h-[37px] flex items-center justify-center">
                <img src={StarY} alt="star" />
                <img src={StarY} alt="star" />
                <img src={StarY} alt="star" />
                <img src={Star} alt="star" />
                <img src={Star} alt="star" />

                </span>
                <button className="bg-[#2A76D8]  py-[9px] px-[17px]  rounded-br-[20px]  ">
                  <p className="font-mtn-brighter-medium font-medium text-center text-[14px] leading-[18.2px] text-white">Play</p>
                </button>
              </div>
            </div>
          </div>

          <div className="min-w-[157px] flex-shrink-0 flex justify-center items-center">
            <div className="relative rounded-[20px] pt-[7px]   border border-[#FEFFD366] bg-[#2E3237]">
              <div
                className="relative w-[142.64px] h-[71px] mx-[7px] bg-cover bg-center rounded-lg flex flex-col items-center justify-between"
                style={{ backgroundImage: `url(${Frame3})` }}
              >
                <img
                  src={Game3}
                  alt="Game"
                  className="w-[59px] h-[58px] rounded-[12px] shadow-box-shadow absolute -top-2 z-10"
                />
                <div className="absolute bottom-1 text-center">
                  <p className="font-mtn-brighter-xtra-bold font-extrabold text-[14px] leading-[18.2px] text-center text-[#0E0038]">Taffy Match Up</p>
                </div>
              </div>
              <div className="flex items-center mt-[10px] mb-0">
                <span className="bg-[#4601B7] rounded-bl-[20px] w-[103px] h-[30px] flex items-center justify-center">
                <img src={StarYs} alt="star" />
                  <img src={StarYs} alt="star" />
                  <img src={StarYs} alt="star" />
                  <img src={StarWs} alt="star" />
                  <img src={StarWs} alt="star" />

                </span>
                <button className="bg-[#2A76D8] py-[7px] px-[15px] rounded-br-[20px]">
                <p className="font-mtn-brighter-medium font-medium text-center text-[12px] leading-[15.6px] text-white">Play</p> 
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselSection;
