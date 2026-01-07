import React from 'react';

// Skeleton component for a clean, premium loading experience
function PropertySkeleton() {
  return (
    <div className="w-full text-left">
      {/* Image Placeholder with shimmer effect */}
      <div className="relative aspect-square overflow-hidden rounded-[2.5rem] mb-4 bg-gray-100 skeleton shadow-sm" />
      
      <div className="px-2 space-y-3">
        <div className="flex justify-between items-center">
          {/* Title placeholder */}
          <div className="h-5 w-2/3 bg-gray-100 skeleton rounded-full" />
          {/* Rating placeholder */}
          <div className="h-4 w-10 bg-gray-100 skeleton rounded-full" />
        </div>
        
        {/* Subtitle/Location placeholder */}
        <div className="h-3 w-1/3 bg-gray-50 skeleton rounded-full" />
        
        {/* Price placeholder */}
        <div className="h-7 w-20 bg-gray-100 skeleton rounded-xl mt-4" />
      </div>
    </div>
  );
}

export default PropertySkeleton;