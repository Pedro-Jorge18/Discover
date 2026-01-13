import React from 'react';
import { Users, Bed, Bath, MapPin } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

const ListingInfo = ({ city, country, description, guests, bedrooms, bathrooms, address }) => {
  const { t } = useTranslation();
  return (
    <div className="lg:col-span-2">
      <div className="border-b border-gray-100 pb-10 mb-10">
        <h2 className="text-3xl font-black text-gray-900 italic">{t('property.spaceIn')} {country || city || t('property.locationNotDefined')}</h2>
        <div className="flex flex-wrap gap-4 text-gray-500 font-medium mt-4 text-lg">
          <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl"><Users size={20}/> {guests} {t('common.guests')}</span>
          <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl"><Bed size={20}/> {bedrooms} {t('common.bedrooms')}</span>
          <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl"><Bath size={20}/> {bathrooms} {t('common.bathrooms')}</span>
        </div>
        <div className="mt-6 flex items-start gap-2 text-gray-600 text-base font-semibold">
          <MapPin size={18} className="text-blue-600 mt-0.5" />
          <span className="leading-snug">{address || t('property.locationNotDefined')}</span>
        </div>
      </div>
      <div className="mb-12">
        <h3 className="text-xl font-black mb-6 uppercase italic underline decoration-blue-500 decoration-[6px] underline-offset-8">{t('property.about')}</h3>
        <p className="text-gray-700 leading-relaxed text-xl font-light whitespace-pre-line">{description}</p>
      </div>
    </div>
  );
};

export default ListingInfo;