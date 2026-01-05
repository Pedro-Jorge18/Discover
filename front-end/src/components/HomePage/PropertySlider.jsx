import React, { useRef } from 'react';
import PropertyCard from './PropertyCard';

const PropertySlider = ({ title, subtitle, properties, onVerTudo }) => {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-20">
      <div className="flex justify-between items-end mb-8 px-2">
        <div className="text-left">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            {title}
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 hidden md:block"></span>
          </h2>
          <p className="text-gray-400 font-medium mt-1">{subtitle}</p>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => scroll('left')} className="w-12 h-12 border-2 border-gray-100 rounded-full flex items-center justify-center bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-90">‹</button>
          <button onClick={() => scroll('right')} className="w-12 h-12 border-2 border-gray-100 rounded-full flex items-center justify-center bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-90">›</button>
        </div>
      </div>

      <div ref={sliderRef} className="flex overflow-x-auto gap-8 pb-6 snap-x no-scrollbar scroll-smooth px-2">
        {Array.isArray(properties) && properties.length > 0 ? (
          <>
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} isSliderItem={true} />
            ))}
            
            {/* Elegant View All Card */}
            <div 
              onClick={onVerTudo}
              className="min-w-[220px] flex flex-col items-center justify-center snap-start border-2 border-dashed border-gray-200 rounded-4xl bg-white hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group shrink-0 shadow-sm"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                <span className="text-2xl font-light">→</span>
              </div>
              <span className="font-bold text-gray-800 tracking-wide uppercase text-xs">Ver mais em {title.split(' ')[1]}</span>
            </div>
          </>
        ) : (
          /* High-quality Placeholders */
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[320px] md:min-w-[360px] h-64 bg-gray-50 rounded-4xl animate-pulse border border-gray-100 shrink-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-400 rounded-full animate-spin mx-auto mb-2"></div>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">A carregar...</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PropertySlider;