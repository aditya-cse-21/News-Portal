import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const AuthButton = ({ customClass = '' }) => {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const syncUserWithBackend = async () => {
      try {
        const token = await getAccessTokenSilently();
        await axios.post('http://localhost:5000/api/users/auth0-login', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (err) {
        // Optionally handle error
      }
    };

    if (isAuthenticated) {
      syncUserWithBackend();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) return <button className={`w-full h-full ${customClass}`} disabled>Loading...</button>;

  return (
    <div className="w-full h-full flex items-center justify-center">
      {!isAuthenticated ? (
        <button
          onClick={() => loginWithRedirect()}
          className={`w-full h-full ${customClass}`}
        >
          User Login
        </button>
      ) : (
        <button
          onClick={() => logout({ returnTo: window.location.origin })}
          className={`w-full h-full ${customClass}`}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default AuthButton;
