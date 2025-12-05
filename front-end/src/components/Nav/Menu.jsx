import React from 'react';
import { LogIn, HelpCircle, Gift, Home } from 'lucide-react'; // Added Home for host link
import { Link } from 'react-router-dom'; // Added Link for navigation

/**
 * Menu popover component that appears when the user/hamburger icon is clicked.
 * It provides options for login, help, and navigation.
 *
 * @param {object} props
 * @param {function} props.onOpenLogin - Function to show the Login modal.
 * @param {function} props.onCloseMenu - Function to close the menu popover.
 */
function Menu({ onOpenLogin, onCloseMenu }) {
  // Base classes for regular menu items
  const itemClasses = "px-4 py-3 text-gray-800 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition-colors w-full text-left";

  return (
    <div 
      className="absolute top-12 right-0 w-64 bg-white rounded-xl shadow-2xl overflow-hidden z-20 transform origin-top-right"
      // Prevent immediate close on link click
      onClick={onCloseMenu} 
    >
      <div className="py-2">
        
        {/* Item: Log in or Sign up (Primary action) */}
        <div 
          className="px-4 py-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 flex items-center gap-3 w-full text-left"
          // Action: Opens the Login modal and closes the menu popover
          onClick={() => { onOpenLogin(); }} 
        >
          <LogIn className="w-5 h-5 text-gray-600" />
          Entrar ou registar-se
        </div>
        
        <div className="border-t my-2"></div>
        
        {/* HOST TEST BUTTON - Links to the new /host route */}
        <Link 
            to="/host" 
            onClick={onCloseMenu} 
            className="px-4 py-3 text-indigo-600 hover:bg-indigo-50 cursor-pointer flex items-center gap-3 transition-colors font-semibold w-full"
        >
            <Home className="w-5 h-5 text-indigo-600" />
            HostTeste: Menu Anfitrião
        </Link>
        
        <div className="border-t my-2"></div>
        
        {/* Item: Help Center */}
        <Link to="/help" onClick={onCloseMenu} className={itemClasses}>
          <HelpCircle className="w-5 h-5 text-gray-500" />
          Centro de Ajuda
        </Link>

        {/* Item: Gift Cards */}
        <Link to="/gifts" onClick={onCloseMenu} className={itemClasses}>
          <Gift className="w-5 h-5 text-gray-500" />
          Cartões-oferta
        </Link>
        
      </div>
    </div>
  );
}

export default Menu;