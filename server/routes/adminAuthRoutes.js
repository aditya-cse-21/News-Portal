import express from 'express';
import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// // ✅ Admin Register (one-time setup)
// router.post('/register', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const adminExists = await Admin.findOne({ email });
//     if (adminExists) return res.status(400).json({ message: 'Admin already exists' });

//     const admin = await Admin.create({ email, password });

//     res.status(201).json({
//       _id: admin._id,
//       email: admin.email,
//       token: generateToken(admin._id),
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Error registering admin', error: err.message });
//   }
// });

// ✅ Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({
      _id: admin._id,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

// ✅ Helper: Generate JWT
function generateToken(id) {
  return jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

export default router;
