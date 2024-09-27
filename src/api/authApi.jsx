import axios from "axios";

const authApi = async () => {
  try {
    const response = await axios.post(
      "https://ydvassdp.com:5001/api/YellowdotGames/Authorization/Login",
      {
        username: "games_sa_ydotgames",
        password: "password",
      }
    );


    const { jwtToken, tokenExpiry } = response.data;
    localStorage.setItem("authToken", jwtToken);
    localStorage.setItem("tokenExpiry", tokenExpiry);

    return response.data;
  } catch (error) {
    console.error("Authorization failed:", error);
    throw error;
  }
};

export default authApi;







