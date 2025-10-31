import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../api/services';
import { FiUser, FiLock, FiMail, FiMapPin, FiFileText, FiSave } from 'react-icons/fi';
import './Settings.css';

const Settings = () => {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    avatar: user?.avatar || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      await authService.updateProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update password',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="container">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your account settings and preferences</p>
        </div>

        <div className="settings-content">
          {/* Sidebar */}
          <aside className="settings-sidebar">
            <button
              className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FiUser /> Profile Information
            </button>
            <button
              className={`settings-tab ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              <FiLock /> Password & Security
            </button>
          </aside>

          {/* Main Content */}
          <main className="settings-main">
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="settings-section">
                <h2>Profile Information</h2>
                <p className="section-description">
                  Update your profile details and public information
                </p>

                <form onSubmit={handleProfileSubmit} className="settings-form">
                  <div className="form-group">
                    <label htmlFor="name">
                      <FiUser /> Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      required
                      placeholder="Enter your full name"
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
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bio">
                      <FiFileText /> Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      rows="4"
                      placeholder="Tell us about yourself..."
                      maxLength="300"
                    />
                    <small>{profileData.bio.length}/300 characters</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="location">
                      <FiMapPin /> Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={profileData.location}
                      onChange={handleProfileChange}
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="avatar">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      id="avatar"
                      name="avatar"
                      value={profileData.avatar}
                      onChange={handleProfileChange}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  {profileData.avatar && (
                    <div className="avatar-preview">
                      <p>Avatar Preview:</p>
                      <img src={profileData.avatar} alt="Avatar preview" />
                    </div>
                  )}

                  <button type="submit" className="btn-save" disabled={loading}>
                    <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="settings-section">
                <h2>Password & Security</h2>
                <p className="section-description">
                  Update your password to keep your account secure
                </p>

                <form onSubmit={handlePasswordSubmit} className="settings-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">
                      <FiLock /> Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      placeholder="Enter your current password"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">
                      <FiLock /> New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      placeholder="Enter your new password"
                      minLength="6"
                    />
                    <small>Password must be at least 6 characters</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      <FiLock /> Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      placeholder="Confirm your new password"
                    />
                  </div>

                  <button type="submit" className="btn-save" disabled={loading}>
                    <FiSave /> {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;
