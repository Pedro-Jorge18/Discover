import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useTranslation } from '../../contexts/TranslationContext';

export default function RemovePost({ listMaxH = 'max-h-56' }) {
  const { t } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    setLoading(true);
    setError(null);
    setConfirm(null); // Clear confirmation when refreshing
    try {
      const resp = await api.get("/properties");
      let list = [];
      if (Array.isArray(resp?.data?.data)) {
        list = resp.data.data;
      } else if (Array.isArray(resp?.data?.data?.data)) {
        list = resp.data.data.data;
      } else if (Array.isArray(resp?.data)) {
        list = resp.data;
      }
      setProperties(list);
    } catch (err) {
      setError(t('settings.errorLoadingProperties'));
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(id) {
    const property = properties.find(p => p.id === id);
    if (!property) return;
    setConfirm({ id, title: property.title });
  }

  async function confirmDelete() {
    if (!confirm) return;
    const id = confirm.id;
    setDeletingId(id);
    setError(null);
    setSuccess(null);
    try {
      await api.delete(`/properties/${id}`);
      setProperties(prev => prev.filter(p => p.id !== id));
      setSuccess(t('settings.propertyDeleted'));
      setConfirm(null);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || t('settings.deletePropertyError');
      setError(msg);
    } finally {
      setDeletingId(null);
    }
  }

  function cancelDelete() {
    setConfirm(null);
  }

  // auto-clear success/error
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

  return (
    <div className="w-full max-w-xl bg-white border border-gray-200 p-6 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-200 text-center">
        {t('settings.removeProperty')}
      </h3>

      {/* Inline confirmation panel */}
      {confirm && (
        <div className="w-full bg-gray-50 border border-gray-200 p-6 rounded-xl text-center space-y-4 mt-4">
          <p className="text-red-600 text-sm">{t('settings.attention')} {t('settings.deletePropertyMsg')}<p></p><strong className="text-gray-900">{confirm.title}</strong></p>
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
              className="rounded-lg bg-gray-200 px-6 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-300 focus:ring-4 focus:ring-gray-400 transition"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      <div className="pt-6 space-y-4">

        {/* Menssages */}
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center">{success}</div>}

        {/* Properties List */}
        {loading ? (
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-400 rounded-full animate-spin mx-auto mb-2"></div>
        ) : (
          <div className="space-y-3">
            <div className={`${listMaxH} overflow-y-auto divide-y divide-gray-200 rounded-lg border border-gray-200`}>
              {properties.length === 0 && (
                <div className="text-gray-500 text-sm text-center py-6">{t('settings.noPropertiesFound')}</div>
              )}

              {properties.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3 px-3 hover:bg-gray-50 transition rounded-md">
                  <div className="flex-1 pr-3">
                    <div className="text-sm font-medium text-gray-900">{p.title}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => (window.location.href = `/property/${p.id}`)}
                      className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-500 focus:ring-4 focus:ring-blue-400 transition"
                    >
                      {t('settings.view')}
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500 focus:ring-4 focus:ring-red-400 transition"
                    >
                      {deletingId === p.id ? t('settings.deleting') : t('settings.delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Refresh */}
            <div className="text-center pt-2">
              <button
                onClick={fetchProperties}
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
