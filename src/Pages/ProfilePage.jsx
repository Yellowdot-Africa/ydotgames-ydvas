import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar1 from "../assets/Icons/avatar1.png";
import AvatarProfile from "../assets/Images/avatar-prof.png";
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
import GameContext from "../Context/GameContext";
import UserContext from "../Context/UserContext";
import { LeaderboardContext } from "../Context/LeaderboardContext";


const ProfilePage = () => {
  const navigate = useNavigate();
  const [scrollDirection, setScrollDirection] = useState(null);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const { games, loading } = useContext(GameContext);
  const { userProfile,fetchProfile, error, handleUpdateSubscriberProfile } = useContext(UserContext);
  const {leaderboard} = useContext(LeaderboardContext)
  const [myPoints, setMyPoints] = useState(0);
  const [topPoints, setTopPoints] = useState(0);
  const [userAvatar, setUserAvatar] = useState({AvatarProfile}); 

  useEffect(() => {
    const storedAvatar = localStorage.getItem("selectedAvatar");
    if (storedAvatar) {
      setUserAvatar(storedAvatar);
    }
  }, []);

useEffect(() => {
  if (leaderboard.length > 0 && userProfile) {
    const myEntry = leaderboard.find(entry => entry.msisdn === userProfile.msisdn);
    setMyPoints(myEntry ? myEntry.dailyPoints : 0);

    const maxPoints = Math.max(...leaderboard.map(entry => entry.dailyPoints));
    setTopPoints(maxPoints);
  }
}, [leaderboard, userProfile]);

  


  const truncateTitle = (title) => {
    const maxLength = 10;
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };

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

  const handleViewLeaderboardClick = () => {
    navigate("/leaderboard");
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) return <p>{error}</p>;
  
  return (
    <>
      <div className="flex flex-col h-[1059px] md:h-[1390px] bg-profile-gradient   justify-center items-center">
        {/* <div className="bg-[#FFCB05] w-full h-[143px] mx-0"></div> */}
        <div className="bg-darrk-gradient h-[749px]   w-full">
          <div className="flex justify-between items-center -mt-[47px]   ">
            <img
              src={userAvatar}
              alt="Avatar Icon"
              className="w-[108px] h-[108px] rounded-full ml-[40px] md:ml-[170px]"
            />
            <div className="flex gap-[23px] mr-[31px] md:mr-[100px]">
              <img
                src={Volume}
                alt="Volume"
                className=" bg-[#000000] grayscale border border-[#2C3035] rounded-[26px] pt-[13.53px] pb-[15.55px] px-[16px]"
              />
              <img
                src={Radix}
                alt="Mode"
                className=" bg-[#000000] grayscale border border-[#2C3035] rounded-[26px] pt-[13.53px] pb-[15.55px] px-[16px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-[11px]">
            <div className="text-center text-white ml-[13px] md:ml-[170px]">
              <p className="font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-center">
                @{userProfile?.msisdn}
              </p>
              <p className="text-[#FFCA00] font-mtn-brighter-bold font-bold text-[16px] leading-[20.8px] text-center">
                {/* Subscribed */}
                {/* {userProfile?.isSubscribed ? "Subscribed" : "Unsubscribed"} */}
              </p>
            </div>
            {/* <div className="mr-[24px] md:mr-[100px] flex items-center justify-center border border-[#FFCB05] rounded-[30px] pl-[35px] pr-[44px] px-[12px] ">
              <img src={Coins} alt="Coin" className="w-12 h-12" />
              <p className="text-[#FFFFFF] font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-center">
                N10k
              </p>
            </div> */}
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
              <img src={userAvatar} alt="Score Icon" className="w-12 h-12" />
              <div className="block">
                <p className="font-mtn-brighter-regular font-regular text-[16px] leading-[20.8px] text-center text-[#FFFFFFCC]">
                  Your Score
                </p>
                <p className="font-mtn-brighter-bold font-bold text-[20px] leading-[26px] text-center text-[#FFCB05]">
                {myPoints}
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
                {topPoints}
                </p>
              </div>
            </div>
          </div>
          <p className="font-mtn-brighter-xtra-bold font-extrabold text-[24px] leading-[31.2px] text-center text-[#FFFFFF] mt-[40px]">
            Continue Playing
          </p>

          <div className="flex flex-col items-center justify-center gap-[14px] mt-6 w-full ">
            {games.length > 0 ? (
              games.slice(0, 3).map((game, index) => (
                <div
                  key={game.gameId}
                  className="bg-[#2C3035] px-[25px] py-[13px] border-[1.5px] border-[#FFFFFF66] shadow-lg rounded-[12px] w-[342px] h-[71px] flex items-center "
                >
                  <img
                    src={`data:image/png;base64,${game.base64}`}
                    alt={game.title}
                    className="w-[47px] h-[46px] rounded-[10px] object-cover"
                  />
                  <div className="block pl-[16px]  text-justify">
                    <p className="font-mtn-brighter-regular font-regular w-[184px] text-[16px] leading-[20.8px]  text-[#FFFFFF]">
                      {truncateTitle(game.title)}
                    </p>
                    <p className="font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-[#FFFFFF]">
                      #200
                    </p>
                  </div>
                  <div className=" flex -mb-[22px] ">
                    <a
                      href={game.playUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="text-[#FFCA00] font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-center "
                    >
                      Play
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p>No games available.</p>
            )}
          </div>

          <div className="fixed  flex justify-center py-4 ">
            <div
              style={navStyle}
              className=" backdrop-blur-sm mb-[15px] md:mb-[90px]  w-[342px] h-[82px] flex justify-between items-center  bg-foot-nav-gradient rounded-b-[60px] pt-[12px] pb-[20px] px-[46px]  "
            >
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






