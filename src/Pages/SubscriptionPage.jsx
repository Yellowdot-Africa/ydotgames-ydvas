import React from "react";
import Logo from "../assets/Images/logo.png"; 
import { useNavigate } from "react-router-dom";

const SubscriptionPage = () => {
  const navigate = useNavigate();


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-custom-gradient">
      <img src={Logo} alt="Logo" className="w-[100%] h-[auto] max-w-[225.31px] mb-5" />
      <h1 className="text-2xl font-bold font-mtn-brighter-bold mb-5">Subscription Required</h1>
      <p className="text-lg font-mtn-brighter-medium font-medium text-center mb-5">
        To gain access to multiple games and enjoy an amazing experience, please subscribe to our service.
      </p>
    
    </div>
  );
};

export default SubscriptionPage;
