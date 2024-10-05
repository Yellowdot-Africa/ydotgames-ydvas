import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AvatarProfile from "../assets/Images/avatar-prof.png";
import Coins from "../assets/Images/coins.png";
import Trophy from "../assets/Icons/trophy.png";
import Arrow from "../assets/Icons/Arrow.png";
import Home from "../assets/Icons/home.png";
import LeaderboardIcon from "../assets/Icons/leaderboard.png";
import Profile from "../assets/Icons/profile.png";
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
import { LeaderboardContext } from "../Context/LeaderboardContext";
import UserContext from "../Context/UserContext";

const LeaderboardPage = ({ subscriberMsisdn }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(AvatarProfile);
  const avatars = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5];
  const navigate = useNavigate();
  const [scrollDirection, setScrollDirection] = useState(null);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [userAvatar, setUserAvatar] = useState({ AvatarProfile });
  const [gameScore, setGameScore] = useState(0);

  const {
    leaderboard,
    handleUpdateLeaderboardScore,
    fetchLeaderboardStanding,
    obscureMSISDN,
    loading,
    error,
  } = useContext(LeaderboardContext);
  const { userProfile, fetchProfile, msisdn, handleUpdateSubscriberProfile } =
    useContext(UserContext);

  useEffect(() => {
    const storedAvatar = localStorage.getItem("selectedAvatar");
    if (storedAvatar) {
      setUserAvatar(storedAvatar);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboardStanding(subscriberMsisdn);
  }, [subscriberMsisdn]);




  useEffect(() => {
    if (msisdn) {
      console.log("Updated MSISDN:", msisdn);
     
      handleUpdateLeaderboardScore(msisdn, gameScore);
    }
  }, [msisdn, gameScore]);

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

  const handleViewPrizesClick = () => {
    navigate("/prizes");
  };

  const handleAvatarClick = () => {
    setShowAvatarSelector(!showAvatarSelector);
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleSave = () => {
    if (selectedAvatar) {
      setCurrentAvatar(selectedAvatar);
      setShowAvatarSelector(false);
    }
  };
  // console.log("subscriberMsisdn:", subscriberMsisdn);
  // console.log("leaderboard:", leaderboard);

  const userPosition = leaderboard.find((player) => player.msisdn === msisdn);

  // console.log("User Position:", userPosition);
  // console.log("leaderboard:", leaderboard);
  console.log("msisdn:", msisdn);

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }
  // if (!leaderboard || leaderboard.length === 0) {
  //   return <div>No leaderboard data available.</div>;
  // }

  return (
    <>
      <div className="relative">
        <div
          className={`flex flex-col min-h-[1080px] md:h-[1430px] bg-darrk-gradient  ${
            showAvatarSelector ? " blur-[3px]" : ""
          }`}
        >
          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}

          <div className="bg-[#E2EEF60D] w-[342px] h-[933px] mt-[17px] mx-auto">
            <div className="bg-nav-gradient rounded-[26px] text-white flex justify-center items-center w-[175px] h-[49px]  mt-[21px] mx-auto">
              {/* Avatar and Coin Section */}
              <div className="flex justify-between items-center w-[225px] h-[49px]">
                <div className="flex items-center justify-between space-x-14  relative">
                  <div
                    className="w-[50px] h-[50px]  flex items-center justify-center cursor-pointer"
                    onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                  >
                    <img
                      src={userAvatar || AvatarProfile}
                      alt="Profile Avatar"
                      className="-ml-[8px] -mb-[6px]"
                      onError={(e) => { e.target.onerror = null; e.target.src = AvatarProfile; }}
                      loading="lazy"


                    />
                  </div>

                  {/* <div className="flex items-center justify-center">
                    <img src={Coins} alt="coin" />
                    <p className="font-mtn-brighter-medium font-medium text-[12px] text-center leading-[15.6px] text-[#FFFFFF]">
                      R10k
                    </p>
                  </div> */}
                  <Link
                    to="/terms-and-conditions"
                    className="border border-[#FFCB05] rounded-[26px] w-[51px] h-[27px] bg-[#7F806266] flex justify-center px-4 items-center mt-[12px] mb-[10px] mr-[10px]"
                  >
                    <p className="font-mtn-brighter-medium font-medium text-[12px] leading-[15.6px] text-center text-[#FFCB05]">
                      T&C's
                    </p>
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-background w-[140px] h-[28px] rounded-b-[26px] flex items-center justify-center m-auto shadow-box-shadow">
              <p className="font-mtn-brighter-medium font-medium text-[10px] leading-[13px] text-center text-[#FFFFFF]">
                @{msisdn}
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
              and you are currently #{userPosition?.position}
            </p>

            {/* Table */}
            <div className="w-full mt-6 ">
              <table className="table-auto mx-auto md:mx-auto">
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
                  {leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-white">
                        No players found
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((player, index) => {
                      const rankImage =
                        player.position === 1
                          ? Rank1
                          : player.position === 2
                          ? Rank2
                          : player.position === 3
                          ? Rank3
                          : player.position === 4
                          ? Rank4
                          : player.position === 5
                          ? Rank5
                          : player.position === 6
                          ? Rank6
                          : null;

                      const isTop3 =
                        player.position === 1 ||
                        player.position === 2 ||
                        player.position === 3;

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
                                  alt={`Rank ${player.position}`}
                                  className="w-[30px] h-[25px]"
                                />
                                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-white text-[14px]">
                                  {player.position}
                                </span>
                              </div>
                            ) : (
                              <span className="font-bold text-white text-[14px]">
                                {player.position}
                              </span>
                            )}
                          </td>

                          <td className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
                            {/* {player.msisdn} */}
                            {obscureMSISDN(player.msisdn)}
                          </td>
                          <td className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
                            {player.dailyPoints}
                          </td>
                          <td className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
                            {player.monthlyPoints}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="w-full " style={navStyle}>
          <div className="flex justify-center mb-[51px] ">
            <button
              className="bg-button-gradient mx-auto py-[14px] px-[33px] rounded-[42px] border border-[#00000033] font-mtn-brighter-bold text-[14px] text-black"
              onClick={handleViewPrizesClick}
            >
              View Prizes
            </button>
          </div>

          <div className=" flex justify-center py-8 ">
            <div className="w-full max-w-[336px]  h-[82px] backdrop-blur-sm flex justify-between items-center bg-foot-nav-gradient rounded-b-[60px] pt-[12px] pb-[20px] px-[46px]">
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
                <img src={LeaderboardIcon} alt="leaderboard" />
              </Link>
            </div>
          </div>
        </div>
        {showAvatarSelector && (
          <div className="flex items-center justify-center mx-auto">
            <div className="absolute top-[30px] left-auto w-[265px] h-[138px]  bg-background-avatar  rounded-[26px]  ">
              <div className="flex  ">
                <img
                  src={currentAvatar || AvatarProfile}
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

export default LeaderboardPage;






