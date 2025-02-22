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
      // "https://onlinetriviaapi.ydplatform.com:1990/api/YellowdotGames/Authorization/Login",
         "https://ydotgames.runasp.net/api/YellowdotGames/Authorization/Login",


      {
        username: "games_mtn_sa_ydotgames",
        password: "password",
      }
    );

    const { jwtToken, tokenExpiry, username,bigCashTriviaId } = response.data.data;
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











