import axios from "axios";

export const getLeaderboardStanding = async (auth, msisdn) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token available");
    }

    const response = await axios.get(
      `https://ydvassdp.com:5001/api/YellowdotGames/GetLeaderboardStanding?msisdn=${msisdn}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching leaderboard standing:", error);
    throw error;
  }
};

export const updateLeaderboardScore = async (auth, msisdn, gameScore) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token available");
    }
    const response = await axios.put(
      `https://ydvassdp.com:5001/api/YellowdotGames/UpdateLeaderboardScore`,
      {
        MSISDN: msisdn,
        gameScore: gameScore,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating leaderboard score:", error);
    throw error;
  }
};
