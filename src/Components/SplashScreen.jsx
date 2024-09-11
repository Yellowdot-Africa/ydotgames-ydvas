import React, { useEffect, useState } from "react";
import Logo from "../assets/Images/logo.png";
import SplashIcon from "../assets/Icons/splash.png";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
const navigate = useNavigate();


  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setLoadingComplete(true);
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);


 const handlePlayNow = ()=>{
    navigate("/home")
 }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-custom-gradient">
        <div className="flex flex-col items-center justify-center space-t-8">
          <img
            src={Logo}
            alt="Logo"
            className="w-[100%] h-[auto] max-w-[225.31px] mb-5"
          />

          <h1 className="text-[20px] font-bold font-mtn-brighter-bold text-center text-dark-gradient leading-[26px] mb-[110px] w-[342px] h-[52px] ">
            Gain Access To Multiple Games,
            <br /> And Have An Amazing Experience!
          </h1>

          {!loadingComplete && (
            <div className="relative w-[230px] h-4 bg-[#EEEEEE99] rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
              <img
                src={SplashIcon}
                alt="Progress Splash Icon"
                className="absolute top-[-10px] w-9 h-9 transition-transform"
                style={{ transform: `translateX(${progress * 1.9}px)` }}
              />
            </div>
          )}

          {/* {loadingComplete ? ( */}
          {loadingComplete && (
            <div className="h-[60px] w-[230px] flex justify-center items-center mt-8">
              <button className="relative bg-darrk-gradient shadow-custom-shadow w-full h-full text-white text-[20px] text-center font-bold font-mtn-brighter-bold leading-[26px] rounded-[30px] transition-all" onClick={handlePlayNow}>
                Play Now
                <img
                  src={SplashIcon}
                  alt="Splash Icon"
                  className="absolute -top-[25px] -right-3 w-10 h-10 m-2"
                />
              </button>
              {/* //   ) : null} */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SplashScreen;
