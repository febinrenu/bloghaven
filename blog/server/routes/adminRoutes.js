import express from 'express';
import {
  getPendingPosts,
  approvePost,
  rejectPost,
  deletePostAdmin,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  activateUser,
  banUser,
  unbanUser,
  deleteUser,
  getStats,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Post moderation
router.get('/posts/pending', getPendingPosts);
router.put('/posts/:id/approve', approvePost);
router.put('/posts/:id/reject', rejectPost);
router.delete('/posts/:id', deletePostAdmin);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/deactivate', deactivateUser);
router.put('/users/:id/activate', activateUser);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/unban', unbanUser);
router.delete('/users/:id', deleteUser);

// Statistics
router.get('/stats', getStats);

export default router;
