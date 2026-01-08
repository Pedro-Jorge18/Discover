import React from 'react';
import { MapPin, Users, Eye, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

function PropertyList({ properties, onView, onEdit, onDelete, onToggleStatus }) {
  const { t } = useTranslation();
  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(property => (
        <div
          key={property.id}
          className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition group"
        >
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-black text-gray-900 line-clamp-1">
                {property.title}
              </h3>
              <button
                onClick={() => onToggleStatus(property.id, property.published)}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide transition ${
                  property.published
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                {property.published ? t('host.active') : t('host.inactive')}
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <MapPin size={14} />
              <span className="line-clamp-1">{property.location?.city?.name || t('property.location')}</span>
            </div>

            <p className="text-xs font-semibold text-gray-500 mb-3 line-clamp-2">
              {property.location?.address || property.address || t('property.locationNotDefined')}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <Users size={14} />
                {property.capacity?.max_guests || property.max_guests}
              </span>
              <span>•</span>
              <span className="font-bold text-blue-600 text-lg">
                €{property.price?.per_night || property.price_per_night}/{t('common.perNight')}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => onView(property.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-sm"
              >
                <Eye size={16} />
                {t('host.view')}
              </button>
              <button
                onClick={() => onEdit(property)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-semibold text-sm"
              >
                <Edit size={16} />
                {t('host.editProperty')}
              </button>
              <button
                onClick={() => onDelete(property)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PropertyList;