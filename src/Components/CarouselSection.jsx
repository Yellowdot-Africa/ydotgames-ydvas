import React, { useRef, useEffect, useState, useContext } from "react";
import Frame1 from "../assets/Images/frame1.png";
import Frame2 from "../assets/Images/frame2.png";
import Frame3 from "../assets/Images/frame3.png";
import StarW from "../assets/Icons/Star-w.png";
import SkateRush from "../assets/Images/rush.jpeg";
import StarWars from "../assets/Images/ground.jpeg";
import TempleQuest from "../assets/Images/quest.jpeg";
import TempleRun from "../assets/Images/game2.png";
import GameContext from "../Context/GameContext";
import AuthContext from "../Context/AuthContext";
// import { useAuth } from '../Context/AuthContext';
import UserContext from "../Context/UserContext";
import { LeaderboardContext } from "../Context/LeaderboardContext";
import { Link } from "react-router-dom";

import "../App.css";

const CarouselSection = () => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const { auth } = useContext(AuthContext);
  // const { auth, setAuth } = useAuth();

  const { games, loading } = useContext(GameContext);
  const [iframeSrc, setIframeSrc] = useState("");
  const { handleUpdateSubscriberProfile, fetchProfile, userProfile, msisdn } =
    useContext(UserContext);
  const { handleUpdateLeaderboardScore, fetchLeaderboardStanding } =
    useContext(LeaderboardContext);
  const [gameScore, setGameScore] = useState(0);

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
      const itemWidth = 160;
      // const middleItemIndex = Math.floor(3 / 2);
      const middleItemIndex = Math.floor(carouselConfig.length / 2); 

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

  const gameConfig = {
    xWingFighter: {
      url: "/x-wing-fighter/index.html",
      localStorageKey: "x-wing-fighter-gameScore",

      getScore: () => {
        const score = localStorage.getItem("x-wing-fighter-gameScore");
        return score ? Number(score) : 0;
      },
    },

    templeQuest: {
      url: "/temple-quest/index.html",
      localStorageKey: "inl-tmpl-qst",

      // Get the current session score by subtracting PlayerCoinsAtStart from PlayerCoins
      getScore: (data) => {
        const playerCoins = data?.PlayerCoins || 0;
        const playerCoinsAtStart = data?.PlayerCoinsAtStart || 0;

        // Calculate the current score by subtracting the initial coins from the current coins
        const currentScore = playerCoins - playerCoinsAtStart;

        // If the score is negative (which shouldn't happen), return 0
        return currentScore > 0 ? currentScore : 0;
      },
    },

    skateRush: {
      url: "/skate-rush/index.html",
      localStorageKey: "skaterushv4",

      // Method to get the highest score
      getScore: () => {
        const localStorageScore = localStorage.getItem("skaterushv4");

        // Convert stored string to an array of numbers
        const scoresArray = localStorageScore
          ? localStorageScore.split(",").map(Number) // Convert to numbers
          : [];

        // Get the last score from the array
        const lastScore =
          scoresArray.length > 0 ? scoresArray[scoresArray.length - 1] : 0;

        return lastScore; // Return the last score or 0 if array is empty
      },

      // Method to set a new score
      setScore: (newScore) => {
        // Ensure the new score is a number and greater than zero
        if (!isNaN(newScore) && newScore > 0) {
          const currentScores = localStorage.getItem("skaterushv4");

          // Parse the current scores or initialize an empty array
          const scoresArray = currentScores
            ? currentScores.split(",").map(Number) // Convert to numbers
            : [];

          // Add the new score to the array
          scoresArray.push(Number(newScore));

          // Update the localStorage with the new scores
          localStorage.setItem("skaterushv4", scoresArray.join(","));
        }
      },
    },
    starWars: {
      url: "/star-wars-rogue/index.html",
      localStorageKey: "sw_boots_1.0",
      getScore: (data) => data?.arcade?.lastScore || 0,
    },
  };

  const handlePlay = (gameKey, msisdn) => {
    const game = gameConfig[gameKey];

    if (!game) {
      console.error("Game configuration not found");
      return;
    }

    const storedData = localStorage.getItem(game.localStorageKey);
    // console.log(`Stored score for ${gameKey}:`, storedData);

    let parsedData;
    try {
      // Try to parse the data as JSON
      parsedData = storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      console.warn("Data is not in JSON format, handling as a string:", error);
      // Handle SkateRush data as a comma-separated string
      parsedData = storedData ? storedData.split(",") : null;
    }

    // If the game score is stored as JSON, use the game's getScore function
    const gameScore = game.getScore(parsedData);

    if (gameScore === undefined || gameScore === null) {
      console.error("Score not found in localStorage for", gameKey);
    }
    // console.log(`Best score for ${gameKey}:`, gameScore);

    setIframeSrc(game.url);

    return gameScore;
  };

  const handleXwingPlay = () => {
    const gameScore = handlePlay("xWingFighter", msisdn);
    // console.log("X-Wing Fighter score:", gameScore);
  };

  const handleSkatePlay = () => {
    const gameScore = handlePlay("skateRush", msisdn);
    // console.log("Skate Rush score:", gameScore);
  };

  const handleTemplePlay = () => {
    const gameScore = handlePlay("templeQuest", msisdn);
    // console.log("Temple run score:", gameScore);
  };

  const handleStarWarsPlay = () => {
    const gameScore = handlePlay("starWars", msisdn);
    // console.log("Star wars score:", gameScore);
  };

  const gameMappings = {
    "/x-wing-fighter/index.html": "xWingFighter",
    "/skate-rush/index.html": "skateRush",
    "/star-wars-rogue/index.html": "starWars",
    // "/temple-run-2/index.html": "templeRun",
    "/temple-quest/index.html": "templeQuest",
  };

  // useEffect(() => {
  //   if (msisdn) {
  //     // console.log("Updated MSISDN:", msisdn);

  //     handleUpdateLeaderboardScore(msisdn, gameScore);
  //   }
  // }, [msisdn, gameScore]);

  const handleBackToApp = async (gameKey, msisdn) => {
    setIframeSrc("");
    // console.log("Game Key:", gameKey);
    const game = gameConfig[gameKey];
    if (!game) {
      console.error("Game configuration not found for key:", gameKey);
      return;
    }

    const storedData = localStorage.getItem(game.localStorageKey);
    let parsedData;
    try {
      // Try to parse the data as JSON
      parsedData = storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      console.warn("Data is not in JSON format, handling as a string:", error);
      // Handle SkateRush data as a comma-separated string
      parsedData = storedData ? storedData.split(",") : null;
    }

    // console.log("Parsed Data:", parsedData);

    const gameScore = game.getScore(parsedData);

    // console.log("Game Score Retrieved:", gameScore);

    if (gameScore !== undefined && gameScore !== null) {
      // console.log("Stored score outside for bestScore:", gameScore);
      try {
        // console.log("MSISDN before updating leaderboard:", msisdn);

        await handleUpdateLeaderboardScore(msisdn, gameScore);
        // console.log("Leaderboard updated successfully with score:", gameScore);
        await fetchLeaderboardStanding();
        // console.log("Leaderboard standing with score:", gameScore);
      } catch (error) {
        console.error("Error updating leaderboard:", error);
      }
    } else {
      console.error("Game score is invalid:", gameScore);
    }
  };

  useEffect(() => {
    if (msisdn && gameScore > 0) {
      // console.log("Updated MSISDN:", msisdn);
      handleUpdateLeaderboardScore(msisdn, gameScore)
        .then(() => {
          // console.log(
          //   "Leaderboard updated successfully with score:",
          //   gameScore
          // );
          fetchLeaderboardStanding();
        })
        .catch((error) => {
          console.error("Error updating leaderboard:", error);
        });
    }
  }, [msisdn, gameScore]);

  return (
    <>
    <div className="w-full">
      <div className="overflow-x-auto scrollbar-hide" ref={carouselRef}>
        <div className="flex space-x-[12px] w-max mx-0 md:mx-auto">
          {/* {games.length > 0 ? ( */}
          {/* games.slice(0, 3).map((game, index) => ( */}
          <div
            // to="#"
            onClick={() => handleSkatePlay(gameConfig.skateRush, msisdn)}
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
                    onClick={() =>
                      handleSkatePlay(gameConfig.skateRush, msisdn)
                    }
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
            onClick={() => handleStarWarsPlay(gameConfig.starWars, msisdn)}
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
                    onClick={() =>
                      handleStarWarsPlay(gameConfig.starWars, msisdn)
                    }
                    className="font-mtn-brighter-medium font-medium text-center text-[12px] leading-[15.6px] text-white"
                  >
                    Play
                  </p>
                </button>
              </div>
            </div>
          </div>

          <div
            onClick={() => handleTemplePlay(gameConfig.templeQuest, msisdn)}
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
                    onClick={() =>
                      handleTemplePlay(gameConfig.templeQuest, msisdn)
                    }
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
        <div className=" fixed inset-0 mx-auto h-screen bg-black z-50">
                  {/* // <div className="mx-auto h-screen bg-black"> */}

          <iframe
            src={iframeSrc}
            title="Game"
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-[88vh]"
          />
          <button
            onClick={() => {
              const gameKey = gameMappings[iframeSrc];
              if (gameKey) {
                handleBackToApp(gameKey, msisdn);
              } else {
                console.error(
                  "No game mapping found for the current iframe source."
                );
              }
            }}
            className="my-4 w-full  bg-sky-900 text-white px-4 py-[12px] rounded-[28px] font-mtn-brighter-medium font-medium text-[18px]"

            // className="absolute top-4 right-4 bg-sky-900 text-white px-4 py-2 rounded"
          >
            Back to App
          </button>
        </div>
      )}
    </div>
    </>
  );
};

export default CarouselSection;
