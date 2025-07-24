import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import cors from 'cors';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import userRoutes from './routes/userRoutes.js'; 

import authRoutes from './routes/authRoutes.js';
import newsRoutes from './routes/newsRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Mount Routes
app.use('/api/users', userRoutes); // 
app.use('/api/admin', adminAuthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
connectDB();

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
