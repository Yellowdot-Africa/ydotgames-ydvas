import { createContext, useState, useEffect } from "react";
import authApi from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

// this checks if the token has expired
  const isTokenExpired = (expiryTime) => {
    const currentTime = new Date().getTime();
    return currentTime >= expiryTime;
  };


  const login = async () => {
    // setLoading(true); 
    setError(null); 

    try {
      const data = await authApi();


      setAuth({
        token: data.token,
        tokenExpiry: data.expiryTime, 
        username: data.username,
        bigCashTriviaId: data.bigCashTriviaId,
      });

    } catch (error) {
      setError('Internal Server Error. Please try again later.');

      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };



//   if (jwtToken && tokenExpiry && username) {
//     if (!isTokenExpired(tokenExpiry)) {
//       // Token is still valid, set auth state
//       setAuth({
//         token: jwtToken,
//         tokenExpiry,
//         username,
//       });
//     } else {
//       // Token expired, clear storage and re-login
//       localStorage.clear();
//       login();
//     }
//   } else {
//     // No token available, perform login
//     login();
//   }
// };

  // Effect to automatically check token expiration and refresh if necessary
  useEffect(() => {
    if (auth) {
      const tokenCheckInterval = setInterval(() => {
        if (isTokenExpired(auth.tokenExpiry)) {
          console.log("Token expired, refreshing...");
          login(); // Refresh the token if expired
        }
      }, 60000); // Check every 60 seconds

      return () => clearInterval(tokenCheckInterval); // Clear interval on component unmount
    }
  }, [auth]);
   // perform login when the component is first mounted
   useEffect(() => {
    login();
  }, []);

  
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (error) {
    return <div>{error}</div>; 
  }


  return (
    <AuthContext.Provider value={{ auth }}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;









// import { createContext, useState, useEffect, useContext } from "react";
// import authApi from "../api/authApi";

// const AuthContext = createContext();


// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState(null);

//   const login = async () => {
//     try {
//       const data = await authApi();

//       setAuth({
//         token: data.jwtToken,
//         tokenExpiry: data.tokenExpiry,
//         username: data.username,
//         bigCashTriviaId: data.bigCashTriviaId,
//       });
//     } catch (error) {
//       console.error("Login error:", error);
//     }
//   };

//   useEffect(() => {
//     login();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ auth }}>{children}</AuthContext.Provider>
//   );
// };



// export default AuthContext;








// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// // Create a context for Auth
// const AuthContext = createContext();

// // Create a provider component
// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(null);

//   // Fetch the token only once
//   const fetchAuthToken = async () => {
//     try {
//       const response = await axios.post("https://ydvassdp.com:5001/api/auth", {
//         username: "games_sa_ydotgames",
//         password: "password"
//       });
//       setToken(response.data.token); // Store the token
//     } catch (error) {
//       console.error("Error fetching auth token:", error);
//     }
//   };

//   useEffect(() => {
//     if (!token) {
//       fetchAuthToken(); // Fetch token on first mount
//     }
//   }, [token]);

//   // Provide the token and a function to refresh it
//   return (
//     <AuthContext.Provider value={{ token, fetchAuthToken }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Hook to use the Auth context
// export const useAuth = () => {
//   return useContext(AuthContext);
// };








