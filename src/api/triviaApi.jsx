// import axios from "axios";

// export const getTriviaGames = async (count) => {
//   try {
//     const authToken = localStorage.getItem("triviaAuthToken");

//     if (!authToken) throw new Error("Authentication token is missing");

//     const response = await axios.get(
//       `https://ydvassdp.com:4001/api/Trivia/Games/GetGames?count=${count}`,
//       {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching games:", error);
//     // throw error;
//     return [];
//   }
// };

// export const getTriviaQuestions = async (gameId) => {
//   try {
//     const authToken = localStorage.getItem("triviaAuthToken");

//     if (!authToken) throw new Error("Authentication token is missing");

//     const response = await axios.get(
//       `https://ydvassdp.com:4001/api/Trivia/Questions/GetQuestions?count=5&gameId=${gameId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching questions:", error);
//     return [];
//   }
// };

// export const submitAnswer = async (msisdn, questionId, submittedAnswer) => {
//     const payload = {
//       msisdn,
//       questionId,
//       submittedAnswer,
//     };

//     try {

//         const authToken = localStorage.getItem("triviaAuthToken");

//     if (!authToken) throw new Error("Authentication token is missing");

//       const response = await axios.post(
//         "https://ydvassdp.com:4001/api/Trivia/Games/SubmitGamePlay",
//         payload,
//         {
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//             },
//           }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error submitting answer:", error);
//       throw new Error(`Error submitting answer: ${error.message}`);

//     }
//   };



import axios from "axios";
import { v4 as uuidv4 } from 'uuid';


const TRIVIA_API_URL =
  // "https://ydvassdp.com:4001/api/Trivia/Games/GetGame?gameId=";
  "https://ydotbigcashtrivia.runasp.net/api/Trivia/Games/GetGame/";

export const getTriviaGame = async (gameId) => {
  try {
    const authToken = localStorage.getItem("triviaAuthToken");

    if (!authToken) {
      console.error("Auth token is missing!");
      throw new Error("Authentication token is missing");
    }
   
    const response = await axios.get(`${TRIVIA_API_URL}${gameId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching trivia game:", error);
    throw error;
  }
};

export const getTriviaQuestions = async (gameCategoryId) => {
  try {
    const authToken = localStorage.getItem("triviaAuthToken");

    if (!authToken) throw new Error("Authentication token is missing");

    const response = await axios.get(
      // `https://ydvassdp.com:4001/api/Trivia/Questions/GetQuestions?count=10&gameCategoryId=${gameCategoryId}`,
      `https://ydotbigcashtrivia.runasp.net/api/Trivia/Questions/GetQuestions?count=10&gameCategoryId=${gameCategoryId}`,
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
  const transactionId = uuidv4();
  const payload = {
    msisdn,
    questionId,
    submittedAnswer,
    transactionId,
  };

  try {
    const authToken = localStorage.getItem("triviaAuthToken");

    if (!authToken) throw new Error("Authentication token is missing");

    const response = await axios.post(
      // "https://ydvassdp.com:4001/api/Trivia/Games/SubmitGamePlay",
      "https://ydotbigcashtrivia.runasp.net/api/Trivia/Games/SubmitGamePlay",
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
    throw new Error(`Error submitting answer: ${error.message}`);
  }
};












