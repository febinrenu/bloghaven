import { Link } from 'react-router-dom';
import { FiThumbsUp, FiMessageCircle, FiEye, FiClock, FiArrowRight } from 'react-icons/fi';
import { getUserAvatar } from '../utils/avatarUtils';
import './PostCard.css';

const PostCard = ({ post }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="post-card">
      <div className="post-card-image-container">
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} className="post-card-image" />
        ) : (
          <div className="post-card-placeholder">
            <div className="placeholder-icon">
              <FiMessageCircle />
            </div>
          </div>
        )}
        <div className="post-card-overlay"></div>
        <span className="post-category-badge">{post.category}</span>
      </div>

      <div className="post-card-content">
        <div className="post-card-header">
          <Link to={`/profile/${post.author._id}`} className="author-info">
            <img 
              src={getUserAvatar(post.author)} 
              alt={post.author.name} 
              className="author-avatar" 
            />
            <div className="author-details">
              <span className="author-name">{post.author.name}</span>
              <span className="post-date">
                <FiClock /> {formatDate(post.publishedAt || post.createdAt)}
              </span>
            </div>
          </Link>
        </div>

        <Link to={`/posts/${post._id}`} className="post-title-link">
          <h3 className="post-title">{post.title}</h3>
        </Link>

        <p className="post-excerpt">{post.excerpt || post.content.substring(0, 120) + '...'}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="post-footer">
          <div className="post-stats">
            <span className="stat">
              <FiThumbsUp /> {post.upvoteCount || 0}
            </span>
            <span className="stat">
              <FiMessageCircle /> {post.commentCount || 0}
            </span>
            <span className="stat">
              <FiEye /> {post.views || 0}
            </span>
          </div>
          <Link to={`/posts/${post._id}`} className="read-more">
            Read More <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
