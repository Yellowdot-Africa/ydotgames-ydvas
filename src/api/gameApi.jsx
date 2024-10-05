import axios from "axios";



const gameApi = async (auth, count = 4) => {

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token available");
    }
    const response = await axios.get(
      `https://ydvassdp.com:5001/api/YellowdotGames/YdotGames/GetHomePageGames?count=${count}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Authorization failed:", error);
    throw error;
  }
};

export default gameApi;
