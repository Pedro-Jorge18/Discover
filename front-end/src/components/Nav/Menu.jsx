import React from 'react';
import { LogIn, HelpCircle, House, Cog, MessageSquare, UserStar, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useTranslation } from '../../contexts/TranslationContext';

function Menu({ user, setUser, onOpenSettings, onOpenSettingsAdmin, onCloseMenu }) {
  const { t } = useTranslation();
  
  // Standard classes for menu items to maintain consistency
  const itemClasses = "px-4 py-3 font-semibold text-gray-500 hover:bg-gray-100 flex items-center gap-3 w-full text-left transition-colors";

  /**
   * Handles user logout process
   * Clears tokens and resets application state
   */
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await api.post("/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      
      // Remove sensitive data from storage
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      setUser(null);

      if (typeof onCloseMenu === 'function') onCloseMenu();
      
      // Reload to ensure all private states are cleared
      window.location.reload();
    } catch (error) {
      // Force logout on client side even if server request fails
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      setUser(null);
      if (typeof onCloseMenu === 'function') onCloseMenu();
      window.location.reload();
    }
  };

  return (
    <div className="absolute top-12 right-0 w-64 bg-white rounded-xl shadow-2xl overflow-hidden z-20 transform origin-top-right">
      <div className="py-2">
        
        {/* Auth section: Login or Logout depending on user state */}
        {user && user.id ? (
          <button 
            onClick={handleLogout} 
            className="px-4 py-3 font-semibold text-red-900 hover:bg-gray-100 flex items-center gap-3 w-full text-left"
          >
            <LogIn className="w-5 h-5" /> 
            Terminar Sessão
          </button>
        ) : (
          <Link 
            to="/login" 
            className="px-4 py-3 font-semibold text-gray-900 hover:bg-gray-100 flex items-center gap-3 w-full text-left"
          >
            <LogIn className="w-5 h-5" /> 
            Iniciar Sessão
          </Link>
        )}

        {/* Protected routes: Only visible if user is logged in */}
        {user && user.role && (
          <>
            <div className="border-t my-2"></div>
            
            {/* My Trips - Placed above reviews as requested */}
            <Link
              to="/minhas-reservas"
              onClick={() => onCloseMenu?.()}
              className={itemClasses}
            >
              <Briefcase className="w-5 h-5 text-gray-500" />
              As minhas viagens
            </Link>

            <Link
              to="/my-reviews"
              onClick={() => onCloseMenu?.()}
              className={itemClasses}
            >
              <MessageSquare className="w-5 h-5 text-gray-500" />
              As minhas avaliações
            </Link>          
            
            <button
              onClick={() => { onOpenSettings(); onCloseMenu?.(); }}
              className={itemClasses}
            >
              <Cog className="w-5 h-5 text-gray-500" />
              Definições da conta
            </button>
          
            {/* Conditional role-based links */}
            {user.role === "host" ? (
              <Link 
                to="/host" 
                onClick={() => onCloseMenu?.()} 
                className={itemClasses}
              >
                <House className="w-5 h-5 text-gray-500" /> 
                Modo Anfitrião
              </Link>
            ) : user.role === "admin" && (
              <button 
                onClick={() => { onOpenSettingsAdmin(); onCloseMenu?.(); }} 
                className={itemClasses}
              >
                <UserStar className="w-5 h-5 text-gray-500" /> 
                Painel de Administrador
              </button>
            )}
          </>
        )}      

        <div className="border-t my-2"></div>
        
        {/* Support section */}
        <Link 
          to="/help" 
          onClick={() => onCloseMenu?.()} 
          className={itemClasses}
        >
          <HelpCircle className="w-5 h-5 text-gray-500" /> 
          Centro de Ajuda
        </Link>
      </div>
    </div>
  );
}

export default Menu;