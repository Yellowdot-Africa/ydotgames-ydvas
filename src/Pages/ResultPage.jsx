import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Trophy from "../assets/Images/gold-trophy.png";
import Right from "../assets/Icons/icon-cancel.png";
import Cancel from "../assets/Icons/icon-right.png";
import { TriviaContext } from "../Context/TriviaContext";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // console.log('Score:', score, 'Total Questions:', totalQuestions, 'Statuses:', statuses);
  // const { score, totalQuestions, statuses = [] } = location.state || {};
  // const { score, totalQuestions, correctAnswers, incorrectAnswers } =
  //   location.state;

    const { score = 0, totalQuestions = 0, correctAnswers = [], incorrectAnswers = [] } = location.state || {};

    // console.log('Location state:', location.state); 
  const { games, fetchGames, selectedGameId, setSelectedGameId } =
    useContext(TriviaContext);
  const gameId = location.state?.gameId || selectedGameId;

  // const correctAnswers = statuses.filter(
  //   (status) => status === "correct"
  // ).length;
  // const wrongAnswers = statuses.filter(
  //   (status) => status === "incorrect"
  // ).length;

  const handlePlayAgain = () => {
    navigate("/home");
  };

  const handleReplay = () => {
    if (gameId) {
      setSelectedGameId(gameId);
      navigate(`/bigcash-trivia/${gameId}`);
    } else {
      console.error("No game ID available for replay.");
    }
  };

  return (
    <div className="flex flex-col items-center   w-[100%] h-[100vh]  bg-[#EFF3F5] text-black pt-[70px] px-[20px]">
      <h1 className="text-[20px] leading-[24px] font-mtn-brighter-bold font-bold mb-4">
        Your Results
      </h1>
      <div className="flex items-center justify-around w-full h-[40px] bg-[#f7f7f7] rounded-[10px]">
        <div className="flex items-center justify-center">
          <img
            className="bg-[#4fd96d] w-[18px] h-[18px] rounded-[50px] p-[3px]"
            src={Right}
            alt="green"
          />
          <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[19px] text-[#221E1E] text-center p-[20px]">
            {correctAnswers}
          </p>
          <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[22px] text-[#221E1E]">
            Correct{" "}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <img
            className="bg-[#e37f80] w-[18px] h-[18px] rounded-[50px] p-[3px]"
            src={Cancel}
            alt="red"
          />
          <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[19px] text-[#221E1E] text-center p-[20px]">
            {/* {wrongAnswers} */}
            {incorrectAnswers}
          </p>
          <p className="font-mtn-brighter-bold font-bold text-[14px] leading-[22px] text-[#221E1E]">
            Wrong
          </p>
        </div>
      </div>

      <div className="flex flex-col mt-[66px] items-center justify-center">
        <img src={Trophy} alt="trophy" />
        <p className="font-mtn-brighter-medium font-medium text-[24px] text-[#221E1E] w-[155px] h-[52px] rounded-[10px] flex items-center justify-center text-center bg-[#e0f5e5] mt-[35px]">
          Well Done
        </p>
      </div>

      <button
        onClick={handleReplay}
        className="mt-[36px] w-full h-[50px] text-center leading-[16.51px] font-mtn-brighter-medium font-medium text-[14px] text-white rounded-[30px] border-none bg-[#19BFC1]"
      >
        Replay
      </button>
      <button
        onClick={handlePlayAgain}
        className="mt-[26px] text-[#19BFC1] font-mtn-brighter-medium font-medium text-[14px] leading-[16.41px] text-center py-2 px-4 "
      >
        Home
      </button>
    </div>
  );
};

export default ResultPage;






