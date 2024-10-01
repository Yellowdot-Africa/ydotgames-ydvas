// import React, { useState, useEffect, useContext } from "react";
// import { Link } from "react-router-dom";
// import CarouselSection from "../Components/CarouselSection";
// import Arrow from "../assets/Icons/Arrow.png";
// import Action from "../assets/Icons/action.png";
// import Fantasy from "../assets/Icons/fantasy.png";
// import Racing from "../assets/Icons/racing.png";
// import StarYs from "../assets/Icons/Star-ys.png";
// import StarWs from "../assets/Icons/Star-ws.png";
// import Forknite from "../assets/Images/forknite.png";
// import XWinger from "../assets/Images/x-winger.png";
// import Gumball from "../assets/Images/gumball.png";
// import Taffy from "../assets/Images/match-up.png";
// import Home from "../assets/Icons/home.png";
// import Leaderboard from "../assets/Icons/leaderboard.png";
// import Profile from "../assets/Icons/profile.png";
// import FooterNav from "../assets/Images/nav-container.png";
// import AvatarProfile from "../assets/Images/avatar-prof.png";
// import Coins from "../assets/Images/coins.png";
// import PlusIcon from "../assets/Icons/plus-icon.png";
// import Avatar1 from "../assets/Icons/avatar1.png";
// import Avatar2 from "../assets/Icons/avatar2.png";
// import Avatar3 from "../assets/Icons/avatar3.png";
// import Avatar4 from "../assets/Icons/avatar4.png";
// import Avatar5 from "../assets/Icons/avatar5.png";
// import { AuthContext } from "../Context/AuthContext";
// import gameApi from "../api/gameApi";

// const HomePage = () => {
//   const avatars = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5];
//   const [selectedAvatar, setSelectedAvatar] = useState(null);
//   const [showAvatarSelector, setShowAvatarSelector] = useState(false);
//   const [currentAvatar, setCurrentAvatar] = useState(AvatarProfile);
//   const [scrollDirection, setScrollDirection] = useState("null");
//   const [lastScrollTop, setLastScrollTop] = useState(0);
//   const { token } = useContext(AuthContext);
//   const [games, setGames] = useState([]);

//   useEffect(() => {
//     const fetchGames = async () => {
//       try {
//         const response = await gameApi.getGames(token);
//         setGames(response.data.games);
//       } catch (error) {
//         console.error("Error fetching games:", error);
//       }
//     };

//     fetchGames();
//   }, [token]);

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

//   const handleAvatarClick = () => {
//     setShowAvatarSelector(!showAvatarSelector);
//   };

//   const handleAvatarSelect = (avatar) => {
//     setSelectedAvatar(avatar);
//   };

//   const handleSave = () => {
//     if (selectedAvatar) {
//       setCurrentAvatar(selectedAvatar);
//       setShowAvatarSelector(false);
//     }
//   };

//   return (
//     <>
//       <div className="relative ">
//         <div
//           className={`flex flex-col min-h-screen  h-[1040px] bg-darrk-gradient  ${
//             showAvatarSelector ? " blur-[3px]" : ""
//           }`}
//         >
//           <div className="bg-[#E2EEF60D] mt-[17px]">
//             <div className="bg-nav-gradient rounded-[26px] text-white flex justify-center items-center w-[265px] h-[49px]  mt-[21px] mx-auto">
//               <div className="flex justify-between items-center w-[265px] h-[49px]">
//                 <div className="flex items-center justify-between space-x-12  relative">
//                   <div
//                     className="w-[50px] h-[50px]  flex items-center justify-center cursor-pointer"
//                     onClick={handleAvatarClick}
//                   >
//                     <img
//                       src={currentAvatar || "/default-avatar.png"}
//                       alt="Profile Avatar"
//                       className="-ml-[8px] -mb-[6px]"
//                     />
//                   </div>

//                   <div className="flex items-center justify-center">
//                     <img src={Coins} alt="coin" />
//                     <p className="font-mtn-brighter-medium font-medium text-[12px] text-center leading-[15.6px] text-[#FFFFFF]">
//                       R10k
//                     </p>
//                   </div>
//                   <div className="border border-[#FFCB05] rounded-[26px] w-[51px] h-[27px] bg-[#7F806266] flex justify-center items-center mt-[12px] mb-[10px] mr-[10px]">
//                     <p className="font-mtn-brighter-medium font-medium text-[12px] leading-[15.6px] text-center text-[#FFCB05]">
//                       T&C
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-background w-[140px] h-[28px] rounded-b-[26px] flex items-center justify-center mx-auto shadow-box-shadow">
//               <p className="font-mtn-brighter-medium font-medium text-[10px] leading-[13px] text-center text-[#FFFFFF]">
//                 @+2778 414 2470
//               </p>
//             </div>
//             <div className="flex flex-col items-center flex-grow mt-[20px]">
//               <p className="text-white mb-[17px] font-mtn-brighter-xtra-bold font-extrabold text-[24px] leading-[31.2px] text-center">
//                 Play Now
//               </p>
//               <CarouselSection />
//               <button className="bg-[#7F806266] border border-[#FFCB05]  -mb-[15px] rounded-[26px] flex items-center text-[#FFCB05] justify-center gap-[6px] mt-[29px] py-[5px] px-[16px] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-center">
//                 <img src={Arrow} alt="arrow" />
//                 FAQs
//               </button>
//             </div>
//           </div>

//           <section className="mt-[36px] w-full max-w-4xl lg:mx-auto">
//             <h2 className="font-mtn-brighter-xtra-bold font-extrabold text-[24px] leading-[31.2px] text-center text-[#FFFFFF]">
//               All Games
//             </h2>
//             <div className="space-x-[33px] mt-[17px] flex justify-center items-center mb-[20px]">
//               <button className="flex items-center justify-center text-white rounded-[26px] border border-[#D7E7F066] bg-[#EDF0F233] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] gap-[6px] text-center px-[11px] py-[5px]">
//                 <img src={Action} alt="action" />
//                 Action
//               </button>
//               <button className="flex items-center justify-center text-white rounded-[26px] border border-[#D7E7F066] bg-[#EDF0F233] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] gap-[6px] text-center px-[6px] py-[5px]">
//                 <img src={Fantasy} alt="fantasy" />
//                 Fantasy
//               </button>
//               <button className="flex items-center justify-center text-white rounded-[26px] border border-[#D7E7F066] bg-[#EDF0F233] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] gap-[6px] text-center px-[9px] py-[5px]">
//                 <img src={Racing} alt="racing" />
//                 Racing
//               </button>
//             </div>

//             <div className="flex items-center justify-center">
//               <div className="grid grid-cols-2 gap-[35px] mb-4 ">
//                 <div className="bg-custom-t-gradient flex flex-col items-center justify-center mt-[32px] rounded-[16px] w-[152px] h-[166px]">
//                   <img
//                     src={Forknite}
//                     alt="forknite"
//                     className="mb-[6px] -mt-[50px]"
//                   />
//                   <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center text-[#FFFFFF]">
//                     Forknite
//                   </p>
//                   <div className="flex items-center justify-center mt-[9.8px]">
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarWs} alt="start" />
//                     <img src={StarWs} alt="start" />
//                   </div>
//                   <button className="bg-[#FFCB05] w-[108px] h-[30px] rounded-[15px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center flex items-center justify-center px-[30px] py-[6px] mx-auto mt-[12.87px]">
//                     Play
//                   </button>
//                 </div>
//                 <div className="bg-custom-t-gradient flex flex-col items-center justify-center mt-[32px] rounded-[16px] w-[152px] h-[166px]">
//                   <img
//                     src={Gumball}
//                     alt="gunball"
//                     className="mb-[6px] -mt-[50px]"
//                   />
//                   <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center text-[#FFFFFF]">
//                     Gumball
//                   </p>
//                   <div className="flex items-center justify-center mt-[9.8px]">
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarWs} alt="start" />
//                     <img src={StarWs} alt="start" />
//                   </div>
//                   <button className="bg-[#FFCB05] w-[108px] h-[30px] rounded-[15px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center flex items-center justify-center px-[30px] py-[6px] mx-auto mt-[12.87px]">
//                     Play
//                   </button>
//                 </div>
//                 <div className="bg-custom-t-gradient flex flex-col items-center justify-center mt-[32px] rounded-[16px] w-[152px] h-[166px]">
//                   <img
//                     src={Taffy}
//                     alt="taffy"
//                     className="mb-[6px] -mt-[50px]"
//                   />
//                   <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center text-[#FFFFFF]">
//                     Taffy Match Up
//                   </p>
//                   <div className="flex items-center justify-center mt-[9.8px]">
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarWs} alt="start" />
//                     <img src={StarWs} alt="start" />
//                     <img src={StarWs} alt="start" />
//                   </div>
//                   <button className="bg-[#FFCB05] w-[108px] h-[30px] rounded-[15px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center flex items-center justify-center px-[30px] py-[6px] mx-auto mt-[12.87px]">
//                     Play
//                   </button>
//                 </div>
//                 <div className="bg-custom-t-gradient flex flex-col items-center justify-center mt-[32px] rounded-[16px] w-[152px] h-[166px]">
//                   <img
//                     src={XWinger}
//                     alt="xwinger"
//                     className="mb-[6px] -mt-[50px]"
//                   />
//                   <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center text-[#FFFFFF]">
//                     X-Winger
//                   </p>
//                   <div className="flex items-center justify-center mt-[9.8px]">
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarYs} alt="start" />
//                     <img src={StarWs} alt="start" />
//                     <img src={StarWs} alt="start" />
//                   </div>
//                   <button className="bg-[#FFCB05] w-[108px] h-[30px] rounded-[15px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center flex items-center justify-center px-[30px] py-[6px] mx-auto mt-[12.87px]">
//                     Play
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>

//         <div className="fixed w-full flex justify-center  ">
//           <div
//             style={navStyle}
//             className="bottom-0 backdrop-blur-sm mb-[15px] md:mb-[50px]   left-0px flex justify-between items-center w-[342px] h-[82px] bg-foot-nav-gradient rounded-b-[60px] pt-[12px] pb-[20px] px-[46px] "
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

//         {showAvatarSelector && (
//           <div className="flex items-center justify-center mx-auto">
//             <div className="absolute top-[30px] left-auto w-[265px] h-[138px]  bg-background-avatar  rounded-[26px]  ">
//               <div className="flex  ">
//                 <img
//                   src={currentAvatar || "/default-avatar.png"}
//                   alt="Profile Avatar"
//                 />
//                 <p className="text-white pt-[12px] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-center w-[126px]">
//                   Please select an avatar
//                 </p>
//                 {selectedAvatar && (
//                   <button
//                     className="text-[#FFCB05] ml-[32px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center  -mt-[5px]"
//                     onClick={handleSave}
//                   >
//                     Save
//                   </button>
//                 )}
//               </div>

//               <div className="flex px-[10px] mt-4">
//                 {avatars.map((avatar, index) => (
//                   <div
//                     key={index}
//                     className={`relative  ${
//                       selectedAvatar === avatar
//                         ? "border-[3px] rounded-[28px] flex items-center justify-center border-[#FFCB05]"
//                         : ""
//                     } cursor-pointer`}
//                     onClick={() => handleAvatarSelect(avatar)}
//                   >
//                     <img
//                       src={avatar}
//                       alt={`Avatar ${index + 1}`}
//                       className="w-[50px] h-[50px]"
//                     />
//                     {selectedAvatar !== avatar && (
//                       <div className=" absolute bottom-[5px] right-0  w-[10px] h-[10px]  bg-[#FFCB05] rounded-[28px]">
//                         <img
//                           src={PlusIcon}
//                           alt="Plus Icon"
//                           className="w-[15px] h-[15px]  "
//                         />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default HomePage;




// import React, { useRef, useEffect } from "react";
// import Game1 from "../assets/Images/game1.png";
// import Game2 from "../assets/Images/game2.png";
// import Game3 from "../assets/Images/game3.png";
// import Frame1 from "../assets/Images/frame1.png";
// import Frame2 from "../assets/Images/frame2.png";
// import Frame3 from "../assets/Images/frame3.png";
// import StarW from "../assets/Icons/Star-w.png";
// import StarY from "../assets/Icons/Star-y.png";
// import StarYs from "../assets/Icons/Star-ys.png";
// import StarWs from "../assets/Icons/Star-ws.png";
// import "../App.css";

// const CarouselSection = () => {
//   const carouselRef = useRef(null);

//   useEffect(() => {
//     const carousel = carouselRef.current;
//     if (carousel) {
//       const carouselWidth = carousel.offsetWidth;

//       const itemWidth = 187;

//       const totalItems = 3;

//       const middleItemIndex = Math.floor(totalItems / 2);
//       const scrollPosition =
//         middleItemIndex * itemWidth - carouselWidth / 2 + itemWidth / 2;

//       carousel.scrollTo({
//         left: scrollPosition,
//         behavior: "smooth",
//       });
//     }
//   }, []);

//   return (
//     <div className="w-full">
//       <div className="overflow-x-auto scrollbar-hide" ref={carouselRef}>
//         <div className="flex space-x-[22px] w-max mx-0 md:mx-auto">
//           <div className="min-w-[157px] flex-shrink-0">
//             <div className="relative rounded-[20px] pt-[7px] px-0 border border-[#FEFFD366] bg-[#2E3237]">
//               <div
//                 className="relative w-[142px] h-[71px] mx-[7px] bg-cover bg-center rounded-[16px] flex flex-col items-center justify-between"
//                 style={{ backgroundImage: `url(${Frame1})` }}
//               >
//                 <img
//                   src={Game1}
//                   alt="Game"
//                   className="w-[59px] h-[58px] rounded-[12px] absolute -top-2 z-10"
//                 />
//                 <div className="absolute bottom-1 text-center">
//                   <p className="font-mtn-brighter-xtra-bold font-extrabold text-[14px] leading-[18.2px] text-center text-[#002E38]">
//                     X Wing Fighter
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center mx-0 border-none mt-[10px] mb-0 px-0">
//                 <span className="bg-[#19BFC1] rounded-bl-[20px] w-[103px] h-[30px] flex items-center justify-center">
//                   <img src={StarW} alt="star" />
//                   <img src={StarW} alt="star" />
//                   <img src={StarW} alt="star" />
//                   <img src={StarW} alt="star" />
//                   <img src={StarW} alt="star" />
//                 </span>
//                 <button className="bg-[#2A76D8] py-[7px] px-[15px] rounded-br-[20px]">
//                   <p className="font-mtn-brighter-medium font-medium text-center text-[12px] leading-[15.6px] text-white">
//                     Play
//                   </p>
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="min-w-[194px] flex-shrink-0">
//             <div className="relative rounded-[20px] pt-[7px] border border-[#FEFFD366] bg-[#2E3237]">
//               <div
//                 className="relative w-[176px] h-[88px] mx-[7px] bg-cover bg-center rounded-lg flex flex-col items-center justify-between"
//                 style={{ backgroundImage: `url(${Frame2})` }}
//               >
//                 <img
//                   src={Game2}
//                   alt="Game"
//                   className="w-[59px] h-[58px] rounded-[12px] absolute -top-2 z-10"
//                 />
//                 <div className="absolute bottom-2 text-center">
//                   <p className="font-mtn-brighter-xtra-bold font-extrabold text-[18px] leading-[23.4px] text-center text-[#382C00]">
//                     Temple Run 2
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center mt-[11px] mb-0">
//                 <span className="bg-[#CFA400] rounded-bl-[20px] w-[128px] h-[37px] flex items-center justify-center">
//                   <img src={StarY} alt="star" />
//                   <img src={StarY} alt="star" />
//                   <img src={StarY} alt="star" />
//                   <img src={StarYs} alt="star" />
//                   <img src={StarWs} alt="star" />
//                 </span>
//                 <button className="bg-[#2A76D8] py-[9px] px-[17px] rounded-br-[20px]">
//                   <p className="font-mtn-brighter-medium font-medium text-center text-[14px] leading-[18.2px] text-white">
//                     Play
//                   </p>
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="min-w-[157px] flex-shrink-0">
//             <div className="relative rounded-[20px] pt-[7px] border border-[#FEFFD366] bg-[#2E3237]">
//               <div
//                 className="relative w-[142px] h-[71px] mx-[7px] bg-cover bg-center rounded-lg flex flex-col items-center justify-between"
//                 style={{ backgroundImage: `url(${Frame3})` }}
//               >
//                 <img
//                   src={Game3}
//                   alt="Game"
//                   className="w-[59px] h-[58px] rounded-[12px] shadow-box-shadow absolute -top-2 z-10"
//                 />
//                 <div className="absolute bottom-1 text-center">
//                   <p className="font-mtn-brighter-xtra-bold font-extrabold text-[14px] leading-[18.2px] text-center text-[#0E0038]">
//                     Taffy Match Up
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center mt-[10px] mb-0">
//                 <span className="bg-[#4601B7] rounded-bl-[20px] w-[103px] h-[30px] flex items-center justify-center">
//                   <img src={StarYs} alt="star" />
//                   <img src={StarYs} alt="star" />
//                   <img src={StarYs} alt="star" />
//                   <img src={StarWs} alt="star" />
//                   <img src={StarWs} alt="star" />
//                 </span>
//                 <button className="bg-[#2A76D8] py-[7px] px-[15px] rounded-br-[20px]">
//                   <p className="font-mtn-brighter-medium font-medium text-center text-[12px] leading-[15.6px] text-white">
//                     Play
//                   </p>
//                 </button>
// src={`data:image/png;base64,${game.logo}`}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CarouselSection;





