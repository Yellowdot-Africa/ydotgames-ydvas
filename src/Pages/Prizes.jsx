import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AvatarProfile from "../assets/Images/avatar-prof.png";
import Coins from "../assets/Images/coins.png";
import Home from "../assets/Icons/home.png";
import Leaderboard from "../assets/Icons/leaderboard.png";
import Profile from "../assets/Icons/profile.png";
import PrizeIcon from "../assets/Icons/prizes.png";
import Rank1 from "../assets/Icons/rank4.png";
import Rank2 from "../assets/Icons/rank1.png";
import Rank3 from "../assets/Icons/rank2.png";
import Rank4 from "../assets/Icons/rank3.png";
import Rank5 from "../assets/Icons/rank3.png";
import Rank6 from "../assets/Icons/rank3.png";

const PrizesPage = () => {
  const prizesData = [
    { position: 1, dailyAirtime: "R60", monthlyCash: "R1000" },
    { position: 2, dailyAirtime: "R55", monthlyCash: "R750" },
    { position: 3, dailyAirtime: "R50", monthlyCash: "R500" },
    { position: 4, dailyAirtime: "R45", monthlyCash: "R450" },
    { position: 5, dailyAirtime: "R35", monthlyCash: "R400" },
    { position: 6, dailyAirtime: "R35", monthlyCash: "R350" },
    { position: 7, dailyAirtime: "R35", monthlyCash: "R300" },
    { position: 8, dailyAirtime: "R35", monthlyCash: "R250" },
    { position: 9, dailyAirtime: "R35", monthlyCash: "R200" },
    { position: 10, dailyAirtime: "R10", monthlyCash: "R100" },
  ];

  const navigate = useNavigate();

  const handleViewLeaderboardClick = () => {
    navigate("/leaderboard");
  };
  return (
    <>
      <div className="flex flex-col items-center justify-start min-h-screen bg-darrk-gradient px-[24px]">
        <div className="bg-[#EFF3F50D] mt-[17px] w-full md:w-[50%] min-h-[120vh] md:min-h-[100vh] ">
          <div className="bg-nav-gradient rounded-[26px] text-white flex justify-center items-center w-[265px] h-[49px] mt-[21px] mx-auto ">
            <div className="flex justify-between items-center w-[265px] h-[49px]">
              <div className="flex items-center justify-between space-x-14 relative">
                <div className="w-[40px] h-[40px] shadow-box-shadow flex items-center justify-center cursor-pointer">
                  <img
                    src={AvatarProfile || "/default-avatar.png"}
                    alt="Profile Avatar"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <img src={Coins} alt="coin" />
                  <p className="font-mtn-brighter-medium font-medium text-[12px] text-center leading-[15.6px] text-[#FFFFFF]">
                    R10k
                  </p>
                </div>
                <div className="border border-[#FFCB05] rounded-[26px] w-[51px] h-[27px] bg-[#7F806266] flex justify-center items-center mt-[12px] mb-[10px] mr-[10px]">
                  <p className="font-mtn-brighter-medium font-medium text-[12px] leading-[15.6px] text-center text-[#FFCB05]">
                    T&C
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-background w-[140px] h-[28px] rounded-b-[26px] flex items-center justify-center m-auto shadow-box-shadow">
            <p className="font-mtn-brighter-medium font-medium text-[10px] leading-[13px] text-center text-[#FFFFFF]">
              @+2778 414 2470
            </p>
          </div>

          <img src={PrizeIcon} alt="trophy" className="mx-auto mt-[4px]" />
          <h1 className="font-mtn-brighter-xtra-bold font-extrabold text-[18px] text-center leading-[23.4px] mx-auto text-[#FFFFFF]">
            Prizes
          </h1>
          <p className="text-[#FFFFFF] mx-auto font-mtn-brighter-regular font-regular text-[18px] w-[274px] leading-[23.4px] text-center mt-[11px]">
            The grand prize is
            <span className="font-mtn-brighter-bold font-bold text-[18px] leading-[23.4px] text-center">
              R1000!
            </span>{" "}
            With lots of Airtime to be won!
          </p>

          <div className="w-full max-w-4xl mt-6">
            <table className="table-auto w-full mx-auto">
              <thead>
                <tr className="text-center">
                  <th className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-[#FFFFFF]">
                    Position
                  </th>
                  <th className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-[#FFFFFF]">
                    Daily Airtime
                  </th>
                  <th className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-[#FFFFFF]">
                    Monthly Cash
                  </th>
                </tr>
              </thead>
              <tbody>
                {prizesData.map((prize, index) => {
                  const rankImage =
                    prize.position === 1
                      ? Rank1
                      : prize.position === 2
                      ? Rank2
                      : prize.position === 3
                      ? Rank3
                      : prize.position === 4
                      ? Rank4
                      : prize.position === 5
                      ? Rank5
                      : prize.position === 6
                      ? Rank6
                      : null;

                  const isTop3 =
                    prize.position === 1 ||
                    prize.position === 2 ||
                    prize.position === 3;

                  return (
                    <tr
                      key={index}
                      className={`text-center ${
                        isTop3
                          ? "bg-gradient-to-b from-[#221F20] to-[#000000] shadow-[0px_4px_4px_0px_#00000040] rounded-[25px]"
                          : ""
                      }`}
                    >
                      {" "}
                      <td className="p-2 relative w-[50px] h-[50px] font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
                        {rankImage ? (
                          <div className="relative flex justify-center items-center">
                            <img
                              src={rankImage}
                              alt={`Rank ${prize.position}`}
                              className="w-[30px] h-[25px]"
                            />
                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-white text-[14px]">
                              {prize.position}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-white text-[14px]">
                            {prize.position}
                          </span>
                        )}
                      </td>
                      <td className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
                        {prize.dailyAirtime}
                      </td>
                      <td className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
                        {prize.monthlyCash}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center -mt-[240px]">
            <button
              className="bg-button-gradient mx-auto py-[14px] px-[33px] rounded-[42px] border border-[#00000033] font-mtn-brighter-bold text-[14px] text-black"
              onClick={handleViewLeaderboardClick}
            >
              View Leaderboard
            </button>
          </div>

          <div className="relative flex justify-center py-8 ">
            <div className="absolute -bottom-[75px] w-full h-[82px] backdrop-blur-sm flex justify-between items-center bg-foot-nav-gradient rounded-b-[60px] pt-[12px] pb-[20px] px-[46px]">
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

export default PrizesPage;
