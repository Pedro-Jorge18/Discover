import React from 'react';

// Component for the image grid - handles broken links with fallbacks
const ListingGallery = ({ photos = [] }) => {
  const fallback = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200';

  const getUrl = (index) => {
    const img = photos[index];
    if (!img?.url) return fallback;
    // If it's a full URL use it, otherwise point to Laravel storage
    return img.url.startsWith('http') ? img.url : `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${img.url}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[400px] md:h-[550px] rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl bg-gray-100">
      <div className="md:col-span-2 md:row-span-2 overflow-hidden">
        <img src={getUrl(0)} className="w-full h-full object-cover hover:scale-105 transition duration-1000" alt="Main" />
      </div>
      <div className="hidden md:block overflow-hidden"><img src={getUrl(1)} className="w-full h-full object-cover" alt="1" /></div>
      <div className="hidden md:block overflow-hidden"><img src={getUrl(2)} className="w-full h-full object-cover" alt="2" /></div>
      <div className="hidden md:block md:col-span-2 overflow-hidden"><img src={getUrl(3)} className="w-full h-full object-cover" alt="3" /></div>
    </div>
  );
};

export default ListingGallery;