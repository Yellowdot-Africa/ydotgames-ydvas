import { createContext, useState, useEffect } from "react";
import authApi from "../api/authApi";
import ErrorPage from "../Pages/ErrorPage"; 



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

      if (auth && !isTokenExpired(auth.tokenExpiry)) {
// IF THERE IS A TOKEN AND IT IS STILL VALID, NO NEED TO RE-LOGIN
        return;
      }
      const data = await authApi();


      setAuth({
        token: data.token,
        tokenExpiry: data.expiryTime, 
        username: data.username,
        bigCashTriviaId: data.bigCashTriviaId,
      });

    } catch (error) {
      setError(true);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };


  // THIS Automatically check token expiration and refresh it
  // useEffect(() => {
  //   if (auth) {
  //     const tokenCheckInterval = setInterval(() => {
  //       if (isTokenExpired(auth.tokenExpiry)) {
  //         console.log("Token expired, refreshing...");
  //         login(); // Refresh the token if expired
  //       }
  //     }, 60000); // Check every 60 seconds

  //     return () => clearInterval(tokenCheckInterval); // Clear interval when component unmount
  //   }
  // }, [auth]);

   // perform login when the component is first mounted
   useEffect(() => {
    login();
  }, []);


  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <ErrorPage />;
  // }
  // if (error) {
  //   navigate('/error');
  // }

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















