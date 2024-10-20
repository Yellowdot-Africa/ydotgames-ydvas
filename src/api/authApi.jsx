import axios from "axios";
// import { toast } from "react-toastify";


let globalTokenData = null;


const authApi = async () => {

  if (globalTokenData && globalTokenData.expiryTime > new Date().getTime()) {
    // If the token is still valid, return the global token
    return globalTokenData;
  }

  try {
    const response = await axios.post(
      "https://ydvassdp.com:5001/api/YellowdotGames/Authorization/Login",
      {
        username: "games_sa_ydotgames",
        password: "password",
      }
    );

    const { jwtToken, tokenExpiry, username,bigCashTriviaId } = response.data;
    const expiryTime = new Date().getTime() + tokenExpiry * 1000;

   
    // return response.data;
   globalTokenData = {
      token: jwtToken,
      expiryTime,
      username,
      bigCashTriviaId,
    };

    return globalTokenData;

  } catch (error) {
    console.error("Authorization failed:", error);
    // toast.error("Authorization failed", error);

    throw error;
  }
};

export default authApi;










