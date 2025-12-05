import React, { useState } from 'react';
import Menu from './Menu.jsx';
import { Globe, Menu as MenuIcon, User, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Main navigation header component with a central search bar.
 *
 * @param {object} props
 * @param {function} props.onOpenLogin - Function to open the Login modal in App.jsx.
 */
function Header({ onOpenLogin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu state
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  // Function to close the menu
  const handleCloseMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-10 transition-colors duration-300">
      {/* Container for the whole header content */}
      <div className="max-w-[1790px] mx-auto px-5 sm:px-10 py-3 flex items-center justify-between h-20">
        
        {/* 1. Logo and Site Name (Left) - Link to Homepage */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0 w-1/5"> 
          <span className="text-3xl">
            🏨
          </span>
          <span className="text-xl font-bold text-gray-900 hidden sm:block">
            Teste
          </span>
        </Link>

        {/* 2. CENTRAL SEARCH BAR (MID) */}
        <div className="hidden lg:flex items-center justify-center w-3/5">
          <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200">
            
            {/* Field 1: Location */}
            <button className="px-5 py-2.5 text-sm font-medium text-gray-900 border-r border-gray-200 rounded-l-full hover:bg-gray-50">
              Qualquer lugar
            </button>
            
            {/* Field 2: Date */}
            <button className="px-5 py-2.5 text-sm font-medium text-gray-900 border-r border-gray-200 hover:bg-gray-50">
              Qualquer data
            </button>

            {/* Field 3: Travelers + Search Button */}
            <div className="flex items-center">
              <button className="pl-5 pr-3 py-2.5 text-sm font-light text-gray-500 rounded-r-full hover:bg-gray-50">
                Adicionar viajantes
              </button>
              
              {/* Search Button (Green) */}
              <div className="bg-green-500 rounded-full p-2.5 mr-2 ml-1 cursor-pointer hover:bg-green-600 transition-colors">
                <Search className="w-5 h-5 text-white" />
              </div>
            </div>

          </div>
        </div>
        
        {/* 3. Secondary Menus (Right) */}
        <div className="flex items-center space-x-1 shrink-0 w-1/5 justify-end">

          {/* Language Icon */}
          <button className="hidden sm:block p-3 text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
            <Globe className="w-5 h-5" />
          </button>

          {/* User/Menu Button */}
          <div className="relative">
            <button 
              onClick={toggleMenu}
              className="flex items-center space-x-2 border border-gray-300 bg-white rounded-full p-2 transition-shadow hover:shadow-md focus:outline-none"
              aria-expanded={isMenuOpen}
              aria-controls="user-menu-popover"
            >
              <MenuIcon className="w-4 h-4 text-gray-600" />
              <User className="w-8 h-8 p-1 bg-gray-100 text-gray-500 rounded-full" />
            </button>
            
            {/* Render the Menu Popover */}
            {isMenuOpen && (
              <Menu onOpenLogin={onOpenLogin} onCloseMenu={handleCloseMenu} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;