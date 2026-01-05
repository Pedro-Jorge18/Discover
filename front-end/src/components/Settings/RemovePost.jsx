import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function RemovePost({ listMaxH = 'max-h-56' }) {
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
      setError("Erro ao carregar propriedades.");
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
      setSuccess("Propriedade apagada com sucesso.");
      setConfirm(null);
      // refresh page shortly after successful deletion
      setTimeout(() => window.location.reload(), 700);
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || "Erro ao apagar propriedade.";
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
    <div className="w-full max-w-xl bg-gray-800 p-6 rounded-xl">
      <h3 className="text-lg font-semibold text-white pb-4 border-b border-gray-700 text-center">
        Remover Propriedade
      </h3>

      {/* Inline confirmation panel */}
      {confirm && (
        <div className="w-full bg-gray-800 p-6 rounded-xl text-center space-y-4 mt-4">
          <p className="text-red-600 text-sm">ATENÇÃO! Ao confirmar irá apagar a seguinte propriedade:<p></p><strong className="text-gray-100">{confirm.title}</strong></p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={confirmDelete}
              disabled={deletingId === confirm.id}
              className="rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-500 focus:ring-4 focus:ring-red-400 transition"
            >
              {deletingId === confirm.id ? 'A apagar...' : 'Confirmar'}
            </button>

            <button
              onClick={cancelDelete}
              className="rounded-lg bg-gray-700 px-6 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-600 focus:ring-4 focus:ring-gray-500 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="pt-6 space-y-4">

        {/* Menssages */}
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}
        {success && <div className="text-green-400 text-sm text-center">{success}</div>}

        {/* Properties List */}
        {loading ? (
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-400 rounded-full animate-spin mx-auto mb-2"></div>
        ) : (
          <div className="space-y-3">
            <div className={`${listMaxH} overflow-y-auto divide-y divide-gray-700 rounded-lg border border-gray-700`}>
              {properties.length === 0 && (
                <div className="text-gray-400 text-sm text-center py-6">Nenhuma propriedade encontrada.</div>
              )}

              {properties.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3 px-3 hover:bg-gray-700 transition rounded-md">
                  <div className="flex-1 pr-3">
                    <div className="text-sm font-medium text-gray-100">{p.title}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => (window.location.href = `/alojamento/${p.id}`)}
                      className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-400 transition"
                    >
                      Ver
                    </button>

                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="rounded-lg bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500 focus:ring-4 focus:ring-red-400 transition"
                    >
                      {deletingId === p.id ? "A apagar..." : "Apagar"}
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
                Recarregar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
