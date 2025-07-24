// routes/userAuthRoutes.js
import express from 'express';
import User from '../models/User.js';
import { verifyAuth0Token } from '../middleware/auth0Middleware.js';

const router = express.Router();

// ✅ Route: Login/Register user via Auth0
router.post('/auth0-login', verifyAuth0Token, async (req, res) => {
  try {
    // Support both plain and namespaced email claims
    const email = req.user.email || req.user["https://https://dev-tq0ls4ivp3e2v6hw.us.auth0.com//email"];
    const sub = req.user.sub;

    if (!email) {
      return res.status(400).json({ message: 'Email is missing in token' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        auth0Id: sub, // optional: helpful for Auth0-related actions
      });
      await user.save();
    }

    res.status(200).json({ message: 'User authenticated successfully', user });
  } catch (err) {
    console.error('Auth0 login error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
