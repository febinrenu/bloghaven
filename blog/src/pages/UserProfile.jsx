import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { userService, postService } from '../api/services';
import PostCard from '../components/PostCard';
import { FiMapPin, FiCalendar, FiUsers, FiFileText, FiUserPlus, FiUserCheck } from 'react-icons/fi';
import './UserProfile.css';

const UserProfile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const data = await userService.getUserProfile(id);
      setProfile(data);
      setIsFollowing(data.followers?.includes(currentUser?._id));
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const data = await postService.getPosts({ author: id });
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchFollowers = async () => {
    try {
      const data = await userService.getFollowers(id);
      setFollowers(data);
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const data = await userService.getFollowing(id);
      setFollowing(data);
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await userService.unfollowUser(id);
        setIsFollowing(false);
        setProfile({ ...profile, followersCount: profile.followersCount - 1 });
      } else {
        await userService.followUser(id);
        setIsFollowing(true);
        setProfile({ ...profile, followersCount: profile.followersCount + 1 });
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'followers' && followers.length === 0) {
      fetchFollowers();
    } else if (tab === 'following' && following.length === 0) {
      fetchFollowing();
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-error">
        <h2>Profile not found</h2>
        <Link to="/">Go back home</Link>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === id;

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-banner"></div>
          <div className="profile-info">
            <div className="profile-avatar-section">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="profile-avatar" />
              ) : (
                <div className="profile-avatar-placeholder">
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="profile-details">
              <div className="profile-name-section">
                <h1>{profile.name}</h1>
                {profile.role && (
                  <span className={`role-badge ${profile.role}`}>
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </span>
                )}
              </div>
              
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
              
              <div className="profile-meta">
                {profile.location && (
                  <span>
                    <FiMapPin /> {profile.location}
                  </span>
                )}
                <span>
                  <FiCalendar /> Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>

              <div className="profile-stats">
                <div className="stat">
                  <FiFileText />
                  <span className="stat-value">{posts.length}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat">
                  <FiUsers />
                  <span className="stat-value">{profile.followersCount || 0}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat">
                  <FiUsers />
                  <span className="stat-value">{profile.followingCount || 0}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>

              <div className="profile-actions">
                {isOwnProfile ? (
                  <Link to="/settings" className="btn-edit-profile">
                    Edit Profile
                  </Link>
                ) : (
                  <button onClick={handleFollow} className={`btn-follow ${isFollowing ? 'following' : ''}`}>
                    {isFollowing ? (
                      <>
                        <FiUserCheck /> Following
                      </>
                    ) : (
                      <>
                        <FiUserPlus /> Follow
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => handleTabChange('posts')}
          >
            Posts ({posts.length})
          </button>
          <button
            className={`tab ${activeTab === 'followers' ? 'active' : ''}`}
            onClick={() => handleTabChange('followers')}
          >
            Followers ({profile.followersCount || 0})
          </button>
          <button
            className={`tab ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => handleTabChange('following')}
          >
            Following ({profile.followingCount || 0})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'posts' && (
            <div className="posts-grid">
              {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post._id} post={post} />)
              ) : (
                <div className="no-content">
                  <p>No posts yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'followers' && (
            <div className="users-list">
              {followers.length > 0 ? (
                followers.map((follower) => (
                  <Link key={follower._id} to={`/profile/${follower._id}`} className="user-card">
                    {follower.avatar ? (
                      <img src={follower.avatar} alt={follower.name} className="user-avatar" />
                    ) : (
                      <div className="user-avatar-placeholder">{follower.name?.charAt(0)}</div>
                    )}
                    <div className="user-info">
                      <h4>{follower.name}</h4>
                      <p>{follower.bio || 'No bio available'}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="no-content">
                  <p>No followers yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'following' && (
            <div className="users-list">
              {following.length > 0 ? (
                following.map((user) => (
                  <Link key={user._id} to={`/profile/${user._id}`} className="user-card">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="user-avatar" />
                    ) : (
                      <div className="user-avatar-placeholder">{user.name?.charAt(0)}</div>
                    )}
                    <div className="user-info">
                      <h4>{user.name}</h4>
                      <p>{user.bio || 'No bio available'}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="no-content">
                  <p>Not following anyone yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
