import { createContext, useState, useEffect, useContext } from 'react';
import { getTriviaGames,getTriviaQuestions, submitAnswer } from '../api/triviaApi'; 
import { TriviaAuthContext } from './TriviaAuthContext';

export const TriviaContext = createContext();

export const TriviaProvider = ({ children }) => {
  const { authToken } = useContext(TriviaAuthContext);
  const [games, setGames] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  const fetchGames = async () => {
    setLoading(true);
    try {
      const response = await getTriviaGames();
      setGames(response.data); 
    } catch (error) {
        setError("Error fetching trivia games");
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };


  const fetchQuestions = async (gameId) => {
    console.log(`Fetching questions for gameId: ${gameId}`);
    setLoading(true);

    try {

     
        const response = await getTriviaQuestions(gameId);
        console.log("Fetched Questions:", response.data);
        const structuredQuestions = response.data.map(question => ({
            id: question.id,
            text: question.text,
            rightAnswer: question.rightAnswer,
            answers: [question.rightAnswer, question.wrongAnswer] // Create answers array
        }));
        setQuestions(structuredQuestions); 


       
        
    } catch (error) {
        setError("Error fetching trivia questions");

      console.error('Error fetching questions:', error);
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
    }
  };

  useEffect(() => {
    fetchGames(); 
  }, []);

  useEffect(() => {
    if (selectedGameId) {
      fetchQuestions(selectedGameId);
    }
  }, [selectedGameId]);

  return (
    <TriviaContext.Provider
      value={{
        games,
        fetchGames,
        questions,
        selectedGameId,
        setSelectedGameId,
        fetchQuestions,
        handleAnswerSubmit,
        loading,
        error
      }}
    >
      {children}
    </TriviaContext.Provider>
  );
};




  


