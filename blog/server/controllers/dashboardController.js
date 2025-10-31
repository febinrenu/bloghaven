import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';

// Admin Dashboard - Full Analytics
export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalPosts,
      totalComments,
      pendingPosts,
      publishedPosts,
      totalAuthors,
      totalReaders,
      recentUsers,
      topPosts,
      recentActivity,
      monthlyStats
    ] = await Promise.all([
      // Total counts
      User.countDocuments(),
      Post.countDocuments(),
      Comment.countDocuments(),
      Post.countDocuments({ status: 'pending' }),
      Post.countDocuments({ status: 'published' }),
      User.countDocuments({ role: 'author' }),
      User.countDocuments({ role: 'reader' }),
      
      // Recent users (last 10)
      User.find()
        .select('name email role createdAt avatar')
        .sort({ createdAt: -1 })
        .limit(10),
      
      // Top posts by engagement
      Post.find({ status: 'published' })
        .select('title author upvoteCount commentCount views createdAt')
        .populate('author', 'name avatar')
        .sort({ upvoteCount: -1, views: -1 })
        .limit(10),
      
      // Recent activity (comments)
      Comment.find()
        .select('content author post createdAt')
        .populate('author', 'name avatar')
        .populate('post', 'title')
        .sort({ createdAt: -1 })
        .limit(10),
      
      // Monthly statistics for charts
      getMonthlyStats()
    ]);

    // Calculate growth rates
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalPosts,
          totalComments,
          pendingPosts,
          publishedPosts,
          totalAuthors,
          totalReaders,
          userGrowth: lastMonthUsers,
          postGrowth: lastMonthPosts
        },
        recentUsers,
        topPosts,
        recentActivity,
        monthlyStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin dashboard',
      error: error.message
    });
  }
};

