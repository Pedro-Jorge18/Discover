import React from 'react';
import { LogIn, HelpCircle, Gift, Home, Cog } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function Menu({ user, setUser, onOpenSettings, onOpenSettingsHost, onOpenSettingsAdmin, onCloseMenu }) {
  const itemClasses = "px-4 py-3 text-gray-800 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition-colors w-full text-left";

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await api.post("/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } });

      // Clear token and user state
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      setUser(null);

      // close menu and refresh page to reset UI
      if (typeof onCloseMenu === 'function') onCloseMenu();
      window.location.reload();

    } catch (error) {
      // If token is already revoked the server may return 401. In that case
      // clear local token and user state anyway so the UI is consistent.
      const status = error?.response?.status;
      if (status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setUser(null);
        if (typeof onCloseMenu === 'function') onCloseMenu();
        window.location.reload();
        return;
      }

      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="absolute top-12 right-0 w-64 bg-white rounded-xl shadow-2xl overflow-hidden z-20 transform origin-top-right">

      {user && <p>Bem-vindo, {user.role}</p>}
      <div className="py-2">

        {user && user.id ? (
          <button
            onClick={handleLogout} //Calls Backend
            className="px-4 py-3 font-semibold text-red-900 hover:bg-gray-100 flex items-center gap-3 w-full text-left"
          >
            Terminar Sessão
          </button>
        ) : (
          <Link 
            to="/login"
            className="px-4 py-3 font-semibold text-gray-900 hover:bg-gray-100 flex items-center gap-3 w-full text-left"
          >
            Entrar ou Registar-se
          </Link>
        )}

        {/* Show and Hide Pages */}
        {user && user.role ? (
          <>
            <div className="border-t my-2"></div>
            <button
              onClick={() => { onOpenSettings(); if (typeof onCloseMenu === 'function') onCloseMenu(); }}
              className="px-4 py-3 font-semibold text-gray-500 hover:bg-gray-100 flex items-center gap-3 w-full text-left"
            >
              <Cog className="w-5 h-5 text-gray-500" />
              Definições
            </button>

          
            {user.role === "host" ? (
              <button
                onClick={() => { onOpenSettingsHost(); if (typeof onCloseMenu === 'function') onCloseMenu(); }}
                className="px-4 py-3 font-semibold text-gray-500 hover:bg-gray-100 flex items-center gap-3 w-full text-left"
              >
                <Cog className="w-5 h-5 text-gray-500" />
                Menu Host
              </button>
            ) : user.role === "admin" ? (
              <button
                onClick={() => { onOpenSettingsAdmin(); if (typeof onCloseMenu === 'function') onCloseMenu(); }}
                className="px-4 py-3 font-semibold text-gray-500 hover:bg-gray-100 flex items-center gap-3 w-full text-left"
              >
                <Cog className="w-5 h-5 text-gray-500" />
                Menu Administração
              </button>
            ) : (
              <>
              </>
            )}
          </>
        ) : (
          <>
          </>
        )}      

        <div className="border-t my-2"></div>

        <Link to="/help" className={itemClasses}>
          <HelpCircle className="w-5 h-5 text-gray-500" /> Centro de Ajuda
        </Link>
      </div>
    </div>
  );
}

export default Menu;
