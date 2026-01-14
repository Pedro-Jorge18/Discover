/**
 * Dispatches a notification event to be displayed by the notification system
 * @param {string} message - The message to display
 * @param {string} type - The notification type ('info', 'success', 'error', 'warning')
 * @param {number} duration - Duration in milliseconds before auto-dismiss (default: 4000)
 */
export default function notify(message, type = 'info', duration = 4000) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('app-notify', { detail: { message, type, duration } }));
}
