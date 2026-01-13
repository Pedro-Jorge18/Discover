import React, { useEffect, useRef, useState } from 'react';
import { Bell, CheckCircle, CheckCheck, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../contexts/TranslationContext';
import {
  getUserNotifications,
  markUserNotificationsRead,
  markSingleUserNotificationRead,
  userNotificationEventName,
} from '../../utils/userNotifications';

const formatTimeAgo = (isoDate, language) => {
  if (!isoDate) return '';
  const created = new Date(isoDate).getTime();
  const diffMs = Date.now() - created;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return language === 'pt' ? 'agora' : 'just now';
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}m`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h`;
  return `${Math.floor(diffMs / day)}d`;
};

const typeIcon = (type) => {
  if (type === 'reservation_accepted') return <CheckCircle className="w-4 h-4 text-green-600" />;
  if (type === 'reservation_rejected') return <CheckCircle className="w-4 h-4 text-red-600" />;
  return <Bell className="w-4 h-4 text-gray-500" />;
};

function UserNotifications({ user }) {
  const { t, language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const containerRef = useRef(null);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const refresh = () => {
    if (!user?.id) return;
    setNotifications(getUserNotifications(user.id));
  };

  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      setIsOpen(false);
      return;
    }
    refresh();
  }, [user]);

  useEffect(() => {
    if (!user?.id) return undefined;

    const handleUpdate = (event) => {
      const targetId = event?.detail?.userId;
      if (targetId && targetId !== user.id) return;
      refresh();
    };

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener(userNotificationEventName, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener(userNotificationEventName, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [user]);

  if (!user) return null;

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      refresh();
    }
  };

  const handleMarkAllRead = () => {
    markUserNotificationsRead(user.id);
    refresh();
  };

  const handleMarkSingleRead = (notificationId, e) => {
    e.stopPropagation();
    markSingleUserNotificationRead(user.id, notificationId);
    refresh();
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={handleToggle}
        className="relative p-3 text-gray-700 rounded-full hover:bg-gray-100 transition-all"
        aria-label={t('header.userNotifications')}
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 bg-green-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-30 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div>
              <p className="text-sm font-bold text-gray-900">{t('header.userNotifications')}</p>
              <p className="text-xs text-gray-500">{unreadCount} {t('userNotifications.unread')}</p>
            </div>
            <button
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="w-4 h-4" />
              {t('userNotifications.markAllRead')}
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">{t('userNotifications.empty')}</div>
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
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors shrink-0"
                      title={t('userNotifications.markAsRead')}
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
              to="/reservas-notificacoes"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold uppercase tracking-wide hover:bg-gray-800"
              onClick={() => setIsOpen(false)}
            >
              {t('userNotifications.viewAll')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserNotifications;
