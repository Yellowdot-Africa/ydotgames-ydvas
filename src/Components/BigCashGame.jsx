import React from "react";
import { Link } from "react-router-dom";
import BigCash from "../assets/Images/big-cash.jpeg";
import FPBRating from "../assets/Images/FPBrating.png";


const BigCashGame = () => {
  return (
    <div className="w-full mt-6 flex items-center justify-center mx-auto mb-[110px]">
      <Link to="/trivia-games">
        <div className="flex justify-center items-center">
          <div className="relative w-[344px] h-[166px]  bg-custom-t-gradient rounded-[16px] shadow-md flex flex-col items-center justify-between p-4">
            <div className="w-[120px] h-[80px] bg-cover bg-center"></div>
            <div className="text-center">
              <img
                src={BigCash}
                alt="bigcash"
                className="-mt-[50px] rounded-[50px] w-[60px] h-[60px] object-cover mx-auto mb-[8px]"
              />
              <h3 className="text-white font-bold font-mtn-brighter-bold  text-[18px] text-center leading-[18.2px]">
                BigCash Trivia Game
              </h3>
              <p className="text-gray-400 text-[14px] font-mtn-brighter-regular font-regular text-center leading-[18.2px] mt-2">
                Test your trivia knowledge!
              </p>
              {/* <p className="font-mtn-brighter-bold  mt-1 font-bold text-[12px] leading-[16px] text-center text-[#FFFFFF]">
                      FPB Rating: PG-13
                    </p> */}
                    <div className="flex items-center justify-center">
                    <img src={FPBRating} alt="rating" className=" pt-[5.87px] " />

                    </div>

                    
            </div>

            <button className="mt-2 bg-[#19BFC1] text-white px-4 py-2 rounded-lg font-mtn-brighter-medium font-medium text-[16px] text-center">
              Play Now
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BigCashGame;

// import React, { useEffect, useState, useCallback } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   fetchUserQuestions,
//   setCurrentQuestionIndex,
//   submitAnswer,
//   setQuestions,
// } from "../../features/questions/questionSlice";
// import {
//   getCategories,
//   getGames,
// } from "../../features/categories/categoriesSlice";
// import Pagination from "../../Components/Pagination";
// import Timer from "../../assets/Icons/timer.svg";
// import { useNavigate, useLocation } from "react-router-dom";
// import EndGameModal from "../../Components/EndGameModal";
// import "../../Pages/Questions/QuestionsScreen.css";
// import { unwrapResult } from "@reduxjs/toolkit";
// import { Circles } from "react-loader-spinner";
// import { v4 as uuidv4 } from "uuid";

// const QuestionScreen = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { questions, currentQuestionIndex, answers, loading, error } =
//     useSelector((state) => state.questions);
//   const selectedCategoryID = useSelector(
//     (state) => state.categories.selectedCategory
//   );
//   const selectedGameID = useSelector((state) => state.categories.selectedGame);
//   const selectedLanguage =
//     useSelector((state) => state.categories.selectedLanguage) || "en";
//   const token = useSelector((state) => state.auth.jwt);
//   const [userAnswers, setUserAnswers] = useState([]);
//   const [selectedAnswerID, setSelectedAnswerID] = useState(null);
//   const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
//   const [feedbackText, setFeedbackText] = useState("");
//   const [correctAnswers, setCorrectAnswers] = useState(0);
//   const [wrongAnswers, setWrongAnswers] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [timer, setTimer] = useState(10);
//   const [screenBgColor, setScreenBgColor] = useState("#580DA4");
//   const [answerBgColors, setAnswerBgColors] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isOptionSelected, setIsOptionSelected] = useState(false);
//   const { selectedPack } = location.state || {};
//   const activeIndex = currentQuestionIndex;
//   const [statuses, setStatuses] = useState([]);
//   const [isTimerActive, setIsTimerActive] = useState(true);
//   const gameReference = uuidv4();
//   const [answerSubmitted, setAnswerSubmitted] = useState(false);

//   useEffect(() => {
//     dispatch(getCategories());
//     dispatch(getGames());
//   }, [dispatch]);

//   useEffect(() => {
//     if (!selectedPack) {
//       setErrorMessage("Selected question pack is not available.");
//       return;
//     }

//     const packId = selectedPack?.questionPackId;

//     if (selectedCategoryID && selectedGameID && packId) {
//       dispatch(
//         fetchUserQuestions({
//           categoryID: selectedCategoryID,
//           gameID: selectedGameID,
//           packId,
//         })
//       )
//         .then(unwrapResult)
//         .then((result) => {
//           dispatch(setQuestions(result.data));
//           setErrorMessage("");
//           dispatch(setCurrentQuestionIndex(0));
//           resetQuestionState();
//         })
//         .catch((err) => {
//           console.error("Error fetching questions:", err);
//           const errorMessage =
//             err.response?.data?.message || "An unknown error occurred";
//           setErrorMessage(errorMessage);
//         });
//     } else {
//       setErrorMessage("Pack ID is missing.");
//     }
//   }, [
//     dispatch,
//     selectedPack,
//     selectedGameID,
//     selectedCategoryID,
//     selectedLanguage,
//     token,
//   ]);

//   const resetQuestionState = () => {
//     setSelectedAnswerID(null);
//     setSelectedAnswerIndex(null);
//     setIsOptionSelected(false);
//     setTimer(10);
//     setAnswerBgColors([]);
//     setFeedbackText("");
//     setScreenBgColor("#580DA4");
//   };

//   const handleAnswerSubmission = useCallback(
//     async (isTimeout = false) => {
//       const currentQuestion = questions[currentQuestionIndex] || {};
//       const questionID = currentQuestion?.id;

//       const isCorrect = answers[selectedAnswerIndex]?.isCorrectAnswer === true;

//       const newStatuses = [...statuses];
//       newStatuses[currentQuestionIndex] = isCorrect ? "correct" : "wrong";
//       setStatuses(newStatuses);

//       // Update user answers
//       if (!isTimeout && selectedAnswerID !== null) {
//         setUserAnswers((prevAnswers) => [
//           ...prevAnswers,
//           { questionID: questionID, selectedAnswerID: selectedAnswerID },
//         ]);

//         // Update answer colors and feedback
//         const newAnswerBgColors = answers.map((answer, index) => {
//           if (index === selectedAnswerIndex) {
//             return isCorrect ? "#5CBE5A" : "#E37F80";
//           }
//           return answer.isCorrectAnswer ? "#5CBE5A" : "";
//         });

//         setAnswerBgColors(newAnswerBgColors);
//         setScreenBgColor("#4C22B8");

//         setFeedbackText(isCorrect ? "Nice! Correct" : "Oops! Wrong");
//       } else if (isTimeout) {
//         console.log("Timeout triggered for question:", questionID);
//       }

//       // Manually calculate updated counts
//       const updatedCorrectAnswers = isCorrect
//         ? correctAnswers + 1
//         : correctAnswers;
//       const updatedWrongAnswers = isCorrect ? wrongAnswers : wrongAnswers + 1;

//       // Update state counts
//       setCorrectAnswers(updatedCorrectAnswers);
//       setWrongAnswers(updatedWrongAnswers);

//       const nextIndex = currentQuestionIndex + 1;
//       if (nextIndex < questions.length) {
//         // Move to the next question
//         dispatch(setCurrentQuestionIndex(nextIndex));
//         resetQuestionState();
//       } else {
//         // Include the last answer
//         const finalAnswers = [
//           ...userAnswers,
//           { questionID: questionID, selectedAnswerID: selectedAnswerID },
//         ];

//         await submitAnswerPack(finalAnswers);

//         // Pass updated counts directly
//         navigate("/result-page", {
//           state: {
//             correctAnswers: updatedCorrectAnswers,
//             wrongAnswers: updatedWrongAnswers,
//             selectedPack,
//           },
//         });
//       }
//     },
//     [
//       selectedAnswerID,
//       selectedAnswerIndex,
//       answers,
//       currentQuestionIndex,
//       questions.length,
//       dispatch,
//       userAnswers,
//       correctAnswers,
//       wrongAnswers,
//       navigate,
//       selectedPack,
//       statuses,
//     ]
//   );

//   const submitAnswerPack = async (answers) => {
//     const userAnswerData = {
//       questionPackID: selectedPack.questionPackId,
//       gameID: selectedGameID,
//       gameReference: gameReference,
//       answers,
//     };

//     try {
//       await dispatch(submitAnswer(userAnswerData));
//       navigate("/result-page", {
//         state: {
//           correctAnswers,
//           wrongAnswers,
//           // totalAnswered: correctAnswers + wrongAnswers,
//           selectedPack,
//         },
//       });
//     } catch (error) {
//       console.error("Error submitting answers:", error);
//       setErrorMessage("Failed to submit answers. Please try again.");
//     }
//   };

//   const handleAnswerClick = useCallback(
//     (index) => {
//       if (selectedAnswerIndex === null) {
//         setSelectedAnswerIndex(index);
//         setIsOptionSelected(true);

//         setScreenBgColor("#0B0B2A");

//         setAnswerBgColors(
//           answers.map((_, i) => (i === index ? "#973CF2" : ""))
//         );
//         setSelectedAnswerID(answers[index].id);
//         setAnswerSubmitted(true);
//         // handleAnswerSubmission();
//         // setIsTimerActive(false);
//       }
//     },
//     [selectedAnswerIndex, answers, setAnswerSubmitted]
//   );

//   useEffect(() => {
//     if (!loading && questions.length > 0) {
//       const timerInterval = setInterval(() => {
//         setTimer((prevTimer) => {
//           if (prevTimer === 1) {
//             clearInterval(timerInterval);
//             handleAnswerSubmission();
//             return 0;
//           }
//           return prevTimer - 1;
//         });
//       }, 1000);

//       return () => clearInterval(timerInterval);
//     }
//   }, [loading, questions.length, handleAnswerSubmission]);

//   useEffect(() => {
//     if (answerSubmitted) {
//       const newAnswerBgColors = answers.map((answer, index) => {
//         if (index === selectedAnswerIndex) {
//           return answers[selectedAnswerIndex].isCorrectAnswer
//             ? "#5CBE5A"
//             : "#E37F80";
//         }
//         return answer.isCorrectAnswer ? "#5CBE5A" : "";
//       });
//       setAnswerBgColors(newAnswerBgColors);
//       setAnswerSubmitted(false);
//     }
//   }, [answerSubmitted, answers, selectedAnswerIndex]);

//   const handleQuit = () => {
//     setScreenBgColor("#1F82F2");
//     setShowModal(true);
//   };

//   const handleEndGame = () => {
//     navigate("/result-page", {
//       state: { correctAnswers, wrongAnswers, selectedPack },
//     });
//   };

//   const handlePageChange = (newIndex) => {
//     dispatch(setCurrentQuestionIndex(newIndex));
//     resetQuestionState();
//   };

//   const currentQuestion = questions[currentQuestionIndex] || [];

//   return (
//     <div
//       className={`question-screen ${showModal ? "modal-active" : ""}`}
//       style={{ backgroundColor: screenBgColor }}
//     >
//       <div className="timer-container">
//         <div className="timer-wrapper">
//           <div className="timer">
//             <img className="img-timer" src={Timer} alt="timer" />
//             <p>{timer}</p>
//           </div>
//           <div className="quit-div">
//             <p className="quit" onClick={handleQuit}>
//               Quit
//             </p>
//           </div>
//         </div>
//       </div>

//       <main className="main-container">
//         {loading ? (
//           <Circles color="#D9D9D9" height={20} width={20} />
//         ) : errorMessage ? (
//           <div className="error-message">{errorMessage}</div>
//         ) : (
//           <>
//             <div className="quest-main-container">
//               <p className="question-txt">{currentQuestion?.question}</p>

//               <Pagination
//                 totalItems={questions.length}
//                 activeIndex={activeIndex}
//                 onChange={handlePageChange}
//                 statuses={statuses}
//               />

//               <div className="answer-container">
//                 <div className="answer-card">
//                   {answers.map((answer, index) => (
//                     <div
//                       key={index}
//                       className={`answer-option ${
//                         selectedAnswerIndex === index ? "selected" : ""
//                       }`}
//                       style={{ backgroundColor: answerBgColors[index] || "" }}
//                       onClick={() => handleAnswerClick(index)}
//                     >
//                       <span className="answer-content">
//                         {answer.answerText}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </main>
//       <EndGameModal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         onEnd={handleEndGame}
//       />
//     </div>
//   );
// };

// export default QuestionScreen;
