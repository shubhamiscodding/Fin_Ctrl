import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const { isLoading, error, handleRedirectCallback } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Handle the Auth0 callback
        await handleRedirectCallback();
        // Redirect to the dashboard or home after successful login
        navigate("/dashboard");
      } catch (callbackError) {
        console.error("Error handling callback:", callbackError);
        // Redirect to login page with error message
        navigate("/logIn", { state: { error: callbackError.message } });
      }
    };

    // Only handle the callback if it's not loading
    if (!isLoading) {
      handleCallback();
    }
  }, [isLoading, handleRedirectCallback, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If error occurs during callback handling, display it here
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return null;
};

export default Callback;
