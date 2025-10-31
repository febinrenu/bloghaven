import { useState, useEffect } from 'react';
import { adminService } from '../api/services';
import { Link } from 'react-router-dom';
import { 
  FiUsers, FiFileText, FiCheckCircle, FiClock, FiMessageSquare, 
  FiEdit3, FiTrendingUp, FiActivity, FiEye, FiHeart, FiAlertCircle,
  FiBarChart2, FiPieChart, FiShield, FiSettings, FiZap, FiRefreshCw,
  FiTrash2, FiUserX, FiUserCheck, FiMoreVertical, FiSearch, FiFilter
} from 'react-icons/fi';
import FloatingElements from '../components/animations/FloatingElements';
import ShootingStars from '../components/animations/ShootingStars';
import './AdminDashboard.css?v=2.2';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Log design version to confirm new design is loading
    console.log('%c✅ Admin Dashboard v2.1 - TAGS AS TEXT VERSION 🎨', 
      'background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 8px;');
    console.log('%cPost cards should show: "Category • Pending Review" as simple text', 
      'color: #667eea; font-size: 14px; font-weight: bold;');
    
    fetchStats();
    fetchPendingPosts();
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingPosts = async () => {
    try {
      const data = await adminService.getPendingPosts({ limit: 10 });
      setPendingPosts(data.posts);
    } catch (error) {
      console.error('Error fetching pending posts:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    await fetchPendingPosts();
    if (activeTab === 'users') {
      await fetchUsers();
    }
    setRefreshing(false);
  };

  const handleApprove = async (postId) => {
    try {
      await adminService.approvePost(postId);
      fetchStats();
      fetchPendingPosts();
    } catch (error) {
      console.error('Error approving post:', error);
    }
  };

  const handleReject = async (postId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await adminService.rejectPost(postId, reason);
      fetchStats();
      fetchPendingPosts();
    } catch (error) {
      console.error('Error rejecting post:', error);
    }
  };

  const handleBanUser = async (userId) => {
    if (!window.confirm('Are you sure you want to ban this user?')) return;
    
    try {
      await adminService.banUser(userId);
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error banning user:', error);
      alert(error.response?.data?.message || 'Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await adminService.unbanUser(userId);
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error unbanning user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure? This will permanently delete the user and all their content.')) return;
    
    try {
      await adminService.deleteUser(userId);
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post permanently?')) return;
    
    try {
      await adminService.deletePost(postId);
      fetchPendingPosts();
      fetchStats();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
  <FloatingElements count={15} />
  <ShootingStars count={5} />
      
      <div className="container">
        <div className="dashboard-header">
          <div className="header-icon-wrapper">
            <FiShield className="main-header-icon" />
          </div>
          <div className="header-content">
            <div className="header-text">
              <h1>🚀 Admin Command Center</h1>
              <p>Complete platform analytics and management</p>
            </div>
            <div className="header-actions">
              <button 
                className={`header-btn ${refreshing ? 'refreshing' : ''}`}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <FiRefreshCw /> {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FiBarChart2 /> <span>Overview</span>
          </button>
          <button
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <FiTrendingUp /> <span>Analytics</span>
          </button>
          <button
            className={`tab ${activeTab === 'moderation' ? 'active' : ''}`}
            onClick={() => setActiveTab('moderation')}
          >
            <FiAlertCircle /> <span>Moderation</span>
            {pendingPosts.length > 0 && (
              <span className="tab-badge">{pendingPosts.length}</span>
            )}
          </button>
          <button
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FiUsers /> <span>Users</span>
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card stat-primary">
                <div className="stat-header">
                  <div className="stat-icon">
                    <FiUsers />
                  </div>
                  <div className="stat-trend positive">
                    <FiTrendingUp /> +{stats?.userGrowth || 0}%
                  </div>
                </div>
                <div className="stat-body">
                  <h3>{stats?.totalUsers || 0}</h3>
                  <p>Total Users</p>
                  <div className="stat-detail">+{stats?.newUsersThisMonth || 0} this month</div>
                </div>
              </div>

              <div className="stat-card stat-success">
                <div className="stat-header">
                  <div className="stat-icon">
                    <FiFileText />
                  </div>
                  <div className="stat-trend positive">
                    <FiTrendingUp /> +{stats?.postGrowth || 0}%
                  </div>
                </div>
                <div className="stat-body">
                  <h3>{stats?.totalPosts || 0}</h3>
                  <p>Total Posts</p>
                  <div className="stat-detail">{stats?.publishedPosts || 0} published</div>
                </div>
              </div>

              <div className="stat-card stat-warning">
                <div className="stat-header">
                  <div className="stat-icon">
                    <FiClock />
                  </div>
                  {stats?.pendingPosts > 0 && (
                    <div className="stat-badge">{stats?.pendingPosts}</div>
                  )}
                </div>
                <div className="stat-body">
                  <h3>{stats?.pendingPosts || 0}</h3>
                  <p>Pending Review</p>
                  <div className="stat-detail">Needs attention</div>
                </div>
              </div>

              <div className="stat-card stat-info">
                <div className="stat-header">
                  <div className="stat-icon">
                    <FiEye />
                  </div>
                </div>
                <div className="stat-body">
                  <h3>{(stats?.totalViews || 0).toLocaleString()}</h3>
                  <p>Total Views</p>
                  <div className="stat-detail">Across all posts</div>
                </div>
              </div>

              <div className="stat-card stat-purple">
                <div className="stat-header">
                  <div className="stat-icon">
                    <FiMessageSquare />
                  </div>
                </div>
                <div className="stat-body">
                  <h3>{stats?.totalComments || 0}</h3>
                  <p>Total Comments</p>
                  <div className="stat-detail">+{stats?.newCommentsThisWeek || 0} this week</div>
                </div>
              </div>

              <div className="stat-card stat-pink">
                <div className="stat-header">
                  <div className="stat-icon">
                    <FiHeart />
                  </div>
                </div>
                <div className="stat-body">
                  <h3>{stats?.totalUpvotes || 0}</h3>
                  <p>Total Likes</p>
                  <div className="stat-detail">Community engagement</div>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="glass-card">
                <div className="card-header">
                  <h2><FiActivity /> Recent Activity</h2>
                  <Link to="/posts" className="view-all-link">View All</Link>
                </div>
                <div className="activity-list">
                  {stats?.recentComments?.slice(0, 5).map((comment, index) => (
                    <div key={index} className="activity-item">
                      <img src={comment.author?.avatar} alt={comment.author?.name} />
                      <div className="activity-content">
                        <p><strong>{comment.author?.name}</strong> commented on "{comment.post?.title}"</p>
                        <span className="activity-time">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card">
                <div className="card-header">
                  <h2><FiZap /> Quick Actions</h2>
                </div>
                <div className="quick-actions">
                  <button className="action-card" onClick={() => setActiveTab('moderation')}>
                    <FiAlertCircle />
                    <span>Review Pending</span>
                    <span className="action-count">{stats?.pendingPosts || 0}</span>
                  </button>
                  <button className="action-card" onClick={() => setActiveTab('users')}>
                    <FiUsers />
                    <span>Manage Users</span>
                    <span className="action-count">{stats?.totalUsers || 0}</span>
                  </button>
                  <Link to="/create-post" className="action-card">
                    <FiEdit3 />
                    <span>Create Post</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="dashboard-content">
            <div className="analytics-header-section">
              <h2><FiTrendingUp /> Platform Analytics</h2>
              <p>Comprehensive insights and performance metrics</p>
            </div>

            <div className="glass-card">
              <div className="card-header">
                <h3><FiBarChart2 /> User & Post Growth (Last 6 Months)</h3>
              </div>
              <div className="chart-container">
                {stats?.userGrowthData?.map((month, index) => (
                  <div key={index} className="chart-bar-group">
                    <div className="chart-bars">
                      <div 
                        className="chart-bar users"
                        style={{ 
                          height: `${Math.min(month.users * 20, 200)}px`
                        }}
                        title={`${month.users} users`}
                      >
                        <span className="bar-value">{month.users}</span>
                      </div>
                      <div 
                        className="chart-bar posts"
                        style={{ 
                          height: `${Math.min(month.posts * 20, 200)}px`
                        }}
                        title={`${month.posts} posts`}
                      >
                        <span className="bar-value">{month.posts}</span>
                      </div>
                    </div>
                    <div className="chart-label">{month.month}</div>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <span className="legend-item"><span className="legend-dot users"></span> Users</span>
                <span className="legend-item"><span className="legend-dot posts"></span> Posts</span>
              </div>
            </div>

            <div className="analytics-grid">
              <div className="glass-card">
                <div className="card-header">
                  <h3><FiPieChart /> Category Distribution</h3>
                </div>
                <div className="category-list">
                  {stats?.categoryStats?.map((cat, index) => (
                    <div key={index} className="category-item">
                      <div className="category-info">
                        <span className="category-name">{cat._id}</span>
                        <span className="category-count">{cat.count} posts</span>
                      </div>
                      <div className="category-bar">
                        <div 
                          className="category-bar-fill"
                          style={{ width: `${(cat.count / stats.totalPosts) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card">
                <div className="card-header">
                  <h3><FiTrendingUp /> Top Performing Posts</h3>
                </div>
                <div className="top-posts-list">
                  {stats?.topPosts?.map((post) => (
                    <div key={post._id} className="top-post-item">
                      <Link to={`/posts/${post._id}`}>
                        <h4>{post.title}</h4>
                      </Link>
                      <div className="post-metrics">
                        <span><FiEye /> {post.views}</span>
                        <span><FiHeart /> {post.upvoteCount}</span>
                        <span><FiMessageSquare /> {post.commentCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card">
              <div className="card-header">
                <h3><FiUsers /> Active Authors</h3>
              </div>
              <div className="authors-grid">
                {stats?.activeAuthors?.map((author, index) => (
                  <div key={index} className="author-card">
                    <img src={author.authorDetails?.avatar || author.avatar} alt={author.authorDetails?.name || author.name} />
                    <h4>{author.authorDetails?.name || author.name}</h4>
                    <p>{author.postCount} posts this month</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODERATION TAB */}
        {activeTab === 'moderation' && (
          <div className="dashboard-content">
            <div className="moderation-header-section">
              <h2><FiAlertCircle /> Content Moderation</h2>
              <div className="moderation-stats">
                <span className="mod-stat pending">
                  <FiClock /> {pendingPosts.length} Pending
                </span>
              </div>
            </div>
            <div className="moderation-grid">
              {pendingPosts.length > 0 ? (
                pendingPosts.map((post) => (
                  <div key={post._id} className="moderation-card">
                    <div className="mod-card-header">
                      <span className="mod-category-text">{post.category}</span>
                      <span className="mod-status-text">• Pending Review</span>
                    </div>
                    {post.coverImage && (
                      <div className="mod-card-image">
                        <img src={post.coverImage} alt={post.title} />
                      </div>
                    )}
                    <div className="mod-card-body">
                      <h3>{post.title}</h3>
                      <div
                        className="mod-excerpt"
                        dangerouslySetInnerHTML={{
                          __html: post.excerpt || post.content?.substring(0, 150) + '...',
                        }}
                      />
                      <div className="mod-meta">
                        <div className="mod-author">
                          <img src={post.author?.avatar} alt={post.author?.name} />
                          <span>{post.author?.name}</span>
                        </div>
                        <div className="mod-date">
                          <FiClock />
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mod-card-footer">
                      <Link to={`/posts/${post._id}`} className="mod-btn mod-btn-view">
                        <FiEye /> Preview
                      </Link>
                      <button
                        onClick={() => handleApprove(post._id)}
                        className="mod-btn mod-btn-approve"
                      >
                        <FiCheckCircle /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(post._id)}
                        className="mod-btn mod-btn-reject"
                      >
                        <FiAlertCircle /> Reject
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="mod-btn mod-btn-delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <FiCheckCircle className="empty-icon" />
                  <h3>All Clear!</h3>
                  <p>No posts pending review at the moment</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="dashboard-content">
            <div className="users-header-section">
              <h2><FiUsers /> User Management</h2>
              <div className="users-toolbar">
                <div className="search-box">
                  <FiSearch />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="users-stats-row">
              <div className="user-stat-card">
                <div className="user-stat-icon admin-icon">
                  <FiShield />
                </div>
                <div className="user-stat-content">
                  <h4>{users.filter(u => u.role === 'admin').length}</h4>
                  <p>Administrators</p>
                </div>
              </div>
              <div className="user-stat-card">
                <div className="user-stat-icon author-icon">
                  <FiEdit3 />
                </div>
                <div className="user-stat-content">
                  <h4>{users.filter(u => u.role === 'author').length}</h4>
                  <p>Authors</p>
                </div>
              </div>
              <div className="user-stat-card">
                <div className="user-stat-icon reader-icon">
                  <FiUsers />
                </div>
                <div className="user-stat-content">
                  <h4>{users.filter(u => u.role === 'reader').length}</h4>
                  <p>Readers</p>
                </div>
              </div>
            </div>

            <div className="users-table-card glass-card">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="user-cell">
                          <img src={user.avatar} alt={user.name} />
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                          {user.isActive ? 'Active' : 'Banned'}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="user-actions">
                          {user.role !== 'admin' && (
                            <>
                              {user.isActive ? (
                                <button 
                                  className="action-btn ban"
                                  onClick={() => handleBanUser(user._id)}
                                  title="Ban user"
                                >
                                  <FiUserX />
                                </button>
                              ) : (
                                <button 
                                  className="action-btn unban"
                                  onClick={() => handleUnbanUser(user._id)}
                                  title="Unban user"
                                >
                                  <FiUserCheck />
                                </button>
                              )}
                              <button 
                                className="action-btn delete"
                                onClick={() => handleDeleteUser(user._id)}
                                title="Delete user"
                              >
                                <FiTrash2 />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
