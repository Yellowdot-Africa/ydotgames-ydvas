import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { Circles } from "react-loader-spinner";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      const msisdn = localStorage.getItem("cli");
      const serviceId = localStorage.getItem("sid") || "778";

      try {
        const response = await axios.post(
          "https://be-spin-mtn.ydafrica.com/api/v1/checkstatus",
          { msisdn, serviceId },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.data.State === "Active") {
          setIsSubscribed(true);
          localStorage.setItem("isSubscribed", "true");
        } else {
          setIsSubscribed(false);
          localStorage.setItem("isSubscribed", "false");
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
        setIsSubscribed(false);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center mt-32">
        <Circles color="black" height={50} width={50} />;
      </div>
    );
  }

  if (!isSubscribed) {
    return <Navigate to="/subscription-expired" />;
  }

  return children;
};

export default ProtectedRoute;
