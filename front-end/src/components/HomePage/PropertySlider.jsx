import React from 'react';
import PropertyCard from './PropertyCard.jsx';
import { ChevronRight } from 'lucide-react';

// Slider component for the homepage sections
// Added 'user' to props to enable favorite functionality within the slider
function PropertySlider({ title, subtitle, properties, onVerTudo, user }) {
  if (!properties || properties.length === 0) return null;

  return (
    <div className="mb-16 animate-fadeIn">
      <div className="flex justify-between items-end mb-8 px-2 text-left">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
            {title}
          </h2>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">
            {subtitle}
          </p>
        </div>
        
        {onVerTudo && (
          <button 
            onClick={onVerTudo}
            className="flex items-center gap-2 text-blue-600 font-black uppercase text-[10px] tracking-widest hover:gap-3 transition-all cursor-pointer"
          >
            Ver Tudo <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Horizontal Scroll Area */}
      <div className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar">
        {properties.map((property) => (
          <div key={property.id} className="min-w-[280px] max-w-[280px] snap-start">
            {/* IMPORTANT: Pass the user prop down to the card */}
            <PropertyCard property={property} user={user} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PropertySlider;