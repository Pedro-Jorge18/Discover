import React from 'react';
import { MapPin, Users, Eye, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

function PropertyList({ properties, onView, onEdit, onDelete, onToggleStatus }) {
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
          {/* Image */}
          <div className="relative h-48 bg-gray-200 overflow-hidden">
            {property.images && property.images[0] ? (
              <img
                src={property.images[0].image_path || property.images[0].url}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon size={48} className="text-gray-400" />
              </div>
            )}
            <div className="absolute top-3 right-3">
              <button
                onClick={() => onToggleStatus(property.id, property.published)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  property.published
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                {property.published ? 'Ativo' : 'Inativo'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-5">
            <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-1">
              {property.title}
            </h3>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <MapPin size={14} />
              <span className="line-clamp-1">{property.location?.city?.name || 'Localização'}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <Users size={14} />
                {property.capacity?.max_guests || property.max_guests}
              </span>
              <span>•</span>
              <span className="font-bold text-blue-600 text-lg">
                €{property.price?.per_night || property.price_per_night}/noite
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => onView(property.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-sm"
              >
                <Eye size={16} />
                Ver
              </button>
              <button
                onClick={() => onEdit(property)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-semibold text-sm"
              >
                <Edit size={16} />
                Editar
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