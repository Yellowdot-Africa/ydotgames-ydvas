import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AvatarProfile from "../assets/Images/avatar-prof.png";
import Coins from "../assets/Images/coins.png";
import Trophy from "../assets/Icons/trophy.png";
import Home from "../assets/Icons/home.png";
import Leaderboard from "../assets/Icons/leaderboard.png";
import Profile from "../assets/Icons/profile.png";
import Rank1 from "../assets/Icons/rank4.png";
import Rank2 from "../assets/Icons/rank1.png";
import Rank3 from "../assets/Icons/rank2.png";
import Rank4 from "../assets/Icons/rank3.png";
import Rank5 from "../assets/Icons/rank3.png";
import Rank6 from "../assets/Icons/rank3.png";

const LeaderboardPage = () => {
  const leaderboardData = [
    { rank: 1, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
    { rank: 2, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
    { rank: 3, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
    { rank: 4, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
    { rank: 5, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
    { rank: 6, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
    { rank: 7, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
    { rank: 8, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
    { rank: 9, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
    { rank: 10, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
  ];

  const navigate = useNavigate();

  const handleViewPrizesClick = () => {
    navigate("/prizes");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-start min-h-screen bg-darrk-gradient px-[24px]">
        <div className="bg-[#EFF3F50D] mt-[17px] min-h-[120vh] md:min-h-[100vh] w-full  md:w-[43%]">
          <div className="bg-nav-gradient rounded-[26px] text-white flex justify-center items-center w-[265px] h-[49px]  mt-[21px] mx-auto ">
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

          <img src={Trophy} alt="trophy" className="mx-auto mt-[4px]" />
          <h1 className="font-mtn-brighter-xtra-bold font-extrabold text-[18px] text-center leading-[23.4px] mx-auto text-[#FFFFFF]">
            Leaderboard
          </h1>
          <p className="text-[#FFFFFF] mx-auto font-mtn-brighter-regular font-regular text-[18px] w-[274px] leading-[23.4px] text-center mt-[11px]">
            These are our{" "}
            <span className="font-mtn-brighter-bold font-bold text-[18px] leading-[23.4px] text-center">
              Top Players
            </span>{" "}
            and you are currently #6
          </p>

          <div className="w-full  max-w-4xl mt-6 ">
            <table className="table-auto  mx-auto md:mx-auto">
              <thead>
                <tr className="text-center">
                  <th className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-[#FFFFFF]">
                    Rank
                  </th>
                  <th className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-[#FFFFFF]">
                    Phone
                  </th>
                  <th className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-[#FFFFFF]">
                    Daily Score
                  </th>
                  <th className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-[#FFFFFF]">
                    Monthly Score
                  </th>
                </tr>
              </thead>

              <tbody>
                {leaderboardData.map((player, index) => {
                  const rankImage =
                    player.rank === 1
                      ? Rank1
                      : player.rank === 2
                      ? Rank2
                      : player.rank === 3
                      ? Rank3
                      : player.rank === 4
                      ? Rank4
                      : player.rank === 5
                      ? Rank5
                      : player.rank === 6
                      ? Rank6
                      : null;

                  const isTop3 =
                    player.rank === 1 || player.rank === 2 || player.rank === 3;

                  return (
                    <tr
                      key={index}
                      className={`text-center ${
                        isTop3
                          ? "bg-gradient-to-b from-[#221F20] to-[#000000] shadow-[0px_4px_4px_0px_#00000040] rounded-[25px]"
                          : ""
                      }`}
                    >
                      <td className="p-2 relative w-[50px] h-[50px] font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
                        {rankImage ? (
                          <div className="relative flex justify-center items-center ">
                            <img
                              src={rankImage}
                              alt={`Rank ${player.rank}`}
                              className="w-[30px] h-[25px]"
                            />
                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-white text-[14px]">
                              {player.rank}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-white text-[14px]">
                            {player.rank}
                          </span>
                        )}
                      </td>

                      <td className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
                        {player.phone}
                      </td>
                      <td className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
                        {player.dailyScore}
                      </td>
                      <td className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
                        {player.monthlyScore}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center -mt-[300px]">
            <button
              className="bg-button-gradient mx-auto py-[14px] px-[33px] rounded-[42px] border border-[#00000033] font-mtn-brighter-bold text-[14px] text-black"
              onClick={handleViewPrizesClick}
            >
              View Prizes
            </button>
          </div>

          <div className="relative flex justify-center py-8 ">
            <div className="absolute top-[125px] left-0 w-full  h-[82px] backdrop-blur-sm flex justify-between items-center bg-foot-nav-gradient rounded-b-[60px] pt-[12px] pb-[20px] px-[46px]">
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

export default LeaderboardPage;






