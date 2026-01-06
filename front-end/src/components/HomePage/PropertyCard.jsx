import React, { useState, useEffect } from 'react';
import { Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PropertyCard({ property }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favoritos') || '[]');
    setIsFavorite(favs.some(f => f.id === property.id));
  }, [property.id]);

  // Handle favorite toggle with storage event for header update
  const toggleFavorite = (e) => {
    e.stopPropagation();
    let favs = JSON.parse(localStorage.getItem('favoritos') || '[]');
    
    if (isFavorite) {
      favs = favs.filter(f => f.id !== property.id);
    } else {
      favs.push(property);
    }
    
    localStorage.setItem('favoritos', JSON.stringify(favs));
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event('storage'));
  };

  // Helper to get the correct image URL (Fix for image_d1d869)
  const getImageUrl = (img) => {
    const url = img?.url || property.images?.[0]?.url;
    if (!url) return 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800';
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${url}`;
  };

  return (
    <div 
      onClick={() => navigate(`/property/${property.id}`)}
      className="group cursor-pointer text-left"
    >
      <div className="relative aspect-square overflow-hidden rounded-[2.5rem] mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
        <img 
          src={getImageUrl()} 
          className="h-full w-full object-cover group-hover:scale-110 transition duration-700" 
          alt={property.title}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'; }}
        />
        
        <button 
          onClick={toggleFavorite}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-black/10 backdrop-blur-md hover:scale-110 transition active:scale-90"
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
          <div className="flex items-center gap-1 text-[10px] font-black">
            <Star className="w-3 h-3 fill-blue-600 text-blue-600" />
            <span>{property.rating || '4.9'}</span>
          </div>
        </div>
        
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">
          {property.location?.city?.name || "Portugal"}
        </p>

        <div className="flex items-baseline gap-1">
          <span className="text-lg font-black text-gray-900 italic">
            €{Math.round(property.price?.per_night || property.price_per_night || 0)}
          </span>
          <span className="text-gray-400 text-[9px] font-black uppercase tracking-tighter">/ noite</span>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;