// const CarouselSection = () => {
//     const carouselRef = useRef(null);
//     const [activeIndex, setActiveIndex] = useState(1);
//     const { auth } = useContext(AuthContext);
//     const { games, loading } = useContext(GameContext);
  
//     // Configuration for each carousel item
//     const carouselConfig = [
//       { frame: Frame1, bgColor: "#2E3237" }, // First carousel item
//       { frame: Frame2, bgColor: "#19BFC1" }, // Second carousel item
//       { frame: Frame3, bgColor: "#2A76D8" }, // Third carousel item
//     ];
  
//     useEffect(() => {
//       const carousel = carouselRef.current;
  
//       const handleScroll = () => {
//         if (carousel) {
//           const scrollLeft = carousel.scrollLeft;
//           const itemWidth = 187;
//           const newActiveIndex = Math.round(scrollLeft / itemWidth);
//           setActiveIndex(newActiveIndex);
//         }
//       };
  
//       if (carousel) {
//         carousel.addEventListener("scroll", handleScroll);
  
//         const carouselWidth = carousel.offsetWidth;
//         const itemWidth = 187;
//         const middleItemIndex = Math.floor(3 / 2);
//         const scrollPosition =
//           middleItemIndex * itemWidth - carouselWidth / 2 + itemWidth / 2;
  
//         carousel.scrollTo({
//           left: scrollPosition,
//           behavior: "smooth",
//         });
  
//         return () => {
//           carousel.removeEventListener("scroll", handleScroll);
//         };
//       }
//     }, []);
  
//     const getCardClass = (index) => {
//       return index === activeIndex
//         ? "scale-130 transition-transform duration-300"
//         : "scale-90 opacity-75 transition-transform duration-300";
//     };
  
//     return (
//       <div className="w-full">
//         {loading ? (
//           <p>Loading games...</p>
//         ) : (
//           <div className="overflow-x-auto scrollbar-hide" ref={carouselRef}>
//             <div className="flex space-x-[22px] w-max mx-0 md:mx-auto">
//               {games.length > 0 ? (
//                 games.slice(0, 3).map((game, index) => (
//                   <div
//                     key={game.gameId}
//                     className={`min-w-[157px] flex-shrink-0 ${getCardClass(index)}`}
//                   >
//                     <div
//                       className="relative rounded-[20px] pt-[7px] px-0 border border-[#FEFFD366]"
//                       style={{ backgroundColor: carouselConfig[index].bgColor }}
//                     >
//                       <div
//                         className="relative w-[142px] h-[71px] mx-[7px] bg-cover bg-center rounded-[16px] flex flex-col items-center justify-between"
//                         style={{ backgroundImage: `url(${carouselConfig[index].frame})` }}
//                       >
//                         <img
//                           src={game.thumbnailUrl}
//                           alt={game.title}
//                           className="w-[59px] h-[58px] rounded-[12px] absolute -top-2 z-10"
//                         />
//                         <div className="absolute bottom-1 text-center">
//                           <p className="font-mtn-brighter-xtra-bold font-extrabold text-[14px] leading-[18.2px] text-center text-[#002E38]">
//                             {game.title}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center mx-0 border-none mt-[10px] mb-0 px-0">
//                         <span className="bg-[#19BFC1] rounded-bl-[20px] w-[103px] h-[30px] flex items-center justify-center">
//                           {Array(5)
//                             .fill()
//                             .map((_, starIndex) => (
//                               <img key={starIndex} src={StarW} alt="star" />
//                             ))}
//                         </span>
//                         <button className="bg-[#2A76D8] pb-[7px] px-[15px] rounded-br-[20px]">
//                           <a
//                             href={game.playUrl}
//                             rel="noopener noreferrer"
//                             target="_blank"
//                             className="font-mtn-brighter-medium font-medium text-center text-[12px] leading-[15.6px] text-white"
//                           >
//                             Play
//                           </a>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p>No games available.</p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };
  
//   export default CarouselSection;
  



// <div className="relative rounded-[20px] pt-[7px] px-0 border border-[#FEFFD366] bg-[#2E3237]">
//   <div
//     className="relative w-[142px] h-[71px] mx-[7px] bg-cover bg-center rounded-[16px] flex flex-col items-center justify-between"
//     style={{
//       backgroundImage: `url(${carouselConfig[index].frame})`,
//     }}
//   >
//     {/* Position the image partly outside the div */}
//     <img
//       src={`data:image/png;base64,${game.base64}`}
//       alt={game.title}
//       className="w-[59px] h-[58px] rounded-[12px] absolute top-[-20px] left-[calc(50%-29.5px)] z-10"
//     />
//     <div className="absolute bottom-1 text-center">
//       <p className="font-mtn-brighter-xtra-bold font-extrabold text-[14px] leading-[18.2px] text-center text-[#002E38]">
//         {game.title}
//       </p>
//     </div>
//   </div>
//   <div className="flex items-center mx-0 border-none mt-[10px] mb-0 px-0">
//     <span
//       style={{
//         backgroundColor: carouselConfig[index].bgColor,
//       }}
//       className="rounded-bl-[20px] w-[103px] h-[30px] flex items-center justify-center"
//     >
//       {Array(5)
//         .fill()
//         .map((_, starIndex) => (
//           <img key={starIndex} src={StarW} alt="star" />
//         ))}
//     </span>
//     <button className="bg-[#2A76D8] pb-[7px] px-[15px] rounded-br-[20px]">
//       <a
//         href={game.playUrl}
//         rel="noopener noreferrer"
//         target="_blank"
//         className="font-mtn-brighter-medium font-medium text-center text-[12px] leading-[15.6px] text-white"
//       >
//         Play
//       </a>
//     </button>
//   </div>
// </div>






// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from 'axios'; // Import axios for API calls
// import Avatar1 from "../assets/Icons/avatar1.png";
// import Volume from "../assets/Icons/volume.png";
// import Radix from "../assets/Icons/radix.png";
// import Coins from "../assets/Icons/coins.png";
// import Trophy from "../assets/Icons/trophy.png";
// import Crown from "../assets/Icons/crown.png";
// import Gumball from "../assets/Images/gumball.png";
// import Temple from "../assets/Images/game2.png";
// import Taffy from "../assets/Images/match-up.png";
// import Home from "../assets/Icons/home.png";
// import Leaderboard from "../assets/Icons/leaderboard.png";
// import Profile from "../assets/Icons/profile.png";
// import { useAuth } from './authContext';

// const ProfilePage = () => {
//   const navigate = useNavigate();
//   const [scrollDirection, setScrollDirection] = useState(null);
//   const [lastScrollTop, setLastScrollTop] = useState(0);

//   const [profileData, setProfileData] = useState({}); 
//   const { token, phoneNumber } = useAuth(); 
//   const [profile, setProfile] = useState(null);
//   const [error, setError] = useState(null);
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const msisdn = '+2348123433234'; 
//         const response = await axios.get(`https://ydvassdp.com:5001/api/UserProfile/api/YellowdotGames/GetSubscriberProfile?msisdn=${msisdn}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, 
//           },
//         }
//         );
        
//         setProfileData(response.data); 
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       }
//     };

//     fetchProfile();

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

//   const handleViewLeaderboardClick = () => {
//     navigate("/leaderboard");
//   };

//   return (
//     <>
//       <div className="flex flex-col h-[1059px] md:h-[1390px] bg-profile-gradient justify-center items-center">
//         <div className="bg-darrk-gradient h-[749px] w-full">
//           <div className="flex justify-between items-center -mt-[47px]">
//             <img
//               src={Avatar1}
//               alt="Avatar Icon"
//               className="w-[108px] h-[108px] rounded-full ml-[40px] md:ml-[170px]"
//             />
//             <div className="flex gap-[23px] mr-[31px] md:mr-[100px]">
//               <img
//                 src={Volume}
//                 alt="Volume"
//                 className="bg-[#000000] grayscale border border-[#2C3035] rounded-[26px] pt-[13.53px] pb-[15.55px] px-[16px]"
//               />
//               <img
//                 src={Radix}
//                 alt="Mode"
//                 className="bg-[#000000] grayscale border border-[#2C3035] rounded-[26px] pt-[13.53px] pb-[15.55px] px-[16px]"
//               />
//             </div>
//           </div>

//           <div className="flex items-center justify-between mt-[11px]">
//             <div className="text-center text-white ml-[13px] md:ml-[170px]">
//               <p className="font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-center">
//                 {profileData.msisdn ? `@${profileData.msisdn}` : "@+2348123433234"}
//               </p>
//               <p className="text-[#FFCA00] font-mtn-brighter-bold font-bold text-[16px] leading-[20.8px] text-center">
//                 {profileData.subscribed ? "Subscribed" : "Not Subscribed"}
//               </p>
//             </div>
//             <div className="mr-[24px] md:mr-[100px] flex items-center justify-center border border-[#FFCB05] rounded-[30px] pl-[35px] pr-[44px] px-[12px]">
//               <img src={Coins} alt="Coin" className="w-12 h-12" />
//               <p className="text-[#FFFFFF] font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-center">
//                 N{profileData.walletBalance ? profileData.walletBalance : "10k"}
//               </p>
//             </div>
//           </div>

//           <button
//             className="bg-button-gradient color-[#000000] mx-auto mt-[20px] py-[14px] px-[33px] flex items-center justify-center rounded-[42px] border border-[#00000033] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center"
//             onClick={handleViewLeaderboardClick}
//           >
//             <img src={Trophy} alt="trophy" />
//             View Leaderboard
//           </button>

//           {/* Rest of your component code */}
//        <div className="flex items-center justify-center gap-[15px] mt-[30px]">
//             <div className="w-[158px] h-[71px] flex items-center justify-center gap-[4px] border-[1.5px] border-[#FFFFFF4A] bg-[#2C3035] shadow-box-shadow rounded-[12px] ">
//               <img src={Avatar1} alt="Score Icon" className="w-12 h-12" />
//               <div className="block">
//                 <p className="font-mtn-brighter-regular font-regular text-[16px] leading-[20.8px] text-center text-[#FFFFFFCC]">
//                   Your Score
//                 </p>
//                 <p className="font-mtn-brighter-bold font-bold text-[20px] leading-[26px] text-center text-[#FFCB05]">
//                   198k
//                 </p>
//               </div>
//             </div>
//             <div className="w-[158px] h-[71px] flex items-center justify-center gap-[10px] border-[1.5px] border-[#FFFFFF4A] bg-[#2C3035] shadow-box-shadow rounded-[12px] ">
//               <img src={Crown} alt="Score Icon" className="w-12 h-12" />
//               <div className="block">
//                 <p className="font-mtn-brighter-regular font-regular text-[16px] leading-[20.8px] text-center text-[#FFFFFFCC]">
//                   Top Score
//                 </p>
//                 <p className="font-mtn-brighter-bold font-bold text-[20px] leading-[26px] text-center text-[#FFCB05]">
//                   308k
//                 </p>
//               </div>
//             </div>
//           </div>
//           <p className="font-mtn-brighter-xtra-bold font-extrabold text-[24px] leading-[31.2px] text-center text-[#FFFFFF] mt-[40px]">
//             Continue Playing
//           </p>
//           <div className="flex flex-col items-center justify-center gap-[14px] mt-6 w-full ">
//             <div className="bg-[#2C3035] px-[25px] py-[13px] border-[1.5px] border-[#FFFFFF66] shadow-lg rounded-[12px] w-[342px] h-[71px] flex items-center ">
//               <img src={Gumball} alt="gumball" className="w-[47px] h-[46px]" />
//               <div className="block pl-[16px]  text-justify">
//                 <p className="font-mtn-brighter-regular font-regular text-[16px] leading-[20.8px]  text-[#FFFFFF]">
//                   {" "}
//                   Gumball
//                 </p>
//                 <p className="font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-[#FFFFFF]">
//                   #200
//                 </p>
//               </div>
//               <div className=" flex -mb-[22px] ml-[125px]">
//                 <p className="text-[#FFCA00] font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-center ">
//                   Play
//                 </p>
//               </div>
//             </div>
//             <div className="bg-[#2C3035] px-[25px] py-[13px] border-[1.5px] border-[#FFFFFF66] shadow-lg rounded-[12px] w-[342px] h-[71px] flex items-center ">
//               <img src={Temple} alt="temple" className="w-[47px] h-[46px]" />
//               <div className="block pl-[16px]  text-justify">
//                 <p className="font-mtn-brighter-regular font-regular text-[16px] leading-[20.8px]  text-[#FFFFFF]">
//                   {" "}
//                   Temple Run
//                 </p>
//                 <p className="font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-[#FFFFFF]">
//                   #200
//                 </p>
//               </div>
//               <div className=" flex -mb-[22px] ml-[59px]">
//                 <p className="text-[#FFCA00] font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-center w-[184px]">
//                   Play
//                 </p>
//               </div>
//             </div>
//             <div className="bg-[#2C3035] px-[25px] py-[13px] border-[1.5px] border-[#FFFFFF66] shadow-lg rounded-[12px] w-[342px] h-[71px] flex items-center ">
//               <img src={Taffy} alt="taffy" className="w-[47px] h-[46px]" />
//               <div className="block pl-[16px]  text-justify">
//                 <p className="font-mtn-brighter-regular font-regular text-[16px] leading-[20.8px]  text-[#FFFFFF] w-[184px]">
//                   Taffy Match Up
//                 </p>
//                 <p className="font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-[#FFFFFF]">
//                   #200
//                 </p>
//               </div>
//               <div className=" flex -mb-[22px] ml-[5px]">
//                 <p className="text-[#FFCA00] font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-center ">
//                   Play
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="fixed  flex justify-center py-4 ">
//             <div
//               style={navStyle}
//               className=" backdrop-blur-sm mb-[15px] md:mb-[90px]  w-[342px] h-[82px] flex justify-between items-center  bg-foot-nav-gradient rounded-b-[60px] pt-[12px] pb-[20px] px-[46px]  "
//             >
//               <Link
//                 to="/home"
//                 className="bg-foot-nav-gradient rounded-[50px] w-[60px] h-[60px] flex items-center justify-center"
//               >
//                 <img src={Home} alt="home" />
//               </Link>

