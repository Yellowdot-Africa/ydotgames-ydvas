import { createContext, useState, useEffect } from "react";
import authApi from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      const data = await authApi();

      setAuth({
        token: data.jwtToken,
        tokenExpiry: data.tokenExpiry,
        username: data.username,
      });
    } catch (error) {
      setError('Internal Server Error. Please try again later.');

      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAuthFromLocalStorage = () => {
    const jwtToken = localStorage.getItem("authToken");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const username = localStorage.getItem("username");

    if (jwtToken && tokenExpiry && username) {
      const currentTime = new Date().getTime();
      if (currentTime < tokenExpiry) {
        // Token is still valid
        setAuth({
          token: jwtToken,
          tokenExpiry,
          username,
        });
      } else {
        // Token has expired
        localStorage.clear(); // Clear the token from local storage
        login(); // Fetch new token
      }
    } else {
      // No token, perform login
      login();
    }
  };

  useEffect(() => {
    loadAuthFromLocalStorage();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ auth }}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
