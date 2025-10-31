import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../api/services';
import { useAuthStore } from '../store/authStore';
import PostCard from '../components/PostCard';
import FloatingElements from '../components/animations/FloatingElements';
import ShootingStars from '../components/animations/ShootingStars';
import { FiTrendingUp, FiUsers, FiBook, FiArrowRight, FiStar } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats] = useState({
    posts: 1247,
    authors: 342,
    readers: 8521,
  });

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getPosts({ page, limit: 10, sort: '-publishedAt' });
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <FloatingElements count={15} />
      <ShootingStars count={8} />
      
      <div className="container">
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <FiStar /> Welcome to the Future of Blogging
            </div>
            <h1 className="hero-title">
              Discover <span className="gradient-text">Amazing Stories</span> from Creative Minds
            </h1>
            <p className="hero-description">
              Join a vibrant community of passionate writers and readers. Share your unique voice, 
              explore diverse perspectives, and be inspired by stories from around the world.
            </p>
            <div className="hero-buttons">
              {isAuthenticated ? (
                <Link to="/explore" className="btn-hero btn-primary">
                  <FiBook /> Explore Stories
                  <FiArrowRight className="btn-arrow" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-hero btn-primary">
                    Get Started Free
                    <FiArrowRight className="btn-arrow" />
                  </Link>
                  <Link to="/explore" className="btn-hero btn-secondary">
                    <FiBook /> Browse Stories
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <FiBook />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.posts.toLocaleString()}+</div>
                <div className="stat-label">Published Stories</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FiUsers />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.authors.toLocaleString()}+</div>
                <div className="stat-label">Creative Authors</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FiTrendingUp />
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.readers.toLocaleString()}+</div>
                <div className="stat-label">Active Readers</div>
              </div>
            </div>
          </div>
        </section>

        <section className="featured-section">
          <div className="section-header">
            <h2 className="section-title">
              <FiTrendingUp /> Latest Stories
            </h2>
            <Link to="/explore" className="view-all-link">
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading amazing stories...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="posts-grid">
              {posts.map((post, index) => (
                <div 
                  key={post._id} 
                  className="post-card-wrapper"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-posts-container">
              <div className="no-posts-icon">
                <FiBook />
              </div>
              <h3>No Stories Yet</h3>
              <p>Be the first to share your amazing story with the world!</p>
              {isAuthenticated && (
                <Link to="/create-post" className="btn-create">
                  Create Your First Post
                </Link>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="btn-pagination"
              >
                Previous
              </button>
              <div className="pagination-dots">
                {[...Array(totalPages)].map((_, i) => (
                  <span
                    key={i}
                    className={`pagination-dot ${page === i + 1 ? 'active' : ''}`}
                    onClick={() => setPage(i + 1)}
                  />
                ))}
              </div>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="btn-pagination"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
