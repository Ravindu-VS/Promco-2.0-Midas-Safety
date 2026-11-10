import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Badge, Button, Divider, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { Notifications as NotificationsIcon, NotificationsOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { notificationsApi } from '../services/api';
import { notificationsEnabled } from '../services/notificationPrefs';

const POLL_MS = 30000;

const timeAgo = (iso) => {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
  return new Date(iso).toLocaleDateString();
};

/** Bell in the top bar: polls /api/notifications every 30 s (unless turned off in Settings). */
const NotificationBell = () => {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(notificationsEnabled);
  const [data, setData] = useState({ unread: 0, items: [] });
  const [error, setError] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const timer = useRef(null);

  const refresh = useCallback(async () => {
    try {
      setData(await notificationsApi.list(20));
      setError(false);
    } catch (e) {
      setError(true);
    }
  }, []);

  useEffect(() => {
    const onPrefs = () => setEnabled(notificationsEnabled());
    window.addEventListener('promco:notification-prefs', onPrefs);
    return () => window.removeEventListener('promco:notification-prefs', onPrefs);
  }, []);

  useEffect(() => {
    clearInterval(timer.current);
    if (!enabled) {
      setData({ unread: 0, items: [] });
      return undefined;
    }
    refresh();
    timer.current = setInterval(refresh, POLL_MS);
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(timer.current);
      window.removeEventListener('focus', onFocus);
    };
  }, [enabled, refresh]);

  const open = (e) => {
    setAnchorEl(e.currentTarget);
    if (enabled) refresh();
  };

  const openItem = async (item) => {
    setAnchorEl(null);
    if (!item.read) {
      setData((prev) => ({
        unread: Math.max(0, prev.unread - 1),
        items: prev.items.map((n) => (n.id === item.id ? { ...n, read: true } : n)),
      }));
      notificationsApi.markRead(item.id).catch(() => refresh());
    }
    if (item.link) navigate(item.link);
  };

  const markAll = async () => {
    await notificationsApi.markAllRead().catch(() => {});
    refresh();
  };

  return (
    <>
      <Tooltip title={enabled ? 'Notifications' : 'Notifications are turned off in Settings'}>
        <IconButton onClick={open} aria-label="Notifications">
          <Badge badgeContent={data.unread} color="error" max={99}>
            {enabled ? <NotificationsIcon className="notification-icon" /> : <NotificationsOff className="notification-icon" />}
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ className: 'notification-menu' }}
      >
        <div className="notification-header">
          <strong>Notifications</strong>
          {enabled && data.unread > 0 && <Button size="small" color="error" onClick={markAll}>Mark all as read</Button>}
        </div>
        <Divider />
        {!enabled && (
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }}>
            Notifications are off. Turn them on in Settings.
          </MenuItem>
        )}
        {enabled && error && <MenuItem disabled>Could not load notifications.</MenuItem>}
        {enabled && !error && data.items.length === 0 && <MenuItem disabled>You have no notifications.</MenuItem>}
        {enabled && data.items.map((n) => (
          <MenuItem key={n.id} onClick={() => openItem(n)} className={n.read ? 'notification-item' : 'notification-item unread'}>
            <div>
              <div className="notification-title">{n.title}</div>
              <div className="notification-message">{n.message}</div>
              <div className="notification-time">{timeAgo(n.createdAt)}</div>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NotificationBell;
