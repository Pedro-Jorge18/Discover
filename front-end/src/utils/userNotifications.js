const STORAGE_PREFIX = 'user_notifications_';
const EVENT_NAME = 'user-notification';

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return [];
  }
};

const getKey = (userId) => `${STORAGE_PREFIX}${userId}`;

const persist = (userId, notifications) => {
  localStorage.setItem(getKey(userId), JSON.stringify(notifications));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { userId } }));
};

export const getUserNotifications = (userId) => {
  if (!userId) return [];
  const raw = localStorage.getItem(getKey(userId)) || '[]';
  const parsed = safeParse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed;
};

export const pushUserNotification = ({ userId, title, message, type = 'info', reservationId, meta = {} }) => {
  if (!userId) return null;
  const existing = getUserNotifications(userId);
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const newNotification = {
    id,
    title: title || 'Notification',
    message: message || '',
    type,
    reservationId: reservationId || null,
    meta,
    read: false,
    createdAt: new Date().toISOString(),
  };
  const updated = [newNotification, ...existing].slice(0, 50);
  persist(userId, updated);
  return newNotification;
};

export const markUserNotificationsRead = (userId) => {
  if (!userId) return;
  const existing = getUserNotifications(userId);
  const updated = existing.map((item) => ({ ...item, read: true }));
  persist(userId, updated);
};

export const markSingleUserNotificationRead = (userId, notificationId) => {
  if (!userId || !notificationId) return;
  const existing = getUserNotifications(userId);
  const updated = existing.map((item) => 
    item.id === notificationId ? { ...item, read: true } : item
  );
  persist(userId, updated);
};

export const removeUserNotification = (userId, notificationId) => {
  if (!userId || !notificationId) return;
  const existing = getUserNotifications(userId);
  const updated = existing.filter((item) => item.id !== notificationId);
  persist(userId, updated);
};

export const clearUserNotifications = (userId) => {
  if (!userId) return;
  persist(userId, []);
};

export const userNotificationEventName = EVENT_NAME;
