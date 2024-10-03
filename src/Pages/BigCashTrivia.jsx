
// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Timer from "../assets/Icons/timer.svg";
// import { LeaderboardContext } from "../Context/LeaderboardContext";
// import { TriviaContext } from "../Context/TriviaContext";
// import UserContext from "../Context/UserContext";
// import { Circles } from "react-loader-spinner";

// const BigCashTrivia = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [score, setScore] = useState(0);
//   const [statuses, setStatuses] = useState([]);
//   const [timer, setTimer] = useState(10);
//   const navigate = useNavigate();

//   const { userProfile, msisdn } = useContext(UserContext);
//   const { gameId } = useParams();
//   const { handleUpdateLeaderboardScore } = useContext(LeaderboardContext);

//   const {
//     loading,
//     fetchQuestions,
//     questions,
//     selectedGameId,
//     handleAnswerSubmit,
//   } = useContext(TriviaContext);

//   useEffect(() => {
//     if (selectedGameId) {
//       fetchQuestions(selectedGameId);
//     }
//   }, [selectedGameId]);

//   useEffect(() => {
//     if (questions.length > 0) {
//       setCurrentQuestionIndex(0);
//       setSelectedAnswer(null);
//       setIsCorrect(null);
//       setTimer(10);
//       setStatuses(Array(questions.length).fill(null));
//     }
//   }, [questions]);

//   useEffect(() => {
//     const timerId = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(timerId);
//           handleNextQuestion(false);
//           return 10;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [currentQuestionIndex]);


//   const handleAnswerClick = async (answer) => {
//     if (selectedAnswer) return;

//     setSelectedAnswer(answer);
//     const questionId = questions[currentQuestionIndex].id;
//     const response = await handleAnswerSubmit(msisdn, questionId, answer);

//     console.log("Submit answer response:", response);

//     const isAnswerCorrect =
//       answer === questions[currentQuestionIndex]?.rightAnswer;
//     // setIsCorrect(isAnswerCorrect);

//     // setStatuses((prev) => {
//     //   const newStatuses = [...prev];
//     //   newStatuses[currentQuestionIndex] = isAnswerCorrect
//     //     ? "correct"
//     //     : "incorrect";
//     //   return newStatuses;
//     // });
//     setStatuses((prevStatuses) => {
//       const newStatuses = [...prevStatuses];
//       newStatuses[currentQuestionIndex] = isAnswerCorrect ? "correct" : "incorrect";
//       console.log("Updated statuses:", newStatuses); // Log updated statuses
//       return newStatuses;
//   });

//   if (isAnswerCorrect) {
//     const awardedPoints = 10; // Assuming 10 points for each correct answer
//     setScore((prevScore) => prevScore + awardedPoints);
//     console.log("Awarded Points:", awardedPoints);
//   }

//   setTimeout(() => {
//     handleNextQuestion(isAnswerCorrect); // Proceed to the next question
//   }, 2000);
// };




//     if (response && response.statusCode === "999") {
//       if (isAnswerCorrect) {
//         const pointsMessage = response.message;
//         const awardedPoints = parseInt(pointsMessage.match(/\d+/)[0]);
//         console.log(`Awarded Points: ${awardedPoints}`);
//         setScore((prevScore) => prevScore + awardedPoints);
//       }
//       console.log("Statuses before transitioning:", statuses);
//     if (response && response.statusCode === "999") {
//       const pointsMessage = response.message;
//       const awardedPoints = parseInt(pointsMessage.match(/\d+/)[0]);
//       setScore((prevScore) => prevScore + awardedPoints);
//       console.log("Awarded Points:", awardedPoints); // Log awarded points
//   }
//   setTimeout(() => {
//     if (currentQuestionIndex + 1 < questions.length) {
//         handleNextQuestion(isAnswerCorrect); // Proceed to next question
//     } else {
//         console.log("All questions answered. Final Score:", score);
//         // Optionally: Navigate to the result page
//         // navigateToResults();
//     }
// }, 2000);
//       setTimeout(() => {
//         handleNextQuestion(isAnswerCorrect);
//       }, 3000);
//     } else {
//       console.error("Failed to submit answer:", response);
//     }
//   };

//   // const handleNextQuestion = (answeredCorrectly) => {
//   //   setSelectedAnswer(null);
//   //   setIsCorrect(null);
//   //   setTimer(10);

