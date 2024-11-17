import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../Context/AuthContext";
import { useUserContext } from "../Context/UserContext";
import { Circles } from "react-loader-spinner";

const RedirectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setMsisdn } = useUserContext();
  const { auth } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const cli = queryParams.get("cli");
    const sid = queryParams.get("sid");

    //   //   if (setNewID) {
    //   //     setMsisdn(setNewID);
    //   //     console.log("Retrieved MSISDN from localStorage:", storedMsisdn);
    //   //     checkSubscription(storedMsisdn, sid);
    //   //   } else if (cli) {
    //   //     const decodedCli = atob(cli);
    //   //     setMsisdn(decodedCli);
    //   //     localStorage.setItem("cli", decodedCli);
    //   //     console.log("Decoded CLI:", decodedCli);
    //   //     checkSubscription(decodedCli, sid);
    //   //   } else {
    //   //     console.error("CLI parameter is missing.");
    //   //     setLoading(false);
    //   //   }
    //   // }, [location.search, setMsisdn]);

    //   // const setNewID = localStorage.setItem("newID", cli);

    if (cli) {
      const decodedCli = atob(cli);
      setMsisdn(decodedCli);
      localStorage.setItem("cli", decodedCli);
      // console.log("Decoded CLI:", decodedCli);

      checkSubscription(decodedCli, sid);
    } else {
      console.error("CLI parameter is missing.");
      setLoading(false);
    }
  }, [location.search, setMsisdn]);

  const checkSubscription = async (msisdn, serviceId) => {
    try {
      const response = await axios.post(
        "https://be-spin-mtn.ydafrica.com/api/v1/checkstatus",
        { msisdn, serviceId },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.data.State === "Active") {
        const nickname = msisdn;
        const avatarId = 1;

        // await handleCreateSubscriberProfile(msisdn, nickname, avatarId);
        //         if (auth?.token) {
        //           handleCreateSubscriberProfile(msisdn, nickname, avatarId);
        //         }
        navigate("/");
        // } else if (response.data.data.State === "Deactivated") {
        //   setErrorMessage("Your subscription is inactive. Please subscribe to continue.");
        //   window.location.href = "https://play.mtn.co.za/subscribe/service/10421?gv_id=4539";
      } else {
        // setErrorMessage("Unable to determine your subscription status. Please contact support.");

        setErrorMessage(
          "Your subscription is inactive. Please subscribe to continue."
        );
        window.location.href =
          "https://play.mtn.co.za/subscribe/service/10421?gv_id=4539";
      }
    } catch (error) {
      //   const errorMsg =
      //   error.response?.data?.msg ||
      //   "There was an error checking your subscription status.";
      //   console.error("Error checking subscription status:", errorMsg);

      // setErrorMessage(errorMsg);
      // setErrorMessage("There was an error checking your subscription status.");
      if (
        error.response?.status === 400 &&
        error.response?.data?.msg === "User is not active in this service"
      ) {
        setErrorMessage(
          "Your subscription is inactive. Please subscribe to continue."
        );
        window.location.href =
          "https://play.mtn.co.za/subscribe/service/10421?gv_id=4539";
      } else {
        const errorMsg =
          error.response?.data?.msg ||
          "There was an error checking your subscription status.";
        console.error("Error checking subscription status:", errorMsg);
        setErrorMessage(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {loading ? (
        <div className="flex flex-col items-center">
          <Circles color="black" height={50} width={50} />

          <h1 className="text-xl font-semibold mt-4">Redirecting...</h1>
        </div>
      ) : (
        <div className="text-center">
          {errorMessage ? (
            <p className="text-red-500 font-medium">{errorMessage}</p>
          ) : (
            <p className="text-gray-700">Please wait while we redirect you.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RedirectPage;

// import React, { useEffect, useState, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import AuthContext from "../Context/AuthContext";
// import { useUserContext } from "../Context/UserContext";
// import { Circles } from "react-loader-spinner";

// const RedirectPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { setMsisdn, handleCreateSubscriberProfile, fetchProfile  } = useUserContext();
//   const { auth } = useContext(AuthContext);
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     const cli = queryParams.get("cli");
//     const sid = queryParams.get("sid");

//     //   //   if (setNewID) {
//     //   //     setMsisdn(setNewID);
//     //   //     console.log("Retrieved MSISDN from localStorage:", storedMsisdn);
//     //   //     checkSubscription(storedMsisdn, sid);
//     //   //   } else if (cli) {
//     //   //     const decodedCli = atob(cli);
//     //   //     setMsisdn(decodedCli);
//     //   //     localStorage.setItem("cli", decodedCli);
//     //   //     console.log("Decoded CLI:", decodedCli);
//     //   //     checkSubscription(decodedCli, sid);
//     //   //   } else {
//     //   //     console.error("CLI parameter is missing.");
//     //   //     setLoading(false);
//     //   //   }
//     //   // }, [location.search, setMsisdn]);

//     //   // const setNewID = localStorage.setItem("newID", cli);

//     if (cli) {
//       const decodedCli = atob(cli);
//       setMsisdn(decodedCli);
//       localStorage.setItem("cli", decodedCli);
//       // console.log("Decoded CLI:", decodedCli);

//       checkSubscription(decodedCli, sid);
//     } else {
//       console.error("CLI parameter is missing.");
//       setLoading(false);
//     }
//   }, [location.search, setMsisdn]);

//   const checkSubscription = async (msisdn, serviceId) => {
//     try {
//       const response = await axios.post(
//         "https://be-spin-mtn.ydafrica.com/api/v1/checkstatus",
//         { msisdn, serviceId },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       console.log("Subscription check response:", response.data);
//       if (response.data.data.State === "Active") {

//         const existingProfile = await fetchProfile(auth, msisdn);
//         console.log("Existing profile:", existingProfile);

//         // if (existingProfile.statusCode === "999") {
//           if (existingProfile && existingProfile.statusCode === "999") {

//           // Profile exists, navigate to homepage
//           console.log("Profile already exists, redirecting...");
//           navigate("/");

//         } else {

//         const nickname = msisdn;
//         const avatarId = 1;

//         console.log("Creating new profile...");
//         // await handleCreateSubscriberProfile(auth, msisdn, nickname, avatarId);
//                 // if (auth?.token) {
//                 //   handleCreateSubscriberProfile(msisdn, nickname, avatarId);
//                 // }
//                 // console.log("Profile created successfully.");

//         navigate("/");
//               }
//       } else {
//         setErrorMessage(
//           "Your subscription is inactive. Please subscribe to continue."
//         );
//         window.location.href =
//           "https://play.mtn.co.za/subscribe/service/10421?gv_id=4539";
//       }
//     } catch (error) {
//       console.error("Error checking subscription status", error);
//       setErrorMessage("There was an error checking your subscription status.", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       {loading ? (
//         <div className="flex flex-col items-center">
//           <Circles color="black" height={50} width={50} />

//           <h1 className="text-xl font-semibold mt-4">Redirecting...</h1>
//         </div>
//       ) : (
//         <div className="text-center">
//           {errorMessage ? (
//             <p className="text-red-500 font-medium">{errorMessage}</p>
//           ) : (
//             <p className="text-gray-700">Please wait while we redirect you.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RedirectPage;
