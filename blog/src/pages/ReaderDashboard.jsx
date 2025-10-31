import { useState, useEffect } from 'react';
import { dashboardService } from '../api/services';
import { Link } from 'react-router-dom';
import { 
  FiHeart, FiMessageSquare, FiUsers, FiUserPlus, FiBell, 
  FiTrendingUp, FiBookOpen, FiStar, FiActivity, FiBook
} from 'react-icons/fi';
import FloatingElements from '../components/animations/FloatingElements';
import ShootingStars from '../components/animations/ShootingStars';
import { getUserAvatar } from '../utils/avatarUtils';
import './ReaderDashboard.css';

const ReaderDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getReaderDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
        <p>Loading your personalized feed...</p>
      </div>
    );
  }

  const { 
    overview, user, followedAuthors, upvotedPosts, myComments, 
    recommendedPosts, trendingPosts, notifications, readingStats 
  } = dashboardData || {};

  return (
    <div className="reader-dashboard">
      <FloatingElements count={10} />
      <ShootingStars count={3} />
      
      <div className="container">
        <div className="dashboard-header">
          <div className="header-icon-wrapper">
            <FiBook className="main-header-icon" />
          </div>
          <div className="user-welcome">
            <img src={getUserAvatar(user)} alt={user?.name} />
            <div>
              <h1>Welcome back, {user?.name}!</h1>
              <p>Discover and engage with amazing content</p>
            </div>
          </div>
        </div>

      {/* Stats Overview */}
      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-icon following">
            <FiUsers />
          </div>
          <div>
            <h3>{overview?.followingCount || 0}</h3>
            <p>Following</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon followers">
            <FiUserPlus />
          </div>
          <div>
            <h3>{overview?.followersCount || 0}</h3>
            <p>Followers</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon upvotes">
            <FiHeart />
          </div>
          <div>
            <h3>{overview?.upvotedCount || 0}</h3>
            <p>Upvoted Posts</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon comments">
            <FiMessageSquare />
          </div>
          <div>
            <h3>{overview?.commentsCount || 0}</h3>
            <p>Comments</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon notifications">
            <FiBell />
          </div>
          <div>
            <h3>{overview?.unreadNotifications || 0}</h3>
            <p>New Notifications</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => setActiveTab('feed')}
        >
          <FiBookOpen /> Your Feed
        </button>
        <button
          className={`tab ${activeTab === 'trending' ? 'active' : ''}`}
          onClick={() => setActiveTab('trending')}
        >
          <FiTrendingUp /> Trending
        </button>
        <button
          className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <FiActivity /> Your Activity
        </button>
        <button
          className={`tab ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          <FiUsers /> Following
        </button>
        <button
          className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <FiBell /> Notifications
          {overview?.unreadNotifications > 0 && (
            <span className="badge">{overview.unreadNotifications}</span>
          )}
        </button>
      </div>

      {/* Feed Tab */}
      {activeTab === 'feed' && (
        <div className="dashboard-content">
          <div className="two-column-layout">
            {/* Main Feed */}
            <div className="main-column">
              <div className="section-card">
                <h2><FiBookOpen /> Posts from Authors You Follow</h2>
                {followedAuthors?.length === 0 ? (
                  <div className="empty-state">
                    <FiUsers size={48} />
                    <p>You're not following any authors yet.</p>
                    <Link to="/" className="btn-primary">Discover Authors</Link>
                  </div>
                ) : (
                  <div className="posts-feed">
                    {followedAuthors?.map((post) => (
                      <div key={post._id} className="feed-post">
                        <div className="post-author">
                          <img src={post.author?.avatar} alt={post.author?.name} />
                          <div>
                            <h4>{post.author?.name}</h4>
                            <small>{new Date(post.createdAt).toLocaleDateString()}</small>
                          </div>
                        </div>
                        {post.coverImage && (
                          <img src={post.coverImage} alt={post.title} className="post-image" />
                        )}
                        <h3>{post.title}</h3>
                        <p>{post.excerpt}</p>
                        <div className="post-footer">
                          <span className="category-badge">{post.category}</span>
                          <div className="post-stats">
                            <span><FiHeart /> {post.upvoteCount}</span>
                            <span><FiMessageSquare /> {post.commentCount}</span>
                          </div>
                        </div>
                        <Link to={`/posts/${post._id}`} className="btn-read">
                          Read More
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="sidebar-column">
              <div className="section-card">
                <h3><FiStar /> Recommended for You</h3>
                <div className="recommended-list">
                  {recommendedPosts?.slice(0, 5).map((post) => (
                    <Link to={`/posts/${post._id}`} key={post._id} className="recommended-item">
                      {post.coverImage && (
                        <img src={post.coverImage} alt={post.title} />
                      )}
                      <div>
                        <h4>{post.title}</h4>
                        <p>By {post.author?.name}</p>
                        <div className="mini-stats">
                          <span><FiHeart /> {post.upvoteCount}</span>
                          <span><FiMessageSquare /> {post.commentCount}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {readingStats && (
                <div className="section-card">
                  <h3><FiActivity /> Your Reading Stats</h3>
                  <div className="reading-stats">
                    <div className="stat-row">
                      <span>Engagement Score</span>
                      <strong>{readingStats.engagementScore}</strong>
                    </div>
                    <div className="stat-row">
                      <span>Posts Upvoted</span>
                      <strong>{readingStats.totalUpvotes}</strong>
                    </div>
                    <div className="stat-row">
                      <span>Comments Made</span>
                      <strong>{readingStats.totalComments}</strong>
                    </div>
                  </div>
                  {readingStats.topCategories?.length > 0 && (
                    <>
                      <h4>Your Favorite Topics</h4>
                      <div className="category-tags">
                        {readingStats.topCategories.map((cat) => (
                          <span key={cat.category} className="category-tag">
                            {cat.category} ({cat.count})
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trending Tab */}
      {activeTab === 'trending' && (
        <div className="dashboard-content">
          <div className="section-card">
            <h2><FiTrendingUp /> Trending This Week</h2>
            <div className="trending-grid">
              {trendingPosts?.map((post) => (
                <div key={post._id} className="trending-post">
                  {post.coverImage && (
                    <img src={post.coverImage} alt={post.title} />
                  )}
                  <div className="trending-post-content">
                    <span className="trending-badge">🔥 Trending</span>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="post-author-mini">
                      <img src={post.author?.avatar} alt={post.author?.name} />
                      <span>{post.author?.name}</span>
                    </div>
                    <div className="trending-stats">
                      <span><FiHeart /> {post.upvoteCount}</span>
                      <span><FiMessageSquare /> {post.commentCount}</span>
                      <span>👁️ {post.views}</span>
                    </div>
                    <Link to={`/posts/${post._id}`} className="btn-read">
                      Read Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="dashboard-content">
          <div className="two-column-layout">
            <div className="section-card">
              <h2><FiHeart /> Posts You've Upvoted ({upvotedPosts?.length || 0})</h2>
              <div className="activity-list">
                {upvotedPosts?.map((post) => (
                  <div key={post._id} className="activity-item">
                    {post.coverImage && (
                      <img src={post.coverImage} alt={post.title} />
                    )}
                    <div className="activity-details">
                      <h4>{post.title}</h4>
                      <p>By {post.author?.name}</p>
                      <div className="activity-stats">
                        <span><FiHeart /> {post.upvoteCount}</span>
                        <span><FiMessageSquare /> {post.commentCount}</span>
                      </div>
                      <Link to={`/posts/${post._id}`}>View Post</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <h2><FiMessageSquare /> Your Comments ({myComments?.length || 0})</h2>
              <div className="comments-activity">
                {myComments?.map((comment) => (
                  <div key={comment._id} className="comment-activity-item">
                    <div className="comment-content">
                      <p className="comment-text">{comment.content}</p>
                      <div className="comment-meta">
                        <span>On: <Link to={`/posts/${comment.post?._id}`}>
                          {comment.post?.title}
                        </Link></span>
                        <small>{new Date(comment.createdAt).toLocaleString()}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Following Tab */}
      {activeTab === 'following' && (
        <div className="dashboard-content">
          <div className="section-card">
            <h2><FiUsers /> Authors You Follow ({user?.following?.length || 0})</h2>
            {user?.following?.length === 0 ? (
              <div className="empty-state">
                <FiUsers size={48} />
                <p>You're not following any authors yet.</p>
                <Link to="/" className="btn-primary">Discover Authors</Link>
              </div>
            ) : (
              <div className="authors-grid">
                {user?.following?.map((author) => (
                  <div key={author._id} className="author-card">
                    <img src={author.avatar} alt={author.name} />
                    <h4>{author.name}</h4>
                    <p>{author.bio}</p>
                    <Link to={`/profile/${author._id}`} className="btn-view-profile">
                      View Profile
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="dashboard-content">
          <div className="section-card">
            <h2><FiBell /> Notifications</h2>
            {notifications?.length === 0 ? (
              <p className="no-data">No notifications</p>
            ) : (
              <div className="notifications-list">
                {notifications?.map((notification) => (
                  <div
                    key={notification._id}
                    className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                  >
                    <img src={notification.sender?.avatar} alt={notification.sender?.name} />
                    <div className="notification-content">
                      <p>{notification.message}</p>
                      <small>{new Date(notification.createdAt).toLocaleString()}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ReaderDashboard;
