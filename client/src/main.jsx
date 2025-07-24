import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain='dev-tq0ls4ivp3e2v6hw.us.auth0.com'
      clientId='xbiSweGDiGGmrCzI6JNVXoVfnRWWuC5y'
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://news-api/'
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
