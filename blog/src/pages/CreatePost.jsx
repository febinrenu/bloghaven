import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { postService } from '../api/services';
import { FiSave, FiSend, FiImage, FiTag, FiEdit3, FiCheckCircle } from 'react-icons/fi';
import FloatingElements from '../components/animations/FloatingElements';
import ShootingStars from '../components/animations/ShootingStars';
import './CreatePost.css';

const CreatePost = () => {
  console.log('CreatePost component is rendering at:', new Date().toISOString());
  console.log('Current location:', window.location.href);

  try {
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'article',
    tags: '',
    coverImage: '',
    status: 'draft',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'code-block'],
      ['clean'],
    ],
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContentChange = (value) => {
    setFormData({
      ...formData,
      content: value,
    });
  };

  const handleSubmit = async (e, status = 'draft') => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation
    if (!formData.title.trim()) {
      setError('Please enter a title for your post');
      return;
    }
    
    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      setError('Please add content to your post');
      return;
    }
    
    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const postData = {
        ...formData,
        tags: tagsArray,
        status,
      };

      console.log('Submitting post data:', postData);
      const newPost = await postService.createPost(postData);
      console.log('Post created successfully:', newPost);
      
      setSuccess(`Post ${status === 'draft' ? 'saved as draft' : 'submitted for review'} successfully!`);
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        if (status === 'draft') {
          navigate('/my-posts');
        } else {
          navigate(`/posts/${newPost._id}`);
        }
      }, 1500);
    } catch (err) {
      console.error('Error creating post:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || err.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = (e) => {
    handleSubmit(e, 'draft');
  };

  const handleSubmitForReview = (e) => {
    handleSubmit(e, 'pending');
  };

  return (
    <div className="create-post-page">
      <FloatingElements count={12} />
      <ShootingStars count={4} />
      
      <div className="container">
        <div className="create-post-header">
          <div className="header-icon">
            <FiEdit3 />
          </div>
          <h1>Create New Post</h1>
          <p>Share your story with the world and inspire others</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        {success && (
          <div className="success-message">
            <FiCheckCircle />
            {success}
          </div>
        )}

        <form className="create-post-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="title">
              <FiEdit3 /> Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter an engaging title"
              maxLength="200"
            />
            <span className="char-count">{formData.title.length}/200</span>
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">
              <FiEdit3 /> Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Brief summary of your post (optional)"
              rows="3"
              maxLength="300"
            />
            <span className="char-count">{formData.excerpt.length}/300</span>
          </div>

          <div className="form-group">
            <label>
              <FiEdit3 /> Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Write your content here..."
              rows="10"
              className="content-editor"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">
                <FiTag /> Category *
              </label>
              <select id="category" name="category" value={formData.category} onChange={handleChange}>
                <option value="article">📄 Article</option>
                <option value="tutorial">📚 Tutorial</option>
                <option value="story">📖 Story</option>
                <option value="news">📰 News</option>
                <option value="other">📌 Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="coverImage">
                <FiImage /> Cover Image URL
              </label>
              <input
                type="url"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">
              <FiTag /> Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Separate tags with commas (e.g., javascript, react, tutorial)"
            />
            <small>Enter tags separated by commas</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="btn-secondary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave /> Save as Draft
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleSubmitForReview}
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend /> Submit for Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  } catch (error) {
    console.error('Error in CreatePost component:', error);
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Error Loading Create Post</h1>
        <p>There was an error loading the create post page. Check the console for details.</p>
        <p>Error: {error.message}</p>
      </div>
    );
  }
};

export default CreatePost;
