import express from 'express';
import {
  getAdminDashboard,
  getAuthorDashboard,
  getReaderDashboard
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin Dashboard
router.get('/admin', protect, authorize('admin'), getAdminDashboard);

// Author Dashboard
router.get('/author', protect, authorize('author', 'admin'), getAuthorDashboard);

// Reader Dashboard
router.get('/reader', protect, getReaderDashboard);

export default router;
