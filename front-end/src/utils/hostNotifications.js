const STORAGE_PREFIX = 'host_notifications_';
const EVENT_NAME = 'host-notification';

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return [];
  }
};

const getKey = (hostId) => `${STORAGE_PREFIX}${hostId}`;

const persist = (hostId, notifications) => {
  localStorage.setItem(getKey(hostId), JSON.stringify(notifications));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { hostId } }));
};

export const getHostNotifications = (hostId) => {
  if (!hostId) return [];
  const raw = localStorage.getItem(getKey(hostId)) || '[]';
  const parsed = safeParse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed;
};

export const pushHostNotification = ({ hostId, title, message, type = 'info', propertyId, meta = {} }) => {
  if (!hostId) return null;
  const existing = getHostNotifications(hostId);
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const newNotification = {
    id,
    title: title || 'Notification',
    message: message || '',
    type,
    propertyId: propertyId || null,
    meta,
    read: false,
    createdAt: new Date().toISOString(),
  };
  const updated = [newNotification, ...existing].slice(0, 50);
  persist(hostId, updated);
  return newNotification;
};

export const markHostNotificationsRead = (hostId) => {
  if (!hostId) return;
  const existing = getHostNotifications(hostId);
  const updated = existing.map((item) => ({ ...item, read: true }));
  persist(hostId, updated);
};

export const markSingleNotificationRead = (hostId, notificationId) => {
  if (!hostId || !notificationId) return;
  const existing = getHostNotifications(hostId);
  const updated = existing.map((item) => 
    item.id === notificationId ? { ...item, read: true } : item
  );
  persist(hostId, updated);
};

export const removeHostNotification = (hostId, notificationId) => {
  if (!hostId || !notificationId) return;
  const existing = getHostNotifications(hostId);
  const updated = existing.filter((item) => item.id !== notificationId);
  persist(hostId, updated);
};

export const clearHostNotifications = (hostId) => {
  if (!hostId) return;
  persist(hostId, []);
};

export const hostNotificationEventName = EVENT_NAME;
