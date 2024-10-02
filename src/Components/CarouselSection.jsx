// import React, { useRef, useEffect, useState, useContext } from "react";
// import Frame1 from "../assets/Images/frame1.png";
// import Frame2 from "../assets/Images/frame2.png";
// import Frame3 from "../assets/Images/frame3.png";
// import StarW from "../assets/Icons/Star-w.png";
// import GameContext from "../Context/GameContext";
// import AuthContext from "../Context/AuthContext";
// import { Link } from "react-router-dom";

// import "../App.css";
// import StarRatings from "./StarRatings";

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
//         const itemWidth = 250;
//         const newActiveIndex = Math.round(scrollLeft / itemWidth);
//         setActiveIndex(newActiveIndex);
//       }
//     };

//     if (carousel) {
//       carousel.addEventListener("scroll", handleScroll);

//       const carouselWidth = carousel.offsetWidth;
//       const itemWidth = 189;
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
//           <div className="flex space-x-[12px] w-max mx-0 md:mx-auto">
//             {games.length > 0 ? (
//               games.slice(0, 3).map((game, index) => (
//                 <Link
//                 to={game.playUrl}
//                   key={game.gameId}
//                   rel="noopener noreferrer"
//                           target="_blank"
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
//                         className="w-[59px] h-[58px] rounded-[12px] absolute  object-cover z-10 "
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
//                           {/* <StarRatings/> */}
//                       </span>
//                       <button className="bg-[#2A76D8] pt-[7px] pb-[7px]  px-[15px] rounded-br-[20px]">
//                         <p
//                           href={game.playUrl}
//                           rel="noopener noreferrer"
//                           target="_blank"
//                           className="font-mtn-brighter-medium font-medium text-center text-[12px] leading-[15.6px] text-white"
//                         >
//                           Play
//                         </p>
//                       </button>
//                     </div>
//                   </div>
//                 </Link>
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






import React, { useRef, useEffect, useState, useContext } from "react";
import Frame1 from "../assets/Images/frame1.png";
import Frame2 from "../assets/Images/frame2.png";
import Frame3 from "../assets/Images/frame3.png";
import StarW from "../assets/Icons/Star-w.png";
import GameContext from "../Context/GameContext";
import AuthContext from "../Context/AuthContext";
import { Link } from "react-router-dom";

import "../App.css";
import StarRatings from "./StarRatings";

const CarouselSection = () => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(1);
  const { auth } = useContext(AuthContext);
  const { games, loading } = useContext(GameContext);

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
      ? "scale-125 transition-transform duration-300"
      : "scale-90 opacity-75 transition-transform duration-300";
  };

  return (
    <div className="w-full">
      {loading ? (
        <p>Loading games...</p>
      ) : (
        <div className="overflow-x-auto scrollbar-hide" ref={carouselRef}>
          <div className="flex space-x-[12px] w-max mx-0 md:mx-auto">
            {games.length > 0 ? (
              games.slice(0, 3).map((game, index) => (
                <Link
                  to={game.playUrl}
                  key={game.gameId}
                  rel="noopener noreferrer"
                  target="_blank"
                  className={`min-w-[157px] flex-shrink-0 ${getCardClass(
                    index
                  )}`}
                >
                  <div className="relative rounded-[20px] pt-[7px] px-0 border border-[#FEFFD366] bg-[#2E3237] overflow-visible">
                    <div
                      className="relative w-[142px] h-[71px] mx-[7px] bg-cover bg-center rounded-[16px] flex flex-col items-center justify-between"
                      style={{
                        backgroundImage: `url(${carouselConfig[index].frame})`,
                      }}
                    >
                      <img
                        src={`data:image/png;base64,${game.base64}`}
                        style={{ top: "-15px" }}
                        alt={game.title}
                        className="w-[59px] h-[58px] rounded-[12px] absolute object-cover z-10 "
                      />
                      <div className="absolute bottom-1 text-center">
                        <p className="font-mtn-brighter-xtra-bold font-extrabold text-[14px] leading-[18.2px] text-center text-[#002E38]">
                          {truncateTitle(game.title)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mx-0 border-none mt-[10px] mb-0 px-0">
                      <span
                        style={{
                          backgroundColor: carouselConfig[index].bgColor,
                        }}
                        className="bg-[#19BFC1] rounded-bl-[20px] w-[103px] h-[30px] flex items-center justify-center"
                      >
                        {Array(5)
                          .fill()
                          .map((_, starIndex) => (
                            <img key={starIndex} src={StarW} alt="star" />
                          ))}
                      </span>
                      <button className="bg-[#2A76D8] pt-[7px] pb-[7px] px-[15px] rounded-br-[20px]">
                        <p
                          href={game.playUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                          className="font-mtn-brighter-medium font-medium text-center text-[12px] leading-[15.6px] text-white"
                        >
                          Play
                        </p>
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>No games available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselSection;
