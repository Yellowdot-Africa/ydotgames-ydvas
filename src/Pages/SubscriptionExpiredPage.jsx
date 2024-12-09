import React from "react";
import Logo from "../assets/Images/new-logo.png";


const SubscriptionExpiredPage = () => {
  const handleRenewSubscription = () => {
    window.location.href =
    "https://play.mtn.co.za/subscribe/service/10421?gv_id=4539";

    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
            <img src={Logo} alt="Logo" className="w-[100%] h-[auto] max-w-[225.31px] mb-5" />

      <h1 className="text-2xl font-bold font-mtn-brighter-bold ">Subscription Expired</h1>
      <p className="text-lg font-mtn-brighter-medium text-center">Your subscription has ended. Please renew to continue using the app.</p>
      <button
        onClick={handleRenewSubscription}
        className="mt-4 px-8 py-3.5 bg-[#FFCB05] text-black font-mtn-brighter-medium font-medium rounded-full"
      >
        Renew Subscription
      </button>
    </div>
  );
};

export default SubscriptionExpiredPage;






// import { useContext } from "react";
// import { SubscriptionContext } from "../Context/SubscriptionContext";
// import { Navigate } from "react-router-dom";

// const SubscriptionGuard = ({ children }) => {
//   const { subscriptionStatus } = useContext(SubscriptionContext);

//   // Check if subscription status is loading or not available
//   if (!subscriptionStatus) {
//     return <div>Loading...</div>;
//   }

//   // Check subscription state
//   if (subscriptionStatus?.data?.State === "Active") {
//     return children;
//   }

//   // Redirect to subscription expired page
//   return <Navigate to="/subscribe" replace />;
// };

// export default SubscriptionGuard;
