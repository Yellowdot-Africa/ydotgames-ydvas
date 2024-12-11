import React, { createContext, useContext, useState, useEffect } from "react";
import AuthContext from "../Context/AuthContext";
import {
  createSubscriberProfile,
  getSubscriberProfile,
  UpdateSubscriberProfile,
} from "../api/userApi";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);

  const [msisdn, setMsisdn] = useState(() => {
    return localStorage.getItem("cli") || "";
  });

  useEffect(() => {
    if (auth?.token && msisdn) {
      fetchProfile();
    }
  }, [auth?.token, msisdn]);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      //  to fetch the  profile
      const profile = await getSubscriberProfile(auth, msisdn);
      if (profile.isSuccessful) {
        console.log("Profile fetched successfully:", profile.data);
        setUserProfile(profile.data);
      } else {
        throw new Error("Profile not found.");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn(
          "Profile not found. Attempting to create a new profile..."
        );

        try {
          const newProfile = await createSubscriberProfile(
            auth,
            msisdn,
            msisdn,
            1
          );
          console.log("Profile created successfully:", newProfile);
          setUserProfile(newProfile);
        } catch (createError) {
          console.error("Failed to create profile:", createError);
          setError("Error creating profile");
        }
      } else {
        console.error("Error fetching profile:", error);
        setError("Error fetching profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubscriberProfile = async (nickname, avatarId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await UpdateSubscriberProfile(
        auth,
        msisdn,
        nickname,
        avatarId
      );
      if (response.isSuccessful) {
        console.log("Profile updated successfully:", response.data);
        setUserProfile((prev) => ({
          ...prev,
          nickname,
          avatarId,
        }));
      } else {
        setError(response.message);
        console.error("Update error:", response.message);
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
        setMsisdn,
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
