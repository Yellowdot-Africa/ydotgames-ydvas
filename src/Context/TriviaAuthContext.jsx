import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const TriviaAuthContext = createContext();

export const TriviaAuthProvider = ({ children }) => {
//   const [authToken, setAuthToken] = useState(null);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("triviaAuthToken") || null); 

  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);


 

  const loginTriviaAPI = async () => {


    const tokenExpiry = localStorage.getItem("triviaTokenExpiry");
    if (tokenExpiry && Date.now() < tokenExpiry * 1000) {
      setAuthLoading(false);
      return;
    }

   
    try {
      const response = await axios.post(
      
        "https://ydotbigcashtrivia.runasp.net/api/Trivia/Authorization/Login",
        {
          username: "games_ng_bigCash",
          password: "password",
        }
      );


      const { jwtToken, tokenExpiry } = response.data.data;

      if (!jwtToken || !tokenExpiry) {
        throw new Error("Invalid response from login API");
      }

      localStorage.setItem("triviaAuthToken", jwtToken);
      localStorage.setItem("triviaTokenExpiry", tokenExpiry);
  
      // setAuthToken(response.data.jwtToken);
      setAuthToken(jwtToken);
    } catch (error) {
        setAuthError("Failed to authenticate with Trivia API.");

      console.error("Trivia login failed", error);
    }finally {
        setAuthLoading(false);
      }
  };

  useEffect(() => {
    loginTriviaAPI();

  }, []);

 


  return (
    <TriviaAuthContext.Provider value={{ authToken,authLoading, authError  }}>
      {children}
    </TriviaAuthContext.Provider>
  );
};





