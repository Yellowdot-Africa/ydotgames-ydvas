import React, { createContext, useContext, useState, useEffect } from "react";
import leaderboardApi from "../api/leaderboardApi";
import AuthContext from "../Context/AuthContext";

const LeaderboardContext = createContext();

export const LeaderboardProvider = ({ children, msisdn }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await leaderboardApi(auth, msisdn);
      if (response.statusCode === "999" && response.data.length > 0) {
        const leaderboarddd = response.data;

        setLeaderboardData(leaderboarddd);
        console.log("Fetched 0 leaderboard");
      } else {
        setError("No leaderboard data available.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchLeaderboard();
    }
  }, [auth?.token, msisdn]);

  return (
    <LeaderboardContext.Provider
      value={{ leaderboardData, loading, error, fetchLeaderboard }}
    >
      {children}
    </LeaderboardContext.Provider>
  );
};
export const useLeaderboard = () => useContext(LeaderboardContext);
