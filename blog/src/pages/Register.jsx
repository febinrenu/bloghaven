import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/services';
import { useAuthStore } from '../store/authStore';
import FloatingElements from '../components/animations/FloatingElements';
import ShootingStars from '../components/animations/ShootingStars';
import { FiUser, FiMail, FiLock, FiCheck, FiArrowRight, FiUserPlus } from 'react-icons/fi';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'reader',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const data = await authService.register(registerData);
      setAuth(data, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <FloatingElements count={15} />
      <ShootingStars count={6} />
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              <FiUserPlus />
            </div>
            <h1>Join BlogHaven</h1>
            <p className="auth-subtitle">Create an account and start your storytelling journey</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">
                <FiUser /> Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <FiMail /> Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">
                  <FiLock /> Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Min. 6 characters"
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <FiCheck /> Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Repeat password"
                  minLength="6"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role">
                <FiUserPlus /> Join as
              </label>
              <div className="role-options">
                <label className={`role-option ${formData.role === 'reader' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="reader"
                    checked={formData.role === 'reader'}
                    onChange={handleChange}
                  />
                  <div className="role-content">
                    <span className="role-title">Reader</span>
                    <span className="role-desc">Discover and enjoy stories</span>
                  </div>
                </label>
                <label className={`role-option ${formData.role === 'author' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="author"
                    checked={formData.role === 'author'}
                    onChange={handleChange}
                  />
                  <div className="role-content">
                    <span className="role-title">Author</span>
                    <span className="role-desc">Share your amazing stories</span>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account <FiArrowRight className="btn-arrow" />
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <div className="auth-footer">
            <Link to="/login" className="auth-link">
              Login here <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
