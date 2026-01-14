const STORAGE_PREFIX = 'user_notifications_';
const EVENT_NAME = 'user-notification';

/**
 * Safely parses JSON string, returns empty array on error
 * @param {string} value - JSON string to parse
 * @returns {Array} Parsed array or empty array
 */
const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return [];
  }
};

/**
 * Generates localStorage key for user notifications
 * @param {string|number} userId - User ID
 * @returns {string} Storage key
 */
const getKey = (userId) => `${STORAGE_PREFIX}${userId}`;

/**
 * Persists notifications to localStorage and dispatches events
 * @param {string|number} userId - User ID
 * @param {Array} notifications - Array of notification objects
 */
const persist = (userId, notifications) => {
  localStorage.setItem(getKey(userId), JSON.stringify(notifications));
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { userId } }));
};

/**
 * Retrieves all notifications for a user from localStorage
 * @param {string|number} userId - User ID
 * @returns {Array} Array of notification objects
 */
export const getUserNotifications = (userId) => {
  if (!userId) return [];
  const raw = localStorage.getItem(getKey(userId)) || '[]';
  const parsed = safeParse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed;
};

/**
 * Adds a new notification for a user (max 50 notifications stored)
 * @param {Object} params - Notification parameters
 * @param {string|number} params.userId - User ID
 * @param {string} params.title - Notification title
 * @param {string} params.message - Notification message
 * @param {string} params.type - Notification type ('info', 'reservation_accepted', 'reservation_rejected')
 * @param {string|number} params.reservationId - Optional reservation ID
 * @param {Object} params.meta - Optional metadata
 * @returns {Object|null} Created notification object or null
 */
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
