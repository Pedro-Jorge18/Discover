import React, { memo, useRef } from 'react';
import PropertyCard from './PropertyCard.jsx';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

// Slider component for the homepage sections
// Added 'user' to props to enable favorite functionality within the slider
// Memoized to prevent unnecessary re-renders
// Limited to 10 properties for performance
const PropertySlider = memo(function PropertySlider({ title, subtitle, properties, onVerTudo, user }) {
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  
  if (!properties || properties.length === 0) return null;

  // Limit to first 8 properties for performance
  const displayProperties = properties.slice(0, 8);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300; // Scroll by ~1 card width
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
            {t('common.viewAll')} <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Horizontal Scroll Area */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} className="text-gray-900" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} className="text-gray-900" />
        </button>

        <div ref={scrollRef} className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar scroll-smooth">
          {displayProperties.map((property) => (
            <div key={property.id} className="min-w-[280px] max-w-[280px] snap-start flex-shrink-0">
              {/* IMPORTANT: Pass the user prop down to the card */}
              <PropertyCard property={property} user={user} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default PropertySlider;