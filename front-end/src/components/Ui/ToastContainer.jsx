import { useState, useEffect } from 'react';

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    function handle(e) {
      const { message, type = 'info', duration = 4000 } = e.detail || {};
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, message, type, duration }]);
    }

    window.addEventListener('app-notify', handle);
    return () => window.removeEventListener('app-notify', handle);
  }, []);

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((toast) => {
      return setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== toast.id));
      }, toast.duration);
    });
    return () => timers.forEach((id) => clearTimeout(id));
  }, [toasts]);

  return (
    <div className="fixed top-6 right-6 z-[1000] pointer-events-none flex flex-col gap-3">
      {toasts.map((t) => (
        <div key={t.id} className={`pointer-events-auto w-96 max-w-full rounded-lg p-3 shadow-lg text-sm font-medium text-white ${t.type === 'error' ? 'bg-red-600' : t.type === 'success' ? 'bg-green-600' : 'bg-gray-800'}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 break-words">{t.message}</div>
            <button onClick={() => setToasts((s) => s.filter(x => x.id !== t.id))} className="ml-3 text-white/80 hover:text-white">✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}
