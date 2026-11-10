import { getCurrentUser } from './authService';

// Per-user, per-browser preference: whether the top bar checks for notifications.
const key = () => `notificationsEnabled:${getCurrentUser()?.id ?? 'anon'}`;

export const notificationsEnabled = () => localStorage.getItem(key()) !== 'false';

export const setNotificationsEnabled = (enabled) => {
  localStorage.setItem(key(), String(enabled));
  window.dispatchEvent(new Event('promco:notification-prefs'));
};
