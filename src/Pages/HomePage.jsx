import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import CarouselSection from "../Components/CarouselSection";
import Arrow from "../assets/Icons/Arrow.png";
import Action from "../assets/Icons/action.png";
import Fantasy from "../assets/Icons/fantasy.png";
import Racing from "../assets/Icons/racing.png";
import StarYs from "../assets/Icons/Star-ys.png";
import StarWs from "../assets/Icons/Star-ws.png";
import SkateRush from "../assets/Images/rush.jpeg";
import XWinger from "../assets/Images/x-winger.png";
import StarWars from "../assets/Images/ground.jpeg";
import TempleQuest from "../assets/Images/quest.jpeg";
import BigCash from "../assets/Images/big-cash.jpeg";
import Home from "../assets/Icons/home.png";
import Leaderboard from "../assets/Icons/leaderboard.png";
import Profile from "../assets/Icons/profile.png";
import FooterNav from "../assets/Images/nav-container.png";
import AvatarProfile from "../assets/Images/avatar-prof.png";
import Coins from "../assets/Images/coins.png";
import PlusIcon from "../assets/Icons/plus-icon.png";
import Avatar1 from "../assets/Icons/avatar1.png";
import Avatar2 from "../assets/Icons/avatar2.png";
import Avatar3 from "../assets/Icons/avatar3.png";
import Avatar4 from "../assets/Icons/avatar4.png";
import Avatar5 from "../assets/Icons/avatar5.png";
import AuthContext from "../Context/AuthContext";
import GameContext from "../Context/GameContext";
import UserContext from "../Context/UserContext";
import BigCashGame from "../Components/BigCashGame";
import StarRatings from "../Components/StarRatings";
import { LeaderboardContext } from "../Context/LeaderboardContext";

