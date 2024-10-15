// import { createContext, useState, useEffect } from "react";
// import authApi from "../api/authApi";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState(null);
//   const [loading, setLoading] = useState(false);


//   const isTokenExpired = (expiryTime) => {
//     const currentTime = new Date().getTime();
//     return currentTime >= expiryTime;
//   };


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
//       setError('Internal Server Error. Please try again later.');

//       console.error("Login error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadAuthFromLocalStorage = () => {
//     const jwtToken = localStorage.getItem("authToken");
//     const tokenExpiry = localStorage.getItem("tokenExpiry");
//     const username = localStorage.getItem("username");

//   //   if (jwtToken && tokenExpiry && username) {
//   //     const currentTime = new Date().getTime();
//   //     if (currentTime < tokenExpiry) {
//   //       // Token is still valid
//   //       setAuth({
//   //         token: jwtToken,
//   //         tokenExpiry,
//   //         username,
//   //       });
//   //     } else {
//   //       // Token has expired
//   //       localStorage.clear(); // Clear the token from local storage
//   //       login(); // Fetch new token
//   //     }
//   //   } else {
//   //     // No token, perform login
//   //     login();
//   //   }
//   // };


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


// useEffect(() => {
//   const tokenCheckInterval = setInterval(() => {
//     if (auth && isTokenExpired(auth.tokenExpiry)) {
//       // Token expired, re-login
//       localStorage.clear();
//       login();
//     }
//   }, 60000); // Check every 60 seconds

//   return () => clearInterval(tokenCheckInterval); // Clear interval on unmount
// }, [auth]);

//   useEffect(() => {
//     loadAuthFromLocalStorage();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <AuthContext.Provider value={{ auth }}>{children}</AuthContext.Provider>
//   );
// };

// export default AuthContext;









import { createContext, useState, useEffect, useContext } from "react";
import authApi from "../api/authApi";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const login = async () => {
    try {
      const data = await authApi();

      setAuth({
        token: data.jwtToken,
        tokenExpiry: data.tokenExpiry,
        username: data.username,
        bigCashTriviaId: data.bigCashTriviaId,
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    login();
  }, []);

  return (
    <AuthContext.Provider value={{ auth }}>{children}</AuthContext.Provider>
  );
};



export default AuthContext;








