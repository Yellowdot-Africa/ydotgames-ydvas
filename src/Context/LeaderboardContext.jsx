import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getLeaderboardStanding,
  updateLeaderboardScore,
} from "../api/leaderboardApi";
import AuthContext from "../Context/AuthContext";
import UserContext from "../Context/UserContext";

const obscureMSISDN = (msisdn) => {
  if (!msisdn || msisdn.length < 5) return msisdn;
  const obscuredPart = "*".repeat(5);
  const visiblePart = msisdn.slice(5);
  return `${obscuredPart}${visiblePart}`;
};

const LeaderboardContext = createContext();

const LeaderboardProvider = ({ children }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);
  const { userProfile } = useContext(UserContext);

  const msisdn = userProfile?.msisdn || null;

  useEffect(() => {
    console.log("UserContext MSISDN:", msisdn);
  }, [msisdn]);

  const fetchLeaderboardStanding = async () => {
    try {
      setLoading(true);
      if (!msisdn) {
        throw new Error("MSISDN is required");
      }
      const response = await getLeaderboardStanding(auth, msisdn);
      setLeaderboard(response.data);
      console.log("Fetched leaderboard:", response.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching leaderboard standing:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleUpdateLeaderboardScore = async (gameScore) => {
    if (!msisdn) throw new Error("MSISDN is required for updating the score");
    
    try {
      const response = await updateLeaderboardScore(auth, msisdn, gameScore);
      console.log("Leaderboard score updated:", response);
      await fetchLeaderboardStanding(); 
    } catch (error) {
      console.error("Error updating leaderboard score:", error);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchLeaderboardStanding();
      
      const storedScore = localStorage.getItem("gameScore");
      if (storedScore) {
        const gameScore = parseInt(storedScore, 10);
        if (!isNaN(gameScore)) {
          handleUpdateLeaderboardScore(gameScore);
          localStorage.removeItem("gameScore"); 
        } else {
          console.warn("Invalid score value found in local storage.");
        }
      }
    }
  }, [auth?.token, msisdn]);



  return (
    <LeaderboardContext.Provider
      value={{
        leaderboard,
        loading,
        fetchLeaderboardStanding,
        handleUpdateLeaderboardScore,
        obscureMSISDN,
      }}
    >
      {children}
    </LeaderboardContext.Provider>
  );
};

export { LeaderboardContext, LeaderboardProvider };

export const useLeaderboard = () => useContext(LeaderboardContext);




