import React, { useState, useEffect, useCallback, memo } from 'react';
import { Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../contexts/TranslationContext';

const PropertyCard = memo(function PropertyCard({ property, user }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const { t } = useTranslation();

  // Safety check: only create storage key if user and user.id exist
  const storageKey = user && user.id ? `favoritos_user_${user.id}` : null;

  // Renderizar as estrelas baseado no rating
  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            className={`${
              star <= (rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const checkFavoriteStatus = () => {
    // If no user is logged in, item cannot be a favorite
    if (!storageKey) {
      setIsFavorite(false);
      return;
    }
    const favs = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const exists = favs.some(f => String(f.id) === String(property.id));
    setIsFavorite(exists);
  };

  useEffect(() => {
    checkFavoriteStatus();
  }, [property.id, user?.id]); // Only re-run when property or user changes

  useEffect(() => {
    // Only add listeners if user is logged in
    if (!user || !user.id) return;
    
    // Listen for updates from other cards or header
    const handleUpdate = () => checkFavoriteStatus();
    
    window.addEventListener('favoritesUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleUpdate);
    };
  }, [storageKey]); // Only re-run when storageKey changes

  const toggleFavorite = useCallback((e) => {
    e.stopPropagation();

    // If user is null, undefined or has no ID, redirect to login
    if (!user || !user.id) {
      console.log("No user session found, redirecting to login...");
      navigate('/login');
      return;
    }

    let favs = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const exists = favs.find(f => String(f.id) === String(property.id));

    if (exists) {
      favs = favs.filter(f => String(f.id) !== String(property.id));
    } else {
      favs.push(property);
    }
    
    localStorage.setItem(storageKey, JSON.stringify(favs));
    setIsFavorite(!exists);
    
    // Notify other components for real-time update
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  }, [user, storageKey, property.id, navigate]);

  const getImageUrl = useCallback(() => {
    const image = property.images?.[0];
    const raw = image?.thumbnail_url || image?.image_url || image?.url || image?.image_path || image?.path;
    if (!raw) return 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800';
    if (raw.startsWith('http')) return raw;
    const base = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${base}/storage/${raw.replace(/^\/storage\//, '')}`;
  }, [property.images]);

  return (
    <div 
      onClick={() => navigate(`/property/${property.id}`)}
      className="group cursor-pointer text-left"
    >
      <div className="relative aspect-square overflow-hidden rounded-[2.5rem] mb-4 shadow-sm group-hover:shadow-xl transition-shadow duration-300">
        <img 
          src={getImageUrl()} 
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
          alt={property.title}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'; }}
        />
        
        <button 
          onClick={toggleFavorite}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-black/10 backdrop-blur-md hover:scale-110 transition-transform duration-200 active:scale-90"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} 
            strokeWidth={isFavorite ? 0 : 2.5}
          />
        </button>
      </div>

      <div className="px-2">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-black text-gray-900 truncate uppercase tracking-tighter italic text-sm">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-[10px] font-black text-gray-900">
            {renderStars(property.metrics?.rating ? parseFloat(property.metrics.rating) : 0)}
            <span>{property.metrics?.rating ? parseFloat(property.metrics.rating).toFixed(1) : "0"}</span>
          </div>
        </div>
        
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">
          {property.location?.city?.name || "Portugal"}
        </p>

        <div className="flex items-baseline gap-1 text-gray-900">
          <span className="text-lg font-black italic">
            €{Math.round(property.price?.per_night || property.price_per_night || 0)}
          </span>
          <span className="text-gray-400 text-[9px] font-black uppercase tracking-tighter">/ {t('common.night')}</span>
        </div>
      </div>
    </div>
  );
});

export default PropertyCard;