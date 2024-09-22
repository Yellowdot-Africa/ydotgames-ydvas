import React, { createContext, useState, useEffect, useContext } from "react";
import gameApi from "../api/gameApi";
import AuthContext from "../Context/AuthContext";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useContext(AuthContext);

  const fetchGames = async () => {
    try {
      const response = await gameApi(auth, 4);
      if (response?.statusCode === "999") {
        const gamesData = response.data;
        setGames(gamesData);
        console.log(`Fetched ${gamesData.length} games`);
      } else {
        console.error("Error in response:", response.statusMessage);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchGames();
    }
  }, [auth?.token]);

  return (
    <GameContext.Provider value={{ games, loading }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
