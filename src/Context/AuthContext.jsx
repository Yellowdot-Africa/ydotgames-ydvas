// import { createContext, useState, useEffect, useContext } from "react";
// import authApi from "../api/authApi";

// const AuthContext = createContext();


// export const AuthProvider = ({ children }) => {
//   // const [auth, setAuth] = useState(null);
//   const [auth, setAuth] = useState({
//     token: localStorage.getItem("authToken") || null,
//     tokenExpiry: parseInt(localStorage.getItem("tokenExpiry"), 10) || null,
//     username: localStorage.getItem("username") || null,
//   });

//   const isTokenExpired = () => {
//     const currentTime = Math.floor(Date.now() / 1000); 
//     return auth.tokenExpiry && currentTime > auth.tokenExpiry; 
//   };

//   const login = async () => {
//     try {
//       const data = await authApi();

//       setAuth({
//         token: data.jwtToken,
//         tokenExpiry: parseInt(data.tokenExpiry, 10), 
//         username: data.username,
//       });
//       // localStorage.setItem("authToken", data.jwtToken);
//       // localStorage.setItem("tokenExpiry", data.tokenExpiry);
//       // localStorage.setItem("username", data.username);
//     } catch (error) {
//       console.error("Login error:", error);
//     }
//   };

//   // useEffect(() => {
//   //   login();
//   // }, []);

//   useEffect(() => {
//     if (!auth.token || isTokenExpired()) {
//       login();
//     }
//   }, [auth]);

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