//               <Link
//                 to="/user-profile"
//                 className="bg-[#FFCB05] rounded-[50px] w-[76px] h-[76px] flex items-center justify-center -mt-[40px]"
//               >
//                 <img
//                   src={Profile}
//                   alt="profile"
//                   className="w-[40px] h-[40px]"
//                 />
//               </Link>
//               <Link
//                 to="/leaderboard"
//                 className="bg-foot-nav-gradient rounded-[50px] w-[60px] h-[60px] flex items-center justify-center"
//               >
//                 <img src={Leaderboard} alt="leaderboard" />
//               </Link>
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// };

// export default ProfilePage;


// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import AvatarProfile from "../assets/Images/avatar-prof.png";
// import Coins from "../assets/Images/coins.png";
// import Trophy from "../assets/Icons/trophy.png";
// import Home from "../assets/Icons/home.png";
// import Leaderboard from "../assets/Icons/leaderboard.png";
// import Profile from "../assets/Icons/profile.png";
// import Rank1 from "../assets/Icons/rank4.png";
// import Rank2 from "../assets/Icons/rank1.png";
// import Rank3 from "../assets/Icons/rank2.png";
// import Rank4 from "../assets/Icons/rank3.png";
// import Rank5 from "../assets/Icons/rank3.png";
// import Rank6 from "../assets/Icons/rank3.png";
// import Avatar1 from "../assets/Icons/avatar1.png";
// import Avatar2 from "../assets/Icons/avatar2.png";
// import Avatar3 from "../assets/Icons/avatar3.png";
// import Avatar4 from "../assets/Icons/avatar4.png";
// import Avatar5 from "../assets/Icons/avatar5.png";
// import PlusIcon from "../assets/Icons/plus-icon.png";

// const LeaderboardPage = () => {
//   const leaderboardData = [
//     { rank: 1, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
//     { rank: 2, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
//     { rank: 3, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
//     { rank: 4, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
//     { rank: 5, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
//     { rank: 6, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
//     { rank: 7, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
//     { rank: 8, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
//     { rank: 9, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
//     { rank: 10, phone: "**88881", dailyScore: "0000", monthlyScore: "0000" },
//   ];
//   const avatars = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5];
//   const [selectedAvatar, setSelectedAvatar] = useState(null);
//   const [showAvatarSelector, setShowAvatarSelector] = useState(false);
//   const [currentAvatar, setCurrentAvatar] = useState(AvatarProfile);
//   const navigate = useNavigate();

//   const [scrollDirection, setScrollDirection] = useState(null);
//   const [lastScrollTop, setLastScrollTop] = useState(0);

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

//   const handleViewPrizesClick = () => {
//     navigate("/prizes");
//   };

//   const handleAvatarClick = () => {
//     setShowAvatarSelector(!showAvatarSelector);
//   };

//   const handleAvatarSelect = (avatar) => {
//     setSelectedAvatar(avatar);
//   };

//   const handleSave = () => {
//     if (selectedAvatar) {
//       setCurrentAvatar(selectedAvatar);
//       setShowAvatarSelector(false);
//     }
//   };
//   return (
//     <>
//       <div className="relative">
//         <div
//           className={`flex flex-col min-h-[1080px] md:h-[1430px] bg-darrk-gradient  ${
//             showAvatarSelector ? " blur-[3px]" : ""
//           }`}
//         >
//           <div className="bg-[#E2EEF60D] w-[342px] h-[933px] mt-[17px] mx-auto">
//             <div className="bg-nav-gradient rounded-[26px] text-white flex justify-center items-center w-[265px] h-[49px]  mt-[21px] mx-auto">
//               <div className="flex justify-between items-center w-[265px] h-[49px]">
//                 <div className="flex items-center justify-between space-x-12  relative">
//                   <div
//                     className="w-[50px] h-[50px]  flex items-center justify-center cursor-pointer"
//                     onClick={handleAvatarClick}
//                   >
//                     <img
//                       src={currentAvatar || "/default-avatar.png"}
//                       alt="Profile Avatar"
//                       className="-ml-[8px] -mb-[6px]"
//                     />
//                   </div>

//                   <div className="flex items-center justify-center">
//                     <img src={Coins} alt="coin" />
//                     <p className="font-mtn-brighter-medium font-medium text-[12px] text-center leading-[15.6px] text-[#FFFFFF]">
//                       R10k
//                     </p>
//                   </div>
//                   <div className="border border-[#FFCB05] rounded-[26px] w-[51px] h-[27px] bg-[#7F806266] flex justify-center items-center mt-[12px] mb-[10px] mr-[10px]">
//                     <p className="font-mtn-brighter-medium font-medium text-[12px] leading-[15.6px] text-center text-[#FFCB05]">
//                       T&C
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-background w-[140px] h-[28px] rounded-b-[26px] flex items-center justify-center m-auto shadow-box-shadow">
//               <p className="font-mtn-brighter-medium font-medium text-[10px] leading-[13px] text-center text-[#FFFFFF]">
//                 @+2778 414 2470
//               </p>
//             </div>

//             <img src={Trophy} alt="trophy" className="mx-auto mt-[4px]" />
//             <h1 className="font-mtn-brighter-xtra-bold font-extrabold text-[18px] text-center leading-[23.4px] mx-auto text-[#FFFFFF]">
//               Leaderboard
//             </h1>
//             <p className="text-[#FFFFFF] mx-auto font-mtn-brighter-regular font-regular text-[18px] w-[274px] leading-[23.4px] text-center mt-[11px]">
//               These are our{" "}
//               <span className="font-mtn-brighter-bold font-bold text-[18px] leading-[23.4px] text-center">
//                 Top Players
//               </span>{" "}
//               and you are currently #6
//             </p>