//   const handleNextQuestion = () => {
//     setSelectedAnswer(null);
//     setIsCorrect(null);
//     setTimer(10);
  

//     // setStatuses((prev) => {
//     //   const newStatuses = [...prev];
//     //   newStatuses[currentQuestionIndex] = answeredCorrectly
//     //     ? "correct"
//     //     : "incorrect";
//     //   return newStatuses;
//     // });

//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//     } else {
//       // const lastQuestionStatus = answeredCorrectly ? "correct" : "incorrect";

//       // setStatuses((prevStatuses) => {
//       //   const newStatuses = [...prevStatuses];
//       //   newStatuses[currentQuestionIndex] = answeredCorrectly ? "correct" : "incorrect"; // Set status for last question
//       //   console.log("Final statuses array before navigating:", newStatuses);

//       //   return newStatuses;
//       // });
//       console.log("All questions answered. Final Score:", score);
//       console.log("Final statuses array:", statuses);
  
//       handleUpdateLeaderboardScore(msisdn, score);

//       setTimeout(() => {
//         navigate("/result-page", {
//           state: {
//             score: score,
//             totalQuestions: questions.length,
//             statuses: [...statuses],
//           },
//         });
//       }, 2000);
//     }
//   };


//   if (loading || !questions || questions.length === 0) {
//     return (
//       <div className="flex items-center justify-center mx-auto mt-[50px]">
//         <Circles color="black" height={50} width={50} />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center w-full min-h-screen bg-darrk-gradient text-white">
//       <div className="mt-[60px] mb-[30px]">
//         <div className="flex items-center justify-center bg-white w-[46px] h-[46px] border rounded-[50px]">
//           <img className="img-timer" src={Timer} alt="timer" />
//           <p className="text-black text-[18px] font-mtn-brighter-medium font-medium text-center">
//             {timer}
//           </p>
//         </div>
//       </div>

//       <div className="p-4 text-center">
//         <h2 className="text-[24px] text-white leading-[24px] font-bold font-mtn-brighter-bold text-center mb-[47px]">
//           {questions[currentQuestionIndex]?.text || "No question available."}
//         </h2>

//         {/* Pagination Dots */}
//         <div className="flex items-center justify-center mt-4 mb-[59px] gap-[25px] px-4">
//           {questions.map((_, index) => (
//             <div
//               key={index}
//               className={`w-3 h-3 rounded-full ${
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
//           {/* {!questions[currentQuestionIndex]?.answers || */}
//           {/* // questions[currentQuestionIndex].answers.length === 0 ? (
//             // <div>No answer options available.</div>
//           // ) : ( */}
//             {/* {questions && questions[currentQuestionIndex] && questions[currentQuestionIndex].answers ? ( */}

//            {questions[currentQuestionIndex].answers.map((answer, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleAnswerClick(answer)}
//                 className={`py-2 px-4 text-black rounded-[50px] w-[90vw] h-[60px] ${
//                   selectedAnswer === answer
//                     ? answer === questions[currentQuestionIndex].rightAnswer
//                       ? "bg-[#82e180]"
//                       : "bg-[#e37e80]"
//                     : selectedAnswer &&
//                       answer === questions[currentQuestionIndex].rightAnswer
//                     ? "bg-[#82e180]"
//                     : "bg-white"
//                 }`}
//                 disabled={selectedAnswer !== null}
//               >
//                 {answer}
//               </button>
//             ))}
//             {/* // ) : (
//             //   <div>Loading...</div>
//             // )} */}
//               {/* // } */}
//           {/* )} */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default React.memo(BigCashTrivia);



// import React, { useEffect, useState } from 'react';

// const AvatarSelector = ({ avatars }) => {
//   const [selectedAvatar, setSelectedAvatar] = useState(null);
//   const [currentAvatar, setCurrentAvatar] = useState("/default-avatar.png"); // Default avatar
//   const [showAvatarSelector, setShowAvatarSelector] = useState(false);
//   const [error, setError] = useState("");
//   const storedMsisdn = localStorage.getItem('cli');

//   useEffect(() => {
//     const storedAvatar = localStorage.getItem("selectedAvatar");
//     if (storedAvatar) {
//       setSelectedAvatar(storedAvatar);
//       setCurrentAvatar(storedAvatar); // Show stored avatar if exists
//     } else {
//       setCurrentAvatar("/default-avatar.png"); // Set default avatar if none selected
//     }
//   }, []);

