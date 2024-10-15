import axios from "axios";
import { toast } from "react-toastify";

const authApi = async () => {
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

    localStorage.setItem("authToken", jwtToken);
    localStorage.setItem("tokenExpiry", expiryTime);
    localStorage.setItem("username", username);
    localStorage.setItem("bigCashTriviaId", bigCashTriviaId); 

    return response.data;
  } catch (error) {
    console.error("Authorization failed:", error);
    toast.error("Authorization faile", error);

    throw error;
  }
};

export default authApi;




// import axios from "axios";

// const authApi = async () => {
//   try {
//     const response = await axios.post(
//       "https://ydvassdp.com:5001/api/YellowdotGames/Authorization/Login",
//       {
//         username: "games_sa_ydotgames",
//         password: "password",
//       }
//     );

//     const { jwtToken, tokenExpiry, username, bigCashTriviaId } = response.data;
//     localStorage.setItem("authToken", jwtToken);
//     localStorage.setItem("tokenExpiry", tokenExpiry);
//     localStorage.setItem("username", username);
// localStorage.setItem("bigCashTriviaId", bigCashTriviaId);

//     return response.data;
//   } catch (error) {
//     console.error("Authorization failed:", error);
//     throw error;
//   }
// };

// export default authApi;





