// import axios from "axios";
// import { toast } from 'react-toastify'; 


// export const getLeaderboardStanding = async (auth, msisdn) => {
//   // const { auth, setAuth } = useAuth();

//   try {
//     // const token = localStorage.getItem("authToken");
//     const token = auth?.token;

//     if (!token) {
//       throw new Error("No auth token available");
//     }

//     const response = await axios.get(
//       // `https://onlinetriviaapi.ydplatform.com:1990/api/YellowdotGames/GetLeaderboardStanding?msisdn=${msisdn}`,
//       `https://ydotgames.runasp.net/api/YellowdotGames/GetLeaderboardStanding?missdn=${msisdn}`,

//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`,
//         },
//       }
//     );
//     // console.log("API Response:", response.data);

//     return response.data;
//   } catch (error) {
//     // toast.error("Failed to fetch leaderboard standing. Please try again.");
//     console.error("Error fetching leaderboard standing:", error);

//     throw error;
//   }
// };


import axios from "axios";
import { toast } from 'react-toastify'; 

export const getLeaderboardStanding = async (auth, msisdn) => {
  try {
    const token = auth?.token;

    if (!token) {
      throw new Error("No auth token available");
    }

    const response = await axios.get(
      `https://ydotgames.runasp.net/api/YellowdotGames/GetLeaderboardStanding?msisdn=${msisdn}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );

    if (response.data.isSuccessful) {

      return response.data.data;
    } else {
      throw new Error(response.data.message); 
    }
  } catch (error) {
    console.error("Error fetching leaderboard standing:", error);
    throw error; 
  }
};


// export const updateLeaderboardScore = async (auth, msisdn, gameScore) => {
  
//   // const { auth, setAuth } = useAuth();

//   try {
//     // const token = localStorage.getItem("authToken");
//     const token = auth?.token;
//     // console.log("Auth Token Score:", token);

//     if (!token) {
//       throw new Error("No auth token available");
//     }
//     // console.log("Updating score for:", { msisdn, gameScore });
//     // console.log("Sending msisdn:", msisdn);
//     // console.log("Sending gameScore:", gameScore);
//     // console.log("Authorization token:", token);
    
//     const response = await axios.put(
//       // `https://onlinetriviaapi.ydplatform.com:1990/api/YellowdotGames/UpdateLeaderboardScore`,
//       `https://ydotgames.runasp.net/api/YellowdotGames/UpdateLeaderboardScore`,
//       {
//         msisdn: msisdn,
//         gameScore: gameScore,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`,
//         },
//       }
//     );
//     // console.log("Leaderboard scorenapi updated:", response.data);
//     // console.log("API Response:", response.data);
//     return response.data;

    
//   } catch (error) {
//     if (error.response) {
//       console.error("Server error data:", error.response.data);
//       console.error("Server error status:", error.response.status);
//       console.error("Server error headers:", error.response.headers);
//     }
//     console.error("Error updating leaderboard score:", error);

//     throw error;
//   }
// };




export const updateLeaderboardScore = async (auth, msisdn, gameScore) => {
  try {
    const token = auth?.token;

    if (!token) {
      throw new Error("No auth token available");
    }
    
    const response = await axios.post(
      `https://ydotgames.runasp.net/api/YellowdotGames/UpdateLeaderboardScore`,
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

    if (response.data.isSuccessful) {
      // toast.success(response.data.message);
      return response.data.data; 
    } else {
      throw new Error(response.data.message);
    }
    
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






