import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';


const RedirectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const cli = queryParams.get('cli');

    const sid = queryParams.get('sid');

    if (cli) {
      const decodedCli = atob(cli);
      
      console.log('Decoded CLI:', decodedCli);
    //   console.log('SID:', sid);
      checkSubscription(decodedCli, sid);

    //   navigate(`/Redirect?cli=${decodedCli}&sid=${sid}`);
    // navigate("/splashscreen");
    } else {
      console.error('CLI parameter is missing.');
    //   setErrorMessage('CLI parameter is missing.');
      setLoading(false);
    }
  }, [location.search]);


  const checkSubscription = async (msisdn, serviceId) => {
    try {
      const response = await axios.post(
        'https://be-spin-mtn.ydafrica.com/api/v1/checkstatus',
        { msisdn, serviceId },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.data.State === "Active") {
    navigate("/");

      } else {
        setErrorMessage("Your subscription is inactive. Please subscribe to continue.");
        window.location.href = "https://play.mtn.co.za/subscribe/service/10421?gv_id=4539";
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




