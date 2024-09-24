import axios from "axios";

const leaderboardApi = async (auth, msisdn) => {
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
    throw new Error("Error fetching leaderboard data.");
  }
};

export default leaderboardApi;
