import { createBrowserRouter } from 'react-router-dom';
import SplashScreen from './Components/SplashScreen';
import HomePage from './Pages/HomePage';
import Leaderboard from './Pages/Leaderboard';
import ProfilePage from "./Pages/ProfilePage";
import PrizesPage from './Pages/Prizes';
import BigCashTrivia from './Pages/BigCashTrivia';
import ResultPage from './Pages/ResultPage';
import FaqAccordion from './Pages/FaqAccordion';
import TermsAndConditions from './Pages/TermsAndConditions';
import SubscriptionPage from './Pages/SubscriptionPage';
import ErrorPage from './Pages/ErrorPage';
import TriviaGames from './Pages/TriviaGames';
import RedirectPage from "./Pages/RediectPage";
import ErrorBoundary from './Pages/ErrorBoundary';

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
  {
    path: "/error",
    element: <ErrorPage/>,
  },
  {
    path: "/home",
    element: <HomePage/>,
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
    element: <TermsAndConditions/>,
  },
]);

export default router;
