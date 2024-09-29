import React, { useState } from "react";

const StarRatings = () => {
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false); 

  const handleMouseOver = (index) => {
    setRating(index);
  };

  const handleMouseLeave = () => {
    if (!hasRated) {
      setRating(0);
    }
  };

  const handleClick = (index) => {
    setRating(index);
    setHasRated(true); 
    localStorage.setItem("userRating", index);
    console.log(`Rating submitted (temporarily): ${index}`);
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onMouseOver={() => handleMouseOver(star)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(star)}
          style={{
            cursor: "pointer",
            color: star <= rating ? "gold" : "white",
            fontSize: "16px",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRatings;
