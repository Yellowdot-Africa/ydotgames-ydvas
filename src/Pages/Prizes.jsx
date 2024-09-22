import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AvatarProfile from "../assets/Images/avatar-prof.png";
import Home from "../assets/Icons/home.png";
import Leaderboard from "../assets/Icons/leaderboard.png";
import Profile from "../assets/Icons/profile.png";
import PrizeIcon from "../assets/Icons/prizes.png";
import Coins from "../assets/Images/coins.png";
import Rank1 from "../assets/Icons/rank4.png";
import Rank2 from "../assets/Icons/rank1.png";
import Rank3 from "../assets/Icons/rank2.png";
import Rank4 from "../assets/Icons/rank3.png";
import Rank5 from "../assets/Icons/rank3.png";
import Rank6 from "../assets/Icons/rank3.png";
import Avatar1 from "../assets/Icons/avatar1.png";
import Avatar2 from "../assets/Icons/avatar2.png";
import Avatar3 from "../assets/Icons/avatar3.png";
import Avatar4 from "../assets/Icons/avatar4.png";
import Avatar5 from "../assets/Icons/avatar5.png";
import PlusIcon from "../assets/Icons/plus-icon.png";

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
  const avatars = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5];
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(AvatarProfile);
  const navigate = useNavigate();

  const [scrollDirection, setScrollDirection] = useState(null);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  const navStyle = {
    position: "fixed",
    bottom: scrollDirection === "down" ? "0px" : "0px",
    left: "50%",
    transform: "translateX(-50%)",
    transition: "bottom 0.5s ease",
  };

  const handleAvatarClick = () => {
    setShowAvatarSelector(!showAvatarSelector);
  };

  const handleViewLeaderboardClick = () => {
    navigate("/leaderboard");
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleSave = () => {
    if (selectedAvatar) {
      setCurrentAvatar(selectedAvatar);
      setShowAvatarSelector(false);
    }
  }

  return (
    <>
      <div className="relative">
        <div
          className={`flex flex-col min-h-[1080px] md:h-[1430px] bg-darrk-gradient  ${
            showAvatarSelector ? " blur-[3px]" : ""
          }`}
        >
          <div className="bg-[#E2EEF60D] w-[342px]  h-[933px] mt-[17px] mx-auto">
          <div className="bg-nav-gradient rounded-[26px] text-white flex justify-center items-center w-[265px] h-[49px]  mt-[21px] mx-auto">
        <div className="flex justify-between items-center w-[265px] h-[49px]">
          <div className="flex items-center justify-between space-x-12  relative">
            <div
              className="w-[50px] h-[50px] flex items-center justify-center cursor-pointer"
              onClick={handleAvatarClick}
            >
              <img
                src={currentAvatar || "/default-avatar.png"}
                alt="Profile Avatar"
                className="-ml-[8px] -mb-[6px]"
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

            <div className="w-full  mt-6">
              <table className="table-auto  mx-auto md:mx-auto">
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
          </div>
        </div>

        <div className="w-full " style={navStyle}>
          <div className="flex justify-center -mt-[240px]">
            <button
              className="bg-button-gradient mx-auto py-[14px] px-[33px] rounded-[42px] border border-[#00000033] font-mtn-brighter-bold text-[14px] text-black"
              onClick={handleViewLeaderboardClick}
            >
              View Leaderboard
            </button>
          </div>

          <div className="flex justify-center py-8 ">
            <div className="w-full max-w-[336px] h-[82px] backdrop-blur-sm flex justify-between items-center bg-foot-nav-gradient rounded-b-[60px] pt-[12px] pb-[20px] px-[46px]">
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

        {showAvatarSelector && (
          <div className="flex items-center justify-center mx-auto">
            <div className="absolute top-[30px] left-auto w-[265px] h-[138px]  bg-background-avatar  rounded-[26px]  ">
              <div className="flex  ">
                <img
                  src={currentAvatar || "/default-avatar.png"}
                  alt="Profile Avatar"
                />
                <p className="text-white pt-[12px] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-center w-[126px]">
                  Please select an avatar
                </p>
                {selectedAvatar && (
                  <button
                    className="text-[#FFCB05] ml-[32px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center  -mt-[5px]"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                )}
              </div>

              <div className="flex px-[10px] mt-4">
                {avatars.map((avatar, index) => (
                  <div
                    key={index}
                    className={`relative  ${
                      selectedAvatar === avatar
                        ? "border-[3px] rounded-[28px] flex items-center justify-center border-[#FFCB05]"
                        : ""
                    } cursor-pointer`}
                    onClick={() => handleAvatarSelect(avatar)}
                  >
                    <img
                      src={avatar}
                      alt={`Avatar ${index + 1}`}
                      className="w-[50px] h-[50px]"
                    />
                    {selectedAvatar !== avatar && (
                      <div className=" absolute bottom-[5px] right-0  w-[10px] h-[10px]  bg-[#FFCB05] rounded-[28px]">
                        <img
                          src={PlusIcon}
                          alt="Plus Icon"
                          className="w-[15px] h-[15px]  "
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PrizesPage;