//             <div className="w-full   mt-6 ">
//               <table className="table-auto  mx-auto md:mx-auto">
//                 <thead>
//                   <tr className="text-center">
//                     <th className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-[#FFFFFF]">
//                       Rank
//                     </th>
//                     <th className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-[#FFFFFF]">
//                       Phone
//                     </th>
//                     <th className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-[#FFFFFF]">
//                       Daily Score
//                     </th>
//                     <th className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-[#FFFFFF]">
//                       Monthly Score
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {leaderboardData.map((player, index) => {
//                     const rankImage =
//                       player.rank === 1
//                         ? Rank1
//                         : player.rank === 2
//                         ? Rank2
//                         : player.rank === 3
//                         ? Rank3
//                         : player.rank === 4
//                         ? Rank4
//                         : player.rank === 5
//                         ? Rank5
//                         : player.rank === 6
//                         ? Rank6
//                         : null;

//                     const isTop3 =
//                       player.rank === 1 ||
//                       player.rank === 2 ||
//                       player.rank === 3;

//                     return (
//                       <tr
//                         key={index}
//                         className={`text-center ${
//                           isTop3
//                             ? "bg-gradient-to-b from-[#221F20] to-[#000000] shadow-[0px_4px_4px_0px_#00000040] rounded-[25px]"
//                             : ""
//                         }`}
//                       >
//                         <td className="p-2 relative w-[50px] h-[50px] font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
//                           {rankImage ? (
//                             <div className="relative flex justify-center items-center ">
//                               <img
//                                 src={rankImage}
//                                 alt={`Rank ${player.rank}`}
//                                 className="w-[30px] h-[25px]"
//                               />
//                               <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-white text-[14px]">
//                                 {player.rank}
//                               </span>
//                             </div>
//                           ) : (
//                             <span className="font-bold text-white text-[14px]">
//                               {player.rank}
//                             </span>
//                           )}
//                         </td>

//                         <td className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
//                           {player.phone}
//                         </td>
//                         <td className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
//                           {player.dailyScore}
//                         </td>
//                         <td className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
//                           {player.monthlyScore}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//         <div className="w-full " style={navStyle}>
//           <div className="flex justify-center mb-[51px] ">
//             <button
//               className="bg-button-gradient mx-auto py-[14px] px-[33px] rounded-[42px] border border-[#00000033] font-mtn-brighter-bold text-[14px] text-black"
//               onClick={handleViewPrizesClick}
//             >
//               View Prizes
//             </button>
//           </div>

//           <div className=" flex justify-center py-8 ">
//             <div className="w-full max-w-[336px]  h-[82px] backdrop-blur-sm flex justify-between items-center bg-foot-nav-gradient rounded-b-[60px] pt-[12px] pb-[20px] px-[46px]">
//               <Link
//                 to="/home"
//                 className="bg-foot-nav-gradient rounded-[50px] w-[60px] h-[60px] flex items-center justify-center"
//               >
//                 <img src={Home} alt="home" />
//               </Link>

//               <Link
//                 to="/user-profile"
//                 className="bg-[#FFCB05] rounded-[50px] w-[76px] h-[76px] flex items-center justify-center -mt-[40px]"
//               >
//                 <img
//                   src={Profile}
//                   alt="profile"
//                   className="w-[40px] h-[40px]"
//                 />
//               </Link>

//               <Link
//                 to="/leaderboard"
//                 className="bg-foot-nav-gradient rounded-[50px] w-[60px] h-[60px] flex items-center justify-center"
//               >
//                 <img src={Leaderboard} alt="leaderboard" />
//               </Link>
//             </div>
//           </div>

//         </div>
//         {showAvatarSelector && (
//           <div className="flex items-center justify-center mx-auto">
//             <div className="absolute top-[30px] left-auto w-[265px] h-[138px]  bg-background-avatar  rounded-[26px]  ">
//               <div className="flex  ">
//                 <img
//                   src={currentAvatar || "/default-avatar.png"}
//                   alt="Profile Avatar"
//                 />
//                 <p className="text-white pt-[12px] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-center w-[126px]">
//                   Please select an avatar
//                 </p>
//                 {selectedAvatar && (
//                   <button
//                     className="text-[#FFCB05] ml-[32px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center  -mt-[5px]"
//                     onClick={handleSave}
//                   >
//                     Save
//                   </button>
//                 )}
//               </div>

//               <div className="flex px-[10px] mt-4">
//                 {avatars.map((avatar, index) => (
//                   <div
//                     key={index}
//                     className={`relative  ${
//                       selectedAvatar === avatar
//                         ? "border-[3px] rounded-[28px] flex items-center justify-center border-[#FFCB05]"
//                         : ""
//                     } cursor-pointer`}
//                     onClick={() => handleAvatarSelect(avatar)}
//                   >
//                     <img
//                       src={avatar}
//                       alt={`Avatar ${index + 1}`}
//                       className="w-[50px] h-[50px]"
//                     />
//                     {selectedAvatar !== avatar && (
//                       <div className=" absolute bottom-[5px] right-0  w-[10px] h-[10px]  bg-[#FFCB05] rounded-[28px]">
//                         <img
//                           src={PlusIcon}
//                           alt="Plus Icon"
//                           className="w-[15px] h-[15px]  "
//                         />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default LeaderboardPage;





// import React, { useState } from 'react';

// const BigCashTrivia = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [isCorrect, setIsCorrect] = useState(null);

//   const questions = [
//     {
//       question: "What is the capital of France?",
//       answers: ["Berlin", "Madrid", "Paris", "Rome"],
//       correctAnswer: "Paris"
//     },
//     {
//       question: "Which planet is known as the Red Planet?",
//       answers: ["Earth", "Mars", "Jupiter", "Saturn"],
//       correctAnswer: "Mars"
//     },
//     {
//       question: "Who wrote 'Hamlet'?",
//       answers: ["Mark Twain", "J.K. Rowling", "William Shakespeare", "Charles Dickens"],
//       correctAnswer: "William Shakespeare"
//     }
//   ];

//   const handleAnswerClick = (answer) => {
//     setSelectedAnswer(answer);
//     if (answer === questions[currentQuestionIndex].correctAnswer) {
//       setIsCorrect(true);
//     } else {
//       setIsCorrect(false);
//     }
//   };

//   const handleNextQuestion = () => {
//     setSelectedAnswer(null);
//     setIsCorrect(null);
//     setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center w-full h-screen bg-darrk-gradient text-white">
//       <div className="w-[350px] p-4 bg-custom-t-gradient rounded-lg shadow-lg text-center">
//         <h2 className="text-2xl font-bold mb-4">
//           {questions[currentQuestionIndex].question}
//         </h2>
//         <div className="flex flex-col gap-2">
//           {questions[currentQuestionIndex].answers.map((answer, index) => (
//             <button
//               key={index}
//               onClick={() => handleAnswerClick(answer)}
//               className={`py-2 px-4 rounded-lg ${selectedAnswer === answer ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-800'}`}
//             >
//               {answer}
//             </button>
//           ))}
//         </div>
//         {selectedAnswer && (
//           <div className="mt-4">
//             {isCorrect ? (
//               <p className="text-green-400">Correct!</p>
//             ) : (
//               <p className="text-red-400">Wrong! The correct answer is {questions[currentQuestionIndex].correctAnswer}</p>
//             )}
//             {currentQuestionIndex < questions.length - 1 && (
//               <button
//                 onClick={handleNextQuestion}
//                 className="mt-4 bg-[#19BFC1] py-2 px-4 rounded-lg"
//               >
//                 Next Question
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BigCashTrivia;




// import React, {useState} from "react";
// // import Logo from "../../assets/Icons/Frame-cup.png";
// import Congrat from "../../assets/Icons/congrat.png";
// import Right from "../../assets/Icons/icon-cancel.png";
// import Cancel from "../../assets/Icons/icon-right.png";
// import { useNavigate, useLocation } from "react-router-dom";
// // import { useDispatch, useSelector } from "react-redux";
// // import EndGameModal from "../../Components/EndGameModal";
// import Trophy from "../../assets/Images/gold-trophy.png";
// import "../../Pages/ResultPage/ResultPage.css";



// const ResultPage = () => {
//   const [screenBgColor, setScreenBgColor] = useState("#580DA4"); 
//   const [showModal, setShowModal] = useState(false);

//   const location = useLocation();
//   const { selectedPack } = location.state || {}; 

//   const navigate = useNavigate();
//   const walletBalance = useSelector((state) => state.wallet.walletBalance);

//   const { correctAnswers, wrongAnswers, balance } = location.state || {};

//   const handleQuit = () => {
//     setScreenBgColor("#1F82F2"); 
//     setShowModal(true);
//   };

//   const handleEndGame = () => {
//     navigate("/home");
//   };

//   return (
//     <>
//       <div className="result-container">
//         <div className="result-header">
//           <div className="your-result">
//             <p>Your Results</p>

//           </div>
//           <div className="quitt">
//             <p onClick={handleQuit}>Quit</p>

//           </div>
//         </div>

//         <div className="result-details">
//           <div className="result-info">
//             <img className="right" src={Right} alt="green" />

//             <p className="info-value">{correctAnswers}</p>

//             <p className="info-heading">Correct </p>
//           </div>
//           <div className="result-info">
//             <img className="wrong" src={Cancel} alt="red" />
//             <p className="info-value">{wrongAnswers}</p>

//             <p className="info-heading">Wrong</p>
//           </div>
//         </div>

//         <div className="prize-details">
//           <img src={Trophy} alt="trophy" />
//           <p className="prize-amount">Welldone</p>
//           <p className="current-balance">Current balance: {walletBalance} Naira</p>
//         </div>
//         <div className="result-text">
//           <img src={Congrat} alt="" />
//           <p className="qualification-text">
//             You automatically qualify for a draw after every game that you
//             exceed 70% correct.
//           </p>
//         </div>
//         <button
//           className="replay-button"
//           onClick={() => {
//             navigate("/questions", {
//               state: {
//                 selectedPack
//               }
//             });
//           }}
//         >
//           Replay
//         </button>
//         <a className="back-to-home"  onClick={() => {
//             navigate("/home", {
//               state: {
//                 selectedPack
//               }
//             });
//           }}>Home</a>
       
//       </div>
//       <EndGameModal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         onEnd={handleEndGame}
//       />
//     </>
//   );
// };

// export default ResultPage;








// import React, { useRef, useEffect, useState, useContext } from "react";
// import Frame1 from "../assets/Images/frame1.png";
// import Frame2 from "../assets/Images/frame2.png";
// import Frame3 from "../assets/Images/frame3.png";
// import StarW from "../assets/Icons/Star-w.png";
// import GameContext from "../Context/GameContext";
// import AuthContext from "../Context/AuthContext";
// import "../App.css";

// const CarouselSection = () => {
//   const carouselRef = useRef(null);
//   const [activeIndex, setActiveIndex] = useState(1);
//   const { auth } = useContext(AuthContext);
//   const { games, loading } = useContext(GameContext);

//   const carouselConfig = [
//     { frame: Frame1, bgColor: "#19BFC1" },
//     { frame: Frame2, bgColor: "#CFA400" },
//     { frame: Frame3, bgColor: "#4601B7" },
//   ];

//   const truncateTitle = (title) => {
//     const maxLength = 10; 
//     if (title.length > maxLength) {
//       return title.substring(0, maxLength) + "...";
//     }
//     return title;
//   };

//   useEffect(() => {
//     const carousel = carouselRef.current;

//     const handleScroll = () => {
//       if (carousel) {
//         const scrollLeft = carousel.scrollLeft;
//         const itemWidth = 187;
//         const newActiveIndex = Math.round(scrollLeft / itemWidth);
//         setActiveIndex(newActiveIndex);
//       }
//     };

//     if (carousel) {
//       carousel.addEventListener("scroll", handleScroll);

//       const carouselWidth = carousel.offsetWidth;
//       const itemWidth = 187;
//       const middleItemIndex = Math.floor(3 / 2);
//       const scrollPosition =
//         middleItemIndex * itemWidth - carouselWidth / 2 + itemWidth / 2;

//       carousel.scrollTo({
//         left: scrollPosition,
//         behavior: "smooth",
//       });

//       return () => {
//         carousel.removeEventListener("scroll", handleScroll);
//       };
//     }
//   }, []);

//   // Auto-slide functionality
//   useEffect(() => {
//     const carousel = carouselRef.current;
//     const itemWidth = 187; // Adjust this according to your item width
//     const interval = setInterval(() => {
//       if (carousel) {
//         const newIndex = (activeIndex + 1) % games.length; // Loop back to the first item
//         const scrollPosition = newIndex * itemWidth;
//         carousel.scrollTo({
//           left: scrollPosition,
//           behavior: "smooth",
//         });
//         setActiveIndex(newIndex);
//       }
//     }, 3000); // Change slide every 3 seconds

//     return () => clearInterval(interval);
//   }, [activeIndex, games.length]);

//   const getCardClass = (index) => {
//     return index === activeIndex
//       ? "scale-130 transition-transform duration-300"
//       : "scale-90 opacity-75 transition-transform duration-300";
//   };

//   return (
//     <div className="w-full">
//       {loading ? (
//         <p>Loading games...</p>
//       ) : (
//         <div className="overflow-x-auto scrollbar-hide" ref={carouselRef}>
//           <div className="flex space-x-[22px] w-max mx-0 md:mx-auto">
//             {games.length > 0 ? (
//               games.slice(0, 3).map((game, index) => (
//                 <div
//                   key={game.gameId}
//                   className={`min-w-[157px] flex-shrink-0 ${getCardClass(
//                     index
//                   )}`}
//                 >
//                   <div className="relative rounded-[20px] pt-[7px] px-0 border border-[#FEFFD366] bg-[#2E3237] overflow-visible">
//                     <div
//                       className="relative w-[142px] h-[71px] mx-[7px] bg-cover bg-center rounded-[16px] flex flex-col items-center justify-between"
//                       style={{
//                         backgroundImage: `url(${carouselConfig[index].frame})`,
//                       }}
//                     >
//                       <img
//                         src={`data:image/png;base64,${game.base64}`}
//                         style={{ top: '-15px' }}
//                         alt={game.title}
//                         className="w-[59px] h-[58px] rounded-[12px] absolute object-cover z-10"
//                       />
//                       <div className="absolute bottom-1 text-center">
//                         <p className="font-mtn-brighter-xtra-bold font-extrabold text-[14px] leading-[18.2px] text-center text-[#002E38]">
//                           {truncateTitle(game.title)}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center mx-0 border-none mt-[10px] mb-0 px-0">
//                       <span
//                         style={{
//                           backgroundColor: carouselConfig[index].bgColor,
//                         }}
//                         className="bg-[#19BFC1] rounded-bl-[20px] w-[103px] h-[30px] flex items-center justify-center"
//                       >
//                         {Array(5)
//                           .fill()
//                           .map((_, starIndex) => (
//                             <img key={starIndex} src={StarW} alt="star" />
//                           ))}
//                       </span>
//                       <button className="bg-[#2A76D8] pb-[7px] px-[15px] rounded-br-[20px]">
//                         <a
//                           href={game.playUrl}
//                           rel="noopener noreferrer"
//                           target="_blank"
//                           className="font-mtn-brighter-medium font-medium text-center text-[12px] leading-[15.6px] text-white"
//                         >
//                           Play
//                         </a>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p>No games available.</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CarouselSection;






// src/pages/ProfilePage.js
// import React, { useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import UserContext from "../Context/UserContext";
// import Avatar1 from "../assets/Icons/avatar1.png";
// import Trophy from "../assets/Icons/trophy.png";
// import Coins from "../assets/Icons/coins.png";
// import Crown from "../assets/Icons/crown.png";
// import Home from "../assets/Icons/home.png";
// import Leaderboard from "../assets/Icons/leaderboard.png";
// import Profile from "../assets/Icons/profile.png";

// const ProfilePage = () => {
//   const navigate = useNavigate();
//   const { userProfile, loading, handleUpdateLeaderboardScore } = useContext(UserContext);

//   const handleViewLeaderboardClick = () => {
//     navigate("/leaderboard");
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex flex-col h-[1059px] md:h-[1390px] bg-profile-gradient justify-center items-center">
//       <div className="bg-darrk-gradient h-[749px] w-full">
//         <div className="flex justify-between items-center">
//           <img
//             src={Avatar1}
//             alt="Avatar Icon"
//             className="w-[108px] h-[108px] rounded-full ml-[40px] md:ml-[170px]"
//           />
//           <div className="mr-[24px] md:mr-[100px] flex items-center justify-center border border-[#FFCB05] rounded-[30px] pl-[35px] pr-[44px] px-[12px] ">
//             <img src={Coins} alt="Coin" className="w-12 h-12" />
//             <p className="text-[#FFFFFF] font-mtn-brighter-medium font-medium text-[16px] leading-[20.8px] text-center">
//               N10k
//             </p>
//           </div>
//         </div>

//         <div className="text-center text-white ml-[13px] md:ml-[170px]">
//           <p className="font-mtn-brighter-medium text-[14px]">@{userProfile?.msisdn}</p>
//           <p className="text-[#FFCA00] font-mtn-brighter-bold text-[16px]">Subscribed</p>
//         </div>

//         <button
//           className="bg-button-gradient mx-auto mt-[20px] py-[14px] px-[33px] flex items-center justify-center rounded-[42px]"
//           onClick={() => handleUpdateLeaderboardScore(200)} // Example score update
//         >
//           <img src={Trophy} alt="trophy" />
//           View Leaderboard
//         </button>

//         {/* Other UI elements */}
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;



// In UserContext


// import React, { useState, useEffect , useContext} from "react";
// import { Link, useNavigate } from "react-router-dom";
// import AvatarProfile from "../assets/Images/avatar-prof.png";
// import Coins from "../assets/Images/coins.png";
// import Trophy from "../assets/Icons/trophy.png";
// import Arrow from "../assets/Icons/Arrow.png";
// import Home from "../assets/Icons/home.png";
// import LeaderboardIcon from "../assets/Icons/leaderboard.png";
// import Profile from "../assets/Icons/profile.png";
// import Rank1 from "../assets/Icons/rank4.png";
// import Rank2 from "../assets/Icons/rank1.png";
// import Rank3 from "../assets/Icons/rank2.png";
// import Rank4 from "../assets/Icons/rank3.png";
// import Rank5 from "../assets/Icons/rank3.png";
// import Rank6 from "../assets/Icons/rank3.png";
// import Avatar1 from "../assets/Icons/avatar1.png";
// import Avatar2 from "../assets/Icons/avatar2.png";
// import Avatar3 from "../assets/Icons/avatar3.png";
// import Avatar4 from "../assets/Icons/avatar4.png";
// import Avatar5 from "../assets/Icons/avatar5.png";
// import PlusIcon from "../assets/Icons/plus-icon.png";
// // import { useLeaderboard } from "../Context/LeaderboardContext";
// import { LeaderboardContext } from "../Context/LeaderboardContext";

// const LeaderboardPage = ({ subscriberMsisdn }) => {
//   const [selectedAvatar, setSelectedAvatar] = useState(null);
//   const [showAvatarSelector, setShowAvatarSelector] = useState(false);
//   const [currentAvatar, setCurrentAvatar] = useState(AvatarProfile);
//   const avatars = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5];
//   const navigate = useNavigate();
//   const [scrollDirection, setScrollDirection] = useState(null);
//   const [lastScrollTop, setLastScrollTop] = useState(0);

//   // const { leaderboardData, loading, error, fetchLeaderboard } =
//   //   useLeaderboard();

//   const { leaderboard, handleUpdateLeaderboardScore, fetchLeaderboardStanding, loading, error } = useContext(LeaderboardContext);

//   // useEffect(() => {
//   //   fetchLeaderboardStanding(subscriberMsisdn);
//   // }, [subscriberMsisdn]);

//   useEffect(() => {
//     fetchLeaderboardStanding(subscriberMsisdn);
//   }, [subscriberMsisdn]);

//   // useEffect(() => {
//   //   handleUpdateLeaderboardScore(subscriberMsisdn);

//   //   const intervalId = setInterval(() => {
//   //     handleUpdateLeaderboardScore(subscriberMsisdn);
//   //   }, 30000);

//   //   return () => clearInterval(intervalId);
//   // }, [subscriberMsisdn, handleUpdateLeaderboardScore]);

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

//   const handleViewPrizesClick = () => {
//     navigate("/prizes");
//   };

//   const handleAvatarClick = () => {
//     setShowAvatarSelector(!showAvatarSelector);
//   };

//   const handleAvatarSelect = (avatar) => {
//     setSelectedAvatar(avatar);
//   };

//   const handleSave = () => {
//     if (selectedAvatar) {
//       setCurrentAvatar(selectedAvatar);
//       setShowAvatarSelector(false);
//     }
//   };

//   // if (loading) {
//   //   return <div>Loading...</div>;
//   // }

//   return (
//     <>
//       <div className="relative">
//         <div
//           className={`flex flex-col min-h-[1080px] md:h-[1430px] bg-darrk-gradient  ${
//             showAvatarSelector ? " blur-[3px]" : ""
//           }`}
//         >
//           {error && (
//             <div className="text-red-500 text-center mt-4">{error}</div>
//           )}

//           <div className="bg-[#E2EEF60D] w-[342px] h-[933px] mt-[17px] mx-auto">
//             <div className="bg-nav-gradient rounded-[26px] text-white flex justify-center items-center w-[265px] h-[49px]  mt-[21px] mx-auto">
//               {/* Avatar and Coin Section */}
//               <div className="flex justify-between items-center w-[265px] h-[49px]">
//                 <div className="flex items-center justify-between space-x-12  relative">
//                   <div
//                     className="w-[50px] h-[50px]  flex items-center justify-center cursor-pointer"
//                     onClick={() => setShowAvatarSelector(!showAvatarSelector)}
//                   >
//                     <img
//                       src={currentAvatar || "/default-avatar.png"}
//                       alt="Profile Avatar"
//                       className="-ml-[8px] -mb-[6px]"
//                     />
//                   </div>

//                   <div className="flex items-center justify-center">
//                     <img src={Coins} alt="coin" />
//                     <p className="font-mtn-brighter-medium font-medium text-[12px] text-center leading-[15.6px] text-[#FFFFFF]">
//                       R10k
//                     </p>
//                   </div>
//                   <Link to="/terms-and-conditions" className="border border-[#FFCB05] rounded-[26px] w-[51px] h-[27px] bg-[#7F806266] flex justify-center items-center mt-[12px] mb-[10px] mr-[10px]">
//                     <p className="font-mtn-brighter-medium font-medium text-[12px] leading-[15.6px] text-center text-[#FFCB05]">
//                       T&C
//                     </p>
//                   </Link>

//                 </div>
//               </div>
//             </div>

//             <div className="bg-background w-[140px] h-[28px] rounded-b-[26px] flex items-center justify-center m-auto shadow-box-shadow">
//               <p className="font-mtn-brighter-medium font-medium text-[10px] leading-[13px] text-center text-[#FFFFFF]">
//                 @+2778 414 2470
//               </p>
//             </div>

//             <img src={Trophy} alt="trophy" className="mx-auto mt-[4px]" />
//             <h1 className="font-mtn-brighter-xtra-bold font-extrabold text-[18px] text-center leading-[23.4px] mx-auto text-[#FFFFFF]">
//               Leaderboard
//             </h1>
//             <p className="text-[#FFFFFF] mx-auto font-mtn-brighter-regular font-regular text-[18px] w-[274px] leading-[23.4px] text-center mt-[11px]">
//               These are our{" "}
//               <span className="font-mtn-brighter-bold font-bold text-[18px] leading-[23.4px] text-center">
//                 Top Players
//               </span>{" "}
//               and you are currently #
//               {leaderboard.find(
//                 (player) => player.phone === subscriberMsisdn
//               )?.rank || "N/A"}
//             </p>

//             {/* Table */}
//             <div className="w-full mt-6 ">
//               <table className="table-auto mx-auto md:mx-auto">
//                 <thead>
//                   <tr className="text-center">
//                     <th className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-[#FFFFFF]">
//                       Rank
//                     </th>
//                     <th className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-[#FFFFFF]">
//                       Phone
//                     </th>
//                     <th className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-[#FFFFFF]">
//                       Daily Score
//                     </th>
//                     <th className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-[#FFFFFF]">
//                       Monthly Score
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                 {leaderboard.length === 0 ? (
//  <tr>
//  <td colSpan="4" className="text-center text-white">No players found</td>
// </tr>
// ) : (
//                   leaderboard.map((player, index) => {
//                     const rankImage =
//                       player.rank === 1
//                         ? Rank1
//                         : player.rank === 2
//                         ? Rank2
//                         : player.rank === 3
//                         ? Rank3
//                         : player.rank === 4
//                         ? Rank4
//                         : player.rank === 5
//                         ? Rank5
//                         : player.rank === 6
//                         ? Rank6
//                         : null;

//                     const isTop3 =
//                       player.rank === 1 ||
//                       player.rank === 2 ||
//                       player.rank === 3;

//                     return (
//                       <tr
//                         key={index}
//                         className={`text-center ${
//                           isTop3
//                             ? "bg-gradient-to-b from-[#221F20] to-[#000000] shadow-[0px_4px_4px_0px_#00000040] rounded-[25px]"
//                             : ""
//                         }`}
//                       >
//                         <td className="p-2 relative w-[50px] h-[50px] font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
//                           {rankImage ? (
//                             <div className="relative flex justify-center items-center ">
//                               <img
//                                 src={rankImage}
//                                 alt={`Rank ${player.rank}`}
//                                 className="w-[30px] h-[25px]"
//                               />
//                               <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-white text-[14px]">
//                                 {player.rank}
//                               </span>
//                             </div>
//                           ) : (
//                             <span className="font-bold text-white text-[14px]">
//                               {player.rank}
//                             </span>
//                           )}
//                         </td>

//                         <td className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
//                           {player.phone}
//                         </td>
//                         <td className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
//                           {player.dailyScore}
//                         </td>
//                         <td className="p-2 font-mtn-brighter-medium font-medium text-[14px] leading-[20.8px] text-[#FFFFFF]">
//                           {player.monthlyScore}
//                         </td>
//                       </tr>
//                     );
//                   })
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         <div className="w-full " style={navStyle}>
//           <div className="flex justify-center mb-[51px] ">
//             <button
//               className="bg-button-gradient mx-auto py-[14px] px-[33px] rounded-[42px] border border-[#00000033] font-mtn-brighter-bold text-[14px] text-black"
//               onClick={handleViewPrizesClick}
//             >
//               View Prizes
//             </button>
//           </div>

//           <div className=" flex justify-center py-8 ">
//             <div className="w-full max-w-[336px]  h-[82px] backdrop-blur-sm flex justify-between items-center bg-foot-nav-gradient rounded-b-[60px] pt-[12px] pb-[20px] px-[46px]">
//               <Link
//                 to="/home"
//                 className="bg-foot-nav-gradient rounded-[50px] w-[60px] h-[60px] flex items-center justify-center"
//               >
//                 <img src={Home} alt="home" />
//               </Link>

//               <Link
//                 to="/user-profile"
//                 className="bg-[#FFCB05] rounded-[50px] w-[76px] h-[76px] flex items-center justify-center -mt-[40px]"
//               >
//                 <img
//                   src={Profile}
//                   alt="profile"
//                   className="w-[40px] h-[40px]"
//                 />
//               </Link>

//               <Link
//                 to="/leaderboard"
//                 className="bg-foot-nav-gradient rounded-[50px] w-[60px] h-[60px] flex items-center justify-center"
//               >
//                 <img src={LeaderboardIcon} alt="leaderboard" />
//               </Link>
//             </div>
//           </div>
//         </div>
//         {showAvatarSelector && (
//           <div className="flex items-center justify-center mx-auto">
//             <div className="absolute top-[30px] left-auto w-[265px] h-[138px]  bg-background-avatar  rounded-[26px]  ">
//               <div className="flex  ">
//                 <img
//                   src={currentAvatar || "/default-avatar.png"}
//                   alt="Profile Avatar"
//                 />
//                 <p className="text-white pt-[12px] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-center w-[126px]">
//                   Please select an avatar
//                 </p>
//                 {selectedAvatar && (
//                   <button
//                     className="text-[#FFCB05] ml-[32px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center  -mt-[5px]"
//                     onClick={handleSave}
//                   >
//                     Save
//                   </button>
//                 )}
//               </div>

//               <div className="flex px-[10px] mt-4">
//                 {avatars.map((avatar, index) => (
//                   <div
//                     key={index}
//                     className={`relative  ${
//                       selectedAvatar === avatar
//                         ? "border-[3px] rounded-[28px] flex items-center justify-center border-[#FFCB05]"
//                         : ""
//                     } cursor-pointer`}
//                     onClick={() => handleAvatarSelect(avatar)}
//                   >
//                     <img
//                       src={avatar}
//                       alt={`Avatar ${index + 1}`}
//                       className="w-[50px] h-[50px]"
//                     />
//                     {selectedAvatar !== avatar && (
//                       <div className=" absolute bottom-[5px] right-0  w-[10px] h-[10px]  bg-[#FFCB05] rounded-[28px]">
//                         <img
//                           src={PlusIcon}
//                           alt="Plus Icon"
//                           className="w-[15px] h-[15px]  "
//                         />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default LeaderboardPage;










// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { getLeaderboardStanding, updateLeaderboardScore } from '../api/leaderboardApi'; 
// import AuthContext from "../Context/AuthContext";
// import UserContext from '../Context/UserContext';

// const LeaderboardContext = createContext();

// const LeaderboardProvider = ({ children }) => {
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { auth } = useContext(AuthContext);
//   const userContext = useContext(UserContext);
//   // const { msisdn } = useContext(UserContext); // Use msisdn from UserContext
//   const msisdn = userContext ? userContext.msisdn : null; // Fallback if context is undefined


//   useEffect(() => {
//     console.log("UserContext MSISDN:", msisdn); // Debugging log
// }, [msisdn]);

//   const fetchLeaderboardStanding = async () => {
//     try {
//       setLoading(true);
//       if (!msisdn) {
//         throw new Error("MSISDN is required");
//       }
//       const response = await getLeaderboardStanding(auth, msisdn);
//       setLeaderboard(response.data);
//       console.log("Fetched leaderboard:", response.data);
//     } catch (error) {
//       setError(error.message);
//       console.error("Error fetching leaderboard standing:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateLeaderboardScore = async (gameScore) => {
//     try {
//       if (!msisdn) {
//         throw new Error("MSISDN is required for updating the score");
//       }
//       await updateLeaderboardScore(auth, msisdn, gameScore);
//       fetchLeaderboardStanding();
//     } catch (error) {
//       console.error("Error updating leaderboard score:", error);
//     }
//   };

//   useEffect(() => {
//     if (auth?.token) {
//       fetchLeaderboardStanding();
//     }
//   }, [auth?.token, msisdn]);

//   return (
//     <LeaderboardContext.Provider
//       value={{
//         leaderboard,
//         loading,
//         fetchLeaderboardStanding,
//         handleUpdateLeaderboardScore, 
//       }}
//     >
//       {children}
//     </LeaderboardContext.Provider>
//   );
// };

// export { LeaderboardContext, LeaderboardProvider };

// export const useLeaderboard = () => useContext(LeaderboardContext);



// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { getLeaderboardStanding, updateLeaderboardScore } from '../api/leaderboardApi'; 
// import AuthContext from "../Context/AuthContext";
// import UserContext from '../Context/UserContext';

// const LeaderboardContext = createContext();

// const LeaderboardProvider = ({ children }) => {
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { auth } = useContext(AuthContext);
//   const userContext = useContext(UserContext);
  
//   // Use optional chaining to safely access msisdn
//   const msisdn = userContext?.msisdn || null; 

//   useEffect(() => {
//     console.log("UserContext MSISDN:", msisdn); // Debugging log
//   }, [msisdn]);

//   const fetchLeaderboardStanding = async () => {
//     try {
//       setLoading(true);
//       if (!msisdn) {
//         throw new Error("MSISDN is required");
//       }
//       const response = await getLeaderboardStanding(auth, msisdn);
//       setLeaderboard(response.data);
//       console.log("Fetched leaderboard:", response.data);
//     } catch (error) {
//       setError(error.message);
//       console.error("Error fetching leaderboard standing:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateLeaderboardScore = async (gameScore) => {
//     try {
//       console.log("Updating score for MSISDN:", msisdn); // Debugging log
//       if (!msisdn) {
//         throw new Error("MSISDN is required for updating the score");
//       }
//       await updateLeaderboardScore(auth, msisdn, gameScore);
//       await fetchLeaderboardStanding(); // Ensure leaderboard is refreshed after updating
//     } catch (error) {
//       console.error("Error updating leaderboard score:", error);
//     }
//   };

//   useEffect(() => {
//     if (auth?.token) {
//       fetchLeaderboardStanding();
//     }
//   }, [auth?.token, msisdn]);

//   return (
//     <LeaderboardContext.Provider
//       value={{
//         leaderboard,
//         loading,
//         fetchLeaderboardStanding,
//         handleUpdateLeaderboardScore, 
//       }}
//     >
//       {children}
//     </LeaderboardContext.Provider>
//   );
// };

// export { LeaderboardContext, LeaderboardProvider };

// export const useLeaderboard = () => useContext(LeaderboardContext);



// import axios from "axios";

// const leaderboardApi = async (auth, msisdn) => {
//   try {
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       throw new Error("No auth token available");
//     }
//     const response = await axios.get(
//       `https://ydvassdp.com:5001/api/YellowdotGames/GetLeaderboardStanding?msisdn=${msisdn}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     throw new Error("Error fetching leaderboard data.");
//   }
// };

// export default leaderboardApi;



// import React, { useContext } from "react";
// import Slider from "react-slick";
// import Frame1 from "../assets/Images/frame1.png";
// import Frame2 from "../assets/Images/frame2.png";
// import Frame3 from "../assets/Images/frame3.png";
// import StarW from "../assets/Icons/Star-w.png";
// import GameContext from "../Context/GameContext";
// import AuthContext from "../Context/AuthContext";
// import "../App.css";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const CarouselSection = () => {
//   const { games, loading } = useContext(GameContext);

//   const carouselConfig = [
//     { frame: Frame1, bgColor: "#19BFC1" },
//     { frame: Frame2, bgColor: "#CFA400" },
//     { frame: Frame3, bgColor: "#4601B7" },
//   ];

//   const truncateTitle = (title) => {
//     const maxLength = 10;
//     return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
//   };

//   // Adjusting Slick settings to reduce padding and scaling properly
//   const settings = {
//     centerMode: true,
//     centerPadding: "10px", // Reduced center padding to reduce space between slides
//     slidesToShow: 3,
//     infinite: true,
//     speed: 500,
//     responsive: [
//       {
//         breakpoint: 768, // For smaller screens
//         settings: {
//           slidesToShow: 1,
//           centerPadding: "10px", // Reduced padding for smaller screens
//         },
//       },
//     ],
//   };

//   return (
//     <div className="w-full">
//       {loading ? (
//         <p>Loading games...</p>
//       ) : (
//         <Slider {...settings} className="overflow-visible"> {/* Added overflow-visible */}
//           {games.length > 0 ? (
//             games.slice(0, 3).map((game, index) => (
//               <div key={game.gameId} className="px-0"> {/* Reduced spacing */}
//                 <div className="relative rounded-[20px] w-[160px] my-6 pt-[7px] px-0 border border-[#FEFFD366] bg-[#2E3237] overflow-visible"> {/* overflow-visible ensures no clipping */}
//                   <div
//                     className="relative w-[142px] h-[71px] mx-[7px] bg-cover bg-center rounded-[16px] flex flex-col items-center justify-center"
//                     style={{
//                       backgroundImage: `url(${carouselConfig[index].frame})`,
//                     }}
//                   >
//                     <img
//                       src={`data:image/png;base64,${game.base64}`}
//                       style={{ top: "-15px" }}
//                       alt={game.title}
//                       className="w-[59px] h-[58px] rounded-[12px] absolute object-cover z-10"
//                     />
//                     <div className="absolute bottom-1 text-center">
//                       <p className="font-mtn-brighter-xtra-bold font-extrabold text-[14px] leading-[18.2px] text-center text-[#002E38]">
//                         {truncateTitle(game.title)}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center mx-0 border-none mt-[10px] mb-0 px-0">
//                     <span
//                       style={{
//                         backgroundColor: carouselConfig[index].bgColor,
//                       }}
//                       className="bg-[#19BFC1] rounded-bl-[20px] w-[103px] h-[30px] flex items-center justify-center"
//                     >
//                       {Array(5)
//                         .fill()
//                         .map((_, starIndex) => (
//                           <img key={starIndex} src={StarW} alt="star" />
//                         ))}
//                     </span>
//                     <button className="bg-[#2A76D8] pb-[7px] px-[15px] rounded-br-[20px]">
//                       <a
//                         href={game.playUrl}
//                         rel="noopener noreferrer"
//                         target="_blank"
//                         className="font-mtn-brighter-medium font-medium text-center text-[12px] leading-[15.6px] text-white"
//                       >
//                         Play
//                       </a>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>No games available.</p>
//           )}
//         </Slider>
//       )}
//     </div>
//   );
// };

// export default CarouselSection;



// import React, { useContext } from "react";
// import Slider from "react-slick";
// import Frame1 from "../assets/Images/frame1.png";
// import Frame2 from "../assets/Images/frame2.png";
// import Frame3 from "../assets/Images/frame3.png";
// import StarW from "../assets/Icons/Star-w.png";
// import GameContext from "../Context/GameContext";
// import AuthContext from "../Context/AuthContext";
// import "../App.css";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const CarouselSection = () => {
//   const { games, loading } = useContext(GameContext);

//   const carouselConfig = [
//     { frame: Frame1, bgColor: "#19BFC1" },
//     { frame: Frame2, bgColor: "#CFA400" },
//     { frame: Frame3, bgColor: "#4601B7" },
//   ];

//   const truncateTitle = (title) => {
//     const maxLength = 10;
//     return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
//   };

//   // Slick settings to make the center item bigger
//   const settings = {
//     centerMode: true,
//     centerPadding: "10px",
//     slidesToShow: 3,
//     infinite: true,
//     speed: 500,
//     responsive: [
//       {
//         breakpoint: 768, // For smaller screens
//         settings: {
//           slidesToShow: 1,
//           centerPadding: "10px",
//         },
//       },
//     ],
//   };

//   return (
//     <div className="w-full h-[100%]">
//       {loading ? (
//         <p>Loading games...</p>
//       ) : (
//         <Slider {...settings}>
//           {games.length > 0 ? (
//             games.slice(0, 3).map((game, index) => (
//               <div key={game.gameId} className="">
//                 <div className=" rounded-[20px] w-[142px] pt-[7px] px-0 border border-[#FEFFD366] bg-[#2E3237] overflow-visible">
//                   <div
//                     className="relative w-[142px] h-[71px]  bg-cover bg-center rounded-[16px] flex flex-col items-center justify-between"
//                     style={{
//                       backgroundImage: `url(${carouselConfig[index].frame})`,
//                     }}
//                   >
//                     <img
//                       src={`data:image/png;base64,${game.base64}`}
//                       style={{ top: "-15px" }}
//                       alt={game.title}
//                       className="w-[59px] h-[58px] rounded-[12px] absolute object-contain z-10"
//                     />
//                     <div className="absolute bottom-1 text-center">
//                       <p className="font-mtn-brighter-xtra-bold font-extrabold text-[14px] leading-[18.2px] text-center text-[#002E38]">
//                         {truncateTitle(game.title)}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center mx-0 border-none mt-[10px] mb-0 px-0">
//                     <span
//                       style={{
//                         backgroundColor: carouselConfig[index].bgColor,
//                       }}
//                       className="bg-[#19BFC1] rounded-bl-[20px] w-[103px] h-[30px] flex items-center justify-center"
//                     >
//                       {Array(5)
//                         .fill()
//                         .map((_, starIndex) => (
//                           <img key={starIndex} src={StarW} alt="star" />
//                         ))}
//                     </span>
//                     <button className="bg-[#2A76D8] pb-[7px] px-[15px] rounded-br-[20px]">
//                       <a
//                         href={game.playUrl}
//                         rel="noopener noreferrer"
//                         target="_blank"
//                         className="font-mtn-brighter-medium font-medium text-center text-[12px] leading-[15.6px] text-white"
//                       >
//                         Play
//                       </a>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>No games available.</p>
//           )}
//         </Slider>
//       )}
//     </div>
//   );
// };

// export default CarouselSection;





  // const handleUpdateLeaderboardScore = async () => {
  //   console.log("Attempting to update leaderboard score..."); // Debugging log

  //   try {
  //     const storedScore = localStorage.getItem("gameScore");
  //     console.log("Stored score:", storedScore);
  //     if (!storedScore) {
  //       // throw new Error("No score found in local storage");
  //       console.warn(
  //         "No score found in local storage. Ensure the game score is set after playing."
  //       );

  //       return;
  //     }

  //     console.log("Updating score for MSISDN:", msisdn);
  //     if (!msisdn) {
  //       throw new Error("MSISDN is required for updating the score");
  //     }
  //     const gameScore = parseInt(storedScore, 10);
  //     if (isNaN(gameScore)) {
  //       console.warn("Invalid score value. Cannot update leaderboard.");
  //       return;
  //     }

  //     console.log("Updating leaderboard score with:", { msisdn, gameScore });

  //     const response = await updateLeaderboardScore(auth, msisdn, gameScore);
  //     console.log("API Response:", response);

  //     console.log("Leaderboard score update response:", response);

  //     await fetchLeaderboardStanding();
  //   } catch (error) {
  //     console.error("Error updating leaderboard score:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (auth?.token) {
  //     fetchLeaderboardStanding();
  //     const storedScore = localStorage.getItem("gameScore");
  //     if (storedScore) {
  //       handleUpdateLeaderboardScore();
  //     } else {
  //       console.warn("No score to update in the leaderboard.");
  //     }
  //   }
  // }, [auth?.token, msisdn]);








// import React from "react";
// import { useNavigate } from "react-router-dom";
// import BackgroundImage from "../assets/leaderboard-bg.png";
// import LogoImage from "../assets/gamewin.png";
// import DiamondImage from "../assets/DiamondGems.png";
// import Image1 from "../assets/one.png";
// import Image2 from "../assets/two.png";
// import Image3 from "../assets/three.png";
// import Rank1 from "../assets/rank1.png";
// import Rank2 from "../assets/rank2.png";
// import Rank3 from "../assets/rank3.png";
// import Rank4 from "../assets/rank4.png";
// import Rank5 from "../assets/rank3.png";
// import Rank6 from "../assets/rank3.png";

// const Leaderboard = () => {
//   const navigate = useNavigate();

//   const GoHome = () => {
//     navigate("/main");
//   };

//   const players = [
//     { rank: 1, name: "Name", points: 1000 },
//     { rank: 2, name: "Name", points: 800 },
//     { rank: 3, name: "Name", points: 600 },
//     { rank: 4, name: "Name", points: 1000 },
//     { rank: 5, name: "Name", points: 800 },
//     { rank: 6, name: "Name", points: 600 },
//     { rank: 7, name: "Name", points: 1000 },
//     { rank: 8, name: "Name", points: 800 },
//     { rank: 9, name: "Name", points: 600 },
//     { rank: 10, name: "Name", points: 600 },
//   ];

//   const getLocalStorageData = () => {
//         const gameData = localStorage.getItem('com.disney.fighter.game_11.save');
//         return gameData ? JSON.parse(gameData) : {};
//       };

//       const parsedData = getLocalStorageData();
//         const formattedPlayers = [
//           {
//             rank: 1,
//             name: "Player 1",
//             points: parsedData.bestScore || 0,
//           },
//           {
//             rank: 2,
//             name: "Player 2",
//             points: parsedData.bestScore || 0,
//           },
//           {
//             rank: 3,
//             name: "Player 3",
//             points: parsedData.bestScore || 0,
//           }, {
//             rank: 4,
//             name: "Player 4",
//             points: parsedData.bestScore || 0,
//           }, {
//             rank: 5,
//             name: "Player 5",
//             points: parsedData.bestScore || 0,
//           },

//           {
//             rank: 6,
//             name: "Player 6",
//             points: parsedData.bestScore || 0,
//           },{
//             rank: 7,
//             name: "Player 5",
//             points: parsedData.bestScore || 0,
//           },{
//             rank: 8,
//             name: "Player 5",
//             points: parsedData.bestScore || 0,
//           },{
//             rank: 9,
//             name: "Player 5",
//             points: parsedData.bestScore || 0,
//           },
//         ];

//   return (
//     <div className="min-h-screen flex flex-col">
//       <div
//         className="relative w-full h-[328px] bg-cover bg-center"
//         style={{ backgroundImage: `url(${BackgroundImage})` }}
//       >
//         <img
//           src={LogoImage}
//           alt="Logo"
//           className="absolute top-4 left-4 w-[73px] h-[52px]"
//         />
//         <div className="relative w-[200px] h-[200px] mx-auto mt-20">
//           <img
//             src={DiamondImage}
//             alt="Top 3"
//             className="absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[174px] h-[100px]"
//           />
//           <img
//             src={Image1}
//             alt="1"
//             className="absolute w-[50px] top-[25%] left-1/2 transform -translate-x-1/2"
//           />
//           <img
//             src={Image2}
//             alt="2"
//             className="absolute w-[50px] top-[47%] left-[3%]"
//           />
//           <img
//             src={Image3}
//             alt="3"
//             className="absolute w-[50px] top-[50%] right-[0%]"
//           />
//         </div>
//       </div>
//       <div className="relative -mt-16 flex justify-center">
//         <div className="absolute top-[10px] flex flex-col items-center justify-center container mx-auto p-4">
//           <h1 className="w-[70vw] text-center bg-[#004ADA] px-[35px] py-[8px] text-white font-mochiy text-[16px] font-normal leading-[23.17px]">
//             LEADERBOARD
//           </h1>
//           <div className="bg-white flex flex-col items-center justify-center shadow rounded overflow-hidden">
//             {players.map((player) => (
//               <div
//                 key={player.rank}
//                 className={`flex items-center justify-between p-4 border-b border-gray-200 rounded-lg shadow-md mx-[22px] ${
//                   player.rank > 6 ? "bg-white" : ""
//                 }`}
//                 style={{
//                   width: "80vw",
//                   height: "49px",
//                   borderRadius: player.rank <= 3 ? "25px" : "0px",
//                   boxShadow:
//                     player.rank <= 3 ? "0px 4px 4px 0px #00000040" : "none",
//                 }}
//               >
//                 {player.rank <= 6 ? (
//                   <div className="relative flex items-center">
//                     <img
//                       src={
//                         player.rank === 1
//                           ? Rank4
//                           : player.rank === 2
//                           ? Rank1
//                           : player.rank === 3
//                           ? Rank2
//                           : Rank3
//                       }
//                       alt={`Rank ${player.rank}`}
//                       className=""
//                     />
//                     <span className="absolute left-1/2 transform -translate-x-1/2 text-white font-normal text-[16px]">
//                       {player.rank}
//                     </span>
//                   </div>
//                 ) : (
//                   <span className="flex-0 text-left mx-[22px]">
//                     {player.rank}
//                   </span>
//                 )}
//                 <span className="flex-0 text-center">{player.name}</span>
//                 <span className="text-right flex-0">{player.points}</span>
//               </div>
//             ))}
//             <button
//               className="px-4 py-2 bg-white text-black rounded-[25px] font-mochiy text-[16px] font-normal leading-[23.17px] w-[50vw] mx-auto"
//               style={{
//                 height: "50px",
//                 borderRadius: "25px",
//                 boxShadow: "0px 4px 4px 0px #00000040",
//                 // marginTop: "50px",
//                 position: "absolute",
//                 // bottom: "144px",
//                 bottom: "10px",
//               }}
//               onClick={GoHome}
//             >
//               BACK TO HOME
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Leaderboard;






// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Timer from "../assets/Icons/timer.svg";
// import { useLeaderboard } from "../Context/LeaderboardContext"; // Import Leaderboard context

// const BigCashTrivia = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [score, setScore] = useState(0);
//   const [statuses, setStatuses] = useState([]);
//   const [timer, setTimer] = useState(10);
//   const navigate = useNavigate();
//   const { handleUpdateLeaderboardScore } = useLeaderboard(); // Use leaderboard context

//   const questions = [
//     // Questions data...
//   ];

//   useEffect(() => {
//     const timerId = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(timerId);
//           handleNextQuestion();
//           return 10;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [currentQuestionIndex]);

//   const handleAnswerClick = (answer) => {
//     if (selectedAnswer) return;

//     setSelectedAnswer(answer);
//     const isAnswerCorrect =
//       answer === questions[currentQuestionIndex].correctAnswer;
//     setIsCorrect(isAnswerCorrect);
//     setStatuses((prev) => {
//       const newStatuses = [...prev];
//       newStatuses[currentQuestionIndex] = isAnswerCorrect
//         ? "correct"
//         : "incorrect";
//       return newStatuses;
//     });

//     if (isAnswerCorrect) {
//       setScore(score + 1);
//     }

//     setTimeout(() => {
//       handleNextQuestion();
//     }, 2000);
//   };

//   const handleNextQuestion = () => {
//     setSelectedAnswer(null);
//     setIsCorrect(null);
//     setTimer(10);

//     // Check if it's the last question
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       // Game is finished, update leaderboard score
//       handleUpdateLeaderboardScore(score);

//       // Navigate to result page after updating leaderboard
//       navigate("/result-page", {
//         state: { score: score, totalQuestions: questions.length, statuses: statuses },
//       });
//     }
//   };

//   return (
//     <div className="flex flex-col items-center w-full min-h-screen bg-darrk-gradient text-white">
//       {/* Timer and question content */}
//       <div className=" mt-[60px] mb-[30px]">
//         <div className="flex items-center justify-center bg-white w-[46px] h-[46px] border rounded-[50px]">
//           <img className="img-timer" src={Timer} alt="timer" />
//           <p className="text-black text-[18px] font-mtn-brighter-medium font-medium text-center">
//             {timer}
//           </p>
//         </div>
//       </div>

//       <div className="p-4 text-center">
//         <h2 className="text-[24px] text-white leading-[24px] font-bold font-mtn-brighter-bold text-center mb-[47px]">
//           {questions[currentQuestionIndex].question}
//         </h2>

//         {/* Pagination Dots */}
//         <div className="flex items-center justify-between mt-4 mb-[59px]">
//           {questions.map((_, index) => (
//             <div
//               key={index}
//               className={`w-2 h-2 rounded-full mx-1 ${
//                 statuses[index] === "correct"
//                   ? "bg-[#82e180]"
//                   : statuses[index] === "incorrect"
//                   ? "bg-[#e37e80]"
//                   : "bg-gray-500"
//               }`}
//             />
//           ))}
//         </div>

//         <div className="flex flex-col gap-[21px]">
//           {questions[currentQuestionIndex].answers.map((answer, index) => {
//             const isCorrectAnswer =
//               answer === questions[currentQuestionIndex].correctAnswer;
//             const isWrongAnswer = selectedAnswer === answer && !isCorrect;

//             return (
//               <button
//                 key={index}
//                 onClick={() => handleAnswerClick(answer)}
//                 className={`py-2 px-4 text-black rounded-[50px] w-[90vw] h-[60px] ${
//                   selectedAnswer === answer
//                     ? isCorrectAnswer
//                       ? "bg-[#82e180]"
//                       : "bg-[#e37e80]"
//                     : selectedAnswer && isCorrectAnswer
//                     ? "bg-[#82e180]"
//                     : "bg-white"
//                 }`}
//                 disabled={selectedAnswer !== null}
//               >
//                 {answer}
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BigCashTrivia;





// import React, { useState, useEffect,useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import Timer from "../assets/Icons/timer.svg";
// import { LeaderboardContext } from "../Context/LeaderboardContext"; 
// import { TriviaContext } from "../Context/TriviaContext";
// import { useParams } from 'react-router-dom';
// // import { getTriviaQuestions } from '../api/triviaApi';


// const BigCashTrivia = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [score, setScore] = useState(0);
//   const [statuses, setStatuses] = useState([]);
//   const [timer, setTimer] = useState(10);
//   const navigate = useNavigate();
//   const { gameId } = useParams();
//   const { handleUpdateLeaderboardScore } = useContext(LeaderboardContext);
//   const { leaderboard, loading, fetchLeaderboardStanding } = useContext(LeaderboardContext);
//   const {
//     games,
//     questions,
//     fetchQuestions,
//     selectedGameId,
//     setSelectedGameId,
//    error,

//   } = useContext(TriviaContext);



//   useEffect(() => {
//     if (selectedGameId) {
//       fetchQuestions(selectedGameId);
//     }
//   }, [selectedGameId, fetchQuestions]);

//   // useEffect(() => {
//   //   console.log("Game ID:", gameId);
//   //   if (gameId) {
//   //     setSelectedGameId(gameId);
//   //     fetchQuestions(gameId); 
//   //   }
//   // }, [gameId]);
  

//   useEffect(() => {
//     const timerId = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(timerId);
//           handleNextQuestion();
//           return 10;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [currentQuestionIndex]);

//   const handleAnswerClick = (answer) => {
//     if (selectedAnswer) return;

//     setSelectedAnswer(answer);
//     const isAnswerCorrect =
//       answer === questions[currentQuestionIndex].correctAnswer;
//     setIsCorrect(isAnswerCorrect);
//     setStatuses((prev) => {
//       const newStatuses = [...prev];
//       newStatuses[currentQuestionIndex] = isAnswerCorrect
//         ? "correct"
//         : "incorrect";
//       return newStatuses;
//     });

//     if (isAnswerCorrect) {
//       setScore(score + 1);
//     }

//     setTimeout(() => {
//       handleNextQuestion();
//     }, 2000);
//   };

//   const handleNextQuestion = () => {
//     setSelectedAnswer(null);
//     setIsCorrect(null);
//     setTimer(10);
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       handleUpdateLeaderboardScore(score);

//       navigate("/result-page", {
//         state: { score: score, totalQuestions: questions.length , statuses: statuses},
//       });
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>; // Show loading state
// }

//   return (
//     <div className="flex flex-col items-center w-full min-h-screen bg-darrk-gradient text-white">
//       <div className=" mt-[60px] mb-[30px]">
//         <div className="flex items-center justify-center bg-white w-[46px] h-[46px] border rounded-[50px]">
//           <img className="img-timer" src={Timer} alt="timer" />
//           <p className="text-black text-[18px] font-mtn-brighter-medium font-medium text-center">
//             {timer}
//           </p>
//         </div>
//       </div>

//       <div className="p-4 text-center">
//         <h2 className="text-[24px] text-white leading-[24px] font-bold font-mtn-brighter-bold text-center mb-[47px]">
//           {questions[currentQuestionIndex]?.question}
//         </h2>

//         {/* Pagination Dots */}
//         <div className="flex items-center justify-between mt-4 mb-[59px]">
//           {questions.map((_, index) => (
//             <div
//               key={index}
//               className={`w-2 h-2 rounded-full mx-1 ${
//                 statuses[index] === "correct"
//                   ? "bg-[#82e180]"
//                   : statuses[index] === "incorrect"
//                   ? "bg-[#e37e80]"
//                   : "bg-gray-500"
//               }`}
//             />
//           ))}
//         </div>

//         <div className="flex flex-col gap-[21px]">
//           {questions[currentQuestionIndex]?.answers?.map((answer, index) => {
//             const isCorrectAnswer =
//               answer === questions[currentQuestionIndex].correctAnswer;
//             const isWrongAnswer = selectedAnswer === answer && !isCorrect;

//             return (
//               <button
//                 key={index}
//                 onClick={() => handleAnswerClick(answer)}
//                 className={`py-2 px-4 text-black rounded-[50px] w-[90vw] h-[60px] ${
//                   selectedAnswer === answer
//                     ? isCorrectAnswer
//                       ? "bg-[#82e180]"
//                       : "bg-[#e37e80]"
//                     : selectedAnswer && isCorrectAnswer
//                     ? "bg-[#82e180]"
//                     : "bg-white"
//                 }`}
//                 disabled={selectedAnswer !== null}
//               >
//                 {answer}
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BigCashTrivia;






// import React, { useEffect, useState } from "react";
// import Logo from "../assets/Images/logo.png";
// import SplashIcon from "../assets/Icons/splash.png";
// import { useNavigate } from "react-router-dom";
// import axios from "axios"; 

// const SplashScreen = () => {
//   const [progress, setProgress] = useState(0);
//   const [loadingComplete, setLoadingComplete] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           setLoadingComplete(true);
//           clearInterval(interval);
//           return 100;
//         }
//         return prev + 10;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const checkSubscription = async () => {
//       const queryParams = new URLSearchParams(window.location.search);
//       let msisdn = queryParams.get('msisdn');

//       if (isBase64(msisdn)) {
//         msisdn = atob(msisdn);
//       }

//       try {
//         // const response = await axios.get(`https://ydvassdp.com:6001/api/DataSync/Subscription/CheckSubscriptionStatus?msisdn=${msisdn}&serviceId=9`);
       
//         const response = await axios.post(`https://be-spin-mtn.ydafrica.com/api/v1/checkstatus`, {
//           msisdn,
//           serviceId,
//         });
//      if (response.status === 200){
//         // if (response.data.isSubscribed) {
//           navigate("/redirect");
//         } else {
//           // navigate("/subscribe");
//         }
//       } catch (error) {
//         console.error("Error checking subscription status", error);
//         // navigate("/error");
//       }
//     };

//     if (loadingComplete) {
//       checkSubscription();
//     }
//   }, [loadingComplete, navigate]);

//   const isBase64 = (str) => {
//     try {
//       return btoa(atob(str)) === str;
//     } catch (err) {
//       return false; 
//     }
//   };

//   return (
//     <>
//       <div className="flex flex-col items-center justify-center h-screen bg-custom-gradient">
//         <div className="flex flex-col items-center justify-center">
//           <img
//             src={Logo}
//             alt="Logo"
//             className="w-[100%] h-[auto] max-w-[225.31px] mb-5"
//           />

//           <h1 className="text-[20px] font-bold font-mtn-brighter-bold text-center text-dark-gradient leading-[26px] mb-[100px] w-[342px] h-[52px] ">
//             Gain Access To Multiple Games,
//             <br /> And Have An Amazing Experience!
//           </h1>

//           {!loadingComplete && (
//             <div className="relative w-[230px] h-4 bg-[#EEEEEE99] rounded-full">
//               <div
//                 className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300"
//                 style={{ width: `${progress}%` }}
//               ></div>
//               <img
//                 src={SplashIcon}
//                 alt="Progress Splash Icon"
//                 className="absolute top-[-10px] w-9 h-9 transition-transform"
//                 style={{ transform: `translateX(${progress * 1.9}px)` }}
//               />
//             </div>
//           )}

//           {loadingComplete && (
//             <div className="h-[60px] w-[230px] flex justify-center items-center">
//               <button
//                 className="relative bg-darrk-gradient shadow-custom-shadow w-full h-full text-white text-[20px] text-center font-bold font-mtn-brighter-bold leading-[26px] rounded-[30px] transition-all"
//                 onClick={() => navigate("/home")} 
//               >
//                 Play Now
//                 <img
//                   src={SplashIcon}
//                   alt="Splash Icon"
//                   className="absolute -top-[25px] -right-3 w-10 h-10 m-2"
//                 />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SplashScreen;







// import React, { useEffect, useState } from "react";
// import Logo from "../assets/Images/logo.png";
// import SplashIcon from "../assets/Icons/splash.png";
// import { useNavigate } from "react-router-dom";
// import axios from "axios"; 

// const SplashScreen = () => {
//   const [progress, setProgress] = useState(0);
//   const [loadingComplete, setLoadingComplete] = useState(false);
//   const [apiMessage, setApiMessage] = useState(""); // State to store API message
//   const [isActive, setIsActive] = useState(false);  // State to store active status
//   const navigate = useNavigate();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           setLoadingComplete(true);
//           clearInterval(interval);
//           return 100;
//         }
//         return prev + 10;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const checkSubscription = async () => {
//       const queryParams = new URLSearchParams(window.location.search);
//       let msisdn = queryParams.get('msisdn');

//       if (isBase64(msisdn)) {
//         msisdn = atob(msisdn);
//       }

//       try {
//         // Make the API call to check the subscription status
//         const response = await axios.post(`https://be-spin-mtn.ydafrica.com/api/v1/checkstatus`, {
//           msisdn,
//           serviceId: 778, // Use a service ID if available or from the params
//         });

//         if (response.status === 200) {
//           const { State, Description } = response.data.data;
//           setApiMessage(Description); // Set the description message from the API

//           if (State === "Active") {
//             setIsActive(true); // Set active status if subscription is active
//             navigate(`/redirect?cli=${btoa(msisdn)}&sid=778`);
//           } else {
//             setIsActive(false); // Set inactive status if subscription is inactive
//           }
//         }
//       } catch (error) {
//         // Capture and display the error message from the API response
//         if (error.response && error.response.data) {
//           setApiMessage(error.response.data.msg || "An error occurred");
//         } else {
//           setApiMessage("An unknown error occurred");
//         }
//       }
//     };

//     if (loadingComplete) {
//       checkSubscription();
//     }
//   }, [loadingComplete, navigate]);

//   const isBase64 = (str) => {
//     try {
//       return btoa(atob(str)) === str;
//     } catch (err) {
//       return false; 
//     }
//   };

//   return (
//     <>
//       <div className="flex flex-col items-center justify-center h-screen bg-custom-gradient">
//         <div className="flex flex-col items-center justify-center">
//           <img
//             src={Logo}
//             alt="Logo"
//             className="w-[100%] h-[auto] max-w-[225.31px] mb-5"
//           />

//           <h1 className="text-[20px] font-bold font-mtn-brighter-bold text-center text-dark-gradient leading-[26px] mb-[100px] w-[342px] h-[52px] ">
//             Gain Access To Multiple Games,
//             <br /> And Have An Amazing Experience!
//           </h1>

//           {!loadingComplete && (
//             <div className="relative w-[230px] h-4 bg-[#EEEEEE99] rounded-full">
//               <div
//                 className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300"
//                 style={{ width: `${progress}%` }}
//               ></div>
//               <img
//                 src={SplashIcon}
//                 alt="Progress Splash Icon"
//                 className="absolute top-[-10px] w-9 h-9 transition-transform"
//                 style={{ transform: `translateX(${progress * 1.9}px)` }}
//               />
//             </div>
//           )}

//           {loadingComplete && !isActive && (
//             <div className="mt-5 text-center text-red-600">
//               {/* Display the exact API message here */}
//               <p>{apiMessage}</p>
//             </div>
//           )}

//           {loadingComplete && isActive && (
//             <div className="h-[60px] w-[230px] flex justify-center items-center">
//               <button
//                 className="relative bg-darrk-gradient shadow-custom-shadow w-full h-full text-white text-[20px] text-center font-bold font-mtn-brighter-bold leading-[26px] rounded-[30px] transition-all"
//                 onClick={() => navigate("/home")} 
//               >
//                 Play Now
//                 <img
//                   src={SplashIcon}
//                   alt="Splash Icon"
//                   className="absolute -top-[25px] -right-3 w-10 h-10 m-2"
//                 />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default SplashScreen;







// import React, { useState, useEffect, useContext } from "react";
// import { Link } from "react-router-dom";
// import CarouselSection from "../Components/CarouselSection";
// import Action from "../assets/Icons/action.png";
// import Fantasy from "../assets/Icons/fantasy.png";
// import Racing from "../assets/Icons/racing.png";
// import BigCash from "../assets/Images/big-cash.jpeg";
// import XWinger from "../assets/Images/x-winger.png";
// import AvatarProfile from "../assets/Images/avatar-prof.png";
// import Home from "../assets/Icons/home.png";
// import Leaderboard from "../assets/Icons/leaderboard.png";
// import Profile from "../assets/Icons/profile.png";
// import PlusIcon from "../assets/Icons/plus-icon.png";
// import Avatar1 from "../assets/Icons/avatar1.png";
// import Avatar2 from "../assets/Icons/avatar2.png";
// import Avatar3 from "../assets/Icons/avatar3.png";
// import Avatar4 from "../assets/Icons/avatar4.png";
// import Avatar5 from "../assets/Icons/avatar5.png";
// import AuthContext from "../Context/AuthContext";
// import GameContext from "../Context/GameContext";
// import UserContext from "../Context/UserContext";
// import BigCashGame from "../Components/BigCashGame";
// import StarRatings from "../Components/StarRatings";
// import { LeaderboardContext } from "../Context/LeaderboardContext";

// const HomePage = () => {
//   const avatars = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5];
//   const [selectedAvatar, setSelectedAvatar] = useState(null);
//   const [showAvatarSelector, setShowAvatarSelector] = useState(false);
//   const [currentAvatar, setCurrentAvatar] = useState(AvatarProfile);
//   const [scrollDirection, setScrollDirection] = useState("null");
//   const [lastScrollTop, setLastScrollTop] = useState(0);
//   const { auth } = useContext(AuthContext);
//   const { handleUpdateSubscriberProfile, userProfile, msisdn } =
//     useContext(UserContext);


//     const { saveScoreToLocalStorage } = useContext(LeaderboardContext);

//   const { games, loading } = useContext(GameContext);
//   const [nickname, setNickname] = useState("Racer001");
//   const [iframeSrc, setIframeSrc] = useState("");

//   const truncateTitle = (title) => {
//     const maxLength = 15;
//     if (title.length > maxLength) {
//       return title.substring(0, maxLength) + "...";
//     }
//     return title;
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.scrollY || document.documentElement.scrollTop;
//       setScrollDirection(scrollTop > lastScrollTop ? "down" : "up");
//       setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [lastScrollTop]);


//     useEffect(() => {
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

//   const handleAvatarClick = () => {
//     setShowAvatarSelector(!showAvatarSelector);
//   };

//   const handleAvatarSelect = async (avatar) => {
//     setSelectedAvatar(avatar);
//     // // await handleUpdateSubscriberProfile({
//     // //   msisdn: userProfile.msisdn,
//     // //   avatarId: avatar,
//     // });
//   };

//   const handleSave = async () => {
//     try {
//       if (!selectedAvatar) return;
//       const avatarId = avatars.indexOf(selectedAvatar) + 1;
//       await handleUpdateSubscriberProfile(msisdn, nickname, avatarId);
//       setCurrentAvatar(selectedAvatar);

//       localStorage.setItem("avatarId", avatarId);
//       setShowAvatarSelector(false);
//     } catch (error) {
//       console.error("Error saving avatar:", error);
//     }
//   };

//   const handlePlay = (playUrl) => {
//     setIframeSrc(playUrl);
//   };

//   const handleBackToApp = () => {
//     setIframeSrc("");
//     saveScoreToLocalStorage(userProfile.msisdn, score);

//   };

//   return (
//     <>
//       <div className="relative ">
//         <div
//           className={`flex flex-col min-h-screen bg-darrk-gradient ${
//             showAvatarSelector ? "blur-[3px]" : ""
//           }`}
//         >
//           <div className="bg-[#E2EEF60D] mt-[17px]">
//             <div className="bg-nav-gradient rounded-[26px] text-white flex justify-center items-center w-[222px] h-[49px] mt-[21px] mx-auto">
//               <div className="flex justify-between items-center w-[242px] h-[49px]">
//                 <div className="flex items-center space-x-10 relative">
//                   <div
//                     className="w-[50px] h-[50px] flex items-center justify-center cursor-pointer"
//                     onClick={() => setShowAvatarSelector(!showAvatarSelector)}
//                   >
//                     <img
//                       src={currentAvatar || "/default-avatar.png"}
//                       alt="Profile Avatar"
//                       className="-ml-[8px] -mb-[6px]"
//                     />
//                   </div>
//                   <div className="flex items-center justify-center gap-[10px]">
//                     <Link
//                       to="/terms-and-conditions"
//                       className="border border-[#FFCB05] rounded-[26px] w-[51px] h-[27px] bg-[#7F806266] flex justify-center items-center mt-[12px] mb-[10px] "
//                     >
//                       <p className="font-mtn-brighter-medium font-medium text-[12px] leading-[15.6px] text-center text-[#FFCB05]">
//                         T&C's
//                       </p>
//                     </Link>
//                     <Link
//                       to="/faq"
//                       className="border border-[#FFCB05] rounded-[26px] w-[51px] h-[27px] flex items-center justify-center gap-[6px] py-[5px] px-[20px]"
//                     >
//                       <p className="font-mtn-brighter-medium font-medium text-[12px] leading-[15.6px] text-center text-[#FFCB05]">
//                         FAQ's
//                       </p>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-background w-[140px] h-[28px] rounded-b-[26px] flex items-center justify-center mx-auto shadow-box-shadow">
//               <p className="font-mtn-brighter-medium font-medium text-[10px] leading-[13px] text-center text-[#FFFFFF]">
//                 @{userProfile?.msisdn}
//               </p>
//             </div>
//             <div className="flex flex-col items-center flex-grow mt-[20px]">
//               <p className="text-white mb-[17px] font-mtn-brighter-xtra-bold font-extrabold text-[24px] leading-[31.2px] text-center">
//                 Play Now
//               </p>
//               {loading ? <p>Loading games...</p> : <CarouselSection />}
//             </div>
//           </div>

//           <section className="mt-[36px] w-full max-w-4xl lg:mx-auto">
//             <h2 className="font-mtn-brighter-xtra-bold font-extrabold text-[24px] leading-[31.2px] text-center text-[#FFFFFF]">
//               All Games
//             </h2>
//             <div className="flex items-center justify-center">
//               <div className="grid grid-cols-2 gap-[35px] mb-4">
//                 {games &&
//                   games.length > 0 &&
//                   games.map((game) => (
//                     <div
//                       key={game.gameId}
//                       className="bg-custom-t-gradient flex flex-col items-center justify-center mt-[32px] rounded-[16px] w-[152px] h-[166px]"
//                     >
//                       <img
//                         src={
//                           game.base64
//                             ? `data:image/png;base64,${game.base64}`
//                             : game.title.trim() === "X-Wing Fighter"
//                             ? XWinger
//                             : ""
//                         }
//                         alt={game.title || "game-image"}
//                         className="mb-[6px] -mt-[50px] w-[60px] h-[60px] rounded-[12px] object-cover"
//                       />
//                       <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center text-[#FFFFFF]">
//                         {game.title}
//                       </p>
//                       <div className="flex items-center justify-center mt-[9.8px]">
//                         <StarRatings />
//                       </div>
//                       <button
//                         onClick={() => handlePlay(game.playUrl)}
//                         className="bg-[#FFCB05] w-[108px] h-[30px] rounded-[15px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center flex items-center justify-center mx-auto mt-[12.87px]"
//                       >
//                         Play
//                       </button>
//                     </div>
//                   ))}
//               </div>
//             </div>
//             <BigCashGame />
//           </section>
//         </div>

//         {iframeSrc && (
//           <div className="absolute inset-0 bg-white z-50">
//             <iframe src={iframeSrc} title="Game"  sandbox="allow-scripts allow-same-origin" className="w-full h-full" />
//             <button
//               onClick={handleBackToApp}
//               className="absolute top-4 right-4 bg-sky-900 text-white px-4 py-2 rounded"
//             >
//               Back to App
//             </button>
//           </div>
//         )}

//         <div className="fixed w-full flex justify-center ">
//           <div
//             style={navStyle}
//             className="bottom-0 backdrop-blur-sm mb-[15px] md:mb-[50px] left-0px flex justify-between items-center w-[342px] h-[82px] bg-foot-nav-gradient rounded-b-[60px] pt-[12px] pb-[20px] px-[46px] "
//           >
//             <Link
//               to="/home"
//               className="bg-foot-nav-gradient rounded-[50px] w-[60px] h-[60px] flex items-center justify-center"
//             >
//               <img src={Home} alt="home" />
//             </Link>
//             <Link
//               to="/user-profile"
//               className="bg-foot-nav-gradient rounded-[50px] w-[60px] h-[60px] flex items-center justify-center"
//             >
//               <img src={Profile} alt="profile" />
//             </Link>
//             <Link
//               to="/leaderboard"
//               className="bg-foot-nav-gradient rounded-[50px] w-[60px] h-[60px] flex items-center justify-center"
//             >
//               <img src={Leaderboard} alt="leaderboard" />
//             </Link>
//           </div>
//         </div>
//         {showAvatarSelector && (
//           <div className="flex items-center justify-center mx-auto">
//             <div className="absolute top-[30px] left-auto w-[265px] h-[138px]  bg-background-avatar  rounded-[26px]  ">
//               <div className="flex  ">
//                 <img
//                   src={currentAvatar || "/default-avatar.png"}
//                   alt="Profile Avatar"
//                 />
//                 <p className="text-white pt-[12px] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-center w-[126px]">
//                   Please select an avatar
//                 </p>
//                 {selectedAvatar && (
//                   <button
//                     className="text-[#FFCB05] ml-[32px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center  -mt-[5px]"
//                     onClick={handleSave}
//                   >
//                     Save
//                   </button>
//                 )}
//               </div>

//               <div className="flex px-[10px] mt-4">
//                 {avatars.map((avatar, index) => (
//                   <div
//                     key={index}
//                     className={`relative  ${
//                       selectedAvatar === avatar
//                         ? "border-[3px] rounded-[28px] flex items-center justify-center border-[#FFCB05]"
//                         : ""
//                     } cursor-pointer`}
//                     onClick={() => handleAvatarSelect(avatar)}
//                   >
//                     <img
//                       src={avatar}
//                       alt={`Avatar ${index + 1}`}
//                       className="w-[50px] h-[50px]"
//                     />
//                     {selectedAvatar !== avatar && (
//                       <div className=" absolute bottom-[5px] right-0  w-[10px] h-[10px]  bg-[#FFCB05] rounded-[28px]">
//                         <img
//                           src={PlusIcon}
//                           alt="Plus Icon"
//                           className="w-[15px] h-[15px]  "
//                         />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default HomePage;



// import React, { useState, useEffect, useContext } from "react";
// import { Link } from "react-router-dom";
// import CarouselSection from "../Components/CarouselSection";
// import Arrow from "../assets/Icons/Arrow.png";
// import Action from "../assets/Icons/action.png";
// import Fantasy from "../assets/Icons/fantasy.png";
// import Racing from "../assets/Icons/racing.png";
// import StarYs from "../assets/Icons/Star-ys.png";
// import StarWs from "../assets/Icons/Star-ws.png";
// import Forknite from "../assets/Images/forknite.png";
// import XWinger from "../assets/Images/x-winger.png";
// import Gumball from "../assets/Images/gumball.png";
// import Taffy from "../assets/Images/match-up.png";
// import BigCash from "../assets/Images/big-cash.jpeg";
// import Home from "../assets/Icons/home.png";
// import Leaderboard from "../assets/Icons/leaderboard.png";
// import Profile from "../assets/Icons/profile.png";
// import FooterNav from "../assets/Images/nav-container.png";
// import AvatarProfile from "../assets/Images/avatar-prof.png";
// import Coins from "../assets/Images/coins.png";
// import PlusIcon from "../assets/Icons/plus-icon.png";
// import Avatar1 from "../assets/Icons/avatar1.png";
// import Avatar2 from "../assets/Icons/avatar2.png";
// import Avatar3 from "../assets/Icons/avatar3.png";
// import Avatar4 from "../assets/Icons/avatar4.png";
// import Avatar5 from "../assets/Icons/avatar5.png";
// import AuthContext from "../Context/AuthContext";
// import GameContext from "../Context/GameContext";
// import UserContext from "../Context/UserContext";
// import BigCashGame from "../Components/BigCashGame";
// import StarRatings from "../Components/StarRatings";

// const HomePage = () => {
//   const avatars = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5];
//   const [selectedAvatar, setSelectedAvatar] = useState(null);
//   const [showAvatarSelector, setShowAvatarSelector] = useState(false);
//   const [currentAvatar, setCurrentAvatar] = useState(AvatarProfile);
//   const [scrollDirection, setScrollDirection] = useState("null");
//   const [lastScrollTop, setLastScrollTop] = useState(0);
//   const { auth } = useContext(AuthContext);
//   const { handleUpdateSubscriberProfile, fetchProfile, userProfile, msisdn } =
//     useContext(UserContext);
//   const { games, loading } = useContext(GameContext);
//   const [categories, setCategories] = useState([]);
//   const [nickname, setNickname] = useState("Racer001");

//   useEffect(() => {
//     if (games && games.length > 0) {
//       const uniqueCategories = [
//         ...new Set(games.map((game) => game.category[0])),
//       ];

//       setCategories(uniqueCategories);
//     }
//   }, [games]);

//   const truncateTitle = (title) => {
//     const maxLength = 15;
//     if (title.length > maxLength) {
//       return title.substring(0, maxLength) + "...";
//     }
//     return title;
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

//   const handleAvatarClick = () => {
//     setShowAvatarSelector(!showAvatarSelector);
//   };

//   const handleAvatarSelect = async (avatar) => {
//     setSelectedAvatar(avatar);
//     // // await handleUpdateSubscriberProfile({
//     // //   msisdn: userProfile.msisdn,
//     // //   avatarId: avatar,
//     // });
//   };

//   const handleSave = async () => {
//     try {
//       if (!selectedAvatar) return;
//       const avatarId = avatars.indexOf(selectedAvatar) + 1;
//       await handleUpdateSubscriberProfile(msisdn, nickname, avatarId);
//       setCurrentAvatar(selectedAvatar);

//       localStorage.setItem("avatarId", avatarId);
//       setShowAvatarSelector(false);
//     } catch (error) {
//       console.error("Error saving avatar:", error);
//     }
//   };

//   const handlePlay = (playUrl) => {
//     localStorage.setItem("gameScore", 0);

//     window.open(playUrl, '_blank');
//   };

// // const handlePlay = (game) => {
// //   const currentScore = getCurrentScoreForGame(game.gameId);
// //   const totalScore = parseInt(localStorage.getItem("ydotGameScore")) || 0;
// //   const newTotalScore = totalScore + currentScore;

// //   localStorage.setItem("ydotGameScore", newTotalScore);

// //   window.location.href = game.playUrl;
// // };

//   return (
//     <>
//       <div className="relative ">
//         <div
//           className={`flex flex-col min-h-screen  h-[1240px] bg-darrk-gradient  ${
//             showAvatarSelector ? " blur-[3px]" : ""
//           }`}
//         >
//           <div className="bg-[#E2EEF60D] mt-[17px]">
//             <div className="bg-nav-gradient rounded-[26px] text-white flex justify-center items-center w-[222px] h-[49px]  mt-[21px] mx-auto">
//               <div className="flex justify-between items-center w-[242px] h-[49px]">
//                 <div className="flex items-center  space-x-10  relative">
//                   <div
//                     className="w-[50px] h-[50px]  flex items-center justify-center cursor-pointer"
//                     onClick={handleAvatarClick}
//                   >
//                     <img
//                       src={currentAvatar || "/default-avatar.png"}
//                       alt="Profile Avatar"
//                       className="-ml-[8px] -mb-[6px]"
//                     />
//                   </div>
//                   <div className="flex items-center justify-center gap-[10px]  ">
//                     {/* <div className="flex items-center justify-center">
//                       <img src={Coins} alt="coin" />
//                       <p className="font-mtn-brighter-medium font-medium text-[12px] text-center leading-[15.6px] text-[#FFFFFF]">
//                         R10k
//                       </p>
//                     </div> */}

//                     <Link
//                       to="/terms-and-conditions"
//                       className="border border-[#FFCB05] rounded-[26px] w-[51px] h-[27px] bg-[#7F806266] flex justify-center items-center mt-[12px] mb-[10px] "
//                     >
//                       <p className="font-mtn-brighter-medium font-medium text-[12px] leading-[15.6px] text-center text-[#FFCB05]">
//                         T&C's
//                       </p>
//                     </Link>
//                     <Link
//                       to="/faq"
//                       className="border border-[#FFCB05]   rounded-[26px] w-[51px] h-[27px]  flex items-center  justify-center gap-[6px]   py-[5px] px-[20px]  "
//                     >
//                       <p className="font-mtn-brighter-medium font-medium text-[12px] leading-[15.6px] text-center text-[#FFCB05]">
//                         {" "}
//                         FAQ's
//                       </p>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-background w-[140px] h-[28px] rounded-b-[26px] flex items-center justify-center mx-auto shadow-box-shadow">
//               <p className="font-mtn-brighter-medium font-medium text-[10px] leading-[13px] text-center text-[#FFFFFF]">
//                 @{userProfile?.msisdn}
//               </p>
//             </div>
//             <div className="flex flex-col items-center flex-grow mt-[20px]">
//               <p className="text-white mb-[17px] font-mtn-brighter-xtra-bold font-extrabold text-[24px] leading-[31.2px] text-center">
//                 Play Now
//               </p>
//               {loading ? <p>Loading games...</p> : <CarouselSection />}
//             </div>
//           </div>

//           <section className="mt-[36px] w-full max-w-4xl lg:mx-auto">
//             <h2 className="font-mtn-brighter-xtra-bold font-extrabold text-[24px] leading-[31.2px] text-center text-[#FFFFFF]">
//               All Games
//             </h2>
//             <div className="space-x-[33px] mt-[17px] flex justify-center items-center mb-[20px]">
//               {/* {categories.map((category, index) => (
//                 <button
//                   key={index}
//                   className="flex items-center justify-center text-white rounded-[26px] border border-[#D7E7F066] bg-[#EDF0F233] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] gap-[6px] text-center px-[9px] py-[5px]"
//                 >
//                   {category === "Action" && <img src={Action} alt="action" />}
//                   {category === "Adventure" && (
//                     <img src={Fantasy} alt="fantasy" />
//                   )}
//                   {category === "Racing" && <img src={Racing} alt="racing" />}
//                   {category}
//                 </button>
//               ))} */}
//             </div>

//             <div className="flex items-center justify-center">
//               <div className="grid grid-cols-2 gap-[35px] mb-4">
//                 {/* {games.map((game, index) => ( */}

//                 {games &&
//                   games.length > 0 &&
//                   games.map((game) => (

//                       <div
//                         key={game.gameId}
//                         className="bg-custom-t-gradient flex flex-col items-center justify-center mt-[32px] rounded-[16px] w-[152px] h-[166px]"
//                       >
//                         <img
//                           src={
//                             game.base64
//                               ? `data:image/png;base64,${game.base64}`
//                               : game.title &&
//                                 game.title.trim() === "X-Wing Fighter"
//                               ? XWinger
//                               : ""
//                           }
//                           alt={game.title || "game-image"}
//                           className="mb-[6px] -mt-[50px] w-[60px] h-[60px] rounded-[12px] object-cover"
//                         />

//                         <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center text-[#FFFFFF]">
//                           {truncateTitle(game.title)}
//                         </p>
//                         <div className="flex items-center justify-center mt-[9.8px]">
//                           <StarRatings />
//                         </div>
//                         <button   onClick={() => handlePlay(game.playUrl)}  className="bg-[#FFCB05] w-[108px] h-[30px] rounded-[15px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center flex items-center justify-center px-[30px] py-[6px] mx-auto mt-[12.87px]">
//                           {/* <a
//                             href={game.playUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                           >
//                             Play
//                           </a> */}
//                           Play
//                         </button>
//                       </div>
//                     )
//                   )}
//               </div>
//             </div>
//             <BigCashGame />
//           </section>
//         </div>

//         <div className="fixed w-full flex justify-center  ">
//           <div
//             style={navStyle}
//             className="bottom-0 backdrop-blur-sm mb-[15px] md:mb-[50px]   left-0px flex justify-between items-center w-[342px] h-[82px] bg-foot-nav-gradient rounded-b-[60px] pt-[12px] pb-[20px] px-[46px] "
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

//         {showAvatarSelector && (
//           <div className="flex items-center justify-center mx-auto">
//             <div className="absolute top-[30px] left-auto w-[265px] h-[138px]  bg-background-avatar  rounded-[26px]  ">
//               <div className="flex  ">
//                 <img
//                   src={currentAvatar || "/default-avatar.png"}
//                   alt="Profile Avatar"
//                 />
//                 <p className="text-white pt-[12px] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-center w-[126px]">
//                   Please select an avatar
//                 </p>
//                 {selectedAvatar && (
//                   <button
//                     className="text-[#FFCB05] ml-[32px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center  -mt-[5px]"
//                     onClick={handleSave}
//                   >
//                     Save
//                   </button>
//                 )}
//               </div>

//               <div className="flex px-[10px] mt-4">
//                 {avatars.map((avatar, index) => (
//                   <div
//                     key={index}
//                     className={`relative  ${
//                       selectedAvatar === avatar
//                         ? "border-[3px] rounded-[28px] flex items-center justify-center border-[#FFCB05]"
//                         : ""
//                     } cursor-pointer`}
//                     onClick={() => handleAvatarSelect(avatar)}
//                   >
//                     <img
//                       src={avatar}
//                       alt={`Avatar ${index + 1}`}
//                       className="w-[50px] h-[50px]"
//                     />
//                     {selectedAvatar !== avatar && (
//                       <div className=" absolute bottom-[5px] right-0  w-[10px] h-[10px]  bg-[#FFCB05] rounded-[28px]">
//                         <img
//                           src={PlusIcon}
//                           alt="Plus Icon"
//                           className="w-[15px] h-[15px]  "
//                         />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default HomePage;




