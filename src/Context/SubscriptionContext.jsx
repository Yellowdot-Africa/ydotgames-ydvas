// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const SubscriptionContext = createContext();

// export const SubscriptionProvider = ({ children }) => {
//   const [msisdn, setMsisdn] = useState(localStorage.getItem("msisdn"));
//   const [sid, setSid] = useState(localStorage.getItem("sid"));
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Update state when localStorage changes
//     const handleStorageChange = () => {
//       setMsisdn(localStorage.getItem("msisdn"));
//       setSid(localStorage.getItem("sid"));
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   if (!msisdn || !sid) {
//     return <div>Subscription details are missing. Please try again later.</div>;
//   }

//   const verifySubscription = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post(
//         "https://be-spin-mtn.ydafrica.com/api/v1/checkstatus",
//         { msisdn, ServiceID: sid },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const { isActive } = response.data;
//       setIsSubscribed(isActive);
//     } catch (err) {
//       console.error("Subscription check failed:", err);
//       setError(err?.response?.data?.message || "Failed to check subscription status.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     verifySubscription();
//   }, [msisdn, sid]);

//   return (
//     <SubscriptionContext.Provider
//       value={{
//         isSubscribed,
//         verifySubscription,
//         loading,
//         error,
//       }}
//     >
//       {children}
//     </SubscriptionContext.Provider>
//   );
// };

// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const SubscriptionContext = createContext();

// export const SubscriptionProvider = ({ children }) => {
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const verifySubscription = async () => {
//     const msisdn = localStorage.getItem("msisdn");
//     const sid = localStorage.getItem("sid");

//     if (!msisdn || !sid) {
//       setError("Missing subscription details.");
//       setIsSubscribed(false);
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "https://be-spin-mtn.ydafrica.com/api/v1/checkstatus",
//         { msisdn, ServiceID: sid },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.data.State === "Active") {
//         setIsSubscribed(true);
//       } else {
//         setIsSubscribed(false);
//       }
//     } catch (err) {
//       console.error("Subscription check failed:", err);
//       setError("Failed to verify subscription status.");
//       setIsSubscribed(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     verifySubscription();

//     // Re-check subscription every 5 minutes
//     const interval = setInterval(() => {
//       verifySubscription();
//     }, 300000); // 300,000ms = 5 minutes

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <SubscriptionContext.Provider
//       value={{
//         isSubscribed,
//         loading,
//         error,
//         verifySubscription, // Expose the function if you need manual re-check
//       }}
//     >
//       {children}
//     </SubscriptionContext.Provider>
//   );
// };

import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(null);

  const checkSubscription = async () => {
    const msisdn = localStorage.getItem("msisdn");
    const sid = localStorage.getItem("sid");

    if (!msisdn || !sid) {
      setIsActive(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://be-spin-mtn.ydafrica.com/api/v1/checkstatus",
        {
          msisdn,
          serviceId: sid,
        }
      );

      if (response.data.data.State === "Active") {
        localStorage.setItem(
          "lastBillingDate",
          response.data.data.LastBillingDate
        );
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    } catch (error) {
      console.error("Subscription check failed:", error);
      setIsActive(false);
    }
  };

  useEffect(() => {
    checkSubscription();
    const interval = setInterval(checkSubscription, 10 * 60 * 1000); // Check every 10 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <SubscriptionContext.Provider value={{ isActive }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// export default SubscriptionContext;
