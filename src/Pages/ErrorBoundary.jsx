import React, { useEffect } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { Circles } from "react-loader-spinner";




const ErrorFallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/error");
  }, [navigate]);

  return (
    <div>
      <h1>Something went wrong!</h1>
      <Circles color="black" height={50} width={50} />

      {/* <p>Redirecting to the error page...</p> */}
    </div>
  );
};

const ErrorBoundary = ({ children }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;

