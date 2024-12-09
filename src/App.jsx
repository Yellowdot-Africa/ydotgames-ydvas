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
import { SubscriptionProvider } from "./Context/SubscriptionContext";
import SubscriptionGuard from "./Components/SubscriptionGuard";
import SubscriptionExpiredPage from "./Pages/SubscriptionExpiredPage";

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
    element: (
      <SubscriptionGuard>
        <HomePage />
      </SubscriptionGuard>
    ),
  },
  {
    path: "/bigcash-trivia/:categoryId",
    element: (
      <SubscriptionGuard>
        <BigCashTrivia />
      </SubscriptionGuard>
    ),
  },
  {
    path: "/trivia-games",
    element: (
      <SubscriptionGuard>
        <TriviaGames />
      </SubscriptionGuard>
    ),
  },
  {
    path: "/leaderboard",
    element: (
      <SubscriptionGuard>
        <Leaderboard />
      </SubscriptionGuard>
    ),
  },
  {
    path: "/user-profile",
    element: (
      <SubscriptionGuard>
        <ProfilePage />
      </SubscriptionGuard>
    ),
  },
  {
    path: "/prizes",
    element: (
      <SubscriptionGuard>
        <PrizesPage />
      </SubscriptionGuard>
    ),
  },
  {
    path: "/result-page",
    element: (
      <SubscriptionGuard>
        <ResultPage />
      </SubscriptionGuard>
    ),
  },
  {
    path: "/faq",
    element: <FaqAccordion />,
  },
  {
    path: "/terms-and-conditions",
    element: <TermsAndConditions />,
  },
  {
    path: "/subscription-expired",
    element: <SubscriptionExpiredPage />,
  },
]);

const App = () => {
  return (
    <>
      <ToastContainer />
      <ErrorBoundary>
        <SubscriptionProvider>
          <RouterProvider router={router} />
        </SubscriptionProvider>
      </ErrorBoundary>
    </>
  );
};

export default App;
