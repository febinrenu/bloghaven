import Post from '../models/Post.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import { notifyPostApproved, notifyPostRejected } from '../utils/notifications.js';

// @desc    Get all pending posts for moderation
// @route   GET /api/admin/posts/pending
// @access  Private (Admin)
export const getPendingPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find({ status: 'pending' })
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'name email avatar')
      .exec();

    const count = await Post.countDocuments({ status: 'pending' });

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Approve a post
// @route   PUT /api/admin/posts/:id/approve
// @access  Private (Admin)
export const approvePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending posts can be approved' });
    }

    post.status = 'published';
    post.publishedAt = new Date();
    await post.save();

    // Notify author
    await notifyPostApproved(post.author, post._id, post.title);

    res.json({ message: 'Post approved and published', post });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reject a post
// @route   PUT /api/admin/posts/:id/reject
// @access  Private (Admin)
export const rejectPost = async (req, res) => {
  try {
    const { reason } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending posts can be rejected' });
    }

    post.status = 'rejected';
    post.rejectionReason = reason || 'Does not meet content guidelines';
    await post.save();

    // Notify author
    await notifyPostRejected(post.author, post._id, post.title, post.rejectionReason);

    res.json({ message: 'Post rejected', post });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete any post (admin)
// @route   DELETE /api/admin/posts/:id
// @access  Private (Admin)
export const deletePostAdmin = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete all comments
    await Comment.deleteMany({ post: req.params.id });

    await post.deleteOne();

    res.json({ message: 'Post and associated comments deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, isActive } = req.query;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['reader', 'author', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Deactivate user account
// @route   PUT /api/admin/users/:id/deactivate
// @access  Private (Admin)
export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    await user.save();

    res.json({ message: 'User account deactivated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Activate user account
// @route   PUT /api/admin/users/:id/activate
// @access  Private (Admin)
export const activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = true;
    await user.save();

    res.json({ message: 'User account activated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Ban user account
// @route   PUT /api/admin/users/:id/ban
// @access  Private (Admin)
export const banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot ban admin users' });
    }

    user.isActive = false;
    user.bannedAt = new Date();
    await user.save();

    res.json({ message: 'User banned successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Unban user account
// @route   PUT /api/admin/users/:id/unban
// @access  Private (Admin)
export const unbanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = true;
    user.bannedAt = null;
    await user.save();

    res.json({ message: 'User unbanned successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    // Delete user's posts and comments
    await Post.deleteMany({ author: req.params.id });
    await Comment.deleteMany({ author: req.params.id });
    await user.deleteOne();

    res.json({ message: 'User and associated content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getStats = async (req, res) => {
  try {
    // Get date ranges for growth calculations
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Basic counts
    const totalUsers = await User.countDocuments();
    const totalAuthors = await User.countDocuments({ role: 'author' });
    const totalReaders = await User.countDocuments({ role: 'reader' });
    const totalPosts = await Post.countDocuments();
    const publishedPosts = await Post.countDocuments({ status: 'published' });
    const pendingPosts = await Post.countDocuments({ status: 'pending' });
    const draftPosts = await Post.countDocuments({ status: 'draft' });
    const totalComments = await Comment.countDocuments();

    // Growth metrics
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: lastMonth } });
    const newPostsThisMonth = await Post.countDocuments({ createdAt: { $gte: lastMonth } });
    const newCommentsThisWeek = await Comment.countDocuments({ createdAt: { $gte: lastWeek } });

    // Calculate growth percentages
    const userGrowth = totalUsers > 0 ? ((newUsersThisMonth / totalUsers) * 100).toFixed(1) : 0;
    const postGrowth = totalPosts > 0 ? ((newPostsThisMonth / totalPosts) * 100).toFixed(1) : 0;

    // Get total views and likes across all posts
    const viewsAndLikes = await Post.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' }, totalUpvotes: { $sum: '$upvoteCount' } } }
    ]);

    // Recent posts with full details
    const recentPosts = await Post.find()
      .sort('-createdAt')
      .limit(10)
      .populate('author', 'name avatar')
      .select('title status category createdAt upvoteCount commentCount views');

    // Top performing posts
    const topPosts = await Post.find({ status: 'published' })
      .sort('-views -upvoteCount')
      .limit(5)
      .populate('author', 'name avatar')
      .select('title views upvoteCount commentCount createdAt');

    // Category distribution
    const categoryStats = await Post.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 }, totalViews: { $sum: '$views' } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // User growth over last 6 months
    const userGrowthData = await getUserGrowthData();

    // Recent activity (recent comments and posts)
    const recentComments = await Comment.find()
      .sort('-createdAt')
      .limit(10)
      .populate('author', 'name avatar')
      .populate('post', 'title')
      .select('content createdAt');

    // Active authors (with most posts this month)
    const activeAuthors = await Post.aggregate([
      { $match: { createdAt: { $gte: lastMonth } } },
      { $group: { _id: '$author', postCount: { $sum: 1 } } },
      { $sort: { postCount: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'authorDetails' } },
      { $unwind: '$authorDetails' },
      { $project: { name: '$authorDetails.name', avatar: '$authorDetails.avatar', postCount: 1 } }
    ]);

    res.json({
      totalUsers,
      totalAuthors,
      totalReaders,
      totalPosts,
      publishedPosts,
      pendingPosts,
      draftPosts,
      totalComments,
      totalViews: viewsAndLikes[0]?.totalViews || 0,
      totalUpvotes: viewsAndLikes[0]?.totalUpvotes || 0,
      userGrowth: parseFloat(userGrowth),
      postGrowth: parseFloat(postGrowth),
      newUsersThisMonth,
      newPostsThisMonth,
      newCommentsThisWeek,
      recentPosts,
      topPosts,
      categoryStats,
      userGrowthData,
      recentComments,
      activeAuthors
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to get user growth data over time
async function getUserGrowthData() {
  const months = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    
    const users = await User.countDocuments({
      createdAt: { $gte: monthStart, $lt: monthEnd }
    });
    
    const posts = await Post.countDocuments({
      createdAt: { $gte: monthStart, $lt: monthEnd }
    });
    
    months.push({
      month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
      users,
      posts
    });
  }
  
  return months;
}
