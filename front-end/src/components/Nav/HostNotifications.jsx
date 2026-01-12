import React, { useEffect, useRef, useState } from 'react';
import { Bell, CreditCard, MessageSquare, CheckCheck, Check, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../contexts/TranslationContext';
import {
  getHostNotifications,
  markHostNotificationsRead,
  markSingleNotificationRead,
  hostNotificationEventName,
} from '../../utils/hostNotifications';

const formatTimeAgo = (isoDate, language) => {
  if (!isoDate) return '';
  const created = new Date(isoDate).getTime();
  const diffMs = Date.now() - created;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return language === 'pt' ? 'agora' : 'just now';
  if (diffMs < hour) {
    const m = Math.floor(diffMs / minute);
    return language === 'pt' ? `${m}m` : `${m}m`;
  }
  if (diffMs < day) {
    const h = Math.floor(diffMs / hour);
    return language === 'pt' ? `${h}h` : `${h}h`;
  }
  const d = Math.floor(diffMs / day);
  return language === 'pt' ? `${d}d` : `${d}d`;
};

const typeIcon = (type) => {
  if (type === 'payment') return <CreditCard className="w-4 h-4 text-blue-600" />;
  if (type === 'review') return <MessageSquare className="w-4 h-4 text-green-600" />;
  if (type === 'reservation_request') return <Calendar className="w-4 h-4 text-purple-600" />;
  return <Bell className="w-4 h-4 text-gray-500" />;
};

function HostNotifications({ user }) {
  const { t, language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const containerRef = useRef(null);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const refresh = () => {
    if (!user?.id) return;
    setNotifications(getHostNotifications(user.id));
  };

  useEffect(() => {
    if (!user?.id || user.role !== 'host') {
      setNotifications([]);
      setIsOpen(false);
      return;
    }
    refresh();
  }, [user?.id, user?.role]);

  useEffect(() => {
    if (!user?.id || user.role !== 'host') return undefined;

    const handleUpdate = (event) => {
      const targetId = event?.detail?.hostId;
      if (targetId && targetId !== user.id) return;
      refresh();
    };

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener(hostNotificationEventName, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener(hostNotificationEventName, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [user?.id, user?.role]);

  if (!user || user.role !== 'host') return null;

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      refresh();
    }
  };

  const handleMarkAllRead = () => {
    markHostNotificationsRead(user.id);
    refresh();
  };

  const handleMarkSingleRead = (notificationId, e) => {
    e.stopPropagation();
    markSingleNotificationRead(user.id, notificationId);
    refresh();
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={handleToggle}
        className="relative p-3 text-gray-700 rounded-full hover:bg-gray-100 transition-all"
        aria-label={t('header.notifications')}
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-30 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-bold text-gray-900">{t('header.notifications')}</p>
              <p className="text-xs text-gray-500">{unreadCount} {t('hostNotifications.unread')}</p>
            </div>
            <button
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="w-4 h-4" />
              {t('hostNotifications.markAllRead')}
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">{t('hostNotifications.empty')}</div>
            ) : (
              notifications.map((item) => (
                <div key={item.id} className="p-4 flex gap-3 hover:bg-gray-50 transition-colors">
                  <div className="mt-0.5">{typeIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                    <p className="text-xs text-gray-600 leading-snug">{item.message}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{formatTimeAgo(item.createdAt, language)}</p>
                  </div>
                  {!item.read && (
                    <button
                      onClick={(e) => handleMarkSingleRead(item.id, e)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0"
                      title={t('hostNotifications.markAsRead')}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-gray-50 border-t border-gray-100">
            <Link
              to="/notificacoes"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold uppercase tracking-wide hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              {t('hostNotifications.viewAll')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default HostNotifications;
