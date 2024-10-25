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
    errorElement: <ErrorPage />, 
  },
  {
    path: "/Redirect",
    element: <RedirectPage />,
    errorElement: <ErrorPage />, 
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
    errorElement: <ErrorPage />, 
  },
  {
    path: "/bigcash-trivia/:categoryId",
    element: <BigCashTrivia />,
    errorElement: <ErrorPage />, 
  },
  {
    path: "/trivia-games",
    element: <TriviaGames />,
    errorElement: <ErrorPage />, 
  },
  {
    path: "/leaderboard",
    element: <Leaderboard />,
    errorElement: <ErrorPage />, 
  },
  {
    path: "/user-profile",
    element: <ProfilePage />,
    errorElement: <ErrorPage />, 
  },
  {
    path: "/prizes",
    element: <PrizesPage />,
  },
  {
    path: "/result-page",
    element: <ResultPage />,
    errorElement: <ErrorPage />, 
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
