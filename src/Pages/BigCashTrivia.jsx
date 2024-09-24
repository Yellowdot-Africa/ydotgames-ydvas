import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Timer from "../assets/Icons/timer.svg";

const BigCashTrivia = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [statuses, setStatuses] = useState([]);
  const [timer, setTimer] = useState(10);
  const navigate = useNavigate();

  const questions = [
    {
      question: "What is the capital of France?",
      answers: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: "Paris",
    },
    {
      question: "FC Barcelona has won how many Champions League trophy?",
      answers: ["5", "4", "3", "7"],
      correctAnswer: "5",
    },
    {
      question: "Which planet is known as the Red Planet?",
      answers: ["Earth", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars",
    },
    {
      question: "Who wrote 'Hamlet'?",
      answers: [
        "Mark Twain",
        "J.K. Rowling",
        "William Shakespeare",
        "Charles Dickens",
      ],
      correctAnswer: "William Shakespeare",
    },

    {
      question: "Manchester United has won how many Champions League trophy?",
      answers: ["5", "4", "3", "7"],
      correctAnswer: "3",
    },

    {
      question: "What is the last book in the Bible?",
      answers: ["Genesis", "Revelation", "Luke", "Chronicles"],
      correctAnswer: "Revelation",
    },
    {
      question: "Which planet is known as the Red Planet?",
      answers: ["Earth", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars",
    },
    {
      question: "Who wrote 'Hamlet'?",
      answers: [
        "Mark Twain",
        "J.K. Rowling",
        "William Shakespeare",
        "Charles Dickens",
      ],
      correctAnswer: "William Shakespeare",
    },
    {
      question: "Cristiano Ronaldo has how many Ballon d'Or awards?",
      answers: ["5", "6", "8", "7"],
      correctAnswer: "5",
    },
    {
      question: "Which country won the 2022 World Cup hosted in Qatar?",
      answers: ["Nigeria", "Portugal", "Argentina", "France"],
      correctAnswer: "Argentina",
    },
  ];

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

  const handleAnswerClick = (answer) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const isAnswerCorrect =
      answer === questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(isAnswerCorrect);
    setStatuses((prev) => {
      const newStatuses = [...prev];
      newStatuses[currentQuestionIndex] = isAnswerCorrect
        ? "correct"
        : "incorrect";
      return newStatuses;
    });

    if (isAnswerCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimer(10);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigate("/result-page", {
        state: { score: score, totalQuestions: questions.length , statuses: statuses},
      });
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-darrk-gradient text-white">
      <div className=" mt-[60px] mb-[30px]">
        <div className="flex items-center justify-center bg-white w-[46px] h-[46px] border rounded-[50px]">
          <img className="img-timer" src={Timer} alt="timer" />
          <p className="text-black text-[18px] font-mtn-brighter-medium font-medium text-center">
            {timer}
          </p>
        </div>
      </div>

      <div className="p-4 text-center">
        <h2 className="text-[24px] text-white leading-[24px] font-bold font-mtn-brighter-bold text-center mb-[47px]">
          {questions[currentQuestionIndex].question}
        </h2>

        {/* Pagination Dots */}
        <div className="flex items-center justify-between mt-4 mb-[59px]">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1 ${
                statuses[index] === "correct"
                  ? "bg-[#82e180]"
                  : statuses[index] === "incorrect"
                  ? "bg-[#e37e80]"
                  : "bg-gray-500"
              }`}
            />
          ))}
        </div>

        <div className="flex flex-col gap-[21px]">
          {questions[currentQuestionIndex].answers.map((answer, index) => {
            const isCorrectAnswer =
              answer === questions[currentQuestionIndex].correctAnswer;
            const isWrongAnswer = selectedAnswer === answer && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerClick(answer)}
                className={`py-2 px-4 text-black rounded-[50px] w-[90vw] h-[60px] ${
                  selectedAnswer === answer
                    ? isCorrectAnswer
                      ? "bg-[#82e180]"
                      : "bg-[#e37e80]"
                    : selectedAnswer && isCorrectAnswer
                    ? "bg-[#82e180]"
                    : "bg-white"
                }`}
                disabled={selectedAnswer !== null}
              >
                {answer}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BigCashTrivia;
