// server/models/News.js
import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: String }], // store emails of liked users
  dislikes: [{ type: String }], // store emails of disliked users
  blockedUsers: [{ type: String }], // emails of blocked users
});

export default mongoose.model('News', newsSchema);
