// controllers/authController.js
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// // Register Admin
// export const registerAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

//     // Do NOT hash password here; let the pre-save hook handle it
//     const newAdmin = new Admin({ email, password });
//     await newAdmin.save();

//     res.status(201).json({ message: "Admin registered successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