// Author Dashboard - Personal Analytics
export const getAuthorDashboard = async (req, res) => {
  try {
    const authorId = req.user._id;

    const [
      myPosts,
      totalViews,
      totalUpvotes,
      totalComments,
      followers,
      recentComments,
      postStats,
      engagementOverTime
    ] = await Promise.all([
      // All author's posts
      Post.find({ author: authorId })
        .select('title status upvoteCount commentCount views publishedAt createdAt coverImage category')
        .sort({ createdAt: -1 }),
      
      // Total views across all posts
      Post.aggregate([
        { $match: { author: authorId } },
        { $group: { _id: null, total: { $sum: '$views' } } }
      ]),
      
      // Total upvotes
      Post.aggregate([
        { $match: { author: authorId } },
        { $group: { _id: null, total: { $sum: '$upvoteCount' } } }
      ]),
      
      // Total comments on author's posts
      Comment.countDocuments({
        post: { $in: await Post.find({ author: authorId }).distinct('_id') }
      }),
      
      // Followers list
      User.findById(authorId)
        .select('followers')
        .populate('followers', 'name avatar email createdAt'),
      
      // Recent comments on author's posts
      Comment.find({
        post: { $in: await Post.find({ author: authorId }).distinct('_id') }
      })
        .populate('author', 'name avatar')
        .populate('post', 'title')
        .sort({ createdAt: -1 })
        .limit(10),
      
      // Post statistics by status
      Post.aggregate([
        { $match: { author: authorId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Engagement over time (last 30 days)
      getAuthorEngagementOverTime(authorId)
    ]);

    // Calculate averages
    const publishedPosts = myPosts.filter(post => post.status === 'published');
    const avgViews = publishedPosts.length > 0
      ? Math.round(publishedPosts.reduce((sum, post) => sum + post.views, 0) / publishedPosts.length)
      : 0;
    const avgUpvotes = publishedPosts.length > 0
      ? Math.round(publishedPosts.reduce((sum, post) => sum + post.upvoteCount, 0) / publishedPosts.length)
      : 0;

    // Best performing post
    const bestPost = publishedPosts.length > 0
      ? publishedPosts.reduce((best, post) => 
          (post.views + post.upvoteCount * 10) > (best.views + best.upvoteCount * 10) ? post : best
        )
      : null;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalPosts: myPosts.length,
          publishedPosts: publishedPosts.length,
          draftPosts: myPosts.filter(p => p.status === 'draft').length,
          pendingPosts: myPosts.filter(p => p.status === 'pending').length,
          totalViews: totalViews[0]?.total || 0,
          totalUpvotes: totalUpvotes[0]?.total || 0,
          totalComments,
          totalFollowers: followers?.followers?.length || 0,
          avgViews,
          avgUpvotes
        },
        myPosts,
        bestPost,
        recentComments,
        followers: followers?.followers || [],
        postStats,
        engagementOverTime
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching author dashboard',
      error: error.message
    });
  }
};

// Reader Dashboard - Personalized Feed
export const getReaderDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      user,
      followedAuthors,
      upvotedPosts,
      myComments,
      recommendedPosts,
      trendingPosts,
      notifications,
      readingStats
    ] = await Promise.all([
      // User details with following
      User.findById(userId)
        .select('name email avatar following followers')
        .populate('following', 'name avatar bio'),
      
      // Posts from followed authors
      Post.find({
        author: { $in: await User.findById(userId).then(u => u.following) },
        status: 'published'
      })
        .populate('author', 'name avatar')
        .select('title excerpt coverImage category createdAt upvoteCount commentCount views')
        .sort({ createdAt: -1 })
        .limit(10),
      
      // Posts user has upvoted
      Post.find({ upvotes: userId, status: 'published' })
        .populate('author', 'name avatar')
        .select('title excerpt coverImage category createdAt upvoteCount commentCount')
        .sort({ createdAt: -1 })
        .limit(10),
      
      // User's comments
      Comment.find({ author: userId })
        .populate('post', 'title author')
        .populate({
          path: 'post',
          populate: { path: 'author', select: 'name avatar' }
        })
        .sort({ createdAt: -1 })
        .limit(10),
      
      // Recommended posts (popular posts user hasn't upvoted)
      Post.find({
        upvotes: { $ne: userId },
        status: 'published'
      })
        .populate('author', 'name avatar')
        .select('title excerpt coverImage category createdAt upvoteCount commentCount views')
        .sort({ upvoteCount: -1, views: -1 })
        .limit(10),
      
      // Trending posts (most engagement in last 7 days)
      Post.find({
        status: 'published',
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
        .populate('author', 'name avatar')
        .select('title excerpt coverImage category createdAt upvoteCount commentCount views')
        .sort({ upvoteCount: -1, commentCount: -1 })
        .limit(5),
      
      // User notifications
      Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('sender', 'name avatar')
        .populate('post', 'title')
        .populate('comment', 'content'),
      
      // Reading statistics
      getReaderStats(userId)
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          followingCount: user.following?.length || 0,
          followersCount: user.followers?.length || 0,
          upvotedCount: upvotedPosts.length,
          commentsCount: myComments.length,
          unreadNotifications: notifications.filter(n => !n.isRead).length
        },
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          following: user.following
        },
        followedAuthors,
        upvotedPosts,
        myComments,
        recommendedPosts,
        trendingPosts,
        notifications,
        readingStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reader dashboard',
      error: error.message
    });
  }
};

// Helper function: Get monthly statistics
async function getMonthlyStats() {
  const months = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    
    const [users, posts, comments] = await Promise.all([
      User.countDocuments({
        createdAt: { $gte: date, $lt: nextMonth }
      }),
      Post.countDocuments({
        createdAt: { $gte: date, $lt: nextMonth }
      }),
      Comment.countDocuments({
        createdAt: { $gte: date, $lt: nextMonth }
      })
    ]);
    
    months.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      users,
      posts,
      comments
    });
  }
  
  return months;
}

// Helper function: Get author engagement over time
async function getAuthorEngagementOverTime(authorId) {
  const days = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
    
    const posts = await Post.find({
      author: authorId,
      createdAt: { $gte: date, $lt: nextDay }
    });
    
    const postIds = posts.map(p => p._id);
    
    const [comments, views, upvotes] = await Promise.all([
      Comment.countDocuments({
        post: { $in: postIds },
        createdAt: { $gte: date, $lt: nextDay }
      }),
      posts.reduce((sum, post) => sum + post.views, 0),
      posts.reduce((sum, post) => sum + post.upvoteCount, 0)
    ]);
    
    days.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      comments,
      views,
      upvotes
    });
  }
  
  return days;
}

// Helper function: Get reader statistics
async function getReaderStats(userId) {
  const upvotedPosts = await Post.find({ upvotes: userId });
  const comments = await Comment.find({ author: userId });
  
  // Get reading preferences (most read categories)
  const categories = upvotedPosts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {});
  
  const topCategories = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));
  
  return {
    totalUpvotes: upvotedPosts.length,
    totalComments: comments.length,
    topCategories,
    engagementScore: upvotedPosts.length + comments.length * 2
  };
}
