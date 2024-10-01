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
    console.log("Auth Token Score:", token);

    if (!token) {
      throw new Error("No auth token available");
    }
    console.log("Updating score for:", { msisdn, gameScore });

    const response = await axios.put(
      `https://ydvassdp.com:5001/api/YellowdotGames/UpdateLeaderboardScore`,
      {
        msisdn: msisdn,
        gameScore: gameScore,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Leaderboard score updated:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error updating leaderboard score:", error);
    throw error;
  }
};


