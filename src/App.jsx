import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SplashScreen from './Components/SplashScreen'
import HomePage from './Pages/HomePage';
import Leaderboard from './Pages/Leaderboard';
import ProfilePage from "./Pages/ProfilePage";
import PrizesPage from './Pages/Prizes';
import BigCashTrivia from './Pages/BigCashTrivia';
import ResultPage from './Pages/ResultPage';
import './App.css';
import FaqAccordion from './Pages/FaqAccordion';
import TermsAndConditions from './Pages/TermsAndConditions';
import SubscriptionPage from './Pages/SubscriptionPage';
import ErrorPage from './Pages/ErrorPage';
import TriviaGames from './Pages/TriviaGames';
import RedirectPage from "./Pages/RediectPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashScreen/>,
  },
  {
    path: "/Redirect",
    element: <RedirectPage/>,
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
    element: <ErrorPage/>,
  },
  {
    path: "/home",
    element: <HomePage/>,
  },
  {
    path: "/bigcash-trivia/:gameId",
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
    element: <TermsAndConditions/>,
  },
]);

const App = ()=> {

  return (
    <>
      <RouterProvider router={router} />

    </>
  )
}

export default App;















