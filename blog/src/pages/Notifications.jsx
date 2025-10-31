import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationService } from '../api/services';
import { FiBell, FiCheckCircle, FiTrash2, FiUser, FiThumbsUp, FiMessageCircle } from 'react-icons/fi';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(
        notifications.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter((notif) => notif._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow':
        return <FiUser className="notif-icon follow" />;
      case 'upvote':
        return <FiThumbsUp className="notif-icon upvote" />;
      case 'comment':
        return <FiMessageCircle className="notif-icon comment" />;
      default:
        return <FiBell className="notif-icon default" />;
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notifications-page">
      <div className="container">
        <div className="notifications-header">
          <div className="header-left">
            <h1>Notifications</h1>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} unread</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllAsRead} className="btn-mark-all">
              <FiCheckCircle /> Mark all as read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button
            className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div
                key={notif._id}
                className={`notification-item ${!notif.read ? 'unread' : ''}`}
                onClick={() => !notif.read && handleMarkAsRead(notif._id)}
              >
                <div className="notif-icon-container">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="notif-content">
                  <div className="notif-message">
                    {notif.sender && (
                      <Link to={`/profile/${notif.sender._id}`} className="sender-name">
                        {notif.sender.name}
                      </Link>
                    )}
                    <span> {notif.message}</span>
                  </div>
                  {notif.post && (
                    <Link to={`/posts/${notif.post._id}`} className="notif-post-link">
                      {notif.post.title}
                    </Link>
                  )}
                  <div className="notif-time">
                    {getTimeAgo(notif.createdAt)}
                  </div>
                </div>
                <div className="notif-actions">
                  {!notif.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notif._id);
                      }}
                      className="btn-mark-read"
                      title="Mark as read"
                    >
                      <FiCheckCircle />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notif._id);
                    }}
                    className="btn-delete"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-notifications">
              <FiBell className="empty-icon" />
              <h3>No notifications</h3>
              <p>
                {filter === 'unread'
                  ? "You're all caught up!"
                  : "You don't have any notifications yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to format time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';

  return 'Just now';
}

export default Notifications;
