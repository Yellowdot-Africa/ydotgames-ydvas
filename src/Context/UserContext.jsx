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






// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
// import AuthContext from "../Context/AuthContext";
// import {
//   createSubscriberProfile,
//   getSubscriberProfile,
//   UpdateSubscriberProfile,
// } from "../api/userApi";
// // import {  getSubscriberProfile, UpdateSubscriberProfile } from "../api/userApi";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [userProfile, setUserProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [createLoading, setCreateLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { auth } = useContext(AuthContext);

//   const [msisdn, setMsisdn] = useState(() => {
//     const savedMsisdn = localStorage.getItem("cli");
//     return savedMsisdn || "";
//   });

//   useEffect(() => {
//     if (createLoading) {
//       setLoading(true);
//       setError(null);
    
//         // Try to fetch the profile initially
//        getSubscriberProfile(auth, msisdn).then((profile)=>{

//          if (profile.isSuccessful) {
//            console.log("Profile found:", profile.data);
//            setUserProfile(profile.data);
//          } else {
//            throw new Error("Profile not found, attempting to create profile.");
//          }
//        }).catch((error)=>
//        {
       
//            console.error("Error creating profile:", error);
//            setError("Error creating profile");
//          }
//        ).finally(()=>{

//          setLoading(false);
//          setCreateLoading(false)
//        })
     

//     }
//   }, [createLoading]);
//   // useEffect(() => {
//   //   if (auth?.token && msisdn) {
//   //     fetchProfile(msisdn);
//   //   }
//   // }, [auth?.token, msisdn]);

//   const handleCreateSubscriberProfile = useCallback( async ({msisdn, nickname, avatarId}) => {
//     setLoading(true);
//     setError(null);
//     console.log("Creating profile with msisdn:", msisdn, "nickname:", nickname, "avatarId:", avatarId);

//     try {
//       const response = await createSubscriberProfile(
//         auth,
//         msisdn,
//         nickname,
//         avatarId
//       );
//       if (response.isSuccessful) {
//         console.log("Profile created successfully:", response.data);

//         setUserProfile(response.data);
//       } else {
//         setError(response.message);
//         console.error("Failed to create profile:", response.message);

//       }
//     } catch (error) {
//       console.error("Failed to create profile", error);
//       setError("Error creating profile");
//     } finally {
//       setLoading(false);
//     }
//   },[]);


//   // const fetchProfile = useCallback(async (retries = 3, delay = 1000) => {
//   //   setLoading(true);
//   //   setError(null);
  
//   //   try {
//   //     // Try to fetch the profile
//   //     const profile = await getSubscriberProfile(auth, msisdn);
  
//   //     if (profile.isSuccessful) {
//   //       console.log("Profile found:", profile.data);
//   //       setUserProfile(profile.data);
//   //     } else {
//   //       throw new Error("Profile not found.");
//   //     }
//   //   } catch (error) {
//   //     if (error.response && error.response.status === 404) {
//   //       console.warn("Profile not found. Creating a new profile...");
  
//   //       try {
//   //         // Create a new profile
//   //         const createResponse = await handleCreateSubscriberProfile({
//   //           msisdn,
//   //           nickname: msisdn, // Default to msisdn as nickname
//   //           avatarId: 1, // Default avatar ID
//   //         });
  
//   //         if (createResponse?.isSuccessful) {
//   //           console.log("Profile created successfully:", createResponse.data);
//   //           setUserProfile(createResponse.data);
//   //         } else {
//   //           throw new Error("Failed to create profile.");
//   //         }
//   //       } catch (createError) {
//   //         console.error("Error creating profile:", createError);
//   //         setError("Error creating profile");
//   //       }
//   //     } else {
//   //       console.error("Failed to fetch profile:", error);
//   //       setError("Error fetching profile");
//   //     }
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // }, [auth, msisdn, handleCreateSubscriberProfile]);
  
  
//   const fetchProfile = useCallback ( async (retries = 3, delay = 1000) => {
//     setLoading(true);
//     setError(null);
  
//     try {
//       // Try to fetch the profile initially
//       const profile = await getSubscriberProfile(auth, msisdn);
  
//       if (profile.isSuccessful) {
//         console.log("Profile found:", profile.data);
//         setUserProfile(profile.data);
//       } else {
//         throw new Error("Profile not found, attempting to create profile.");
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         console.warn("Profile not found. Creating a new profile...");
        
//         try {
//           // Create new profile
//           const createResponse = await handleCreateSubscriberProfile({
//             msisdn,
//             nickname: msisdn,
//             avatarId: 1
//           });
  
//           if (createResponse?.isSuccessful) {
//             console.log("Profile created successfully:", createResponse.data);
//             setLoading(true);
//             setCreateLoading(true);
//             setUserProfile(createResponse.data);

//             // // Wait for a short delay after profile creation to allow server sync
//             // await new Promise(resolve => setTimeout(resolve, delay));
  
//             // // Try fetching the profile after creation
//             // const fetchNewProfile = await getSubscriberProfile(auth, msisdn);
//             // if (fetchNewProfile.isSuccessful) {
//             //   console.log("Fetched new profile:", fetchNewProfile.data);
//             //   setUserProfile(fetchNewProfile.data);
//             // } else {
//             //   throw new Error("Profile not available yet.");
//             // }
//           } else {
//             setError("Failed to create profile: " + createResponse.message);
//           }
//         } catch (createError) {
//           console.error("Error creating profile:", createError);
//           setError("Error creating profile");
//         }
//       }
//     } finally {
//       setLoading(false);
//       // setCreateLoading(false)
//     }
//   []},);
  

//   const handleUpdateSubscriberProfile = useCallback( async (msisdn, nickname, avatarId) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await UpdateSubscriberProfile(
//         auth,
//         msisdn,
//         nickname,
//         avatarId || ""
//       );
//       if (response.isSuccessful) {
//         setUserProfile((prev) => ({ ...prev, avatarID: avatarId }));
//       } else {
//         setError(response.message);
//         console.error("Update error:", response.message);
//       }
//     } catch (error) {
//       console.error("Failed to update profile", error);
//       setError("Error updating profile");
//     } finally {
//       setLoading(false);
//     }
//   },[]);

//   return (
//     <UserContext.Provider
//       value={{
//         userProfile,
//         loading,
//         error,
//         msisdn,
//         setMsisdn,
//         handleCreateSubscriberProfile,
//         fetchProfile,
//         handleUpdateSubscriberProfile,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserContext;
// export const useUserContext = () => useContext(UserContext);


