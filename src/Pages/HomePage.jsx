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
import FPBRating from "../assets/Images/FPBrating.png";
import TempleQuest from "../assets/Images/quest.jpeg";
import TempleRun from "../assets/Images/game2.png";
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
// import { useAuth } from '../Context/AuthContext';
// import GameContext from "../Context/GameContext";
import UserContext from "../Context/UserContext";
import BigCashGame from "../Components/BigCashGame";
import StarRatings from "../Components/StarRatings";
import { LeaderboardContext } from "../Context/LeaderboardContext";
import axios from "axios";
import ThresholdModal from "../Components/Modal/ThresholdModal";

const HomePage = () => {
  const avatars = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5];
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(AvatarProfile);
  const [scrollDirection, setScrollDirection] = useState("null");
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const { auth } = useContext(AuthContext);
  // const { auth, setAuth } = useAuth();

  const { handleUpdateSubscriberProfile, fetchProfile, userProfile, msisdn } =
    useContext(UserContext);
  // const { games, loading } = useContext(GameContext);
  const [categories, setCategories] = useState([]);
  const [nickname, setNickname] = useState("Racer001");
  const { handleUpdateLeaderboardScore } = useContext(LeaderboardContext);
  const { leaderboard, fetchLeaderboardStanding } =
    useContext(LeaderboardContext);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [iframeSrc, setIframeSrc] = useState("");
  const [gameScore, setGameScore] = useState(0);
  const [isLandscape, setIsLandscape] = useState(false);
  const [games, setGames] = useState("");
  const [loading, setLoading] = useState("");
  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleOrientationChange = () => {
    setIsLandscape(window.innerWidth > window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", handleOrientationChange);
    handleOrientationChange();
    return () => window.removeEventListener("resize", handleOrientationChange);
  }, []);

  useEffect(() => {
    if (error) {
      navigate("/error");
    }
  }, [error, navigate]);

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
    const storedAvatar = localStorage.getItem("selectedAvatar");
    if (storedAvatar) {
      setSelectedAvatar(storedAvatar);
      setCurrentAvatar(storedAvatar);
    } else {
      setCurrentAvatar(AvatarProfile);
    }
  }, []);
  const storedMsisdn = localStorage.getItem("cli");

  const handleAvatarClick = () => {
    setShowAvatarSelector(!showAvatarSelector);
  };

  const handleAvatarSelect = (avatarId) => {
    setSelectedAvatar(avatarId);
  };

  const handleSave = async () => {
    try {
      if (!selectedAvatar) return;
      const avatarId = avatars.indexOf(selectedAvatar) + 1;

      const msisdn = userProfile?.msisdn || storedMsisdn;
      if (!msisdn) {
        setError("MSISDN is required");
        // console.log("MSISDN is required");
        return;
      }
      const nickname = msisdn;
      // console.log("avatar saved", avatarId);

      // console.log("avatar saved in storage", localStorage);
      localStorage.setItem("selectedAvatar", selectedAvatar);

      await handleUpdateSubscriberProfile(msisdn, nickname, avatarId);

      setCurrentAvatar(selectedAvatar);

      setShowAvatarSelector(false);
    } catch (error) {
      console.error("Error saving avatar:", error);
    }
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

    templeRun: {
      url: "/temple-run-2/index.html",
      localStorageKey: "TR2_GAME_STATE",

      getScore: (data) => {
        const currentScore = data?.currentDayDataFinal?.score || 0;
        const lastSessionScore =
          parseFloat(localStorage.getItem("lastTempleRunScore")) || 0; // Ensure we parse it as a number

        const currentChallengeDate = data?.currentChallengeDate;
        const lastPlayDate = localStorage.getItem("lastPlayDate");

        // Check if it's a new day, if so, reset the last session score
        if (lastPlayDate !== currentChallengeDate) {
          localStorage.setItem("lastTempleRunScore", 0);
          localStorage.setItem("lastPlayDate", currentChallengeDate);
        }

        // Calculate the session score
        const sessionScore = currentScore - lastSessionScore;

        // Update the last session score
        localStorage.setItem("lastTempleRunScore", currentScore);

        // Return the session score, rounded up to the nearest integer
        return Math.ceil(sessionScore > 0 ? sessionScore : 0);
      },
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

  const checkUserThreshold = async (msisdn) => {
    try {
      const thresholdResponse = await axios.get(
        `https://ydotgames.runasp.net/api/YellowdotGames/CheckUserThreshold?MSISDN=${msisdn}`
      );

      if (thresholdResponse.data.data) {
        // initiateAdhocBilling(msisdn);
        setShowThresholdModal(true);
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error checking threshold:", error);
      setErrorMessage("Error verifying your access. Please try again.");
      return false;
    }
  };

  // const initiateAdhocBilling = async (msisdn) => {
  //   try {
  //     const randomRef = Math.floor(1000000000 + Math.random() * 9000000000); // 10-digit random number
  //     const billingUrl = `http://doi.dep.mtn.co.za/service/10852?ext_ref=${randomRef}`;

  //     window.location.href = billingUrl;
  //   } catch (error) {
  //     console.error("Error initiating payment:", error);
  //     setErrorMessage("Error processing payment. Please try again.");
  //   }
  // };

  const handleContinue = async () => {
    // setShowPopup(false);
    setShowThresholdModal(false)

    try {
      const randomRef = Math.floor(1000000000 + Math.random() * 9000000000);
      const billingUrl = `http://doi.dep.mtn.co.za/service/10852?ext_ref=${randomRef}`;
      window.location.href = billingUrl;
    } catch (error) {
      console.error("Error initiating payment:", error);
      setErrorMessage("Error processing payment. Please try again.");
    }
  };

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
      // parsedData = storedData && storedData.startsWith("{") ? JSON.parse(storedData) : storedData.split(",");
    }

    // console.log("Parsed Data:", parsedData);

    const gameScore = game.getScore(parsedData);

    // console.log("Game Score Retrieved:", gameScore);

    if (gameScore !== undefined && gameScore !== null) {
      // console.log("Stored score outside for bestScore:", gameScore);

      const isEligible = await checkUserThreshold(msisdn);

      if (!isEligible) {
        console.warn("User has exceeded the threshold.");

        return;
      }

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
    if (msisdn && gameScore) {
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

  // console.log(msisdn);

  return (
    <>
      {!iframeSrc ? (
        <div className="relative ">
          <div
            className={`flex flex-col min-h-screen bg-darrk-gradient  ${
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
                        src={currentAvatar || AvatarProfile}
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
                  @{msisdn}
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
                    {/* <p className="font-mtn-brighter-bold font-bold  mt-1 text-[12px] leading-[16px] text-center text-[#FFFFFF]">
                      FPB Rating: PG
                    </p> */}
                    <div className="flex items-center justify-center mt-[9.8px]">
                      {/* <StarRatings /> */}
                      <img src={StarYs} alt="start" />
                      <img src={StarYs} alt="start" />
                      <img src={StarYs} alt="start" />
                      <img src={StarYs} alt="start" />
                      <img src={StarYs} alt="start" />
                    </div>

                    <img
                      src={FPBRating}
                      alt="rating"
                      className="w-8 h-8 pt-[5.87px]"
                    />

                    <Link to="#">
                      <button
                        onClick={() =>
                          handleSkatePlay(gameConfig.skateRush, msisdn)
                        }
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
                    {/* <p className="font-mtn-brighter-bold mt-1  font-bold text-[12px] leading-[16px] text-center text-[#FFFFFF]">
                      FPB Rating: 12
                    </p> */}
                    <div className="flex items-center justify-center mt-[9.8px]">
                      <img src={StarYs} alt="start" />
                      <img src={StarYs} alt="start" />
                      <img src={StarYs} alt="start" />
                      <img src={StarYs} alt="start" />
                      <img src={StarYs} alt="start" />
                    </div>

                    <img
                      src={FPBRating}
                      alt="rating"
                      className="w-8 h-8 pt-[5.87px]"
                    />

                    <Link to="#">
                      <button
                        onClick={() =>
                          handleStarWarsPlay(gameConfig.starWars, msisdn)
                        }
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
                    {/* <p className="font-mtn-brighter-bold mt-1  font-bold text-[12px] leading-[16px] text-center text-[#FFFFFF]">
                      FPB Rating: G
                    </p> */}
                    <div className="flex items-center justify-center mt-[9.8px]">
                      <img src={StarYs} alt="start" />
                      <img src={StarYs} alt="start" />
                      <img src={StarYs} alt="start" />
                      <img src={StarYs} alt="start" />
                      <img src={StarYs} alt="start" />
                    </div>
                    <img
                      src={FPBRating}
                      alt="rating"
                      className="w-8 h-8 pt-[5.87px]"
                    />

                    <Link to="#">
                      <button
                        onClick={() =>
                          handleTemplePlay(gameConfig.templeQuest, msisdn)
                        }
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
                    {/* <p className="font-mtn-brighter-bold  mt-1 font-bold text-[12px] leading-[16px] text-center text-[#FFFFFF]">
                      FPB Rating: PG-13
                    </p> */}
                    <div className="flex items-center justify-center mt-[9.8px]">
                      <img src={StarYs} alt="start" />
                      <img src={StarYs} alt="start" />
                      <img src={StarYs} alt="start" />
                      <img src={StarYs} alt="start" />
                      <img src={StarYs} alt="start" />
                    </div>
                    <img
                      src={FPBRating}
                      alt="rating"
                      className="w-8 h-8 pt-[5.87px]"
                    />

                    <Link to="#">
                      <button
                        onClick={() =>
                          handleXwingPlay(gameConfig.xWingFighter, msisdn)
                        }
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

          {/* <div className={`absolute inset-0 bg-black mx-[2px] z-50 ${
          //   isLandscape ? "rotate-90 scale-[calc(1/1.5)] origin-center" : ""
          // }`}
          // style={{ width: isLandscape ? '100vh' : '100vw', height: isLandscape ? '100vw' : '100vh' }}

          //   >
        {/* <div className="fixed"> */}
          {/* */}

          <div className="w-max mx-auto">
            <div
              // style={navStyle}
              className="fixed mx-auto left-0 right-0 bottom-0 backdrop-blur-sm flex justify-between items-center w-[342px] h-[82px] bg-foot-nav-gradient rounded-b-[60px] pt-[12px] pb-[20px] px-[46px] "
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
      ) : (
        <div className="mx-auto h-screen bg-black">
          <iframe
            src={iframeSrc}
            title="Game"
            seamless
            // scrolling="no"
            // sandbox="allow-scripts allow-same-origin"
            // sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            className="iframer h-[88vh] w-full"
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
          >
            Back to App
          </button>
        </div>
      )}
      <ThresholdModal
        isOpen={showThresholdModal}
        onClose={() => setShowThresholdModal(false)}
        onContinue={handleContinue}
      />
    </>
  );
};

export default HomePage;
