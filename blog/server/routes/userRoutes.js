import express from 'express';
import {
  followUser,
  unfollowUser,
  getUserProfile,
  getUserFollowers,
  getUserFollowing,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', getUserProfile);
router.get('/:id/followers', getUserFollowers);
router.get('/:id/following', getUserFollowing);
router.post('/:id/follow', protect, followUser);
router.delete('/:id/follow', protect, unfollowUser);

export default router;
