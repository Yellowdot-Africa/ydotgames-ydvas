import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar1 from "../assets/Icons/avatar1.png";
import Volume from "../assets/Icons/volume.png";
import Radix from "../assets/Icons/radix.png";
import Coins from "../assets/Icons/coins.png";
import Trophy from "../assets/Icons/trophy.png";
import Crown from "../assets/Icons/crown.png";
import Gumball from "../assets/Images/gumball.png";
import Temple from "../assets/Images/game2.png";
import Taffy from "../assets/Images/match-up.png";
import Home from "../assets/Icons/home.png";
import Leaderboard from "../assets/Icons/leaderboard.png";
import Profile from "../assets/Icons/profile.png";

const ProfilePage = () => {
  const navigate = useNavigate();

  const handleViewLeaderboardClick = () => {
    navigate("/leaderboard");
  };
  return (
    <>
      <div className="flex flex-col  justify-center items-center">
        <div className="bg-[#FFCB05] w-full h-[143px] mx-0"></div>
        <div className="bg-darrk-gradient min-h-screen lg:h-[100vh] xl:h-[900px] w-full">
          <div className="flex justify-between items-center -mt-[47px]   ">
            <img
              src={Avatar1}
              alt="Avatar Icon"
              className="w-[108px] h-[108px] rounded-full ml-[40px] md:ml-[170px]"
            />
            <div className="flex gap-[23px] mr-[31px] md:mr-[100px]">
              <img
                src={Volume}
                alt="Volume"
                className=" bg-[#000000] border border-[#FFCB05] rounded-[26px] pt-[13.53px] pb-[15.55px] px-[16px]"
              />
              <img
                src={Radix}
                alt="Mode"
                className=" bg-[#000000] border border-[#FFCB05] rounded-[26px] pt-[13.53px] pb-[15.55px] px-[16px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-[11px]">
            <div className="text-center text-white ml-[13px] md:ml-[170px]">
              <p className="font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-center">
                @+2348123433234
              </p>
              <p className="text-[#FFCA00] font-mtn-brighter-bold font-bold text-[16px] leading-[20.8px] text-center">
                Subscribed
              </p>
            </div>
            <div className="mr-[24px] md:mr-[100px] flex items-center justify-center border border-[#FFCB05] rounded-[30px] pl-[35px] pr-[44px] px-[12px] ">
              <img src={Coins} alt="Coin" className="w-12 h-12" />
              <p className="text-[#FFFFFF] font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-center">
                N10k
              </p>
            </div>
          </div>
          <button
            className="bg-button-gradient color-[#000000] mx-auto mt-[20px] py-[14px] px-[33px]  flex items-center justify-center rounded-[42px] border border-[#00000033] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center"
            onClick={handleViewLeaderboardClick}
          >
            <img src={Trophy} alt="trophy" />
            View Leaderboard
          </button>

          <div className="flex items-center justify-center gap-[15px] mt-[30px]">
            <div className="w-[158px] h-[71px] flex items-center justify-center gap-[4px] border-[1.5px] border-[#FFFFFF4A] bg-[#2C3035] shadow-box-shadow rounded-[12px] ">
              <img src={Avatar1} alt="Score Icon" className="w-12 h-12" />
              <div className="block">
                <p className="font-mtn-brighter-regular font-regular text-[16px] leading-[20.8px] text-center text-[#FFFFFFCC]">
                  Your Score
                </p>
                <p className="font-mtn-brighter-bold font-bold text-[20px] leading-[26px] text-center text-[#FFCB05]">
                  198k
                </p>
              </div>
            </div>

            <div className="w-[158px] h-[71px] flex items-center justify-center gap-[10px] border-[1.5px] border-[#FFFFFF4A] bg-[#2C3035] shadow-box-shadow rounded-[12px] ">
              <img src={Crown} alt="Score Icon" className="w-12 h-12" />
              <div className="block">
                <p className="font-mtn-brighter-regular font-regular text-[16px] leading-[20.8px] text-center text-[#FFFFFFCC]">
                  Top Score
                </p>
                <p className="font-mtn-brighter-bold font-bold text-[20px] leading-[26px] text-center text-[#FFCB05]">
                  308k
                </p>
              </div>
            </div>
          </div>
          <p className="font-mtn-brighter-xtra-bold font-extrabold text-[24px] leading-[31.2px] text-center text-[#FFFFFF] mt-[40px]">
            Continue Playing
          </p>

          <div className="flex flex-col items-center justify-center gap-[14px] mt-6 w-full ">
            <div className="bg-[#2C3035] px-[25px] py-[13px] border-[1.5px] border-[#FFFFFF66] shadow-lg rounded-[12px] w-[342px] h-[71px] flex items-center ">
              <img src={Gumball} alt="gumball" className="w-[47px] h-[46px]" />
              <div className="block pl-[16px]  text-justify">
                <p className="font-mtn-brighter-regular font-regular text-[16px] leading-[20.8px]  text-[#FFFFFF]">
                  {" "}
                  Gumball
                </p>
                <p className="font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-[#FFFFFF]">
                  #200
                </p>
              </div>
              <div className=" flex -mb-[22px] ml-[125px]">
                <p className="text-[#FFCA00] font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-center ">
                  Play
                </p>
              </div>
            </div>
            <div className="bg-[#2C3035] px-[25px] py-[13px] border-[1.5px] border-[#FFFFFF66] shadow-lg rounded-[12px] w-[342px] h-[71px] flex items-center ">
              <img src={Temple} alt="temple" className="w-[47px] h-[46px]" />
              <div className="block pl-[16px]  text-justify">
                <p className="font-mtn-brighter-regular font-regular text-[16px] leading-[20.8px]  text-[#FFFFFF]">
                  {" "}
                  Temple Run
                </p>
                <p className="font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-[#FFFFFF]">
                  #200
                </p>
              </div>
              <div className=" flex -mb-[22px] ml-[59px]">
                <p className="text-[#FFCA00] font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-center w-[184px]">
                  Play
                </p>
              </div>
            </div>
            <div className="bg-[#2C3035] px-[25px] py-[13px] border-[1.5px] border-[#FFFFFF66] shadow-lg rounded-[12px] w-[342px] h-[71px] flex items-center ">
              <img src={Taffy} alt="taffy" className="w-[47px] h-[46px]" />
              <div className="block pl-[16px]  text-justify">
                <p className="font-mtn-brighter-regular font-regular text-[16px] leading-[20.8px]  text-[#FFFFFF] w-[184px]">
                  Taffy Match Up
                </p>
                <p className="font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-[#FFFFFF]">
                  #200
                </p>
              </div>
              <div className=" flex -mb-[22px] ml-[5px]">
                <p className="text-[#FFCA00] font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-center ">
                  Play
                </p>
              </div>
            </div>
          </div>
          <div className="relative  flex justify-center py-4">
            <div className="absolute backdrop-blur-sm bottom-[30px] w-[342px] h-[82px] flex justify-between items-center  bg-foot-nav-gradient rounded-b-[60px] pt-[12px] pb-[20px] px-[46px]  ">
              <Link
                to="/home"
                className="bg-foot-nav-gradient rounded-[50px] w-[60px] h-[60px] flex items-center justify-center"
              >
                <img src={Home} alt="home" />
              </Link>

              <Link
                to="/user-profile"
                className="bg-[#FFCB05] rounded-[50px] w-[76px] h-[76px] flex items-center justify-center -mt-[40px]"
              >
                <img
                  src={Profile}
                  alt="profile"
                  className="w-[40px] h-[40px]"
                />
              </Link>
              <Link
                to="/leaderboard"
                className="bg-foot-nav-gradient rounded-[50px] w-[60px] h-[60px] flex items-center justify-center"
              >
                <img src={Leaderboard} alt="leaderboard" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
