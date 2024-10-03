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
  const { userProfile, msisdn } = useContext(UserContext);
  // const msisdn = userProfile?.msisdn || null;

  useEffect(() => {
    // console.log("UserContext MSISDN:", msisdn);
  }, [msisdn]);

  const fetchLeaderboardStanding = async () => {
    try {
      setLoading(true);
      // if (!msisdn) {
      //   throw new Error("MSISDN is required");
      // }
      const response = await getLeaderboardStanding(auth, msisdn);
      setLeaderboard(response.data);
      // console.log("Fetched leaderboard:", response.data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching leaderboard standing:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleUpdateLeaderboardScore = async (msisdn, gameScore) => {
    if (!msisdn) throw new Error("MSISDN is required for updating the score");
    
    try {
      const response = await updateLeaderboardScore(auth, msisdn, gameScore);
      // console.log("Leaderboard score updated:", response);
      await fetchLeaderboardStanding(); 
    } catch (error) {
      console.error("Error updating leaderboard score:", error);
    }


  };



  const saveScoreToLocalStorage = (msisdn, score) => {
    const existingScores = JSON.parse(localStorage.getItem('leaderboard')) || [];
    
    const userIndex = existingScores.findIndex((item) => item.msisdn === msisdn);
    
    if (userIndex !== -1) {
      existingScores[userIndex].score = Math.max(existingScores[userIndex].score, score); // Keep the highest score
    } else {
      existingScores.push({ msisdn, score });
    }
    
    localStorage.setItem('leaderboard', JSON.stringify(existingScores));
  };

  const getScoresFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('leaderboard')) || [];
  };


  useEffect(() => {
    if (auth?.token) {
      fetchLeaderboardStanding();
      
      const storedScore = localStorage.getItem("gameScore");
      if (storedScore) {
        const gameScore = parseInt(storedScore, 10);
        if (!isNaN(gameScore)) {
          handleUpdateLeaderboardScore(gameScore);
          saveScoreToLocalStorage(msisdn, gameScore); 
          localStorage.removeItem("gameScore"); 
        } else {
          console.warn("Invalid score value found in local storage.");
        }
      }
      const scores = getScoresFromLocalStorage();
      setLeaderboard(prev => [...prev, ...scores]);

    }
  }, [auth?.token, msisdn]);



  return (
    <LeaderboardContext.Provider
      value={{
        leaderboard,
        loading,
        fetchLeaderboardStanding,
        handleUpdateLeaderboardScore,
        saveScoreToLocalStorage, 
        obscureMSISDN,
      }}
    >
      {children}
    </LeaderboardContext.Provider>
  );
};

export  { LeaderboardContext, LeaderboardProvider };

export const useLeaderboard = () => useContext(LeaderboardContext);




