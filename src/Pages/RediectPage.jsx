import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../Context/UserContext";
// import { useAuth } from '../Context/AuthContext';


const RedirectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setMsisdn } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const cli = queryParams.get("cli");
    const sid = queryParams.get("sid");

  //   const setNewID = localStorage.setItem("newID", cli);

  //   if (setNewID) {
  //     setMsisdn(setNewID);
  //     console.log("Retrieved MSISDN from localStorage:", storedMsisdn);
  //     checkSubscription(storedMsisdn, sid);
  //   } else if (cli) {
  //     const decodedCli = atob(cli);
  //     setMsisdn(decodedCli);
  //     localStorage.setItem("cli", decodedCli);
  //     console.log("Decoded CLI:", decodedCli);
  //     checkSubscription(decodedCli, sid);
  //   } else {
  //     console.error("CLI parameter is missing.");
  //     setLoading(false);
  //   }
  // }, [location.search, setMsisdn]);

  // const setNewID = localStorage.setItem("newID", cli); // This doesn't need to be assigned to a variable
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
        // await handleCreateSubscriberProfile(msisdn, nickname, avatarId);
        // if (auth?.token) {
        //   handleCreateSubscriberProfile(msisdn, nickname, avatarId); 
        // }
        navigate("/");
      } else {
        setErrorMessage(
          "Your subscription is inactive. Please subscribe to continue."
        );
        window.location.href =
          "https://play.mtn.co.za/subscribe/service/10421?gv_id=4539";
      }
    } catch (error) {
      console.error("Error checking subscription status", error);
      setErrorMessage("There was an error checking your subscription status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <h1>Redirecting...</h1>
      ) : (
        <div>
          {errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <p>Please wait while we redirect you.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RedirectPage;
