import React, { useRef, useEffect, useState, useContext } from "react";
import Frame1 from "../assets/Images/frame1.png";
import Frame2 from "../assets/Images/frame2.png";
import Frame3 from "../assets/Images/frame3.png";
import StarW from "../assets/Icons/Star-w.png";
import SkateRush from "../assets/Images/rush.jpeg";
import StarWars from "../assets/Images/ground.jpeg";
import TempleQuest from "../assets/Images/quest.jpeg";
import GameContext from "../Context/GameContext";
import AuthContext from "../Context/AuthContext";
import UserContext from "../Context/UserContext";
import { LeaderboardContext } from "../Context/LeaderboardContext";
import { Link } from "react-router-dom";

import "../App.css";

const CarouselSection = () => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const { auth } = useContext(AuthContext);
  const { games, loading } = useContext(GameContext);
  const [iframeSrc, setIframeSrc] = useState("");
  const { handleUpdateSubscriberProfile, fetchProfile, userProfile, msisdn } =
    useContext(UserContext);
  const { handleUpdateLeaderboardScore } = useContext(LeaderboardContext);

  const carouselConfig = [
    { frame: Frame1, bgColor: "#19BFC1" },
    { frame: Frame2, bgColor: "#CFA400" },
    { frame: Frame3, bgColor: "#4601B7" },
  ];

  const truncateTitle = (title) => {
    const maxLength = 10;
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };

  useEffect(() => {
    const carousel = carouselRef.current;

    const handleScroll = () => {
      if (carousel) {
        const scrollLeft = carousel.scrollLeft;
        const itemWidth = 250;
        const newActiveIndex = Math.round(scrollLeft / itemWidth);
        setActiveIndex(newActiveIndex);
      }
    };

    if (carousel) {
      carousel.addEventListener("scroll", handleScroll);

      const carouselWidth = carousel.offsetWidth;
      const itemWidth = 189;
      const middleItemIndex = Math.floor(3 / 2);
      const scrollPosition =
        middleItemIndex * itemWidth - carouselWidth / 2 + itemWidth / 2;

      carousel.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });

      return () => {
        carousel.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const getCardClass = (index) => {
    return index === activeIndex
      ? "scale-130 transition-transform duration-300"
      : "scale-90 opacity-75 transition-transform duration-300";
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
    <div className="w-full">
      <div className="overflow-x-auto scrollbar-hide" ref={carouselRef}>
        <div className="flex space-x-[12px] w-max mx-0 md:mx-auto">
          {/* {games.length > 0 ? ( */}
          {/* games.slice(0, 3).map((game, index) => ( */}
          <div
            // to="#"
            onClick={() => handlePlay(XwingFighterUrl, msisdn)}
            className={`min-w-[157px] flex-shrink-0 ${
              getCardClass()
              // index
            }`}
          >
            <div className="relative rounded-[20px] pt-[7px] px-0 border border-[#FEFFD366] bg-[#2E3237] overflow-visible">
              <div
                className="relative w-[142px] h-[71px] mx-[7px] bg-cover bg-center rounded-[16px] flex flex-col items-center justify-between"
                style={{
                  backgroundImage: `url(${Frame1})`,
                }}
              >
                <img
                  // src={`data:image/png;base64,${game.base64}`}
                  style={{ top: "-15px" }}
                  alt="rush"
                  src={SkateRush}
                  className="w-[59px] h-[58px] rounded-[12px] absolute  object-cover z-10 "
                />
                <div className="absolute bottom-1 text-center">
                  <p className="font-mtn-brighter-xtra-bold font-extrabold text-[14px] leading-[18.2px] text-center text-[#002E38]">
                    {/* {truncateTitle(game.title.toUpperCase())} */}
                    SKATE RUSH
                  </p>
                </div>
              </div>
              <div className="flex items-center mx-0 border-none mt-[10px] mb-0 px-0">
                <span
                  style={{
                    backgroundColor: carouselConfig.bgColor,
                  }}
                  className="bg-[#19BFC1] rounded-bl-[20px] w-[103px] h-[30px] flex items-center justify-center"
                >
                  {Array(5)
                    .fill()
                    .map((_, starIndex) => (
                      <img key={starIndex} src={StarW} alt="star" />
                    ))}
                  {/* <StarRatings/> */}
                </span>
                <button className="bg-[#2A76D8] pt-[7px] pb-[7px]  px-[15px] rounded-br-[20px]">
                  <p
                    onClick={() => handlePlay(XwingFighterUrl, msisdn)}
                    className="font-mtn-brighter-medium font-medium text-center text-[12px] leading-[15.6px] text-white"
                  >
                    Play
                  </p>
                </button>
              </div>
            </div>
          </div>
          {/* ))
            ) : (
              <p>No games available.</p>
            )} */}
          <div
            onClick={() => handlePlay(XwingFighterUrl, msisdn)}
            className={`min-w-[157px] flex-shrink-0 ${getCardClass()}`}
          >
            <div className="relative rounded-[20px] pt-[7px] px-0 border border-[#FEFFD366] bg-[#2E3237] overflow-visible">
              <div
                className="relative w-[142px] h-[71px] mx-[7px] bg-cover bg-center rounded-[16px] flex flex-col items-center justify-between"
                style={{
                  backgroundImage: `url(${Frame2})`,
                }}
              >
                <img
                  style={{ top: "-15px" }}
                  alt="rush"
                  src={StarWars}
                  className="w-[59px] h-[58px] rounded-[12px] absolute  object-cover z-10 "
                />
                <div className="absolute bottom-1 text-center">
                  <p className="font-mtn-brighter-xtra-bold font-extrabold text-[14px] leading-[18.2px] text-center text-[#002E38]">
                    STAR WARS
                  </p>
                </div>
              </div>
              <div className="flex items-center mx-0 border-none mt-[10px] mb-0 px-0">
                <span
                  style={{
                    backgroundColor: carouselConfig.bgColor,
                  }}
                  className="bg-[#CFA400] rounded-bl-[20px] w-[103px] h-[30px] flex items-center justify-center"
                >
                  {Array(5)
                    .fill()
                    .map((_, starIndex) => (
                      <img key={starIndex} src={StarW} alt="star" />
                    ))}
                </span>
                <button className="bg-[#2A76D8] pt-[7px] pb-[7px]  px-[15px] rounded-br-[20px]">
                  <p
                    onClick={() => handlePlay(XwingFighterUrl, msisdn)}
                    className="font-mtn-brighter-medium font-medium text-center text-[12px] leading-[15.6px] text-white"
                  >
                    Play
                  </p>
                </button>
              </div>
            </div>
          </div>

          <div
            onClick={() => handlePlay(XwingFighterUrl, msisdn)}
            className={`min-w-[157px] flex-shrink-0 ${getCardClass()}`}
          >
            <div className="relative rounded-[20px] pt-[7px] px-0 border border-[#FEFFD366] bg-[#2E3237] overflow-visible">
              <div
                className="relative w-[142px] h-[71px] mx-[7px] bg-cover bg-center rounded-[16px] flex flex-col items-center justify-between"
                style={{
                  backgroundImage: `url(${Frame3})`,
                }}
              >
                <img
                  style={{ top: "-15px" }}
                  alt="rush"
                  src={TempleQuest}
                  className="w-[59px] h-[58px] rounded-[12px] absolute  object-cover z-10 "
                />
                <div className="absolute bottom-1 text-center">
                  <p className="font-mtn-brighter-xtra-bold font-extrabold text-[14px] leading-[18.2px] text-center text-[#002E38]">
                    TEMPLE QUEST
                  </p>
                </div>
              </div>
              <div className="flex items-center mx-0 border-none mt-[10px] mb-0 px-0">
                <span
                  style={{
                    backgroundColor: carouselConfig.bgColor,
                  }}
                  className="bg-[#4601B7] rounded-bl-[20px] w-[103px] h-[30px] flex items-center justify-center"
                >
                  {Array(5)
                    .fill()
                    .map((_, starIndex) => (
                      <img key={starIndex} src={StarW} alt="star" />
                    ))}
                </span>
                <button className="bg-[#2A76D8] pt-[7px] pb-[7px]  px-[15px] rounded-br-[20px]">
                  <p
                    onClick={() => handlePlay(XwingFighterUrl, msisdn)}
                    className="font-mtn-brighter-medium font-medium text-center text-[12px] leading-[15.6px] text-white"
                  >
                    Play
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* )} */}
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
    </div>
  );
};

export default CarouselSection;
