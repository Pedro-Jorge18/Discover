import React, { useState, useEffect } from 'react';
import Menu from './Menu.jsx';
import { Globe, Menu as MenuIcon, User, Search, Heart, SlidersHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import FilterModal from './FilterModal.jsx'; // Vamos criar este ficheiro

function Header({ user, setUser, onOpenSettings, onOpenSettingsHost }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [favCount, setFavCount] = useState(0);
  const navigate = useNavigate();

  const updateFavCount = () => {
    const favs = JSON.parse(localStorage.getItem('favoritos') || '[]');
    setFavCount(favs.length);
  };

  useEffect(() => {
    updateFavCount();
    window.addEventListener('storage', updateFavCount);
    return () => window.removeEventListener('storage', updateFavCount);
  }, []);

  const handleSearch = () => {
    if (localSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(localSearch)}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1790px] mx-auto px-5 sm:px-10 py-3 flex items-center justify-between h-20">
        
        <Link to="/" className="w-1/4 flex items-center shrink-0"> 
          <img src='/Logo_Discover.png' className="h-12 w-auto" alt="Logo" />
          <span className="hidden xl:block font-black text-2xl text-blue-600 ml-2 tracking-tighter uppercase italic"></span>
        </Link>

        {/* SEARCH BAR & FILTERS BUTTON */}
        <div className="hidden lg:flex items-center justify-center w-2/4 gap-3">
          <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all pl-6 pr-2 py-1.5 w-full max-w-md group">
            <input 
              type="text"
              placeholder="Para onde quer ir?"
              className="outline-none text-sm text-gray-700 w-full bg-transparent font-medium"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div onClick={handleSearch} className="bg-black rounded-full p-2.5 ml-2 cursor-pointer hover:bg-gray-800 transition-colors active:scale-95">
              <Search className="w-4 h-4 text-white stroke-[3px]" />
            </div>
          </div>

          {/* NOVO BOTÃO DE FILTROS */}
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 border border-gray-300 bg-white p-3.5 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <SlidersHorizontal size={18} className="text-gray-600" />
          </button>
        </div>

        <div className="flex items-center space-x-2 w-1/4 justify-end">
          <button onClick={() => navigate('/search?filter=favorites')} className="relative p-3 text-gray-700 rounded-full hover:bg-gray-100">
            <Heart className={`w-5 h-5 ${favCount > 0 ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            {favCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                {favCount}
              </span>
            )}
          </button>
          <button className="hidden sm:flex items-center gap-1.5 p-3 text-gray-700 rounded-full hover:bg-gray-100 font-bold text-xs uppercase">
            <Globe className="w-4 h-4" /> PT
          </button>
          
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2 border border-gray-300 bg-white rounded-full p-1.5 transition-shadow hover:shadow-md">
              <MenuIcon className="w-4 h-4 text-gray-600 ml-2" />
              <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase italic">
                {user ? user.name.charAt(0) : <User className="w-5 h-5 text-gray-400" />}
              </div>
            </button>
            {isMenuOpen && <Menu user={user} setUser={setUser} onOpenSettings={onOpenSettings} onOpenSettingsHost={onOpenSettingsHost} />}
          </div>
        </div>
      </div>

      {/* MODAL DE FILTROS */}
      {isFilterOpen && <FilterModal onClose={() => setIsFilterOpen(false)} />}
    </header>
  );
}

export default Header;