const HomePage = () => {
  const avatars = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5];
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(AvatarProfile);
  const [scrollDirection, setScrollDirection] = useState("null");
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const { auth } = useContext(AuthContext);
  const { handleUpdateSubscriberProfile, fetchProfile, userProfile, msisdn } =
    useContext(UserContext);
  const { games, loading } = useContext(GameContext);
  const [categories, setCategories] = useState([]);
  const [nickname, setNickname] = useState("Racer001");
  const { handleUpdateLeaderboardScore } = useContext(LeaderboardContext);
  const { leaderboard, fetchLeaderboardStanding } =
    useContext(LeaderboardContext);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [iframeSrc, setIframeSrc] = useState("");

  useEffect(() => {
    if (games && games.length > 0) {
      const uniqueCategories = [
        ...new Set(games.map((game) => game.category[0])),
      ];

      setCategories(uniqueCategories);
    }
  }, [games]);

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

  useEffect(() => {
    const storedAvatar = localStorage.getItem("selectedAvatar");
    if (storedAvatar) {
      setSelectedAvatar(storedAvatar);
      setCurrentAvatar(storedAvatar);
    }
  }, []);
  const storedMsisdn = localStorage.getItem('cli');

  const handleAvatarClick = () => {
    setShowAvatarSelector(!showAvatarSelector);
  };

  const handleAvatarSelect = (avatarId) => {
    // if (!userProfile) {
    //   console.error('User profile is not loaded');
    //   return;
    // }
    setSelectedAvatar(avatarId);
  };

  const handleSave = async () => {
    try {
      if (!selectedAvatar) return;
      const avatarId = avatars.indexOf(selectedAvatar) + 1;

      const msisdn = userProfile?.msisdn;
      if (!msisdn) {
        setError("MSISDN is required");
        console.log("MSISDN is required");
        return;
      }
      const nickname = msisdn;
      console.log("avatar saved", avatarId);

      console.log("avatar saved in storage", localStorage);
      localStorage.setItem("selectedAvatar", selectedAvatar);

      await handleUpdateSubscriberProfile(msisdn, nickname, avatarId);

      setCurrentAvatar(selectedAvatar);

      setShowAvatarSelector(false);
    } catch (error) {
      console.error("Error saving avatar:", error);
    }
  };

  const XwingFighterUrl = "/x-wing-fighter/index.html";

  const handlePlay = (XwingFighterUrl, msisdn) => {
    const storedData = localStorage.getItem("com.disney.fighter.game_11.save");
    console.log("Stored score for stored:", storedData);

    const parsedData = storedData ? JSON.parse(storedData) : null;

    const bestScore = parsedData ? parsedData.bestScore : 0;

    console.log("Stored score for bestScore:", bestScore);

    setIframeSrc(XwingFighterUrl);
  };

  const handleBackToApp = async () => {
    setIframeSrc("");
    const storedData = localStorage.getItem("com.disney.fighter.game_11.save");

    const parsedData = storedData ? JSON.parse(storedData) : null;

    const bestScore = parsedData ? parsedData.bestScore : 0;

    console.log("Stored score outside for bestScore:", bestScore);
    const gameScore = bestScore;

    await handleUpdateLeaderboardScore(msisdn, gameScore);
  };

  return (
    <>
      <div className="relative ">
        <div
          className={`flex flex-col min-h-screen  h-[1240px] bg-darrk-gradient  ${
            showAvatarSelector ? " blur-[3px]" : ""
          }`}
        >
          <div className="bg-[#E2EEF60D] mt-[17px]">
            <div className="bg-nav-gradient rounded-[26px] text-white flex justify-center items-center w-[222px] h-[49px]  mt-[21px] mx-auto">
              <div className="flex justify-between items-center w-[242px] h-[49px]">
                <div className="flex items-center  space-x-10  relative">
                  <div
                    className="w-[50px] h-[50px]  flex items-center justify-center cursor-pointer"
                    onClick={handleAvatarClick}
                  >
                    <img
                      src={currentAvatar || "/default-avatar.png"}
                      alt="Profile Avatar"
                      className="-ml-[8px] -mb-[6px]"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-[10px]  ">
                    {/* <div className="flex items-center justify-center">
                      <img src={Coins} alt="coin" />
                      <p className="font-mtn-brighter-medium font-medium text-[12px] text-center leading-[15.6px] text-[#FFFFFF]">
                        R10k
                      </p>
                    </div> */}

                    <Link
                      to="/terms-and-conditions"
                      className="border border-[#FFCB05] rounded-[26px] w-[51px] h-[27px] bg-[#7F806266] flex justify-center items-center mt-[12px] mb-[10px] "
                    >
                      <p className="font-mtn-brighter-medium font-medium text-[12px] leading-[15.6px] text-center text-[#FFCB05]">
                        T&C's
                      </p>
                    </Link>
                    <Link
                      to="/faq"
                      className="border border-[#FFCB05]   rounded-[26px] w-[51px] h-[27px]  flex items-center  justify-center gap-[6px]   py-[5px] px-[20px]  "
                    >
                      <p className="font-mtn-brighter-medium font-medium text-[12px] leading-[15.6px] text-center text-[#FFCB05]">
                        {" "}
                        FAQ's
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-background w-[140px] h-[28px] rounded-b-[26px] flex items-center justify-center mx-auto shadow-box-shadow">
              <p className="font-mtn-brighter-medium font-medium text-[10px] leading-[13px] text-center text-[#FFFFFF]">
                @{userProfile?.msisdn}
              </p>
            </div>
            <div className="flex flex-col items-center flex-grow mt-[20px]">
              <p className="text-white mb-[17px] font-mtn-brighter-xtra-bold font-extrabold text-[24px] leading-[31.2px] text-center">
                Play Now
              </p>
              {loading ? <p>Loading games...</p> : <CarouselSection />}
            </div>
          </div>

          <section className="mt-[36px] w-full max-w-4xl lg:mx-auto">
            <h2 className="font-mtn-brighter-xtra-bold font-extrabold text-[24px] leading-[31.2px] text-center text-[#FFFFFF]">
              All Games
            </h2>
            <div className="space-x-[33px] mt-[17px] flex justify-center items-center mb-[20px]">
              {/* {categories.map((category, index) => (
                <button
                  key={index}
                  className="flex items-center justify-center text-white rounded-[26px] border border-[#D7E7F066] bg-[#EDF0F233] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] gap-[6px] text-center px-[9px] py-[5px]"
                >
                  {category === "Action" && <img src={Action} alt="action" />}
                  {category === "Adventure" && (
                    <img src={Fantasy} alt="fantasy" />
                  )}
                  {category === "Racing" && <img src={Racing} alt="racing" />}
                  {category}
                </button>
              ))} */}
            </div>

            <div className="flex items-center justify-center">
              <div className="grid grid-cols-2 gap-[35px] mb-4">
                {/* {games.map((game, index) => ( */}

                {/* {games && */}
                {/* games.length > 0 && */}
                {/* games.map((game) => ( */}
                <div
                  // key={game.gameId}
                  className="bg-custom-t-gradient flex flex-col items-center justify-center mt-[32px] rounded-[16px] w-[152px] h-[166px]"
                >
                  <img
                    src={SkateRush}
                    alt="rush"
                    className="mb-[6px] -mt-[50px] w-[60px] h-[60px] rounded-[12px] object-cover"
                  />
                  {/* <img
                        src={
                          game.base64
                            ? `data:image/png;base64,${game.base64}`
                            : game.title &&
                              game.title.trim() === "X-Wing Fighter"
                            ? XWinger
                            : ""
                        }
                        alt={game.title || "game-image"}
                        className="mb-[6px] -mt-[50px] w-[60px] h-[60px] rounded-[12px] object-cover"
                      /> */}

                  <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center text-[#FFFFFF]">
                    {/* {truncateTitle(game.title.toUpperCase())} */}
                    SKATE RUSH
                  </p>
                  <div className="flex items-center justify-center mt-[9.8px]">
                    {/* <StarRatings /> */}
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                  </div>

                  <Link to="#">
                    <button
                      onClick={() => handlePlay(XwingFighterUrl, msisdn)}
                      className="bg-[#FFCB05] w-[108px] h-[30px] rounded-[15px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center flex items-center justify-center px-[30px] py-[6px] mx-auto mt-[12.87px]"
                    >
                      Play
                    </button>
                  </Link>
                </div>

                <div className="bg-custom-t-gradient flex flex-col items-center justify-center mt-[32px] rounded-[16px] w-[152px] h-[166px]">
                  <img
                    src={StarWars}
                    alt="ground"
                    className="mb-[6px] -mt-[50px] w-[60px] h-[60px] rounded-[12px] object-cover"
                  />

                  <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center text-[#FFFFFF]">
                    STAR WARS
                  </p>
                  <div className="flex items-center justify-center mt-[9.8px]">
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                  </div>

                  <Link to="#">
                    <button
                      onClick={() => handlePlay(XwingFighterUrl, msisdn)}
                      className="bg-[#FFCB05] w-[108px] h-[30px] rounded-[15px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center flex items-center justify-center px-[30px] py-[6px] mx-auto mt-[12.87px]"
                    >
                      Play
                    </button>
                  </Link>
                </div>

                <div className="bg-custom-t-gradient flex flex-col items-center justify-center mt-[32px] rounded-[16px] w-[152px] h-[166px]">
                  <img
                    src={TempleQuest}
                    alt="quest"
                    className="mb-[6px] -mt-[50px] w-[60px] h-[60px] rounded-[12px] object-cover"
                  />

                  <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center text-[#FFFFFF]">
                    TEMPLE QUEST
                  </p>
                  <div className="flex items-center justify-center mt-[9.8px]">
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                  </div>

                  <Link to="#">
                    <button
                      onClick={() => handlePlay(XwingFighterUrl, msisdn)}
                      className="bg-[#FFCB05] w-[108px] h-[30px] rounded-[15px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center flex items-center justify-center px-[30px] py-[6px] mx-auto mt-[12.87px]"
                    >
                      Play
                    </button>
                  </Link>
                </div>

                <div className="bg-custom-t-gradient flex flex-col items-center justify-center mt-[32px] rounded-[16px] w-[152px] h-[166px]">
                  <img
                    src={XWinger}
                    alt="forknite"
                    className="mb-[6px] -mt-[50px] w-[60px] h-[60px] rounded-[12px] object-cover"
                  />

                  <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center text-[#FFFFFF]">
                    X WING FIGHTER
                  </p>
                  <div className="flex items-center justify-center mt-[9.8px]">
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                  </div>

                  <Link to="#">
                    <button
                      onClick={() => handlePlay(XwingFighterUrl, msisdn)}
                      className="bg-[#FFCB05] w-[108px] h-[30px] rounded-[15px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center flex items-center justify-center px-[30px] py-[6px] mx-auto mt-[12.87px]"
                    >
                      Play
                    </button>
                  </Link>
                </div>

                {/* ))} */}
              </div>
            </div>
            <BigCashGame />
          </section>
        </div>

        {iframeSrc && (
          <div className="absolute inset-0 bg-white z-50">
            <iframe
              src={iframeSrc}
              title="Game"
              sandbox="allow-scripts allow-same-origin"
              className="w-full h-full"
            />
            <button
              onClick={handleBackToApp}
              className="absolute top-4 right-4 bg-sky-900 text-white px-4 py-2 rounded"
            >
              Back to App
            </button>
          </div>
        )}

        <div className="fixed w-full flex justify-center  ">
          <div
            style={navStyle}
            className="bottom-0 backdrop-blur-sm mb-[15px] md:mb-[50px]   left-0px flex justify-between items-center w-[342px] h-[82px] bg-foot-nav-gradient rounded-b-[60px] pt-[12px] pb-[20px] px-[46px] "
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

export default HomePage;


