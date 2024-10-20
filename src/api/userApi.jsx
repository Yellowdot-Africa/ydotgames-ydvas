import axios from "axios";

const BASE_URL = "http://69.197.174.10:8084/api/YellowdotGames";


export const createSubscriberProfile = async (auth, msisdn, nickname, avatarId) => {
  try{
    // const token = localStorage.getItem("authToken");
    const token = auth?.token;

    if (!token) {
      throw new Error("No auth token available");
    }

    const payload = {
      msisdn,
      nickname,
      avatarId,
    };

  // console.log("Auth Token:", token);
  //   console.log("MSISDN:", msisdn, nickname, avatarId);
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
    return response.data;
  } catch (error) {
    console.error("Error creating subscriber profile:", error);
    throw error;
  }
};

export const getSubscriberProfile = async (auth, msisdn) => {
  try {
    const token = auth?.token;
    // const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("No auth token available");
    }
    // console.log("Auth Token:", token);
    // console.log("MSISDN:", msisdn);
    const response = await axios.get(
      `${BASE_URL}/GetSubscriberProfile?msisdn=${msisdn}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching subscriber profile:", error);
    throw error;
  }
};

export const UpdateSubscriberProfile = async (
  auth,
  msisdn,
  nickname,
  avatarId
) => {
  // console.log('Updating profile with:', { msisdn, nickname, avatarId });

  try {
    // const token = localStorage.getItem("authToken");
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
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
