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






