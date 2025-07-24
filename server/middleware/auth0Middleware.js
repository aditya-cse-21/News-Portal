// middleware/verifyAuth0Token.js
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: 'https://dev-tq0ls4ivp3e2v6hw.us.auth0.com/.well-known/jwks.json', // ✅ Replace with your actual Auth0 domain
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err, null);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
}

export const verifyAuth0Token = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Missing or malformed token' });

  const token = authHeader.split(' ')[1];

 jwt.verify(
    token,
    getKey,
    {
      audience: 'https://news-api/', 
      issuer: 'https://dev-tq0ls4ivp3e2v6hw.us.auth0.com/',   
      algorithms: ['RS256'],
    },
    (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid token', error: err.message });

      req.user = decoded; // contains `sub`, `email`, etc.
      next();
    }
  );
};
