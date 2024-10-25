import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Timer from "../assets/Icons/timer.svg";
import { LeaderboardContext } from "../Context/LeaderboardContext";
import { TriviaContext } from "../Context/TriviaContext";
import UserContext from "../Context/UserContext";
import { Circles } from "react-loader-spinner";
import { submitAnswer } from "../api/triviaApi";

const BigCashTrivia = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [statuses, setStatuses] = useState([]);
  const [timer, setTimer] = useState(10);
  const [error, setError] = useState(null);
  const [isFetchingResult, setIsFetchingResult] = useState(false); 
  const navigate = useNavigate();
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const { msisdn } = useContext(UserContext);
  const { gameId } = useParams();
  const { handleUpdateLeaderboardScore } = useContext(LeaderboardContext);
  const {
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
    if (questions.length > 0) {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setTimer(10);
      setStatuses(Array(questions.length).fill(null));
    }
  }, [questions]);

  useEffect(() => {
    // if (currentQuestionIndex >= questions.length) return;

    const timerId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleTimerExpiration();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [currentQuestionIndex]);

  const handleTimerExpiration = async () => {
    if (selectedAnswer === null) {
      // console.log("Time's up! No answer was selected for the question.");
      setStatuses((prevStatuses) => {
        const newStatuses = [...prevStatuses];
        newStatuses[currentQuestionIndex] = "incorrect";
        return newStatuses;
      });

      await handleNextQuestion();
    }
  };

  const handleAnswerClick = async (answer) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const questionId = questions[currentQuestionIndex].id;

    try {
      const response = await handleAnswerSubmit(msisdn, questionId, answer);
      const isAnswerCorrect =
        answer === questions[currentQuestionIndex].rightAnswer;

      const newStatuses = [...statuses];
      newStatuses[currentQuestionIndex] = isAnswerCorrect
        ? "correct"
        : "incorrect";
      setStatuses(newStatuses);

      setScore((prevScore) => {
        let awardedPoints = 0;
        if (response && response.statusCode === "999") {
          const pointsMessage = response.message;
          awardedPoints = parseInt(pointsMessage.match(/\d+/)[0]);
        }
        return prevScore + awardedPoints;
      });

      const updatedCorrectAnswers = isAnswerCorrect
        ? correctAnswers + 1
        : correctAnswers;
      const updatedWrongAnswers = isAnswerCorrect
        ? wrongAnswers
        : wrongAnswers + 1;

      setCorrectAnswers(updatedCorrectAnswers);
      setWrongAnswers(updatedWrongAnswers);

      // Proceed to next question after a 2-second delay
      setTimeout(() => {
        if (currentQuestionIndex === questions.length - 1) {
          finalizeGame(); // Call the function to handle the last question and navigate
        } else {
          handleNextQuestion();
        }
      }, 2000);
    } catch (err) {
      setError("An error occurred while submitting your answer.");
    }
  };

  const handleNextQuestion = async () => {
    setSelectedAnswer(null);
    setTimer(10);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // Ensure selectedAnswer is updated
      if (selectedAnswer === null) {
        // Handle case where user didn't select an answer
        const newStatuses = [...statuses];
        // newStatuses[currentQuestionIndex] = "incorrect";
        newStatuses[currentQuestionIndex] =
          selectedAnswer === questions[currentQuestionIndex].rightAnswer
            ? "correct"
            : "incorrect";

        setStatuses(newStatuses);
      }
      await finalizeGame();
    }
  };

  const finalizeGame = async () => {
    setIsFetchingResult(true); 
    try {

      const finalScore = await new Promise((resolve) => {
        setScore((prevScore) => {
          resolve(prevScore);
          return prevScore;
        });
      });

  

      // Replace null with correct status
      const completedStatuses = statuses.map((status, index) => {
        if (status === null) {
          return selectedAnswer === questions[index].rightAnswer
            ? "correct"
            : "incorrect";
        }
        return status;
      });

      const correctAnswers = completedStatuses.filter(
        (status) => status === "correct"
      ).length;
      const incorrectAnswers = completedStatuses.filter(
        (status) => status === "incorrect"
      ).length;


      await handleUpdateLeaderboardScore(msisdn, finalScore);
      setTimeout(() => {
        setIsFetchingResult(false); 
        navigate("/result-page", {
          state: {
            score: finalScore,
            totalQuestions: questions.length,
            statuses: completedStatuses,
            correctAnswers: correctAnswers,
            incorrectAnswers: incorrectAnswers,
            gameId: selectedGameId,
          },
        });
      }, 1000);
    } catch (err) {
      setError("An error occurred while updating the leaderboard.");
    }
  };

  if (loading || isFetchingResult) {
    return (
      <div className="flex items-center justify-center bg-darrk-gradient h-screen mx-auto">
        <Circles color="white" height={50} width={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center mx-auto mt-[50px]">
        <p className="text-white text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-darrk-gradient text-white pt-[60px] ">
      <div className="p-4 text-center">
        <h2 className="text-[24px] text-white leading-[24px] font-bold font-mtn-brighter-bold text-center mb-[47px]">
          {/* {questions[currentQuestionIndex]?.text || "No question available."} */}
          {questions.length > 0
            ? questions[currentQuestionIndex]?.text
            : "No question available."}
        </h2>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center mt-4 mb-[59px] gap-[25px] px-4">
          {questions.map((_, index) => (
            <div
              key={index}
              className="w-3 h-3 flex items-center justify-center rounded-full "
            >
              {statuses[index] === "correct" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="green"
                  viewBox="0 0 24 24"
                  stroke="green"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : statuses[index] === "incorrect" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="red"
                  viewBox="0 0 24 24"
                  stroke="red"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="gray"
                  className="w-6 h-6"
                >
                  <circle cx="12" cy="12" r="4" />
                </svg>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-[21px] items-center">
          {/* {questions[currentQuestionIndex]?.answers?.map((answer, index) => ( */}
          {questions.length > 0 &&
            questions[currentQuestionIndex]?.answers?.map((answer, index) => (
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
            ))}
        </div>
      </div>
      <div className="pt-[90px]">
        <div className="flex items-center justify-center bg-white w-[86px] h-[86px] border rounded-[50px]">
          <img className="img-timer w-[30%]" src={Timer} alt="timer" />
          <p className="text-black text-[28px] font-mtn-brighter-medium font-medium text-center">
            {timer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BigCashTrivia;










