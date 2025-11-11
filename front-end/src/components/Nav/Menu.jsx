import React from 'react';
import { LogIn, HelpCircle, Gift } from 'lucide-react'; 

/**
 * Menu popover component that appears when the user/hamburger icon is clicked.
 * It provides options for login, help, and navigation.
 *
 * @param {object} props
 * @param {function} props.onOpenLogin - Function to show the Login modal.
 * @param {function} props.onCloseMenu - Function to close the menu popover.
 */
function Menu({ onOpenLogin, onCloseMenu }) {
  const itemClasses = "px-4 py-3 text-gray-800 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition-colors";

  return (
    <div 
      className="absolute top-12 right-0 w-64 bg-white rounded-xl shadow-2xl overflow-hidden z-20 transform origin-top-right animate-in fade-in zoom-in-95"
      // Use setTimeout to allow the click event to propagate before closing
      onClick={() => setTimeout(onCloseMenu, 100)} 
    >
      <div className="py-2">
        
        {/* Item: Log in or Sign up (Primary action) */}
        <div 
          className="px-4 py-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 flex items-center gap-3"
          // Action: Opens the Login modal and closes the menu popover
          onClick={() => { onOpenLogin(); onCloseMenu(); }} 
        >
          <LogIn className="w-5 h-5 text-gray-600" />
          Entrar ou registar-se
        </div>
        
        <div className="border-t my-2"></div>
        
        {/* Item: Help Center */}
        <div className={itemClasses}>
          <HelpCircle className="w-5 h-5 text-gray-500" />
          Centro de Ajuda
        </div>

        {/* Item: Gift Cards */}
        <div className={itemClasses}>
          <Gift className="w-5 h-5 text-gray-500" />
          Cartões-oferta
        </div>
        
        <div className="border-t my-2"></div> 

        {/* Item: Become a Host (Added back for completeness) */}
        <div className={itemClasses}>
          Tornar-se um Anfitrião
        </div> 
        
      </div>
    </div>
  );
}

export default Menu;