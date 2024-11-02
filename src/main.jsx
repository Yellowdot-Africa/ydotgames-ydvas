import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./Context/AuthContext";
// import { GameProvider } from "./Context/GameContext";
import { TriviaProvider } from "./Context/TriviaContext";
import { TriviaAuthProvider } from "./Context/TriviaAuthContext";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./Context/UserContext"; 
import { LeaderboardProvider } from "./Context/LeaderboardContext"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      {/* <GameProvider> */}
        <UserProvider>
          <LeaderboardProvider>
            <TriviaAuthProvider>
            <TriviaProvider>
            <App />
            </TriviaProvider>
            </TriviaAuthProvider>
          </LeaderboardProvider>
        </UserProvider>
      {/* </GameProvider> */}
    </AuthProvider>
  </StrictMode>
);



