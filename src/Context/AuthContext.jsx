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






