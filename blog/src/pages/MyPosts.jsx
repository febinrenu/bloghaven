import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postService } from '../api/services';
import { FiEdit, FiTrash2, FiEye, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import './MyPosts.css';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getMyPosts();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(id);
        setPosts(posts.filter((post) => post._id !== id));
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-post/${id}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <FiCheckCircle className="status-icon published" />;
      case 'pending':
        return <FiClock className="status-icon pending" />;
      case 'draft':
        return <FiEdit className="status-icon draft" />;
      default:
        return <FiAlertCircle className="status-icon" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'published':
        return 'status-published';
      case 'pending':
        return 'status-pending';
      case 'draft':
        return 'status-draft';
      default:
        return '';
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  const stats = {
    all: posts.length,
    published: posts.filter((p) => p.status === 'published').length,
    draft: posts.filter((p) => p.status === 'draft').length,
    pending: posts.filter((p) => p.status === 'pending').length,
  };

  return (
    <div className="my-posts-page">
      <div className="container">
        <div className="my-posts-header">
          <h1>My Posts</h1>
          <Link to="/create-post" className="btn-create">
            Create New Post
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="posts-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.all}</div>
            <div className="stat-label">Total Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.published}</div>
            <div className="stat-label">Published</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.draft}</div>
            <div className="stat-label">Drafts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({stats.all})
          </button>
          <button
            className={`filter-tab ${filter === 'published' ? 'active' : ''}`}
            onClick={() => setFilter('published')}
          >
            Published ({stats.published})
          </button>
          <button
            className={`filter-tab ${filter === 'draft' ? 'active' : ''}`}
            onClick={() => setFilter('draft')}
          >
            Drafts ({stats.draft})
          </button>
          <button
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({stats.pending})
          </button>
        </div>

        {/* Posts List */}
        <div className="posts-list">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading your posts...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post._id} className="post-item">
                <div className="post-content">
                  {post.coverImage && (
                    <img src={post.coverImage} alt={post.title} className="post-thumbnail" />
                  )}
                  <div className="post-details">
                    <div className="post-header">
                      <h3>{post.title}</h3>
                      <span className={`status-badge ${getStatusClass(post.status)}`}>
                        {getStatusIcon(post.status)}
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                    </div>
                    <p className="post-excerpt">
                      {post.excerpt || post.content?.substring(0, 150) + '...'}
                    </p>
                    <div className="post-meta">
                      <span className="meta-item">
                        <FiEye /> {post.views || 0} views
                      </span>
                      <span className="meta-item">
                        {post.upvoteCount || 0} upvotes
                      </span>
                      <span className="meta-item">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="post-actions">
                  <Link to={`/posts/${post._id}`} className="btn-action view">
                    <FiEye /> View
                  </Link>
                  <button onClick={() => handleEdit(post._id)} className="btn-action edit">
                    <FiEdit /> Edit
                  </button>
                  <button onClick={() => handleDelete(post._id)} className="btn-action delete">
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-posts">
              <h3>No posts found</h3>
              <p>
                {filter === 'all'
                  ? "You haven't created any posts yet."
                  : `You don't have any ${filter} posts.`}
              </p>
              <Link to="/create-post" className="btn-create">
                Create Your First Post
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPosts;
