// src/AuthSync.jsx
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

function AuthSync() {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    const verifyUserWithBackend = async () => {
      try {
        if (isAuthenticated) {
          const token = await getAccessTokenSilently();
          await axios.post(
            'http://localhost:5000/api/users/auth0-login',
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      } catch (error) {
        console.error('Auth0 sync error:', error.message);
      }
    };

    verifyUserWithBackend();
  }, [isAuthenticated, getAccessTokenSilently]);

  return null; // no UI needed
}

export default AuthSync;
