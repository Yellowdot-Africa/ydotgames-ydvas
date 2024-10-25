import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SplashScreen from "./Components/SplashScreen";
import HomePage from "./Pages/HomePage";
import Leaderboard from "./Pages/Leaderboard";
import ProfilePage from "./Pages/ProfilePage";
import PrizesPage from "./Pages/Prizes";
import BigCashTrivia from "./Pages/BigCashTrivia";
import ResultPage from "./Pages/ResultPage";
import "./App.css";
import FaqAccordion from "./Pages/FaqAccordion";
import TermsAndConditions from "./Pages/TermsAndConditions";
import SubscriptionPage from "./Pages/SubscriptionPage";
import ErrorPage from "./Pages/ErrorPage";
import TriviaGames from "./Pages/TriviaGames";
import RedirectPage from "./Pages/RediectPage";
import ErrorBoundary from "./Pages/ErrorBoundary";

const router = createBrowserRouter([

 
  {
    path: "/",
    element: <SplashScreen />,
  },
  {
    path: "/Redirect",
    element: <RedirectPage />,
  },
  {
    path: "/subscribe",
    element: <SubscriptionPage />,
  },
  // {
  //   path: "/splash-screen",
  //   element: <SplashScreen />,
  // },
  {
    path: "/error",
    element: <ErrorPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/bigcash-trivia/:categoryId",
    element: <BigCashTrivia />,
  },
  {
    path: "/trivia-games",
    element: <TriviaGames />,
  },
  {
    path: "/leaderboard",
    element: <Leaderboard />,
  },
  {
    path: "/user-profile",
    element: <ProfilePage />,
  },
  {
    path: "/prizes",
    element: <PrizesPage />,
  },
  {
    path: "/result-page",
    element: <ResultPage />,
  },
  {
    path: "/faq",
    element: <FaqAccordion />,
  },
  {
    path: "/terms-and-conditions",
    element: <TermsAndConditions />,
  },
]);

const App = () => {
  return (
    <>
      <ToastContainer />
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </>
  );
};

export default App;

// const handleAnswerClick = async (answer) => {
//   if (selectedAnswer) return;

//   setSelectedAnswer(answer);
//   const questionId = questions[currentQuestionIndex].id;
//   const response = await handleAnswerSubmit(msisdn, questionId, answer);

//   const isAnswerCorrect =
//     answer === questions[currentQuestionIndex].rightAnswer;

//   setStatuses((prevStatuses) => {
//     const newStatuses = [...prevStatuses];
//     newStatuses[currentQuestionIndex] = isAnswerCorrect
//       ? "correct"
//       : "incorrect";
//     return newStatuses;
//   });

//   setScore((prevScore) => {
//     let awardedPoints = 0;
//     if (response && response.statusCode === "999") {
//       const pointsMessage = response.message;
//       awardedPoints = parseInt(pointsMessage.match(/\d+/)[0]);
//     }
//     return prevScore + awardedPoints;
//   });

//   // Ensure everything updates before moving to the next question
//   await new Promise((resolve) => setTimeout(resolve, 2000));
//   handleNextQuestion();
// };
