import axios from "axios";

// const BASE_URL = "https://onlinetriviaapi.ydplatform.com:1990/api/YellowdotGames";

const BASE_URL = "https://ydotgames.runasp.net/api/YellowdotGames";

// export const createSubscriberProfile = async (auth, msisdn, nickname, avatarId) => {
//   try{
//     // const token = localStorage.getItem("authToken");
//     const token = auth?.token;

//     if (!token) {
//       throw new Error("No auth token available");
//     }

//     const payload = {
//       msisdn,
//       nickname,
//       avatarId,
//     };

//   // console.log("Auth Token:", token);
//   //   console.log("MSISDN:", msisdn, nickname, avatarId);
//     const response = await axios.post(
//       `${BASE_URL}/CreateSubscriberProfile`,
//       payload,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error creating subscriber profile:", error);
//     throw error;
//   }
// };



export const createSubscriberProfile = async (auth, msisdn, nickname, avatarId) => {
  try {
    const token = auth?.token;

    if (!token) {
      throw new Error("No auth token available");
    }

    const payload = {
      msisdn,
      nickname,
      avatarId,
    };
    console.log("Sending create profile request with:", payload);

    const response = await axios.post(
      `${BASE_URL}/CreateSubscriberProfile`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );

    console.log("Create profile response:", response.data);


    if (response.data.isSuccessful) {


      return response.data; 
    } else {
      throw new Error(response.data.message); 
    }
  } catch (error) {
    console.error("Error creating subscriber profile:", error);
    console.log("showing Error  creating subscriber profile:", error);

    if (error.response) {
     
      console.error("Server error data:", error.response.data);
      console.error("Server error status:", error.response.status);
      console.error("Server error headers:", error.response.headers);
    }
    console.error("Error creating subscriber profile:", error);
    throw error; 
  }
};


// export const getSubscriberProfile = async (auth, msisdn) => {
//   try {
//     const token = auth?.token;
//     // const token = localStorage.getItem("authToken");

//     if (!token) {
//       throw new Error("No auth token available");
//     }
//     // console.log("Auth Token:", token);
//     // console.log("MSISDN:", msisdn);
//     const response = await axios.get(
//       `${BASE_URL}/GetSubscriberProfile?msisdn=${msisdn}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching subscriber profile:", error);
//     throw error;
//   }
// };

export const getSubscriberProfile = async (auth, msisdn) => {
  try {
    const token = auth?.token;

    if (!token) {
      throw new Error("No auth token available");
    }

    const response = await axios.get(
      `${BASE_URL}/GetSubscriberProfile?msisdn=${msisdn}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );

    if (response.data.isSuccessful) {
      // console.log("is Succesful response:", response.data); 
      return response.data; 
    } else {
      throw new Error(response.data.message); 
    }

  } catch (error) {
    if (error.response) {
      console.error("Server error data:", error.response.data);
      console.error("Server error status:", error.response.status);
      console.error("Server error headers:", error.response.headers);
    }
    console.error("Error fetching subscriber profile:", error);

    throw error; 
  }
};


// export const UpdateSubscriberProfile = async (
//   auth,
//   msisdn,
//   nickname,
//   avatarId
// ) => {
//   // console.log('Updating profile with:', { msisdn, nickname, avatarId });

//   try {
//     // const token = localStorage.getItem("authToken");
//     const token = auth?.token;
//     if (!token) {
//       throw new Error("No auth token available");
//     }
//     const payload = {
//       msisdn,
//       nickname,
//       avatarId,
//     };
//     const response = await axios.put(
//       `${BASE_URL}/UpdateSubscriberProfile`,
//       payload,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${auth.token}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error updating user profile:", error);
//     throw error;
//   }
// };




export const UpdateSubscriberProfile = async (
  auth,
  msisdn,
  nickname,
  avatarId
) => {
  try {
    const token = auth?.token;

    if (!token) {
      throw new Error("No auth token available");
    }

    const payload = {
      msisdn,
      nickname,
      avatarId,
    };

    const response = await axios.put(
      `${BASE_URL}/UpdateSubscriberProfile`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );

    if (response.data.isSuccessful) {
      return response.data; 
    } else {
      throw new Error(response.data.message); 
    }
    
  } catch (error) {
    if (error.response) {
      console.error("Server error data:", error.response.data);
      console.error("Server error status:", error.response.status);
      console.error("Server error headers:", error.response.headers);
    }
    console.error("Error updating user profile:", error);
        
    throw error; 
  }
};
























