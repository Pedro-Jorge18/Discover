import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';
import PropertyCard from '../HomePage/PropertyCard.jsx';
import { useNavigate } from 'react-router-dom';
import { HeartOff } from 'lucide-react';

function FavoritesPage({ user, setUser, onOpenSettings, onOpenSettingsHost, onOpenSettingsAdmin }) {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  // Loads favorites from localStorage for the specific user logged in
  const loadFavorites = () => {
    if (!user) {
      navigate('/login'); // Redirect if user is not authenticated
      return;
    }
    const storageKey = `favoritos_user_${user.id}`;
    const favs = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setFavorites(favs);
  };

  useEffect(() => {
    loadFavorites();
    
    // Listen for real-time updates from PropertyCard components
    window.addEventListener('favoritesUpdated', loadFavorites);
    window.addEventListener('storage', loadFavorites);
    
    return () => {
      window.removeEventListener('favoritesUpdated', loadFavorites);
      window.removeEventListener('storage', loadFavorites);
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-white">
      <Header 
        user={user} 
        setUser={setUser} 
        onOpenSettings={onOpenSettings} 
        onOpenSettingsHost={onOpenSettingsHost}
        onOpenSettingsAdmin={onOpenSettingsAdmin}
      />
      
      <main className="max-w-[1790px] mx-auto px-5 sm:px-10 pt-32 pb-20">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 mb-10">
          Os Meus Favoritos
        </h1>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
            {favorites.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                user={user} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-gray-50 p-8 rounded-full mb-6">
              <HeartOff className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ainda não guardou nenhum alojamento.</h2>
            <p className="text-gray-500 mb-8 max-w-xs">
              Explore as nossas opções e clique no coração para guardar os seus favoritos aqui.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-black uppercase italic tracking-tighter hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
            >
              Explorar agora
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default FavoritesPage;