//   const handleAvatarClick = () => {
//     setShowAvatarSelector(!showAvatarSelector);
//   };

//   const handleAvatarSelect = (avatarId) => {
//     setSelectedAvatar(avatarId);
//   };

//   const handleSave = async () => {
//     try {
//       if (!selectedAvatar) return;
//       const avatarId = avatars.indexOf(selectedAvatar) + 1;

//       const msisdn = storedMsisdn; // Using stored MSISDN directly
//       if (!msisdn) {
//         setError("MSISDN is required");
//         console.log("MSISDN is required");
//         return;
//       }
//       const nickname = msisdn;

//       console.log("avatar saved", avatarId);
//       localStorage.setItem("selectedAvatar", selectedAvatar);

//       await handleUpdateSubscriberProfile(msisdn, nickname, avatarId);

//       setCurrentAvatar(selectedAvatar); // Update current avatar to selected
//       setShowAvatarSelector(false);
//     } catch (error) {
//       console.error("Error saving avatar:", error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleAvatarClick}>
//         {currentAvatar && (
//           <img src={currentAvatar} alt="Current Avatar" className="w-[50px] h-[50px]" />
//         )}
//       </button>

//       {showAvatarSelector && (
//         <div className="flex items-center justify-center mx-auto">
//           <div className="absolute top-[30px] left-auto w-[265px] h-[138px] bg-background-avatar rounded-[26px]">
//             <div className="flex">
//               <img
//                 src={currentAvatar}
//                 alt="Profile Avatar"
//               />
//               <p className="text-white pt-[12px] font-mtn-brighter-medium font-medium text-[14px] leading-[18.2px] text-center w-[126px]">
//                 Please select an avatar
//               </p>
//               {selectedAvatar && (
//                 <button
//                   className="text-[#FFCB05] ml-[32px] font-mtn-brighter-bold font-bold text-[14px] leading-[18.2px] text-center -mt-[5px]"
//                   onClick={handleSave}
//                 >
//                   Save
//                 </button>
//               )}
//             </div>

//             <div className="flex px-[10px] mt-4">
//               {avatars.map((avatar, index) => (
//                 <div
//                   key={index}
//                   className={`relative ${
//                     selectedAvatar === avatar
//                       ? "border-[3px] rounded-[28px] flex items-center justify-center border-[#FFCB05]"
//                       : ""
//                   } cursor-pointer`}
//                   onClick={() => handleAvatarSelect(avatar)}
//                 >
//                   <img
//                     src={avatar}
//                     alt={`Avatar ${index + 1}`}
//                     className="w-[50px] h-[50px]"
//                   />
//                   {selectedAvatar !== avatar && (
//                     <div className="absolute bottom-[5px] right-0 w-[10px] h-[10px] bg-[#FFCB05] rounded-[28px]">
//                       <img
//                         src={PlusIcon}
//                         alt="Plus Icon"
//                         className="w-[15px] h-[15px]"
//                       />
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AvatarSelector;



// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Timer from "../assets/Icons/timer.svg";
// import { LeaderboardContext } from "../Context/LeaderboardContext";
// import { TriviaContext } from "../Context/TriviaContext";
// import UserContext from "../Context/UserContext";
// import { Circles } from "react-loader-spinner";
// import { submitAnswer } from "../api/triviaApi";

// const BigCashTrivia = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [score, setScore] = useState(0);
//   const [statuses, setStatuses] = useState([]);
//   const [timer, setTimer] = useState(10);
//   const navigate = useNavigate();

//   const { msisdn } = useContext(UserContext);
//   const { gameId } = useParams();
//   const { handleUpdateLeaderboardScore } = useContext(LeaderboardContext);
//   const { loading, fetchQuestions, questions, selectedGameId, handleAnswerSubmit } = useContext(TriviaContext);

//   useEffect(() => {
//     if (selectedGameId) {
//       fetchQuestions(selectedGameId);
//     }
//   }, [selectedGameId]);






//   useEffect(() => {
//     if (questions.length > 0) {
//       setCurrentQuestionIndex(0);
//       setSelectedAnswer(null);
//       setTimer(10);
//       setStatuses(Array(questions.length).fill(null));
//     }
//   }, [questions]);

//   useEffect(() => {
//     if (currentQuestionIndex >= questions.length) return;

//     const timerId = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(timerId);
//           handleTimerExpiration(null); // Call the function when timer expires
//           return 10; 
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [currentQuestionIndex]);

