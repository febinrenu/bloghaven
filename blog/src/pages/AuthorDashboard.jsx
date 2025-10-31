import { useState, useEffect } from 'react';
import { dashboardService, postService } from '../api/services';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiFileText, FiEye, FiThumbsUp, FiMessageSquare, FiUsers, 
  FiEdit3, FiClock, FiCheckCircle, FiTrendingUp, FiBarChart, 
  FiPlusCircle, FiFeather, FiRefreshCw, FiTrash2, FiZap,
  FiCalendar, FiActivity, FiAward
} from 'react-icons/fi';
import FloatingElements from '../components/animations/FloatingElements';
import ShootingStars from '../components/animations/ShootingStars';
import './AuthorDashboard.css';

const AuthorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getAuthorDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await postService.deletePost(postId);
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const { overview, myPosts, bestPost, recentComments, followers, engagementOverTime } = dashboardData || {};

  return (
    <div className="author-dashboard">
      <FloatingElements count={10} />
      <ShootingStars count={3} />
      
      <div className="container">
        <div className="dashboard-header">
          <div className="header-icon-wrapper">
            <FiFeather className="main-header-icon" />
          </div>
          <div className="header-content">
            <div className="header-text">
              <h1>Author Dashboard</h1>
              <p>Track your content performance and engagement</p>
            </div>
            <div className="header-actions">
              <button 
                className={`header-btn ${refreshing ? 'refreshing' : ''}`}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <FiRefreshCw /> {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button className="btn-create" onClick={() => navigate('/create-post')}>
                <FiPlusCircle /> Create Post
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FiBarChart /> <span>Overview</span>
          </button>
          <button
            className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <FiFileText /> <span>My Posts</span>
            {myPosts?.length > 0 && (
              <span className="tab-count">{myPosts.length}</span>
            )}
          </button>
          <button
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <FiTrendingUp /> <span>Analytics</span>
          </button>
          <button
            className={`tab ${activeTab === 'audience' ? 'active' : ''}`}
            onClick={() => setActiveTab('audience')}
          >
            <FiUsers /> <span>Audience</span>
            {followers?.length > 0 && (
              <span className="tab-count">{followers.length}</span>
            )}
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="dashboard-content">
            {/* Stats Cards Grid */}
            <div className="stats-grid">
              <div className="stat-card stat-primary">
                <div className="stat-icon">
                  <FiFileText />
                </div>
                <div className="stat-info">
                  <h3>{overview?.totalPosts || 0}</h3>
                  <p>Total Posts</p>
                  <div className="stat-breakdown">
                    <span className="stat-detail success">
                      <FiCheckCircle /> {overview?.publishedPosts || 0} published
                    </span>
                    <span className="stat-detail pending">
                      <FiClock /> {overview?.pendingPosts || 0} pending
                    </span>
                  </div>
                </div>
              </div>

              <div className="stat-card stat-views">
                <div className="stat-icon">
                  <FiEye />
                </div>
                <div className="stat-info">
                  <h3>{overview?.totalViews?.toLocaleString() || 0}</h3>
                  <p>Total Views</p>
                  <div className="stat-detail">
                    Avg: {overview?.avgViews || 0} per post
                  </div>
                </div>
              </div>

              <div className="stat-card stat-likes">
                <div className="stat-icon">
                  <FiThumbsUp />
                </div>
                <div className="stat-info">
                  <h3>{overview?.totalUpvotes || 0}</h3>
                  <p>Total Likes</p>
                  <div className="stat-detail">
                    Avg: {overview?.avgUpvotes || 0} per post
                  </div>
                </div>
              </div>

              <div className="stat-card stat-comments">
                <div className="stat-icon">
                  <FiMessageSquare />
                </div>
                <div className="stat-info">
                  <h3>{overview?.totalComments || 0}</h3>
                  <p>Comments</p>
                  <div className="stat-detail">
                    Community engagement
                  </div>
                </div>
              </div>

              <div className="stat-card stat-followers">
                <div className="stat-icon">
                  <FiUsers />
                </div>
                <div className="stat-info">
                  <h3>{overview?.totalFollowers || 0}</h3>
                  <p>Followers</p>
                  <div className="stat-detail">
                    Growing audience
                  </div>
                </div>
              </div>

              <div className="stat-card stat-drafts">
                <div className="stat-icon">
                  <FiEdit3 />
                </div>
                <div className="stat-info">
                  <h3>{overview?.draftPosts || 0}</h3>
                  <p>Drafts</p>
                  <div className="stat-detail">
                    Ready to publish
                  </div>
                </div>
              </div>
            </div>

            {/* Best Performing Post */}
            {bestPost && (
              <div className="glass-card highlight-card">
                <div className="card-header">
                  <h2><FiAward /> Best Performing Post</h2>
                  <Link to={`/posts/${bestPost._id}`} className="view-link">
                    View Post <FiEye />
                  </Link>
                </div>
                <div className="best-post-container">
                  {bestPost.coverImage && (
                    <div className="best-post-image">
                      <img src={bestPost.coverImage} alt={bestPost.title} />
                    </div>
                  )}
                  <div className="best-post-details">
                    <h3>{bestPost.title}</h3>
                    <div className="best-post-stats">
                      <div className="stat-pill views">
                        <FiEye />
                        <span>{bestPost.views?.toLocaleString()} views</span>
                      </div>
                      <div className="stat-pill likes">
                        <FiThumbsUp />
                        <span>{bestPost.upvoteCount} likes</span>
                      </div>
                      <div className="stat-pill comments">
                        <FiMessageSquare />
                        <span>{bestPost.commentCount} comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="dashboard-grid">
              {/* Recent Comments */}
              <div className="glass-card">
                <div className="card-header">
                  <h2><FiMessageSquare /> Recent Comments</h2>
                  <span className="comment-count">{recentComments?.length || 0} new</span>
                </div>
                <div className="comments-list">
                  {recentComments?.length === 0 ? (
                    <div className="empty-state-small">
                      <FiMessageSquare />
                      <p>No comments yet</p>
                    </div>
                  ) : (
                    recentComments?.slice(0, 5).map((comment) => (
                      <div key={comment._id} className="comment-item">
                        <img src={comment.author?.avatar} alt={comment.author?.name} />
                        <div className="comment-content">
                          <div className="comment-header">
                            <strong>{comment.author?.name}</strong>
                            <span className="comment-time">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Link to={`/posts/${comment.post?._id}`} className="comment-post">
                            {comment.post?.title}
                          </Link>
                          <p className="comment-text">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card">
                <div className="card-header">
                  <h2><FiZap /> Quick Actions</h2>
                </div>
                <div className="quick-actions">
                  <button className="action-card" onClick={() => navigate('/create-post')}>
                    <FiPlusCircle />
                    <div>
                      <span className="action-title">Create New Post</span>
                      <span className="action-desc">Start writing</span>
                    </div>
                  </button>
                  <Link to="/my-posts" className="action-card">
                    <FiEdit3 />
                    <div>
                      <span className="action-title">Manage Posts</span>
                      <span className="action-desc">{overview?.totalPosts || 0} posts</span>
                    </div>
                  </Link>
                  <Link to="/notifications" className="action-card">
                    <FiActivity />
                    <div>
                      <span className="action-title">Activity</span>
                      <span className="action-desc">View notifications</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MY POSTS TAB */}
        {activeTab === 'posts' && (
          <div className="dashboard-content">
            <div className="posts-header">
              <h2><FiFileText /> All My Posts ({myPosts?.length || 0})</h2>
              <button className="btn-create-small" onClick={() => navigate('/create-post')}>
                <FiPlusCircle /> New Post
              </button>
            </div>

            <div className="posts-grid">
              {myPosts?.map((post) => (
                <div key={post._id} className="post-card">
                  {post.coverImage && (
                    <div className="post-card-image">
                      <img src={post.coverImage} alt={post.title} />
                      <span className={`status-badge ${post.status}`}>
                        {post.status === 'published' && <FiCheckCircle />}
                        {post.status === 'pending' && <FiClock />}
                        {post.status === 'draft' && <FiEdit3 />}
                        {post.status}
                      </span>
                    </div>
                  )}
                  <div className="post-card-content">
                    <h3>{post.title}</h3>
                    <div className="post-card-meta">
                      <span className="category-tag">{post.category}</span>
                      <span className="date-text">
                        <FiCalendar /> {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="post-card-stats">
                      <div className="stat-item">
                        <FiEye />
                        <span>{post.views?.toLocaleString() || 0}</span>
                      </div>
                      <div className="stat-item">
                        <FiThumbsUp />
                        <span>{post.upvoteCount || 0}</span>
                      </div>
                      <div className="stat-item">
                        <FiMessageSquare />
                        <span>{post.commentCount || 0}</span>
                      </div>
                    </div>
                    <div className="post-card-actions">
                      <Link to={`/posts/${post._id}`} className="btn-post-action view">
                        <FiEye /> View
                      </Link>
                      {post.status !== 'published' && (
                        <Link to={`/edit-post/${post._id}`} className="btn-post-action edit">
                          <FiEdit3 /> Edit
                        </Link>
                      )}
                      <button
                        className="btn-post-action delete"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(!myPosts || myPosts.length === 0) && (
              <div className="empty-state">
                <FiFileText className="empty-icon" />
                <h3>No Posts Yet</h3>
                <p>Start creating amazing content for your audience</p>
                <button className="btn-create" onClick={() => navigate('/create-post')}>
                  <FiPlusCircle /> Create Your First Post
                </button>
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="dashboard-content">
            <div className="analytics-header">
              <h2><FiTrendingUp /> Engagement Analytics</h2>
              <p>Track your content performance over time</p>
            </div>

            <div className="glass-card">
              <div className="card-header">
                <h3><FiBarChart /> Engagement Over Time (Last 30 Days)</h3>
              </div>
              <div className="engagement-chart">
                <div className="chart-container">
                  {engagementOverTime?.map((day, index) => {
                    const maxValue = Math.max(
                      ...engagementOverTime.map(d => Math.max(d.views, d.upvotes, d.comments)),
                      1
                    );
                    return (
                      <div key={index} className="chart-day">
                        <div className="chart-bars">
                          <div
                            className="bar views"
                            style={{
                              height: `${(day.views / maxValue) * 180}px`
                            }}
                            title={`${day.views} views`}
                          >
                            {day.views > 0 && <span className="bar-value">{day.views}</span>}
                          </div>
                          <div
                            className="bar upvotes"
                            style={{
                              height: `${(day.upvotes / maxValue) * 180}px`
                            }}
                            title={`${day.upvotes} upvotes`}
                          >
                            {day.upvotes > 0 && <span className="bar-value">{day.upvotes}</span>}
                          </div>
                          <div
                            className="bar comments"
                            style={{
                              height: `${(day.comments / maxValue) * 180}px`
                            }}
                            title={`${day.comments} comments`}
                          >
                            {day.comments > 0 && <span className="bar-value">{day.comments}</span>}
                          </div>
                        </div>
                        <div className="chart-label">{day.date}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="chart-legend">
                  <span className="legend-item">
                    <span className="legend-dot views"></span> Views
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot upvotes"></span> Likes
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot comments"></span> Comments
                  </span>
                </div>
              </div>
            </div>

            <div className="analytics-summary-grid">
              <div className="glass-card">
                <div className="card-header">
                  <h3><FiActivity /> Performance Metrics</h3>
                </div>
                <div className="metrics-list">
                  <div className="metric-row">
                    <span className="metric-label">Average Views per Post</span>
                    <span className="metric-value">{overview?.avgViews || 0}</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Average Likes per Post</span>
                    <span className="metric-value">{overview?.avgUpvotes || 0}</span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Engagement Rate</span>
                    <span className="metric-value">
                      {overview?.totalViews > 0
                        ? ((overview.totalUpvotes / overview.totalViews) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Total Engagement</span>
                    <span className="metric-value">
                      {(overview?.totalViews || 0) + (overview?.totalUpvotes || 0) + (overview?.totalComments || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass-card">
                <div className="card-header">
                  <h3><FiTrendingUp /> Top Posts</h3>
                </div>
                <div className="top-posts-list">
                  {myPosts
                    ?.filter(p => p.status === 'published')
                    .sort((a, b) => (b.views + b.upvoteCount * 5) - (a.views + a.upvoteCount * 5))
                    .slice(0, 5)
                    .map((post, index) => (
                      <div key={post._id} className="top-post-item">
                        <span className="post-rank">#{index + 1}</span>
                        <div className="top-post-info">
                          <Link to={`/posts/${post._id}`}>
                            <h4>{post.title}</h4>
                          </Link>
                          <div className="top-post-stats">
                            <span><FiEye /> {post.views}</span>
                            <span><FiThumbsUp /> {post.upvoteCount}</span>
                            <span><FiMessageSquare /> {post.commentCount}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AUDIENCE TAB */}
        {activeTab === 'audience' && (
          <div className="dashboard-content">
            <div className="audience-header">
              <h2><FiUsers /> Your Followers ({followers?.length || 0})</h2>
              <p>People who follow your content</p>
            </div>

            {followers?.length === 0 ? (
              <div className="empty-state">
                <FiUsers className="empty-icon" />
                <h3>No Followers Yet</h3>
                <p>Keep creating great content to grow your audience!</p>
              </div>
            ) : (
              <div className="followers-grid">
                {followers?.map((follower) => (
                  <div key={follower._id} className="follower-card">
                    <img src={follower.avatar} alt={follower.name} />
                    <div className="follower-info">
                      <h4>{follower.name}</h4>
                      <p>{follower.email}</p>
                      <small>
                        <FiCalendar /> Following since {new Date(follower.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorDashboard;
