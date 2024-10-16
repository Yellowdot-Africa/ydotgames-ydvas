import axios from "axios";
import { toast } from 'react-toastify'; 


export const getLeaderboardStanding = async (auth, msisdn) => {
  // const { auth, setAuth } = useAuth();

  try {
    // const token = localStorage.getItem("authToken");
    const token = auth?.token;

    if (!token) {
      throw new Error("No auth token available");
    }

    const response = await axios.get(
      `https://ydvassdp.com:5001/api/YellowdotGames/GetLeaderboardStanding?msisdn=${msisdn}`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    // console.log("API Response:", response.data);

    return response.data;
  } catch (error) {
    // toast.error("Failed to fetch leaderboard standing. Please try again.");
   
    console.error("Error fetching leaderboard standing:", error);

    throw error;
  }
};

export const updateLeaderboardScore = async (auth, msisdn, gameScore) => {
  
  // const { auth, setAuth } = useAuth();

  try {
    // const token = localStorage.getItem("authToken");
    const token = auth?.token;
    // console.log("Auth Token Score:", token);

    if (!token) {
      throw new Error("No auth token available");
    }
    // console.log("Updating score for:", { msisdn, gameScore });
    // console.log("Sending msisdn:", msisdn);
    // console.log("Sending gameScore:", gameScore);
    // console.log("Authorization token:", token);
    
    const response = await axios.put(
      `https://ydvassdp.com:5001/api/YellowdotGames/UpdateLeaderboardScore`,
      {
        msisdn: msisdn,
        gameScore: gameScore,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    // console.log("Leaderboard scorenapi updated:", response.data);
    // console.log("API Response:", response.data);
    return response.data;

    
  } catch (error) {
    if (error.response) {
      console.error("Server error data:", error.response.data);
      console.error("Server error status:", error.response.status);
      console.error("Server error headers:", error.response.headers);
    }
    console.error("Error updating leaderboard score:", error);

    throw error;
  }
};


