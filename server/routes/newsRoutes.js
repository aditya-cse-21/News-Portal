import express from 'express';
import {
  createNews,
  updateNews,
  deleteNews,
  blockUserFromNews,
  getAllNews,
  getNewsById,
  likeNews,
  dislikeNews,
  commentOnNews
} from '../controllers/newsController.js';
import adminAuth from '../middleware/adminAuth.js';
import { verifyAuth0Token } from '../middleware/auth0Middleware.js';

const router = express.Router();

router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.post('/', adminAuth, createNews);
router.put('/:id', adminAuth, updateNews);
router.delete('/:id', adminAuth, deleteNews);
router.patch('/:id/block-user', adminAuth, blockUserFromNews);
router.post('/:id/like', verifyAuth0Token, likeNews);
router.post('/:id/dislike', verifyAuth0Token, dislikeNews);
router.post('/:id/comment', verifyAuth0Token, commentOnNews);

export default router;
