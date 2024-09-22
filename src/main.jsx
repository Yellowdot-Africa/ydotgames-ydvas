import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./Context/AuthContext";
import { GameProvider } from "./Context/GameContext";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <GameProvider>
      <App />
      </GameProvider>
    </AuthProvider>
    
  </StrictMode>
);
