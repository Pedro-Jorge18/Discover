export default function notify(message, type = 'info', duration = 4000) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('app-notify', { detail: { message, type, duration } }));
}
