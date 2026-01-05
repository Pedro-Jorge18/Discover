import React, { useState } from 'react';
import Menu from './Menu.jsx';
import { Globe, Menu as MenuIcon, User, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

// Added search props to handle global filtering
function Header({ user, setUser, termoPesquisa, setTermoPesquisa, onOpenSettings, onOpenSettingsHost }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <header className="fixed top-0 left-0 right-0 z-10 transition-colors duration-300 bg-white border-b border-gray-100">
      <div className="max-w-[1790px] mx-auto px-5 sm:px-10 py-3 flex items-center justify-between h-20">
        
        {/* LEFT: Logo */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0 w-1/5"> 
          <span className="text-3xl">
            <img src='/Logo_Discover.png' height="60" width="60" alt="Logo" />
          </span>
        </Link>

        {/* CENTER: Functional Search Bar */}
        <div className="hidden lg:flex items-center justify-center w-3/5">
          <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 pl-6 pr-2 py-2">
            
            {/* Real Input Field */}
            <input 
              type="text"
              placeholder="Pesquisar por nome ou cidade..."
              className="outline-none text-sm text-gray-700 w-64 bg-transparent"
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
            />

            {/* Black Search Icon as requested */}
            <div className="bg-black rounded-full p-2.5 ml-2 cursor-pointer hover:bg-gray-800 transition-colors">
              <Search className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* RIGHT: Menu and Settings */}
        <div className="flex items-center space-x-1 shrink-0 w-1/5 justify-end">
          <button className="hidden sm:block p-3 text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
            <Globe className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button onClick={toggleMenu} className="flex items-center space-x-2 border border-gray-300 bg-white rounded-full p-2 transition-shadow hover:shadow-md focus:outline-none">
              <MenuIcon className="w-4 h-4 text-gray-600" />
              <User className="w-8 h-8 p-1 bg-gray-100 text-gray-500 rounded-full" />
            </button>
            {isMenuOpen && <Menu user={user} setUser={setUser} onOpenSettings={onOpenSettings} onOpenSettingsHost={onOpenSettingsHost} />}
          </div>
        </div>

      </div>
    </header>
  );
}

export default Header;