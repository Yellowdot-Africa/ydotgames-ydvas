import React, { createContext, useContext, useState, useEffect } from "react";
import { getSubscriberProfile, UpdateSubscriberProfile } from "../api/userApi";
import AuthContext from "../Context/AuthContext";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const msisdn = "27687530974";
  const { auth } = useContext(AuthContext);

  console.log("MSISDN:", msisdn);

  const fetchProfile = async (msisdn) => {
    setLoading(true);
    setError(null);
    try {
      const profileData = await getSubscriberProfile(auth, msisdn);
      if (profileData.statusCode === "999") {
        setUserProfile(profileData.data);
      } else {
        setError(profileData.statusMessage);
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
      setError("Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchProfile(msisdn);
    }
  }, [auth?.token, msisdn]);

  const handleUpdateSubscriberProfile = async (msisdn, nickname, avatarId) => {
    setLoading(true);
    setError(null);

    console.log("MSISDN:", msisdn);
    console.log("Nickname:", nickname);
    console.log("AvatarID:", avatarId);
    try {
      const response = await UpdateSubscriberProfile(auth, msisdn, nickname, avatarId || '');
      if (response.statusCode === "999") {
        setUserProfile((prev) => ({ ...prev, avatarID: avatarId }));
      } else {
        setError(response.statusMessage);
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      setError("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        loading,
        error,
        msisdn,
        fetchProfile,
        handleUpdateSubscriberProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
export const useUserContext = () => useContext(UserContext);







