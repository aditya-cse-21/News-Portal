// server/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user'], default: 'user' },
  blockedNews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'News' }],
});

export default mongoose.model('User', userSchema);
