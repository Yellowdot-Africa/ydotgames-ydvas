import React, {useState} from "react";
import { Link } from "react-router-dom";
import CarouselSection from "../Components/CarouselSection";
import AvatarProfile from "../assets/Images/avatar-prof.png";
import Coins from "../assets/Images/coins.png";
import Arrow from "../assets/Icons/Arrow.png";
import Action from "../assets/Icons/action.png";
import Fantasy from "../assets/Icons/fantasy.png";
import Racing from "../assets/Icons/racing.png";
import StarYs from "../assets/Icons/Star-ys.png";
import StarWs from "../assets/Icons/Star-ws.png";
import Forknite from "../assets/Images/forknite.png";
import XWinger from "../assets/Images/x-winger.png";
import Gumball from "../assets/Images/gumball.png";
import Taffy from "../assets/Images/match-up.png";
import Home from "../assets/Icons/home.png";
import Leaderboard from "../assets/Icons/leaderboard.png";
import Profile from "../assets/Icons/profile.png";
import FooterNav from "../assets/Images/nav-container.png";
import PlusIcon from "../assets/Icons/plus-icon.png"; 
import Avatar1 from "../assets/Icons/avatar1.png";
import Avatar2 from "../assets/Icons/avatar2.png";
import Avatar3 from "../assets/Icons/avatar3.png";
import Avatar4 from "../assets/Icons/avatar4.png";
import Avatar5 from "../assets/Icons/avatar5.png";