//   // Handle timer expiration by marking the current question as unanswered
//   const handleTimerExpiration = async () => {
//     if (selectedAnswer === null) {
//       console.log("Time's up! No answer was selected for the question.");
//       setStatuses((prevStatuses) => {
//         const newStatuses = [...prevStatuses];
//         newStatuses[currentQuestionIndex] = "incorrect"; // Mark as incorrect
//         return newStatuses;
//       });

//       await handleNextQuestion(false); // Move to the next question
//     }
//   };

//   const handleAnswerClick = async (answer) => {
//     if (selectedAnswer) return;

//     setSelectedAnswer(answer);
//     const questionId = questions[currentQuestionIndex].id;
//     const response = await handleAnswerSubmit(msisdn, questionId, answer);
//     console.log("Submit answer response:", response);

//     const isAnswerCorrect = answer === questions[currentQuestionIndex].rightAnswer;

//     setStatuses((prevStatuses) => {
//       const newStatuses = [...prevStatuses];
//       newStatuses[currentQuestionIndex] = isAnswerCorrect ? "correct" : "incorrect";
//       return newStatuses;
//     });

//     useEffect(() => {
//       console.log("Updated statuses:", statuses);
//     }, [statuses]);
    

//     // console.log("Updated statuses:",statuses);

//     setScore((prevScore) => {
//           let awardedPoints = 0;
//           if (response && response.statusCode === '999') {
//             const pointsMessage = response.message;
//             awardedPoints = parseInt(pointsMessage.match(/\d+/)[0]);
//           }
//           return prevScore + awardedPoints; // Return the updated score
//         });
      
//         // Call handleNextQuestion after a delay
//         setTimeout(() => {
//           handleNextQuestion();
//         }, 2000);
//       };

//   //   if (response && response.statusCode === "999") {
//   //     const pointsMessage = response.message;
//   //     const awardedPoints = parseInt(pointsMessage.match(/\d+/)[0]);
//   //     console.log(`Awarded Points: ${awardedPoints}`);
//   //     setScore((prevScore) => prevScore + awardedPoints);
//   //   } else {
//   //     console.error("Failed to submit answer:", response);
//   //   }

//   //   setTimeout(() => {
//   //     handleNextQuestion(isAnswerCorrect);
//   //   }, 2000);
//   // };

//   // const handleNextQuestion = (answeredCorrectly) => {
//   //   setSelectedAnswer(null);
//   //   setTimer(10);

//   //   if (currentQuestionIndex < questions.length - 1) {
//   //     setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//   //   } else {
//   //     console.log("All questions answered. Final Score:", score);
//   //     handleUpdateLeaderboardScore(msisdn, score);

//   //     setTimeout(() => {
//   //       navigate("/result-page", {
//   //         state: {
//   //           score: score,
//   //           totalQuestions: questions.length,
//   //           statuses: [...statuses],
//   //         },
//   //       });
//   //     }, 2000);
//   //   }
//   // };


//    const handleNextQuestion = async () => {
//     // Check if the answer was selected, and if not, submit a blank answer
//     // if (!selectedAnswer) {
//     //   const questionId = questions[currentQuestionIndex].id;
//     //   await handleAnswerSubmit(msisdn, questionId, selectedAnswer); // Submit empty answer if no answer selected
//     // }
  
//     // Reset state for the next question
//     setSelectedAnswer(null);
//     setTimer(10);
  
//     // Move to the next question
//     if (currentQuestionIndex < questions.length - 1) {
    
//       setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//     } else {
//       // After all questions are answered, calculate final score
//       await finalizeGame();
//     }
//   };
  
//   // Function to finalize the game and navigate to results
//   const finalizeGame = async () => {
//     const finalScore = await new Promise((resolve) => {
//       setScore((prevScore) => {
//         resolve(prevScore); // Resolve with final score
//         return prevScore; // Return the final score
//       });
//     });
  
  
//     console.log("All questions answered. Final Score:", finalScore, statuses);
  
//     // Handle leaderboard update
//     await handleUpdateLeaderboardScore(msisdn, finalScore);
  
//     // Navigate to result page after updating the leaderboard
//     setTimeout(() => {
//       navigate("/result-page", {
//         state: {
//           score: finalScore,
//           totalQuestions: questions.length,
//           statuses: statuses,
//         },
//       });
//     }, 2000);
//   };



