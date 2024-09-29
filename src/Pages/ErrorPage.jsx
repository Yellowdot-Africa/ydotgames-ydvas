import React from "react";
import Logo from "../assets/Images/logo.png"; 
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#EFF3F5]">
      <img src={Logo} alt="Logo" className="w-[100%] h-[auto] max-w-[225.31px] mb-5" />
      <h1 className="text-2xl font-bold font-mtn-brighter-bold text-red-600 mb-5">Oops! Something went wrong.</h1>
      <p className="text-lg text-center font-mtn-brighter-medium font-medium mb-5">
        We encountered an error while checking your subscription status. Please try again later.
      </p>
      <button
        onClick={() => navigate("/home")}
        className="bg-darrk-gradient text-white text-lg font-bold font-mtn-brighter-bold py-2 px-4 rounded-[28px] transition-all hover:bg-darrk-gradient-dark"
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default ErrorPage;
