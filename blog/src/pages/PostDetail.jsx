import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService, commentService } from '../api/services';
import { useAuthStore } from '../store/authStore';
import { FaThumbsUp, FaComment, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const data = await postService.getPostById(id);
      setPost(data);
      if (user && data.upvotes) {
        setHasUpvoted(data.upvotes.some((upvote) => upvote._id === user._id));
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await commentService.getCommentsByPost(id);
      setComments(data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const result = await postService.toggleUpvote(id);
      setHasUpvoted(result.upvoted);
      setPost({ ...post, upvoteCount: result.upvoteCount });
    } catch (error) {
      console.error('Error toggling upvote:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await commentService.createComment({
        content: commentContent,
        postId: id,
      });
      setCommentContent('');
      fetchComments();
      fetchPost();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(id);
        navigate('/my-posts');
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (!post) {
    return <div className="error">Post not found</div>;
  }

  const isAuthor = user && post.author._id === user._id;

  return (
    <div className="post-detail-page">
      <div className="container">
        <article className="post-detail">
          {post.coverImage && (
            <div className="post-cover">
              <img src={post.coverImage} alt={post.title} />
            </div>
          )}

          <div className="post-header">
            <h1>{post.title}</h1>
            <div className="post-meta">
              <span className="category">{post.category}</span>
              <span className="date">
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <div className="author-section">
              <Link to={`/profile/${post.author._id}`} className="author-info">
                <img src={post.author.avatar} alt={post.author.name} />
                <div>
                  <h3>{post.author.name}</h3>
                  {post.author.bio && <p>{post.author.bio.substring(0, 60)}{post.author.bio.length > 60 ? '...' : ''}</p>}
                </div>
              </Link>

              {isAuthor && (
                <div className="post-actions">
                  <Link to={`/posts/${id}/edit`} className="btn-icon">
                    <FaEdit /> Edit
                  </Link>
                  <button onClick={handleDeletePost} className="btn-icon btn-danger">
                    <FaTrash /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="post-stats">
            <button
              onClick={handleUpvote}
              className={`stat-button ${hasUpvoted ? 'active' : ''}`}
            >
              <FaThumbsUp /> {post.upvoteCount || 0}
            </button>
            <span className="stat">
              <FaComment /> {post.commentCount || 0} Comments
            </span>
            <span className="stat">
              <FaEye /> {post.views || 0} Views
            </span>
          </div>
        </article>

        <section className="comments-section">
          <h2>Comments ({comments.length})</h2>

          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Share your thoughts..."
                required
                rows="4"
              />
              <button type="submit" className="btn-primary">
                Post Comment
              </button>
            </form>
          ) : (
            <div className="login-prompt">
              <Link to="/login">Login</Link> to leave a comment
            </div>
          )}

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-header">
                  <img src={comment.author.avatar} alt={comment.author.name} />
                  <div>
                    <h4>{comment.author.name}</h4>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="comment-content">{comment.content}</p>
                {comment.isEdited && <span className="edited-tag">(edited)</span>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PostDetail;
