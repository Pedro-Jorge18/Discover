import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import notify from "../../utils/notify";
import { useTranslation } from '../../contexts/TranslationContext';

export default function RemUser({ listMaxH = 'max-h-56' }) {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    setConfirm(null); // Clear confirmation when refreshing
    try {
      const resp = await api.get("/users");
      let list = [];
      if (Array.isArray(resp?.data?.data)) {
        list = resp.data.data;
      } else if (Array.isArray(resp?.data?.data?.data)) {
        list = resp.data.data.data;
      } else if (Array.isArray(resp?.data)) {
        list = resp.data;
      }
      // Filter only "client" and "host" roles
      const filtered = list.filter(u => u.role === 'guest' || u.role === 'host');
      setUsers(filtered);
    } catch (err) {
      setError(t('settings.errorLoadingUsers'));
      notify(t('settings.errorLoadingUsers'), "error");
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;
    setConfirm({ id, name: `${user.name} ${user.last_name || ''}`, role: user.role });
  }

  async function confirmDelete() {
    if (!confirm) return;
    const id = confirm.id;
    setDeletingId(id);
    setError(null);
    setSuccess(null);
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      setSuccess(t('settings.userDeleted'));
      notify(t('settings.userDeleted'), "success");
      setConfirm(null);
      // Refresh page shortly after successful deletion
      setTimeout(() => window.location.reload(), 700);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || t('settings.deleteUserError');
      setError(msg);
      notify(msg, "error");
    } finally {
      setDeletingId(null);
    }
  }

  function cancelDelete() {
    setConfirm(null);
  }

  // Auto-clear success/error
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(t);
    }
  }, [error]);

  // Role display helper
  function getRoleDisplay(role) {
    if (role === 'guest') return t('settings.client');
    if (role === 'host') return t('auth.host');
    return role;
  }

  return (
    <div className="w-full max-w-xl bg-gray-800 p-6 rounded-xl">
      <h3 className="text-lg font-semibold text-white pb-4 border-b border-gray-700 text-center">
        {t('settings.removeUser')}
      </h3>

      {/* Inline confirmation panel */}
      {confirm && (
        <div className="w-full bg-gray-800 p-6 rounded-xl text-center space-y-4 mt-4">
          <p className="text-red-600 text-sm">{t('settings.attention')} {t('settings.deleteUserMsg')}<p></p><strong className="text-gray-100">{confirm.name} ({getRoleDisplay(confirm.role)})</strong></p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={confirmDelete}
              disabled={deletingId === confirm.id}
              className="rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-500 focus:ring-4 focus:ring-red-400 transition"
            >
              {deletingId === confirm.id ? t('settings.deleting') : t('common.confirm')}
            </button>

            <button
              onClick={cancelDelete}
              className="rounded-lg bg-gray-700 px-6 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-600 focus:ring-4 focus:ring-gray-500 transition"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      <div className="pt-6 space-y-4">

        {/* Messages */}
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}
        {success && <div className="text-green-400 text-sm text-center">{success}</div>}

        {/* Users List */}
        {loading ? (
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-400 rounded-full animate-spin mx-auto mb-2"></div>
        ) : (
          <div className="space-y-3">
            <div className={`${listMaxH} overflow-y-auto divide-y divide-gray-700 rounded-lg border border-gray-700`}>
              {users.length === 0 && (
                <div className="text-gray-400 text-sm text-center py-6">{t('settings.noUsersFound')}</div>
              )}

              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between py-3 px-3 hover:bg-gray-700 transition rounded-md">
                  <div className="flex-1 pr-3">
                    <div className="text-sm font-medium text-gray-100">{u.name} {u.last_name || ''}</div>
                    <div className="text-xs text-gray-400">{u.email}</div>
                    <div className="text-xs text-gray-500 mt-1">{t('settings.role')} <span className="text-gray-300">{getRoleDisplay(u.role)}</span></div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(u.id)}
                      disabled={deletingId === u.id}
                      className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500 focus:ring-4 focus:ring-red-400 transition"
                    >
                      {deletingId === u.id ? t('settings.deleting') : t('settings.delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Refresh */}
            <div className="text-center pt-2">
              <button
                onClick={fetchUsers}
                className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-600 focus:ring-4 focus:ring-gray-500 transition"
              >
                {t('common.reload')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
