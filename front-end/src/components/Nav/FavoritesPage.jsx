import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';
import Footer from '../Layout/Footer.jsx';
import PropertyCard from '../HomePage/PropertyCard.jsx';
import { useNavigate } from 'react-router-dom';
import { HeartOff } from 'lucide-react';

function FavoritesPage({ user, setUser, onOpenSettings, onOpenSettingsHost, onOpenSettingsAdmin }) {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const loadFavorites = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const storageKey = `favoritos_user_${user.id}`;
    const favs = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setFavorites(favs);
  };

  useEffect(() => {
    loadFavorites();
    window.addEventListener('favoritesUpdated', loadFavorites);
    window.addEventListener('storage', loadFavorites);
    return () => {
      window.removeEventListener('favoritesUpdated', loadFavorites);
      window.removeEventListener('storage', loadFavorites);
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-white text-left">
      <Header user={user} setUser={setUser} onOpenSettings={onOpenSettings} onOpenSettingsHost={onOpenSettingsHost} onOpenSettingsAdmin={onOpenSettingsAdmin} />
      <main className="max-w-[1790px] mx-auto px-5 sm:px-10 pt-44 pb-20">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">Os Meus Favoritos</h1>
        </div>
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
            {favorites.map((property) => <PropertyCard key={property.id} property={property} user={user} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <HeartOff className="w-12 h-12 text-gray-200 mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Ainda não guardou nenhum alojamento.</h2>
            <button onClick={() => navigate('/')} className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-full font-black uppercase italic tracking-tighter shadow-lg shadow-blue-100">Explorar agora</button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default FavoritesPage;