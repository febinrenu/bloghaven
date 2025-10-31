import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getUserAvatar } from '../utils/avatarUtils';
import { 
  FiBell, FiUser, FiLogOut, FiSettings, FiEdit, 
  FiMenu, FiX, FiHome, FiCompass, FiFileText 
} from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">B</div>
          <span className="logo-text">BlogHaven</span>
        </Link>

        <ul className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <li>
            <Link 
              to="/" 
              className={isActive('/') ? 'active' : ''}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiHome /> <span>Home</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/explore" 
              className={isActive('/explore') ? 'active' : ''}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiCompass /> <span>Explore</span>
            </Link>
          </li>
          {isAuthenticated && user?.role === 'admin' && (
            <li>
              <Link 
                to="/admin" 
                className={isActive('/admin') ? 'active' : ''}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiSettings /> <span>Admin</span>
              </Link>
            </li>
          )}
          {isAuthenticated && (user?.role === 'author' || user?.role === 'admin') && (
            <>
              <li>
                <Link 
                  to="/author-dashboard" 
                  className={isActive('/author-dashboard') ? 'active' : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiFileText /> <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/create-post" 
                  className={`create-post-link ${isActive('/create-post') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiEdit /> <span>Create</span>
                </Link>
              </li>
            </>
          )}
          {isAuthenticated && user?.role === 'reader' && (
            <li>
              <Link 
                to="/dashboard" 
                className={isActive('/dashboard') ? 'active' : ''}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FiFileText /> <span>Dashboard</span>
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <Link to="/notifications" className="notification-btn">
                <FiBell />
                <span className="notification-badge">3</span>
              </Link>
              <div className="user-dropdown">
                <button 
                  className="user-button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <img 
                    src={getUserAvatar(user)} 
                    alt={user?.name} 
                    className="user-avatar" 
                  />
                  <span className="user-name">{user?.name}</span>
                </button>
                <div className={`dropdown-content ${isDropdownOpen ? 'open' : ''}`}>
                  <div className="dropdown-header">
                    <img src={getUserAvatar(user)} alt={user?.name} />
                    <div>
                      <div className="dropdown-name">{user?.name}</div>
                      <div className="dropdown-role">{user?.role}</div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link 
                    to={`/profile/${user?._id}`}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FiUser /> My Profile
                  </Link>
                  <Link 
                    to="/my-posts"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FiFileText /> My Posts
                  </Link>
                  <Link 
                    to="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FiSettings /> Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="logout-btn">
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">
                Login
              </Link>
              <Link to="/register" className="btn-register">
                Sign Up
              </Link>
            </>
          )}

          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