const HomePage = () => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [ProfileAvatar, setProfileAvatar] = useState(null);


  const avatars = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5]; 


  const handleAvatarClick = () => {
    setModalOpen(true);
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    // setModalOpen(false); 
  };


  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      setModalOpen(false);
    }
  };


  const handleSaveClick = () => {
    setProfileAvatar(selectedAvatar);
    setModalOpen(false);
  };

  
  return (
    <>
      <div className="flex flex-col min-h-screen bg-darrk-gradient">
        <div className="bg-nav-gradient rounded-[26px] text-white flex justify-center items-center  mt-[21px] ml-[65px] mr-[57px]">
          <div className="flex justify-between items-center w-[265px] h-[49px]">
            <div className="flex items-center justify-between space-x-12 relative">
              <div className="w-[40px] h-[40px] shadow-box-shadow flex items-center justify-center cursor-pointer"  onClick={handleAvatarClick}>
                {/* <img src={AvatarProfile} alt="avatar" /> */}
                <img
                //  src={selectedAvatar !== null ? avatars[selectedAvatar] : AvatarProfile} alt="avatar"
                 src={AvatarProfile || "/default-avatar.png"}
                 alt="Profile Avatar"
                 />

              </div>
              <div className="flex items-center justify-center">
                <img src={Coins} alt="coin" />
                <p className="font-mtn-brighter-medium font-medium text-[12px] text-center leading-[15.6px] text-[#FFFFFF]">
                  R10k
                </p>
              </div>
              <div className="border border-[#FFCB05] rounded-[26px] w-[51px] h-[27px] bg-[#7F806266] flex justify-center items-center mt-[12px] mb-[10px] mr-[10px]">
                <p className="font-mtn-brighter-medium font-medium text-[12px] leading-[15.6px] text-center text-[#FFCB05]">
                  T&C
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-background w-[140px] h-[28px] rounded-b-[26px] flex items-center justify-center m-auto shadow-box-shadow">
          <p className="font-mtn-brighter-medium font-medium text-[10px] leading-[13px] text-center text-[#FFFFFF]">
            @+2778 414 2470
          </p>
        </div>

        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">

            <div className="relative bg-white p-8 rounded-lg">
            <div className="flex justify-between items-center mb-4">

              <h3 className="font-bold text-xl mb-4 text-center">
                Please select an avatar
              </h3>
              {selectedAvatar && (
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                  onClick={handleSaveClick}
                >
                  Save
                </button>
              )}
            </div>
            <div className="mb-4">
              <img
                src={AvatarProfile || "/default-avatar.png"}
                alt="Current Avatar"
                className="w-24 h-24 rounded-full mx-auto"
              />
            </div>
              {/* <div className="flex justify-center gap-4"> */}
              <div className="grid grid-cols-3 gap-4">

                {avatars.map((avatar, index) => (
                  <div
                    key={index}
                    src={avatar}
                    alt={`Avatar ${index}`}
                    onClick={() => handleAvatarSelect(avatar)} // Select avatar
                    className={` w-[80px] h-[80px] rounded-full p-2 cursor-pointer flex items-center justify-center ${
                      selectedAvatar === avatar ? "border-4 border-yellow-500" : ""
                    }`}
                  >
                    <img src={avatar} alt={`avatar-${index}`} className="rounded-full" />
                    <img
                      src={PlusIcon}
                      alt="plus"
                      className="absolute bottom-0 right-0 w-[20px] h-[20px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <section className="flex flex-col items-center flex-grow mt-[20px]">
          <p className="text-white mb-[17px] font-mtn-brighter-xtra-bold font-extrabold text-[24px] leading-[31.2px] text-center">
            Play Now
          </p>

          <CarouselSection />

          <button className="bg-[#7F806266] border border-[#FFCB05] rounded-[26px] flex items-center text-[#FFCB05] justify-center gap-[6px] mt-[29px] py-[5px] px-[16px] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-center">
            <img src={Arrow} alt="arrow" />
            Discover More
          </button>

          <div className="mt-[26px] w-full max-w-4xl ">
            <h2 className="font-mtn-brighter-xtra-bold font-extrabold text-[24px] leading-[31.2px] text-center text-[#FFFFFF]">
              All Games
            </h2>
            <div className="space-x-[33px] mt-[17px] flex justify-center items-center mb-[20px]">
              <button className="flex items-center justify-center text-white rounded-[26px] border border-[#D7E7F066] bg-[#EDF0F233] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] gap-[6px] text-center px-[11px] py-[5px]">
                <img src={Action} alt="action" />
                Action
              </button>
              <button className="flex items-center justify-center text-white rounded-[26px] border border-[#D7E7F066] bg-[#EDF0F233] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] gap-[6px] text-center px-[6px] py-[5px]">
                <img src={Fantasy} alt="fantasy" />
                Fantasy
              </button>
              <button className="flex items-center justify-center text-white rounded-[26px] border border-[#D7E7F066] bg-[#EDF0F233] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] gap-[6px] text-center px-[9px] py-[5px]">
                <img src={Racing} alt="racing" />
                Racing
              </button>
            </div>

            <div className="flex items-center justify-center">
              <div className="grid grid-cols-2 gap-[35px] mb-4 ">
                <div className="bg-custom-t-gradient flex flex-col items-center justify-center mt-[32px] rounded-[16px] w-[152px] h-[166px]">
                  <img
                    src={Forknite}
                    alt="forknite"
                    className="mb-[6px] -mt-[50px]"
                  />
                  <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center text-[#FFFFFF]">
                    Forknite
                  </p>
                  <div className="flex items-center justify-center mt-[9.8px]">
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarWs} alt="start" />
                    <img src={StarWs} alt="start" />
                  </div>
                  <button className="bg-[#FFCB05] w-[108px] h-[30px] rounded-[15px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center flex items-center justify-center px-[30px] py-[6px] mx-auto mt-[12.87px]">
                    Play
                  </button>
                </div>
                <div className="bg-custom-t-gradient flex flex-col items-center justify-center mt-[32px] rounded-[16px] w-[152px] h-[166px]">
                  <img
                    src={Gumball}
                    alt="gunball"
                    className="mb-[6px] -mt-[50px]"
                  />
                  <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center text-[#FFFFFF]">
                    Gumball
                  </p>
                  <div className="flex items-center justify-center mt-[9.8px]">
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarWs} alt="start" />
                    <img src={StarWs} alt="start" />
                  </div>
                  <button className="bg-[#FFCB05] w-[108px] h-[30px] rounded-[15px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center flex items-center justify-center px-[30px] py-[6px] mx-auto mt-[12.87px]">
                    Play
                  </button>
                </div>
                <div className="bg-custom-t-gradient flex flex-col items-center justify-center mt-[32px] rounded-[16px] w-[152px] h-[166px]">
                  <img
                    src={Taffy}
                    alt="taffy"
                    className="mb-[6px] -mt-[50px]"
                  />
                  <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center text-[#FFFFFF]">
                    Taffy Match Up
                  </p>
                  <div className="flex items-center justify-center mt-[9.8px]">
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarWs} alt="start" />
                    <img src={StarWs} alt="start" />
                    <img src={StarWs} alt="start" />
                  </div>
                  <button className="bg-[#FFCB05] w-[108px] h-[30px] rounded-[15px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center flex items-center justify-center px-[30px] py-[6px] mx-auto mt-[12.87px]">
                    Play
                  </button>
                </div>
                <div className="bg-custom-t-gradient flex flex-col items-center justify-center mt-[32px] rounded-[16px] w-[152px] h-[166px]">
                  <img
                    src={XWinger}
                    alt="xwinger"
                    className="mb-[6px] -mt-[50px]"
                  />
                  <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center text-[#FFFFFF]">
                    X-Winger
                  </p>
                  <div className="flex items-center justify-center mt-[9.8px]">
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarYs} alt="start" />
                    <img src={StarWs} alt="start" />
                    <img src={StarWs} alt="start" />
                  </div>
                  <button className="bg-[#FFCB05] w-[108px] h-[30px] rounded-[15px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center flex items-center justify-center px-[30px] py-[6px] mx-auto mt-[12.87px]">
                    Play
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div
          className="relative w-full bg-cover bg-center flex justify-center py-4  "
          style={{ backgroundImage: `url(${FooterNav})` }}
        >
          <div className="absolute bottom-[238px] left-[34px] flex justify-between items-center w-[342px] h-[82px] bg-foot-nav-gradient rounded-b-[60px] pt-[12px] pb-[20px] px-[46px] ">
          
            <Link
              to="/"
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

export default HomePage;





