import React, { useState, useEffect } from 'react';
import Menu from './Menu.jsx';
import HostNotifications from './HostNotifications.jsx';
import UserNotifications from './UserNotifications.jsx';
import { Globe, Menu as MenuIcon, User, Search, Heart, SlidersHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import FilterModal from './FilterModal.jsx';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher.jsx';
import { useTranslation } from '../../contexts/TranslationContext';

function Header({ user, setUser, onOpenSettings, onOpenSettingsAdmin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [favCount, setFavCount] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Updates the favorite counter based on the specific logged-in user
  const updateFavCount = () => {
    if (!user) {
      setFavCount(0);
      return;
    }
    const storageKey = `favoritos_user_${user.id}`;
    const favs = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setFavCount(favs.length);
  };

  useEffect(() => {
    updateFavCount();
    // Listen for changes in localStorage and custom events for real-time sync
    window.addEventListener('storage', updateFavCount);
    window.addEventListener('favoritesUpdated', updateFavCount);
    
    return () => {
      window.removeEventListener('storage', updateFavCount);
      window.removeEventListener('favoritesUpdated', updateFavCount);
    };
  }, [user]); // Re-sync if user logs in or out

  const handleSearch = () => {
    if (localSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(localSearch)}`);
    }
  };

  const handleFavoriteClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/favoritos');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1790px] mx-auto px-5 sm:px-10 py-3 flex items-center justify-between h-20">
        
        <Link to="/" className="w-1/4 flex items-center shrink-0"> 
          <img src='/Logo_Discover.png' className="h-12 w-auto" alt="Logo" />
          <span className="hidden xl:block font-black text-2xl text-blue-600 ml-2 tracking-tighter uppercase italic"></span>
        </Link>

        <div className="hidden lg:flex items-center justify-center w-2/4 gap-3">
          <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all pl-6 pr-2 py-1.5 w-full max-w-md group">
            <input 
              type="text"
              placeholder={t('header.searchPlaceholder')}
              className="outline-none text-sm text-gray-700 w-full bg-transparent font-medium"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div onClick={handleSearch} className="bg-black rounded-full p-2.5 ml-2 cursor-pointer hover:bg-gray-800 transition-colors active:scale-95">
              <Search className="w-4 h-4 text-white stroke-[3px]" />
            </div>
          </div>

          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 border border-gray-300 bg-white p-3.5 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <SlidersHorizontal size={18} className="text-gray-600" />
          </button>
        </div>

        <div className="flex items-center space-x-2 w-1/4 justify-end">
          <button onClick={handleFavoriteClick} className="relative p-3 text-gray-700 rounded-full hover:bg-gray-100 transition-all">
            <Heart className={`w-5 h-5 ${favCount > 0 && user ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            {user && favCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                {favCount}
              </span>
            )}
          </button>

          {user?.role === 'host' && <HostNotifications user={user} />}
          {user?.role !== 'host' && user && <UserNotifications user={user} />}

          <LanguageSwitcher />
          
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2 border border-gray-300 bg-white rounded-full p-1.5 transition-shadow hover:shadow-md">
              <MenuIcon className="w-4 h-4 text-gray-600 ml-2" />
              <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase italic">
                {user ? user.name.charAt(0) : <User className="w-5 h-5 text-gray-400" />}
              </div>
            </button>
            {isMenuOpen && <Menu user={user} setUser={setUser} onOpenSettings={onOpenSettings} onOpenSettingsAdmin={onOpenSettingsAdmin} onCloseMenu={() => setIsMenuOpen(false)} />}
          </div>
        </div>
      </div>

      {isFilterOpen && <FilterModal onClose={() => setIsFilterOpen(false)} />}
    </header>
  );
}

export default Header;