import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Timer from "../assets/Icons/timer.svg";
import { LeaderboardContext } from "../Context/LeaderboardContext";
import { TriviaContext } from "../Context/TriviaContext";
import UserContext from "../Context/UserContext";




const BigCashTrivia = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [statuses, setStatuses] = useState([]);
  const [timer, setTimer] = useState(10);
  const navigate = useNavigate();
  const { userProfile,fetchProfile, error,msisdn, handleUpdateSubscriberProfile } = useContext(UserContext);

  const { gameId } = useParams();
  const { handleUpdateLeaderboardScore } = useContext(LeaderboardContext);
  const {
    leaderboard,
    loading,
    fetchQuestions,
    questions,
    selectedGameId,
    handleAnswerSubmit,
  } = useContext(TriviaContext);

  useEffect(() => {
    if (selectedGameId) {
      fetchQuestions(selectedGameId);
    }
  }, [selectedGameId]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleNextQuestion();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [currentQuestionIndex]);

  const handleAnswerClick = async (answer) => {
    if (selectedAnswer) return; 

    setSelectedAnswer(answer);
    const questionId = questions[currentQuestionIndex].id;
    const msisdn = "27837441852";
    const response = await handleAnswerSubmit(msisdn, questionId, answer);

    console.log("Submit answer response:", response); 

    if (response && response.statusCode === "999") {
      const isAnswerCorrect =
        answer === questions[currentQuestionIndex]?.rightAnswer;
      setIsCorrect(isAnswerCorrect);
      setStatuses((prev) => {
        const newStatuses = [...prev];
        newStatuses[currentQuestionIndex] = isAnswerCorrect
          ? "correct"
          : "incorrect";
        return newStatuses;
      });

      if (isAnswerCorrect) {
        const pointsMessage = response.message;
        const awardedPoints = parseInt(pointsMessage.match(/\d+/)[0]);
        console.log(`Awarded Points: ${awardedPoints}`); 

        setScore((prevScore) => prevScore + awardedPoints); }

      setTimeout(() => {
        handleNextQuestion();
      }, 2000);
    } else {
      console.error("Failed to submit answer:", response);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimer(10); 

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      console.log(
        "All questions answered. Navigating to results with score:",
        score
      );
      handleUpdateLeaderboardScore(msisdn,score);
      navigate("/result-page", {
        state: { score, totalQuestions: questions.length, statuses },
      });
      return; 
    }
  };

  if (loading || !questions || questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-darrk-gradient text-white">
      <div className="mt-[60px] mb-[30px]">
        <div className="flex items-center justify-center bg-white w-[46px] h-[46px] border rounded-[50px]">
          <img className="img-timer" src={Timer} alt="timer" />
          <p className="text-black text-[18px] font-mtn-brighter-medium font-medium text-center">
            {timer}
          </p>
        </div>
      </div>

      <div className="p-4 text-center">
        <h2 className="text-[24px] text-white leading-[24px] font-bold font-mtn-brighter-bold text-center mb-[47px]">
          {questions[currentQuestionIndex]?.text || "No question available."}
        </h2>

        {/* Pagination Dots */}
        {/* <div className="flex items-center justify-between mt-4 mb-[59px]">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full  ${
                statuses[index] === "correct"
                  ? "bg-[#82e180]"
                  : statuses[index] === "incorrect"
                  ? "bg-[#e37e80]"
                  : "bg-gray-500"
              }`}
            />
          ))}
        </div> */}

        <div className="flex flex-col gap-[21px]">
          {!questions[currentQuestionIndex]?.answers ||
          questions[currentQuestionIndex].answers.length === 0 ? (
            <div>No answer options available.</div>
          ) : (
            questions[currentQuestionIndex].answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(answer)}
                className={`py-2 px-4 text-black rounded-[50px] w-[90vw] h-[60px] ${
                  selectedAnswer === answer
                    ? answer === questions[currentQuestionIndex].rightAnswer
                      ? "bg-[#82e180]"
                      : "bg-[#e37e80]"
                    : selectedAnswer &&
                      answer === questions[currentQuestionIndex].rightAnswer
                    ? "bg-[#82e180]"
                    : "bg-white"
                }`}
                disabled={selectedAnswer !== null}
              >
                {answer}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BigCashTrivia;





