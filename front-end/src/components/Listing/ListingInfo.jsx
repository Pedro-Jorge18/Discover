import React from 'react';
import { Users, Bed, Bath } from 'lucide-react';

const ListingInfo = ({ city, description, guests, bedrooms, bathrooms }) => {
  return (
    <div className="lg:col-span-2">
      <div className="border-b border-gray-100 pb-10 mb-10">
        <h2 className="text-3xl font-black text-gray-900 italic">Espaço em {city || "Portugal"}</h2>
        <div className="flex flex-wrap gap-4 text-gray-500 font-medium mt-4 text-lg">
          <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl"><Users size={20}/> {guests} hóspedes</span>
          <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl"><Bed size={20}/> {bedrooms} quartos</span>
          <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl"><Bath size={20}/> {bathrooms} banho</span>
        </div>
      </div>
      <div className="mb-12">
        <h3 className="text-xl font-black mb-6 uppercase italic underline decoration-blue-500 decoration-[6px] underline-offset-8">Sobre este espaço</h3>
        <p className="text-gray-700 leading-relaxed text-xl font-light whitespace-pre-line">{description}</p>
      </div>
    </div>
  );
};

export default ListingInfo;