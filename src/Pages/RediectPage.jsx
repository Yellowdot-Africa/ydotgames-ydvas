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
    // let msisdn = queryParams.get("msisdn");

    // const sid = queryParams.get('sid');

    if (cli) {
      const decodedCli = atob(cli);
      
      console.log('Decoded CLI:', decodedCli);
    //   console.log('SID:', sid);
      checkSubscription(decodedCli);

      navigate(`/Redirect?cli=${decodedCli}&sid=${sid}`);
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
        { msisdn },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.data.State === "Active") {
    //   navigate(`/splash-sreen?cli=${decodedCli}&sid=${sid}`);
    navigate("/splashscreen");

      } else {
        setErrorMessage("Your subscription is inactive. Please subscribe to continue.");
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




