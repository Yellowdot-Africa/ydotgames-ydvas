import React, { useContext, useEffect } from 'react';
import { TriviaContext } from '../Context/TriviaContext';
import { useNavigate } from 'react-router-dom';

const TriviaGames = () => {
  const { games, fetchGames, selectedGameId, setSelectedGameId } = useContext(TriviaContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames(); 
  }, []);

  const handleCategoryClick = (gameId) => {
    setSelectedGameId(gameId);
    navigate(`/bigcash-trivia/${gameId}`);
  };

  return (
    <>
    <div className="flex flex-col items-center  min-h-screen bg-[#EFF3F5] p-4 pt-[100px]">
      <h1 className="text-[30px] leading-[36px] font-mtn-brighter-bold font-bold text-center text-gray-800 mb-6">
        Choose a Trivia Category
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => handleCategoryClick(game.id)}
            className="cursor-pointer bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 p-4 text-center"
          >
            <h2 className="text-[20px] leading-[28px] font-mtn-brighter-medium font-medium text-gray-700">{game.name}</h2>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default TriviaGames;







const handleNextQuestion = () => {
    // Reset state for the next question
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimer(10); // Reset timer for next question

    if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
        // When all questions are answered, we should navigate to the results
        console.log("All questions answered. Navigating to results.");
        handleUpdateLeaderboardScore(score);
        navigate("/result-page", {
            state: { score, totalQuestions: questions.length, statuses },
        });
    }
};

// Modify the handleAnswerClick function to handle scoring and question submission
const handleAnswerClick = async (answer) => {
    if (selectedAnswer) return; // Prevent multiple clicks

    setSelectedAnswer(answer);
    const questionId = questions[currentQuestionIndex].id;
    const msisdn = "27837441852"; // Sample phone number

    const response = await handleAnswerSubmit(msisdn, questionId, answer); // Ensure this is awaited
    console.log("Submit answer response:", response); // Log the response

    if (response && response.statusCode === "999") {
        console.log("Answer submitted successfully. Updating score...");
        const isAnswerCorrect = answer === questions[currentQuestionIndex]?.correctAnswer;
        setIsCorrect(isAnswerCorrect);
        setStatuses((prev) => {
            const newStatuses = [...prev];
            newStatuses[currentQuestionIndex] = isAnswerCorrect ? "correct" : "incorrect";
            return newStatuses;
        });

        if (isAnswerCorrect) {
            setScore((prevScore) => prevScore + 1);
        }

        // Delay to allow user to see feedback
        setTimeout(() => {
            handleNextQuestion();
        }, 2000);
    } else {
        console.error("Failed to submit answer:", response);
    }
};
