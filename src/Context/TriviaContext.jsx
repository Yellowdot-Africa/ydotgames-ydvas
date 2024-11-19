// import { createContext, useState, useEffect, useContext } from "react";
// import {
//   getTriviaGames,
//   getTriviaQuestions,
//   submitAnswer,
// } from "../api/triviaApi";
// import { TriviaAuthContext } from "./TriviaAuthContext";

// export const TriviaContext = createContext();

// export const TriviaProvider = ({ children }) => {
//   const { authToken } = useContext(TriviaAuthContext);
//   const [games, setGames] = useState([]);
//   const [questions, setQuestions] = useState([]);
//   const [selectedGameId, setSelectedGameId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchGames = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await getTriviaGames(10);
//       // const sortedGames = response.data.sort((a, b) => a.name.localeCompare(b.name));
//       // console.log("API Response:", response);

//       const sortedGames = Array.isArray(response.data)
//         ? response.data.sort((a, b) => a.name.localeCompare(b.name))
//         : [];

//       setGames(sortedGames);
//     } catch (error) {
//       setError("Error fetching trivia games");
//       console.error("Error fetching games:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchQuestions = async (gameId) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await getTriviaQuestions(gameId);

//       if (!Array.isArray(response.data)) {
//         setError("No questions available");
//         setQuestions([]);
//         return;
//       }

//       // if (Array.isArray(response.data)) {

//       const structuredQuestions = response.data.map((question) => ({
//         id: question.id,
//         text: question.text,
//         rightAnswer: question.rightAnswer,
//         answers: [question.rightAnswer, question.wrongAnswer],
//       }));

//       structuredQuestions.forEach((q) => {
//         q.answers.sort(() => Math.random() - 0.5);
//       });

//       setQuestions(structuredQuestions);
//       // }
//     } catch (error) {
//       setError(`Error fetching trivia questions: ${error.message}`);
//       setQuestions([]);
//       console.error("Error fetching questions:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAnswerSubmit = async (msisdn, questionId, submittedAnswer) => {
//     try {
//       const data = await submitAnswer(msisdn, questionId, submittedAnswer);
//       return data;
//     } catch (err) {
//       setError(err.message);
//       return null;
//     }
//   };

//   useEffect(() => {
//     fetchGames();
//   }, []);

//   useEffect(() => {
//     if (selectedGameId) {
//       fetchQuestions(selectedGameId);
//     } else {
//       setQuestions([]);
//     }
//   }, [selectedGameId]);

//   return (
//     <TriviaContext.Provider
//       value={{
//         games,
//         fetchGames,
//         questions,
//         selectedGameId,
//         setSelectedGameId,
//         fetchQuestions,
//         handleAnswerSubmit,
//         loading,
//         error,
//       }}
//     >
//       {children}
//     </TriviaContext.Provider>
//   );
// };







import React, { createContext, useState, useEffect } from 'react';
import { getTriviaGame, getTriviaQuestions,submitAnswer } from '../api/triviaApi';

export const TriviaContext = createContext();

export const TriviaProvider = ({ children }) => {
  const [triviaGame, setTriviaGame] = useState(null);
    const [selectedGameId, setSelectedGameId] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTriviaGame = async (gameId) => {
    try {
      setLoading(true);
      const gameData = await getTriviaGame(gameId);
      setTriviaGame(gameData.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load trivia game');
      setLoading(false);
    }
  };


  const fetchQuestions = async (gameCategoryId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTriviaQuestions(gameCategoryId);

      if (!Array.isArray(response.data)) {
        setError("No questions available");
        setQuestions([]);
        return;
      }

      // if (Array.isArray(response.data)) {

      const structuredQuestions = response.data.map((question) => ({
        id: question.id,
        text: question.text,
        rightAnswer: question.rightAnswer,
        answers: [question.rightAnswer, question.wrongAnswer],
      }));

      structuredQuestions.forEach((q) => {
        q.answers.sort(() => Math.random() - 0.5);
      });

      setQuestions(structuredQuestions);
      // }
    } catch (error) {
      setError(`Error fetching trivia questions: ${error.message}`);
      setQuestions([]);
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (msisdn, questionId, submittedAnswer) => {
    try {
      const data = await submitAnswer(msisdn, questionId, submittedAnswer);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    fetchTriviaGame(12);
  }, []);

  useEffect(() => {
    if (selectedGameId) {
      fetchQuestions(selectedGameId);
    } else {
      setQuestions([]);
    }
  }, [selectedGameId]);


  return (
    <TriviaContext.Provider value={{ triviaGame, fetchTriviaGame,questions,selectedGameId, setSelectedGameId, handleAnswerSubmit,fetchQuestions , loading, error }}>
      {children}
    </TriviaContext.Provider>
  );
};






// export const getTriviaGame = async (gameId) => {
//   const TRIVIA_API_URL = "https://ydotbigcashtrivia.runasp.net/api/Trivia/Games/GetGame/";
//   const authToken = localStorage.getItem("triviaAuthToken");

//   if (!authToken) {
//     console.error("Auth token is missing!");
//     throw new Error("Authentication token is missing");
//   }

//   try {
//     console.log("Fetching game with gameId:", gameId);
//     console.log("Auth Token:", authToken);

//     const response = await axios.get(`${TRIVIA_API_URL}${gameId}`, {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//     });
//     console.log("Trivia game data:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching trivia game:", error.response?.data || error.message);
//     throw error;
//   }
// };





