import React, { useEffect, useState } from 'react';
import { FaBell, FaCheckDouble } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getErrorMessage, notificationApi } from '../../services/api';

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await notificationApi.getAll();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load notifications'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const markAsRead = async (notificationId) => {
    try {
      await notificationApi.markRead(notificationId);
      setNotifications((current) =>
        current.map((notification) =>
          notification.notification_id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
      setUnreadCount((current) => Math.max(0, current - 1));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update notification'));
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications((current) => current.map((notification) => ({ ...notification, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to mark notifications as read'));
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', position: 'relative' }}
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-10px',
              minWidth: '18px',
              height: '18px',
              borderRadius: '999px',
              background: '#f5365c',
              color: '#fff',
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 0.25rem'
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 0.75rem)',
            width: '360px',
            maxHeight: '420px',
            overflowY: 'auto',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
            border: '1px solid #e9ecef',
            zIndex: 1200
          }}
        >
          <div className="flex-between" style={{ padding: '1rem', borderBottom: '1px solid #e9ecef' }}>
            <div>
              <strong>Notifications</strong>
              <p style={{ margin: '0.25rem 0 0', color: '#666', fontSize: '0.85rem' }}>{unreadCount} unread</p>
            </div>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <FaCheckDouble /> Mark all read
            </button>
          </div>

          {loading ? (
            <p style={{ padding: '1rem', color: '#666' }}>Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p style={{ padding: '1rem', color: '#666' }}>No notifications yet.</p>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.notification_id}
                type="button"
                onClick={() => {
                  if (!notification.is_read) {
                    markAsRead(notification.notification_id);
                  }
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: notification.is_read ? '#fff' : '#f8f9fe',
                  border: 'none',
                  borderBottom: '1px solid #f1f3f5',
                  padding: '1rem',
                  cursor: 'pointer'
                }}
              >
                <div className="flex-between" style={{ gap: '1rem', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: '#172b4d' }}>{notification.title}</p>
                    <p style={{ margin: '0.35rem 0 0', color: '#666', fontSize: '0.9rem' }}>{notification.message}</p>
                  </div>
                  {!notification.is_read && (
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#5e72e4', flexShrink: 0, marginTop: '0.25rem' }} />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
