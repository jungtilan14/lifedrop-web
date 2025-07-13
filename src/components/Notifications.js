import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, CheckCircle, Clock, Settings, Filter } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      type: 'urgent',
      title: 'Urgent Blood Request - O+ needed',
      message: 'A patient at Tribhuvan University Teaching Hospital needs O+ blood urgently. Location: Kathmandu',
      timestamp: '2024-03-15T15:30:00',
      read: false,
      action: 'blood_request'
    },
    {
      id: 2,
      type: 'match',
      title: 'You have a blood type match!',
      message: 'Your blood type A+ matches a request from Patan Hospital. Patient needs 2 units.',
      timestamp: '2024-03-15T14:20:00',
      read: false,
      action: 'respond'
    },
    {
      id: 3,
      type: 'success',
      title: 'Donation Confirmed',
      message: 'Your blood donation has been confirmed. Thank you for saving a life!',
      timestamp: '2024-03-15T12:15:00',
      read: true,
      action: 'view_history'
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Donation Reminder',
      message: 'You are eligible to donate blood again. Your last donation was 95 days ago.',
      timestamp: '2024-03-15T10:00:00',
      read: true,
      action: 'register'
    },
    {
      id: 5,
      type: 'info',
      title: 'New Awareness Article',
      message: 'Check out our latest article about blood donation myths and facts.',
      timestamp: '2024-03-14T18:45:00',
      read: true,
      action: 'read_article'
    }
  ];

  useEffect(() => {
    // Simulate loading notifications
    setTimeout(() => {
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 1000);

    // Simulate real-time notifications
    const interval = setInterval(() => {
      // In a real app, this would check for new notifications
      console.log('Checking for new notifications...');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent':
        return <AlertCircle className="text-red-500" size={20} />;
      case 'match':
        return <Bell className="text-blue-500" size={20} />;
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'reminder':
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <Bell className="text-gray-500" size={20} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'urgent':
        return 'border-red-500';
      case 'match':
        return 'border-blue-500';
      case 'success':
        return 'border-green-500';
      case 'reminder':
        return 'border-yellow-500';
      default:
        return 'border-gray-500';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffHours = Math.floor((now - notificationTime) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'urgent') return notification.type === 'urgent';
    return true;
  });

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <Bell className="inline mr-2" size={28} />
            Notifications
            {unreadCount > 0 && (
              <span className="notification-count">{unreadCount}</span>
            )}
          </h1>
          <p className="text-gray">
            Stay updated with blood requests and donation opportunities
          </p>
        </div>

        {/* Notification Controls */}
        <div className="notification-controls">
          <div className="filter-buttons">
            <button
              onClick={() => setFilter('all')}
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`btn ${filter === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('urgent')}
              className={`btn ${filter === 'urgent' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <AlertCircle className="inline mr-2" size={16} />
              Urgent
            </button>
          </div>
          
          <div className="notification-actions">
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="btn btn-secondary">
                Mark all as read
              </button>
            )}
            <button className="btn btn-secondary">
              <Settings className="inline mr-2" size={16} />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Filter className="inline mr-2" size={20} />
            Notifications ({filteredNotifications.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center">
            <p className="text-gray">Loading notifications...</p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.length === 0 ? (
              <div className="text-center">
                <p className="text-gray">No notifications found.</p>
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'notification-unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-header">
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <h3 className="notification-title">{notification.title}</h3>
                      <p className="notification-message">{notification.message}</p>
                    </div>
                    <div className="notification-time">
                      {getTimeAgo(notification.timestamp)}
                    </div>
                  </div>
                  
                  <div className="notification-actions">
                    {notification.action === 'blood_request' && (
                      <button className="btn btn-primary">Respond</button>
                    )}
                    {notification.action === 'respond' && (
                      <button className="btn btn-primary">View Request</button>
                    )}
                    {notification.action === 'view_history' && (
                      <button className="btn btn-secondary">View History</button>
                    )}
                    {notification.action === 'register' && (
                      <button className="btn btn-primary">Register</button>
                    )}
                    {notification.action === 'read_article' && (
                      <button className="btn btn-secondary">Read Article</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Settings className="inline mr-2" size={20} />
            Notification Preferences
          </h2>
        </div>
        
        <div className="notification-settings">
          <div className="setting-item">
            <label className="setting-label">
              <input type="checkbox" defaultChecked />
              <span>Urgent blood requests</span>
            </label>
            <p className="setting-description">
              Receive immediate notifications for urgent blood requests
            </p>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">
              <input type="checkbox" defaultChecked />
              <span>Blood type matches</span>
            </label>
            <p className="setting-description">
              Get notified when your blood type matches a request
            </p>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">
              <input type="checkbox" defaultChecked />
              <span>Donation reminders</span>
            </label>
            <p className="setting-description">
              Reminders when you're eligible to donate again
            </p>
          </div>
          
          <div className="setting-item">
            <label className="setting-label">
              <input type="checkbox" defaultChecked />
              <span>Awareness content</span>
            </label>
            <p className="setting-description">
              Updates about blood donation education and awareness
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;