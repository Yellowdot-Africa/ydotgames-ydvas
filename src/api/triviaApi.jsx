import axios from "axios";

export const getTriviaGames = async () => {
  try {
    const authToken = localStorage.getItem("triviaAuthToken");

    if (!authToken) throw new Error("Authentication token is missing");

    const response = await axios.get(
      "https://ydvassdp.com:4001/api/Trivia/Games/GetGames?count=5",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
};

export const getTriviaQuestions = async (gameId) => {
  try {
    const authToken = localStorage.getItem("triviaAuthToken");

    if (!authToken) throw new Error("Authentication token is missing");

    const response = await axios.get(
      `https://ydvassdp.com:4001/api/Trivia/Questions/GetQuestions?count=5&gameId=${gameId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};




export const submitAnswer = async (msisdn, questionId, submittedAnswer) => {
    const payload = {
      msisdn,
      questionId,
      submittedAnswer,
    };
  
    try {

        const authToken = localStorage.getItem("triviaAuthToken");

    if (!authToken) throw new Error("Authentication token is missing");

      const response = await axios.post(
        "https://ydvassdp.com:4001/api/Trivia/Games/SubmitGamePlay",
        payload,
        {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
      );
      return response.data; 
    } catch (error) {
      console.error("Error submitting answer:", error);
      throw new Error('Error submitting answer'); 
    }
  };
  



