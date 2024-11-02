import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar1 from "../assets/Icons/avatar1.png";
import AvatarProfile from "../assets/Images/avatar-prof.png";
import Volume from "../assets/Icons/volume.png";
import Radix from "../assets/Icons/radix.png";
import Coins from "../assets/Icons/coins.png";
import Trophy from "../assets/Icons/trophy.png";
import Crown from "../assets/Icons/crown.png";
import SkateRush from "../assets/Images/rush.jpeg";
import XWinger from "../assets/Images/x-winger.png";
import StarWars from "../assets/Images/ground.jpeg";
import TempleRun from "../assets/Images/game2.png";
import TempleQuest from "../assets/Images/quest.jpeg";
import Home from "../assets/Icons/home.png";
import Leaderboard from "../assets/Icons/leaderboard.png";
import Profile from "../assets/Icons/profile.png";
// import GameContext from "../Context/GameContext";
import UserContext from "../Context/UserContext";
import { LeaderboardContext } from "../Context/LeaderboardContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [scrollDirection, setScrollDirection] = useState(null);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  // const { games, loading } = useContext(GameContext);
  const {
    userProfile,
    fetchProfile,
  
    error,
    msisdn,
    handleUpdateSubscriberProfile,
  } = useContext(UserContext);
  const {
    leaderboard,
    fetchLeaderboardStanding,
    handleUpdateLeaderboardScore,
  } = useContext(LeaderboardContext);
  const [myPoints, setMyPoints] = useState(0);
  const [topPoints, setTopPoints] = useState(0);
  const [userAvatar, setUserAvatar] = useState({ AvatarProfile });
  const [iframeSrc, setIframeSrc] = useState("");
  const [gameScore, setGameScore] = useState(0);
  const [games, setGames] = useState("");
  const [loading, setLoading] = useState("");
  useEffect(() => {
    const storedAvatar = localStorage.getItem("selectedAvatar");
    if (storedAvatar) {
      setUserAvatar(storedAvatar);
    }
  }, []);

  useEffect(() => {
   
    if (leaderboard?.length > 0 && userProfile) {
      const myEntry = leaderboard.find(
        (entry) => entry.msisdn === userProfile.msisdn
      );

      setMyPoints(myEntry ? myEntry.dailyPoints : 0);

      const maxPoints = Math.max(
        ...leaderboard.map((entry) => entry.dailyPoints)
      );
      setTopPoints(maxPoints);

    }
  }, [leaderboard, userProfile]);

  


 
 
  
  // const truncateTitle = (title) => {
  //   const maxLength = 10;
  //   if (title.length > maxLength) {
  //     return title.substring(0, maxLength) + "...";
  //   }
  //   return title;
  // };


  const truncateTitle = (title) => {
    const maxLength = 10;
  
    if (title && title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    
    // Return the title as-is, or an empty string if title is undefined or null
    return title || "";
  };

 

  const handleViewLeaderboardClick = () => {
    navigate("/leaderboard");
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

 

  if (loading) {
    return <div>Loading...</div>;
  }
  // if (error) return <p>{error}</p>;

  useEffect(() => {
    if (error) {
      navigate("/error");
    }
  }, [error, navigate]);

  return (
    <>
     {!iframeSrc ? (

      <div className="flex flex-col h-[1059px] md:h-[1390px] bg-profile-gradient   justify-center items-center">
        {/* <div className="bg-[#FFCB05] w-full h-[143px] mx-0"></div> */}
        <div className="bg-darrk-gradient h-[749px]   w-full">
          <div className="flex justify-between items-center -mt-[47px]   ">
            <img
              src={userAvatar || Avatar1}
              alt="Avatar Icon"
              className="w-[108px] h-[108px] rounded-full ml-[40px] md:ml-[170px]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = Avatar1;
              }}
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
                @{msisdn}
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

          <div className="flex items-center justify-center gap-[10px] mt-[30px] mx-[10px]">
            <div className="w-full max-w-[200px] h-[71px] flex items-center justify-center gap-[4px] border-[1.5px] border-[#FFFFFF4A] bg-[#2C3035] shadow-box-shadow rounded-[12px] ">
              <img
                src={userAvatar || Avatar1}
                alt="Score Icon"
                className="w-12 h-12"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = Avatar1;
                }}
                loading="lazy"
              />
              <div className="block">
                <p className="font-mtn-brighter-regular font-regular text-[16px] leading-[20.8px] text-center text-[#FFFFFFCC]   ">
                  Your Score
                </p>
                <p className="font-mtn-brighter-bold font-bold text-[20px] leading-[26px] text-center text-[#FFCB05] overflow-hidden text-ellipsis w-[120px]">
                  {myPoints}
                </p>
              </div>
            </div>

            <div className="w-full max-w-[200px] h-[71px] flex items-center justify-center gap-[10px] border-[1.5px] border-[#FFFFFF4A] bg-[#2C3035] shadow-box-shadow rounded-[12px]">
              <img src={Crown} alt="Score Icon" className="w-10 h-10" />
              <div className="block">
                <p className="font-mtn-brighter-regular font-regular text-[16px] leading-[20.8px] text-center text-[#FFFFFFCC]">
                  Top Score
                </p>
                <p className="font-mtn-brighter-bold font-bold text-[20px] leading-[26px] text-center text-[#FFCB05] overflow-hidden text-ellipsis w-[120px]">
                  {topPoints}
                </p>
              </div>
            </div>
          </div>
          <p className="font-mtn-brighter-xtra-bold font-extrabold text-[24px] leading-[31.2px] text-center text-[#FFFFFF] mt-[40px]">
            Continue Playing
          </p>

          <div className="flex flex-col items-center justify-center gap-[14px] mt-6 w-full ">
            <div className="bg-[#2C3035] px-[25px] py-[13px] border-[1.5px] border-[#FFFFFF66] shadow-lg rounded-[12px] w-[342px] h-[71px] flex items-center ">
              <img
                src={SkateRush}
                alt="rush"
                className="w-[47px] h-[46px] rounded-[10px] object-cover"
                loading="lazy"
              />
              <div className="block pl-[16px]  text-justify">
                <p className="font-mtn-brighter-regular font-regular w-[184px] text-[16px] leading-[20.8px]  text-[#FFFFFF]">
                  SKATE RUSH
                </p>
                <p className="font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-[#FFFFFF]">
                  #200
                </p>
              </div>
              <div className=" flex -mb-[22px] ">
                <Link to="#">
                  <button
                    onClick={() =>
                      handleSkatePlay(gameConfig.skateRush, msisdn)
                    }
                    className="text-[#FFCA00] font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-center "
                  >
                    Play
                  </button>
                </Link>
              </div>
            </div>

            <div className="bg-[#2C3035] px-[25px] py-[13px] border-[1.5px] border-[#FFFFFF66] shadow-lg rounded-[12px] w-[342px] h-[71px] flex items-center ">
              <img
                src={StarWars}
                alt="rush"
                className="w-[47px] h-[46px] rounded-[10px] object-cover"
                loading="lazy"
              />
              <div className="block pl-[16px]  text-justify">
                <p className="font-mtn-brighter-regular font-regular w-[184px] text-[16px] leading-[20.8px]  text-[#FFFFFF]">
                  STAR WARS
                </p>
                <p className="font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-[#FFFFFF]">
                  #200
                </p>
              </div>
              <div className=" flex -mb-[22px] ">
                <Link to="#">
                  <button
                    onClick={() =>
                      handleStarWarsPlay(gameConfig.starWars, msisdn)
                    }
                    className="text-[#FFCA00] font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-center "
                  >
                    Play
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-[#2C3035] px-[25px] py-[13px] border-[1.5px] border-[#FFFFFF66] shadow-lg rounded-[12px] w-[342px] h-[71px] flex items-center ">
              <img
                src={TempleQuest}
                alt="rush"
                className="w-[47px] h-[46px] rounded-[10px] object-cover"
                loading="lazy"
              />
              <div className="block pl-[16px]  text-justify">
                <p className="font-mtn-brighter-regular font-regular w-[184px] text-[16px] leading-[20.8px]  text-[#FFFFFF]">
                  TEMPLE QUEST
                </p>
                <p className="font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-[#FFFFFF]">
                  #200
                </p>
              </div>
              <div className=" flex -mb-[22px] ">
                <Link to="#">
                  <button
                    onClick={() =>
                      handleTemplePlay(gameConfig.templeQuest, msisdn)
                    }
                    className="text-[#FFCA00] font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-center "
                  >
                    Play
                  </button>
                </Link>
              </div>
            </div>
          </div>

         

          {/* <div className="fixed  flex justify-center py-4 "> */}
          <div className="w-max mx-auto">

            <div
              // style={navStyle}
              className="fixed mx-auto left-0 right-0 bottom-0  backdrop-blur-sm   w-[342px] h-[82px] flex justify-between items-center  bg-foot-nav-gradient rounded-b-[60px] pt-[12px] pb-[20px] px-[46px]  "
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
                  loading="lazy"
                />
              </Link>
              <Link
                to="/leaderboard"
                className="bg-foot-nav-gradient rounded-[50px] w-[60px] h-[60px] flex items-center justify-center"
              >
                <img src={Leaderboard} alt="leaderboard" loading="lazy" />
              </Link>
            </div>
          </div>
        </div>
      </div> ):(

            // <div className="absolute inset-0 bg-white z-50">
            <div className="mx-auto h-screen bg-black">
 
              <iframe
                src={iframeSrc}
                title="Game"
                // sandbox="allow-scripts allow-same-origin"
                className="w-full h-[88vh]"
                loading="lazy"
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
                className="my-4 w-full bg-sky-900 text-white px-4 py-2 rounded-[28px] font-mtn-brighter-medium font-medium text-[18px]"
              >
                Back to App
              </button>
            </div>
          )}
    </>
  );
};

export default ProfilePage;
