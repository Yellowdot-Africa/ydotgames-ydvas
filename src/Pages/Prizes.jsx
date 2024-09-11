import React from "react";
import { Link , useNavigate} from "react-router-dom";
import AvatarProfile from "../assets/Images/avatar-prof.png";
import Coins from "../assets/Images/coins.png";
import Home from "../assets/Icons/home.png";
import Leaderboard from "../assets/Icons/leaderboard.png";
import Profile from "../assets/Icons/profile.png";
import PrizeIcon from "../assets/Icons/prizes.png";

const PrizesPage = () => {
  const prizesData = [
    { position: 1, dailyAirtime: "R50", monthlyCash: "R1000" },
    { position: 2, dailyAirtime: "R40", monthlyCash: "R800" },
    { position: 3, dailyAirtime: "R30", monthlyCash: "R600" },
    { position: 4, dailyAirtime: "R20", monthlyCash: "R400" },
    { position: 5, dailyAirtime: "R20", monthlyCash: "R400" },
    { position: 6, dailyAirtime: "R20", monthlyCash: "R400" },
    { position: 7, dailyAirtime: "R20", monthlyCash: "R400" },
    { position: 8, dailyAirtime: "R20", monthlyCash: "R400" },
    { position: 9, dailyAirtime: "R20", monthlyCash: "R400" },
    { position: 10, dailyAirtime: "R20", monthlyCash: "R400" },

];

  const navigate = useNavigate();

  const  handleViewLeaderboardClick  = ()=>{
    navigate("/leaderboard");
  }
  return (


    <>
    <div className="flex flex-col items-center justify-start h-screen bg-darrk-gradient px-[24px]">
      <div className="bg-[#EFF3F50D] mt-[17px] w-full h-screen">
        <div className="bg-nav-gradient rounded-[26px] text-white flex justify-center items-center mt-[21px] ml-[65px] mr-[57px]">
          <div className="flex justify-between items-center w-[265px] h-[49px]">
            <div className="flex items-center justify-between space-x-12 relative">
              <div className="w-[40px] h-[40px] shadow-box-shadow flex items-center justify-center cursor-pointer">
                <img src={AvatarProfile || "/default-avatar.png"} alt="Profile Avatar" />
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
              {prizesData.map((prize, index) => (
                <tr key={index} className="text-center">
                  <td className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
                    {prize.position}
                  </td>
                
                  <td className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
                    {prize.dailyAirtime}
                  </td>
                  <td className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
                    {prize.monthlyCash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center -mt-[240px]">
          <button className="bg-button-gradient mx-auto py-[14px] px-[33px] rounded-[42px] border border-[#00000033] font-mtn-brighter-bold text-[14px] text-black" onClick={ handleViewLeaderboardClick }>
            View Leaderboard
          </button>
        </div>

        <div className="relative flex justify-center py-8 ">
          <div className="absolute -bottom-[75px] w-[342px] h-[82px] backdrop-blur-sm flex justify-between items-center bg-foot-nav-gradient rounded-b-[60px] pt-[12px] pb-[20px] px-[46px]">
            <Link
              to="/"
              className="bg-foot-nav-gradient rounded-[50px] w-[60px] h-[60px] flex items-center justify-center"
            >
              <img src={Home} alt="home" />
            </Link>

            <Link
              to="/user-profile"
              className="bg-[#FFCB05] rounded-[50px] w-[76px] h-[76px] flex items-center justify-center -mt-[40px]"
            >
              <img src={Profile} alt="profile" className="w-[40px] h-[40px]" />
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
