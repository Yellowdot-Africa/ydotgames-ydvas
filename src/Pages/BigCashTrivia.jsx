import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Timer from "../assets/Icons/timer.svg";
import { LeaderboardContext } from "../Context/LeaderboardContext";
import { TriviaContext } from "../Context/TriviaContext";
import UserContext from "../Context/UserContext";
import { Circles } from "react-loader-spinner";
// import { submitAnswer } from "../api/triviaApi";

const BigCashTrivia = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [statuses, setStatuses] = useState([]);
  const [timer, setTimer] = useState(10);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
          handleTimerExpiration(false);
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
    const response = await handleAnswerSubmit(msisdn, questionId, answer);
    // console.log("Submit answer response:", response);

    const isAnswerCorrect =
      answer === questions[currentQuestionIndex].rightAnswer;

    setStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      newStatuses[currentQuestionIndex] = isAnswerCorrect
        ? "correct"
        : "incorrect";
      return newStatuses;
    });

    // console.log("Updated statuses:", statuses);

    setScore((prevScore) => {
      let awardedPoints = 0;
      if (response && response.statusCode === "999") {
        const pointsMessage = response.message;
        awardedPoints = parseInt(pointsMessage.match(/\d+/)[0]);
      }
      return prevScore + awardedPoints;
    });

    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  const handleNextQuestion = async () => {
    setSelectedAnswer(null);
    setTimer(10);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      await finalizeGame();
    }
  };

  const finalizeGame = async () => {
    const finalScore = await new Promise((resolve) => {
      setScore((prevScore) => {
        resolve(prevScore);
        return prevScore;
      });
    });

    // console.log(statuses);
    // console.log("Final Statuses:", statuses);
    // console.log("Final Score:", finalScore);

    await handleUpdateLeaderboardScore(msisdn, finalScore);

    setTimeout(() => {
      navigate("/result-page", {
        state: {
          score: finalScore,
          totalQuestions: questions.length,
          statuses: statuses,
          gameId: selectedGameId,
        },
      });
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center mx-auto mt-[50px]">
        <Circles color="black" height={50} width={50} />
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
              className={`w-3 h-3 rounded-full ${
                statuses[index] === "correct"
                  ? "bg-[#82e180]"
                  : statuses[index] === "incorrect"
                  ? "bg-[#e37e80]"
                  : "bg-gray-500"
              }`}
            />
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
    </div>
  );
};

export default BigCashTrivia;
