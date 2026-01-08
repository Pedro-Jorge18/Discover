import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from '../Layout/Footer.jsx';
import { Bell, CheckCircle, Trash2, CheckCheck, Check } from 'lucide-react';
import {
  getUserNotifications,
  markUserNotificationsRead,
  markSingleUserNotificationRead,
  removeUserNotification,
  clearUserNotifications,
  userNotificationEventName,
} from '../../utils/userNotifications';
import { useTranslation } from '../../contexts/TranslationContext';

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
  if (type === 'reservation_accepted') return <CheckCircle className="w-5 h-5 text-green-600" />;
  if (type === 'reservation_rejected') return <CheckCircle className="w-5 h-5 text-red-600" />;
  return <Bell className="w-5 h-5 text-gray-500" />;
};

function UserNotificationsPage({ user, setUser, onOpenSettings, onOpenSettingsAdmin }) {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  const refresh = () => {
    if (!user?.id) return;
    setNotifications(getUserNotifications(user.id));
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
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

    window.addEventListener(userNotificationEventName, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(userNotificationEventName, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const unreadLabel = `${t('userNotifications.unread')}: ${unreadCount}`;

  const handleMarkAllRead = () => {
    markUserNotificationsRead(user.id);
    refresh();
  };

  const handleClearAll = () => {
    clearUserNotifications(user.id);
    refresh();
  };

  const handleMarkSingle = (id) => {
    markSingleUserNotificationRead(user.id, id);
    refresh();
  };

  const handleRemoveSingle = (id) => {
    removeUserNotification(user.id, id);
    refresh();
  };

  return (
    <div className="min-h-screen bg-white text-left">
      <Header user={user} setUser={setUser} onOpenSettings={onOpenSettings} onOpenSettingsAdmin={onOpenSettingsAdmin} />
      <main className="max-w-[1100px] mx-auto px-5 sm:px-10 pt-44 pb-20">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-10 bg-green-600 rounded-full"></div>
            <div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">{t('userNotifications.pageTitle')}</h1>
              <p className="text-sm text-gray-500 font-medium">{t('userNotifications.pageSubtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/my-reservations')}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-gray-200 text-gray-800 font-semibold hover:bg-gray-50"
          >
            {t('userNotifications.viewReservations')}
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6 text-sm">
          <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 font-semibold">{unreadLabel}</span>
          <button onClick={handleMarkAllRead} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white text-xs font-bold uppercase tracking-wide hover:bg-gray-800">
            <CheckCheck className="w-4 h-4" /> {t('userNotifications.markAllRead')}
          </button>
          <button onClick={handleClearAll} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wide hover:bg-gray-50">
            <Trash2 className="w-4 h-4" /> {t('userNotifications.clearAll')}
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-3xl p-10 text-center text-gray-600 font-semibold">
            {t('userNotifications.empty')}
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div key={item.id} className="border border-gray-100 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                <div className="mt-1">{typeIcon(item.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                    {!item.read && <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide bg-green-50 text-green-700 rounded-full">{t('userNotifications.badgeNew')}</span>}
                  </div>
                  <p className="text-xs text-gray-600 leading-snug mt-1">{item.message}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{formatTimeAgo(item.createdAt, language)}</p>
                </div>
                <div className="flex flex-col gap-2 ml-2">
                  {!item.read && (
                    <button
                      onClick={() => handleMarkSingle(item.id)}
                      className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition"
                      title={t('userNotifications.markAsRead')}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveSingle(item.id)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                    title={t('userNotifications.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default UserNotificationsPage;
