import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property, isSliderItem = false }) => {
  const cardClass = isSliderItem 
    ? "min-w-[320px] md:min-w-[360px] snap-start group animate-fadeIn" 
    : "group cursor-pointer animate-fadeIn card-shadow-hover";

  // Using the Resource image structure
  const imagem = property?.images?.[0]?.url || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800';

  return (
    <Link to={`/alojamento/${property?.id}`} className={cardClass}>
      <div className={`${isSliderItem ? 'h-64' : 'h-72'} bg-gray-100 rounded-3xl mb-4 overflow-hidden relative`}>
        {/* Image with smooth zoom effect */}
        <img 
          src={imagem} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" 
          alt={property?.title}
          loading="lazy"
        />
        
        {/* Subtle overlay for better text contrast if needed */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Favorite badge */}
        {isSliderItem && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-sm border border-gray-100">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-700">Premium</span>
          </div>
        )}

        {/* Floating Heart Icon */}
        <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-300">
          <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="text-left space-y-1">
        <h3 className="font-bold text-gray-900 text-[17px] truncate leading-tight group-hover:text-blue-600 transition-colors">
          {property?.title || 'Alojamento'}
        </h3>
        <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
          <span className="opacity-70">📍</span> {property?.location?.city?.name || property?.location?.neighborhood || 'Portugal'}
        </p>
        <div className="pt-1">
          <span className="text-[18px] font-black text-gray-900">€{property?.price?.per_night}</span>
          <span className="text-gray-500 text-sm font-normal"> / noite</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;