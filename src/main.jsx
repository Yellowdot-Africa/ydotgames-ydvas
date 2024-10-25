import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./Context/AuthContext";
import { GameProvider } from "./Context/GameContext";
import { TriviaProvider } from "./Context/TriviaContext";
import { TriviaAuthProvider } from "./Context/TriviaAuthContext";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./Context/UserContext";
import { LeaderboardProvider } from "./Context/LeaderboardContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <GameProvider>
        <UserProvider>
          <LeaderboardProvider>
            <TriviaAuthProvider>
            <TriviaProvider>
            <App />
            </TriviaProvider>
            </TriviaAuthProvider>
          </LeaderboardProvider>
        </UserProvider>
      </GameProvider>
    </AuthProvider>
  </StrictMode>
);

// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { AuthProvider } from "./Context/AuthContext";
// import { GameProvider } from "./Context/GameContext";
// import { TriviaProvider } from "./Context/TriviaContext";
// import { TriviaAuthProvider } from "./Context/TriviaAuthContext";
// import { UserProvider } from "./Context/UserContext";
// import { LeaderboardProvider } from "./Context/LeaderboardContext";
// import App from "./App.jsx";
// import "./index.css";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import FaqAccordion from "./Pages/FaqAccordion";
// import TermsAndConditions from "./Pages/TermsAndConditions";
// import SubscriptionPage from "./Pages/SubscriptionPage";
// import ErrorPage from "./Pages/ErrorPage";
// import TriviaGames from "./Pages/TriviaGames";
// import RedirectPage from "./Pages/RediectPage";
// import SplashScreen from "./Components/SplashScreen";
// import HomePage from "./Pages/HomePage";
// import Leaderboard from "./Pages/Leaderboard";
// import ProfilePage from "./Pages/ProfilePage";
// import PrizesPage from "./Pages/Prizes";
// import BigCashTrivia from "./Pages/BigCashTrivia";
// import ResultPage from "./Pages/ResultPage";
// import ErrorBoundary from "./Pages/ErrorBoundary";

// // Define the routes here
// const router = createBrowserRouter([
//   { path: "/", element: <SplashScreen /> },
//   { path: "/Redirect", element: <RedirectPage /> },
//   { path: "/subscribe", element: <SubscriptionPage /> },
//   { path: "/error", element: <ErrorPage /> },
//   { path: "/home", element: <HomePage /> },
//   { path: "/bigcash-trivia/:categoryId", element: <BigCashTrivia /> },
//   { path: "/trivia-games", element: <TriviaGames /> },
//   { path: "/leaderboard", element: <Leaderboard /> },
//   { path: "/user-profile", element: <ProfilePage /> },
//   { path: "/prizes", element: <PrizesPage /> },
//   { path: "/result-page", element: <ResultPage /> },
//   { path: "/faq", element: <FaqAccordion /> },
//   { path: "/terms-and-conditions", element: <TermsAndConditions /> },
// ]);

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <ErrorBoundary>
//       <RouterProvider router={router}>
//         <AuthProvider>
//           <GameProvider>
//             <UserProvider>
//               <LeaderboardProvider>
//                 <TriviaAuthProvider>
//                   <TriviaProvider>
//                     <App />
//                   </TriviaProvider>
//                 </TriviaAuthProvider>
//               </LeaderboardProvider>
//             </UserProvider>
//           </GameProvider>
//         </AuthProvider>
//       </RouterProvider>
//     </ErrorBoundary>
//   </StrictMode>
// );

// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { RouterProvider } from "react-router-dom";
// import { AuthProvider } from "./Context/AuthContext";
// import { GameProvider } from "./Context/GameContext";
// import { TriviaProvider } from "./Context/TriviaContext";
// import { TriviaAuthProvider } from "./Context/TriviaAuthContext";
// import { UserProvider } from "./Context/UserContext";
// import { LeaderboardProvider } from "./Context/LeaderboardContext";
// import App from "./App.jsx";
// import router from "./router";
// import "./index.css";
// import ErrorBoundary from "./Pages/ErrorBoundary";


// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     {/* <ErrorBoundary> */}
//       <RouterProvider router={router}>
//         <AuthProvider>
//           <GameProvider>
//           <LeaderboardProvider>

//             <UserProvider>
//                 <TriviaAuthProvider>
//                   <TriviaProvider>
//                     <App />
//                   </TriviaProvider>
//                 </TriviaAuthProvider>
//             </UserProvider>
//             </LeaderboardProvider>

//           </GameProvider>
//         </AuthProvider>
//       </RouterProvider>
//     {/* </ErrorBoundary> */}
//   </StrictMode>
// );
