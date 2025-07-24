import News from '../models/News.js';
import Comment from '../models/Comment.js';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

// Create news
export const createNews = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    const news = new News({
      title,
      content,
      image,
      createdBy: req.admin.id, // from adminAuth middleware
    });

    await news.save();
    res.status(201).json({ message: "News created", news });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update news
export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNews = await News.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedNews) return res.status(404).json({ message: "News not found" });
    res.json({ message: "News updated", news: updatedNews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete news
export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await News.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "News not found" });
    res.json({ message: "News deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Block user from viewing news
export const blockUserFromNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const news = await News.findById(id);
    if (!news) return res.status(404).json({ message: "News not found" });

    if (!news.blockedUsers.includes(email)) {
      news.blockedUsers.push(email);
      await news.save();
    }

    res.json({ message: `User ${email} blocked`, news });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all news
export const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const client = jwksClient({
  jwksUri: 'https://dev-tq0ls4ivp3e2v6hw.us.auth0.com/.well-known/jwks.json',
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

// Get single news by ID (with blocked check and comments)
export const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    let userEmail = null;
    let blocked = false;
    let comments = [];

    // Inline decode Auth0 JWT if present
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        await new Promise((resolve, reject) => {
          jwt.verify(
            token,
            getKey,
            {
              audience: 'https://news-api/',
              issuer: 'https://dev-tq0ls4ivp3e2v6hw.us.auth0.com/',
              algorithms: ['RS256'],
            },
            (err, decoded) => {
              if (!err && decoded && decoded.email) {
                userEmail = decoded.email;
              }
              resolve();
            }
          );
        });
      } catch (err) {
        // Invalid token, ignore
      }
    }

    const news = await News.findById(id);
    if (!news) return res.status(404).json({ message: 'News not found' });

    if (
      userEmail &&
      news.blockedUsers.some(
        (blockedEmail) => blockedEmail.toLowerCase() === userEmail.toLowerCase()
      )
    ) {
      blocked = true;
    }

    comments = await Comment.find({ blog: id });

    res.json({ news, blocked, comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Like news
export const likeNews = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.user.email;
    const news = await News.findById(id);
    if (!news) return res.status(404).json({ message: 'News not found' });

    // Remove from dislikes if present
    news.dislikes = news.dislikes.filter((email) => email !== userEmail);
    // Add to likes if not present
    if (!news.likes.includes(userEmail)) {
      news.likes.push(userEmail);
      await news.save();
    }
    res.json({ message: 'Liked', news });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dislike news
export const dislikeNews = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.user.email;
    const news = await News.findById(id);
    if (!news) return res.status(404).json({ message: 'News not found' });

    // Remove from likes if present
    news.likes = news.likes.filter((email) => email !== userEmail);
    // Add to dislikes if not present
    if (!news.dislikes.includes(userEmail)) {
      news.dislikes.push(userEmail);
      await news.save();
    }
    res.json({ message: 'Disliked', news });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Comment on news
export const commentOnNews = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.user.email;
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content required' });

    const comment = new Comment({ blog: id, email: userEmail, content });
    await comment.save();
    res.status(201).json({ message: 'Comment submitted for approval', comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
