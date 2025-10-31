import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleUpvote,
  getMyPosts,
  submitPostForReview,
} from '../controllers/postController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/:id', getPostById);

// Protected routes
router.post('/', protect, authorize('author', 'admin'), createPost);
router.put('/:id', protect, authorize('author', 'admin'), updatePost);
router.delete('/:id', protect, authorize('author', 'admin'), deletePost);
router.post('/:id/upvote', protect, toggleUpvote);
router.get('/my/posts', protect, getMyPosts);
router.post('/:id/submit', protect, authorize('author', 'admin'), submitPostForReview);

export default router;
