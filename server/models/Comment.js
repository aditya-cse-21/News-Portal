// server/models/Comment.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'News' },
  email: { type: String },
  name: { type: String },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Comment', commentSchema);
