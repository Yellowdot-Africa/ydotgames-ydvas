import React, { createContext, useContext, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getLeaderboardStanding,
  updateLeaderboardScore,
} from "../api/leaderboardApi";
import AuthContext from "../Context/AuthContext";
// import useUserApi from "../api/userApi";
// import { useAuth } from '../Context/AuthContext';

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

  // const { auth, setAuth } = useAuth();

  const { userProfile, msisdn } = useContext(UserContext);
  // const msisdn = userProfile?.msisdn || null;
  const [gameScore, setGameScore] = useState(0);

  // useEffect(() => {
  //   // console.log("UserContext MSISDN:", msisdn);
  // }, [msisdn]);

  useEffect(() => {
    if (msisdn) {
      // console.log("Updated MSISDN:", msisdn);

      handleUpdateLeaderboardScore(msisdn, gameScore);
    }
  }, [msisdn, gameScore]);

  const fetchLeaderboardStanding = async () => {
    if (!auth?.token) {
      console.error("No auth token available");

      return;
    }

    try {
      setLoading(true);
      // if (!msisdn) {
      //   throw new Error("MSISDN is required");
      // }
      const response = await getLeaderboardStanding(auth, msisdn);
      setLeaderboard(response.data);

      // toast.success("Leaderboard fetched successfully!");
      setError(null);
      // console.log("Fetched leaderboard:", response.data);
    } catch (error) {
      const errorMessage =
        "An error occurred while fetching the leaderboard. Please try again later.";
      // toast.error(errorMessage);
      setError(error.message || "Failed to fetch leaderboard.");
      console.error("Error fetching leaderboard standing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLeaderboardScore = async (msisdn, gameScore) => {
    // console.log('msisdn in handleUpdateLeaderboardScore:', msisdn);
    if (!auth?.token) {
      console.error("No auth token available");
      return;
    }

    if (!msisdn) throw new Error("MSISDN is required for updating the score");
    // console.log(
    //   "Updating leaderboard score for",
    //   msisdn,
    //   "with score:",
    //   gameScore
    // );

    try {
      const response = await updateLeaderboardScore(auth, msisdn, gameScore);
      // console.log("Leaderboard score updated:", response);
      await fetchLeaderboardStanding();
    } catch (error) {
      console.error("Error updating leaderboard score:", error);
    }
  };

  const saveScoreToLocalStorage = (msisdn, score) => {
    const existingScores =
      JSON.parse(localStorage.getItem("leaderboard")) || [];

    const userIndex = existingScores.findIndex(
      (item) => item.msisdn === msisdn
    );

    if (userIndex !== -1) {
      existingScores[userIndex].score = Math.max(
        existingScores[userIndex].score,
        score
      );
    } else {
      existingScores.push({ msisdn, score });
    }

    localStorage.setItem("leaderboard", JSON.stringify(existingScores));
  };

  const getScoresFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("leaderboard")) || [];
  };

  useEffect(() => {
    if (auth?.token) {
      fetchLeaderboardStanding();

      const storedScore = localStorage.getItem("gameScore");
      if (storedScore) {
        const gameScore = parseInt(storedScore, 10);
        if (!isNaN(gameScore)) {
          handleUpdateLeaderboardScore(msisdn, gameScore);
          saveScoreToLocalStorage(msisdn, gameScore);
          localStorage.removeItem("gameScore");
        } else {
          console.warn("Invalid score value found in local storage.");
        }
      }
      const scores = getScoresFromLocalStorage();
      setLeaderboard((prev) => [...prev, ...scores]);
    }
  }, [auth?.token, msisdn]);

  return (
    <LeaderboardContext.Provider
      value={{
        leaderboard,
        loading,
        error,
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

export { LeaderboardContext, LeaderboardProvider };

export const useLeaderboard = () => useContext(LeaderboardContext);