//   if (loading || !questions || questions.length === 0) {
//     return (
//       <div className="flex items-center justify-center mx-auto mt-[50px]">
//         <Circles color="black" height={50} width={50} />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center w-full min-h-screen bg-darrk-gradient text-white">
//       <div className="mt-[60px] mb-[30px]">
//         <div className="flex items-center justify-center bg-white w-[46px] h-[46px] border rounded-[50px]">
//           <img className="img-timer" src={Timer} alt="timer" />
//           <p className="text-black text-[18px] font-mtn-brighter-medium font-medium text-center">
//             {timer}
//           </p>
//         </div>
//       </div>

//       <div className="p-4 text-center">
//         <h2 className="text-[24px] text-white leading-[24px] font-bold font-mtn-brighter-bold text-center mb-[47px]">
//           {questions[currentQuestionIndex]?.text || "No question available."}
//         </h2>

//         {/* Pagination Dots */}
//         <div className="flex items-center justify-center mt-4 mb-[59px] gap-[25px] px-4">
//           {questions.map((_, index) => (
//             <div
//               key={index}
//               className={`w-3 h-3 rounded-full ${
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
//           {questions[currentQuestionIndex].answers.map((answer, index) => (
//             <button
//               key={index}
//               onClick={() => handleAnswerClick(answer)}
//               className={`py-2 px-4 text-black rounded-[50px] w-[90vw] h-[60px] ${
//                 selectedAnswer === answer
//                   ? answer === questions[currentQuestionIndex].rightAnswer
//                     ? "bg-[#82e180]"
//                     : "bg-[#e37e80]"
//                   : selectedAnswer &&
//                     answer === questions[currentQuestionIndex].rightAnswer
//                   ? "bg-[#82e180]"
//                   : "bg-white"
//               }`}
//               disabled={selectedAnswer !== null}
//             >
//               {answer}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default React.memo(BigCashTrivia);



import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Timer from "../assets/Icons/timer.svg";
import { LeaderboardContext } from "../Context/LeaderboardContext";
import { TriviaContext } from "../Context/TriviaContext";
import UserContext from "../Context/UserContext";
import { Circles } from "react-loader-spinner";

const BigCashTrivia = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [statuses, setStatuses] = useState([]);
  const [timer, setTimer] = useState(10);
  const navigate = useNavigate();

  const { msisdn } = useContext(UserContext);
  const { gameId } = useParams();
  const { handleUpdateLeaderboardScore } = useContext(LeaderboardContext);
  const { loading, fetchQuestions, questions, selectedGameId, handleAnswerSubmit } = useContext(TriviaContext);

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
    const timerId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleNextQuestion(false); 
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
    const response = await handleAnswerSubmit(msisdn, questionId, answer);
    console.log("Submit answer response:", response);

    const isAnswerCorrect = answer === questions[currentQuestionIndex]?.rightAnswer;
    
    setStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      newStatuses[currentQuestionIndex] = isAnswerCorrect ? "correct" : "incorrect";
      console.log("Updated statuses:", newStatuses);
      return newStatuses;
    });

    if (response && response.statusCode === "999") {
      const pointsMessage = response.message;
      const awardedPoints = parseInt(pointsMessage.match(/\d+/)[0]);
      console.log(`Awarded Points: ${awardedPoints}`);
      setScore((prevScore) => prevScore + awardedPoints);
    } else {
      console.error("Failed to submit answer:", response);
    }

    setTimeout(() => {
      handleNextQuestion(isAnswerCorrect);
    }, 2000);
  };

  const handleNextQuestion = (answeredCorrectly) => {
    setSelectedAnswer(null);
    setTimer(10); 

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      console.log("All questions answered. Final Score:", score);
      handleUpdateLeaderboardScore(msisdn, score);

      setTimeout(() => {
        navigate("/result-page", {
          state: {
            score: score,
            totalQuestions: questions.length,
            statuses: [...statuses],
          },
        });
      }, 2000);
    }
  };

  if (loading || !questions || questions.length === 0) {
    return (
      <div className="flex items-center justify-center mx-auto mt-[50px]">
        <Circles color="black" height={50} width={50} />
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
          {questions[currentQuestionIndex]?.text || "No question available."}
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

        <div className="flex flex-col gap-[21px]">
          {questions[currentQuestionIndex].answers.map((answer, index) => (
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

export default React.memo(BigCashTrivia);
