import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./Context/AuthContext";
import { GameProvider } from "./Context/GameContext";
import App from "./App.jsx";
import "./index.css";
import { LeaderboardProvider } from "./Context/LeaderboardContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <GameProvider>
        <LeaderboardProvider>
          <App />
        </LeaderboardProvider>
      </GameProvider>
    </AuthProvider>
  </StrictMode>
);
