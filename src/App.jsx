import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SplashScreen from './Components/SplashScreen'
import HomePage from './Pages/HomePage';
import Leaderboard from './Pages/Leaderboard';
import ProfilePage from "./Pages/ProfilePage";
import PrizesPage from './Pages/Prizes';
import './App.css';



const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashScreen />,
  },
  {
    path: "/home",
    element: <HomePage/>,
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
]);

const App = ()=> {

  return (
    <>
      <RouterProvider router={router} />

    </>
  )
}

export default App






