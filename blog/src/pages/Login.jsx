import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/services';
import { useAuthStore } from '../store/authStore';
import FloatingElements from '../components/animations/FloatingElements';
import ShootingStars from '../components/animations/ShootingStars';
import { FiMail, FiLock, FiArrowRight, FiLogIn } from 'react-icons/fi';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    setLoading(true);

    try {
      const data = await authService.login(formData);
      setAuth(data, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
              <FiLogIn />
            </div>
            <h1>Welcome Back</h1>
            <p className="auth-subtitle">Login to continue your journey with BlogHaven</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder="Enter your password"
                minLength="6"
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                <>
                  Login <FiArrowRight className="btn-arrow" />
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>New to BlogHaven?</span>
          </div>

          <div className="auth-footer">
            <Link to="/register" className="auth-link">
              Create an account <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
