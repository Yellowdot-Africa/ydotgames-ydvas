// import React, { useContext, useEffect, useState} from 'react';
// import { TriviaContext } from '../Context/TriviaContext';
// import { Link, useNavigate } from 'react-router-dom';
// import Home from "../assets/Icons/home.png";
// import Leaderboard from "../assets/Icons/leaderboard.png";
// import Profile from "../assets/Icons/profile.png";

// const TriviaGames = () => {
//   const { games, fetchGames, selectedGameId, setSelectedGameId } = useContext(TriviaContext);
//   const navigate = useNavigate();
//   const [scrollDirection, setScrollDirection] = useState("null");
//   const [lastScrollTop, setLastScrollTop] = useState(0);

//   useEffect(() => {
//     fetchGames();
//   }, []);

//   const handleCategoryClick = (gameId) => {
//     setSelectedGameId(gameId);
//     navigate(`/bigcash-trivia/${gameId}`);
//   };

//   useEffect(() => {
//     let lastScrollTop = 0;

//     const handleScroll = () => {
//       const scrollTop = window.scrollY || document.documentElement.scrollTop;

//       if (scrollTop > lastScrollTop) {
//         setScrollDirection("down");
//       } else {
//         setScrollDirection("up");
//       }
//       setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
//     };
//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [lastScrollTop]);

//   const navStyle = {
//     position: "fixed",
//     bottom: scrollDirection === "down" ? "0px" : "0px",
//     left: "50%",
//     transform: "translateX(-50%)",
//     transition: "bottom 0.5s ease",
//   };

//   return (
//     <>
//     <div className="flex flex-col items-center   min-h-screen  h-[1040px] bg-[#EFF3F5] p-4 pt-[100px] md:w-[500px] md:mx-auto md:flex-col md:h-[1000px]">
//       <h1 className="text-[30px] leading-[36px] font-mtn-brighter-bold font-bold text-center text-gray-800 mb-6">
//         Choose a Trivia Category
//       </h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
//         {games.map((game) => (
//           <div
//             key={game.id}
//             onClick={() => handleCategoryClick(game.id)}
//             className="cursor-pointer bg-white  border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 p-4 text-center"
//           >
//             <h2 className="text-[20px] leading-[28px] font-mtn-brighter-medium font-medium text-gray-700">{game.name}</h2>
//           </div>
//         ))}
//       </div>
//       <div className="fixed w-full flex justify-center ">
//           <div
//             style={navStyle}
//             className="bottom-0 backdrop-blur-sm mb-[15px] md:mb-[50px]   left-0px flex justify-between items-center w-[90%] h-[82px] mx-auto md:w-[402px] bg-darrk-gradient  rounded-b-[60px] pt-[12px] pb-[20px] px-[46px] "
//           >
//             <Link
//               to="/home"
//               className="bg-foot-nav-gradient rounded-[50px] w-[60px] h-[60px] flex items-center justify-center"
//             >
//               <img src={Home} alt="home" />
//             </Link>
//             <Link
//               to="/user-profile"
//               className="bg-[#FFCB05] rounded-[50px] w-[76px] h-[76px] flex items-center justify-center -mt-[40px]"
//             >
//               <img src={Profile} alt="profile" className="w-[40px] h-[40px]" />
//             </Link>
//             <Link
//               to="/leaderboard"
//               className="bg-foot-nav-gradient rounded-[50px] w-[60px] h-[60px] flex items-center justify-center"
//             >
//               <img src={Leaderboard} alt="leaderboard" />
//             </Link>
//           </div>
//         </div>
//     </div>
//     </>
//   );
// };

// export default TriviaGames;

import React, { useContext, useEffect, useState } from "react";
import { TriviaContext } from "../Context/TriviaContext";
import { Link, useNavigate } from "react-router-dom";
import Home from "../assets/Icons/home.png";
import Leaderboard from "../assets/Icons/leaderboard.png";
import Profile from "../assets/Icons/profile.png";
import { Circles } from "react-loader-spinner";

const TriviaGames = () => {
  const {
    triviaGame,
    fetchTriviaGame,
    setSelectedGameId,
    selectedGameId,
    loading,
    error,
  } = useContext(TriviaContext);
  const navigate = useNavigate();
  const [scrollDirection, setScrollDirection] = useState("null");
  const [lastScrollTop, setLastScrollTop] = useState(0);

  // useEffect(() => {
  //   let lastScrollTop = 0;

  //   const handleScroll = () => {
  //     const scrollTop = window.scrollY || document.documentElement.scrollTop;

  //     if (scrollTop > lastScrollTop) {
  //       setScrollDirection("down");
  //     } else {
  //       setScrollDirection("up");
  //     }
  //     setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
  //   };
  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [lastScrollTop]);

  // const navStyle = {
  //   position: "fixed",
  //   bottom: scrollDirection === "down" ? "0px" : "0px",
  //   left: "50%",
  //   transform: "translateX(-50%)",
  //   transition: "bottom 0.5s ease",
  // };

  useEffect(() => {
    fetchTriviaGame(12);
  }, []);

  // const handleCategoryClick = (gameId) => {
  //       setSelectedGameId(gameId);
  //       navigate(`/bigcash-trivia/${gameId}`);
  //     };

  const handleCategoryClick = (categoryId) => {
    setSelectedGameId(categoryId);

    navigate(`/bigcash-trivia/${categoryId}`);
  };

  // if (loading)
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen">
  //       <Circles color="black" height={50} width={50} />
  //     </div>
  //   );
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="flex flex-col items-center  min-h-screen mb-12  bg-[#EFF3F5] p-4 pt-[100px] md:w-[500px] md:mx-auto md:flex-col md:h-[1000px]">
        <h1 className="text-[30px] leading-[36px] font-mtn-brighter-bold font-bold text-center text-gray-800 mb-6">
          {/* {triviaGame?.name} */}
          Big Cash Trivia
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {triviaGame?.categories && triviaGame.categories.length > 0 ? (
            triviaGame.categories.map((category) => (
              <div
                key={category.id}
                className="cursor-pointer bg-white  border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 p-4 text-center"
                onClick={() => handleCategoryClick(category.id)}
              >
                <h2 className="text-[20px] leading-[28px] font-mtn-brighter-medium font-medium text-gray-700">
                  {category.name}
                </h2>
              </div>
            ))
          ) : (
            <p className="flex items-center justify-center font-mtn-brighter-regular font-normal text-[18px]">No categories available</p>
          )}
        </div>

        <div className="w-max mx-auto ">
          <div
            // style={navStyle}
            className="fixed  mx-auto left-0 right-0 bottom-0 mt-[15px]   backdrop-blur-sm flex justify-between items-center w-[342px] h-[82px] bg-darrk-gradient  rounded-b-[60px] pt-[12px] pb-[20px] px-[46px] "

            // className="bottom-0 backdrop-blur-sm mb-[15px] md:mb-[50px]   left-0px flex justify-between items-center w-[90%] h-[82px] mx-auto md:w-[402px] bg-darrk-gradient  rounded-b-[60px] pt-[12px] pb-[20px] px-[46px] "
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
      </div>
    </>
  );
};

export default TriviaGames;
