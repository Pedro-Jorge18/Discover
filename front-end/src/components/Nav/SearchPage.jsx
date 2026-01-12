import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from '../Layout/Footer.jsx';
import PropertyCard from '../HomePage/PropertyCard.jsx';
import PropertySkeleton from '../HomePage/PropertySkeleton.jsx';
import api from '../../api/axios';
import { useTranslation } from '../../contexts/TranslationContext';

function SearchPage({ user, setUser, onOpenSettings, onOpenSettingsAdmin }) {
  const { t } = useTranslation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await api.get('properties');
        const all = response.data?.data?.data || response.data?.data || response.data || [];
        
        const params = new URLSearchParams(location.search);
        const q = params.get('q')?.toLowerCase() || "";
        const maxPrice = Number(params.get('price')) || Infinity;
        const propertyType = params.get('type');
        const amenities = params.get('amenities')?.split(',').filter(Boolean) || [];

        console.log('Filters applied:', { q, maxPrice, propertyType, amenities });

        const filtered = all.filter(p => {
          // Published only
          const isPublished = p.settings?.published ?? p.published ?? false;
          if (!isPublished) return false;

          // Text search (q)
          const matchesSearch = !q || 
            p.title?.toLowerCase().includes(q) || 
            p.city?.name?.toLowerCase().includes(q) ||
            p.location?.city?.name?.toLowerCase().includes(q);

          // Price filter
          const price = Number(p.price?.per_night ?? p.price_per_night ?? 0);
          const matchesPrice = price <= maxPrice;

          // Type filter
          const typeMap = { 
            'Apartamento': ['apartment', 'apartamento'],
            'Moradia': ['house', 'moradia', 'casa'],
            'Quarto': ['hotel_room', 'hotel room', 'quarto de hotel', 'quarto', 'room'],
            'Todos': 'all' 
          };
          
          const filterType = propertyType ? typeMap[propertyType] : null;
          let matchesType = true;
          
          if (filterType && filterType !== 'all') {
            // Check both property_type (direct) and types.property_type.name (nested)
            const propTypeName = (p.types?.property_type?.name || p.property_type || '').toLowerCase();
            const typesToMatch = Array.isArray(filterType) ? filterType : [filterType];
            matchesType = typesToMatch.some(t => propTypeName.includes(t) || t.includes(propTypeName));
          }

          // Amenities filter - normalize comparison with mapping
          const amenityMap = {
            'wi-fi': ['wi-fi', 'wifi', 'internet'],
            'piscina': ['piscina', 'pool', 'swimming pool'],
            'estacionamento': ['estacionamento', 'parking', 'garage', 'garagem'],
            'ac': ['ac', 'ar condicionado', 'ar-condicionado', 'air conditioning']
          };
          
          const propertyAmenities = p.amenities?.map(a => {
            const name = (a.name || '').toLowerCase().trim();
            return name;
          }) || [];
          
          const matchesAmenities = amenities.length === 0 || 
            amenities.every(reqAmenity => {
              const normalized = reqAmenity.toLowerCase().trim();
              const variants = amenityMap[normalized] || [normalized];
              
              const matches = propertyAmenities.some(pAmenity => 
                variants.some(variant => pAmenity.includes(variant) || variant.includes(pAmenity))
              );
              return matches;
            });

          const matches = matchesSearch && matchesPrice && matchesType && matchesAmenities;
          
          if (!matches && (amenities.length > 0 || propertyType !== 'Todos')) {
            console.log('Property filtered out:', {
              id: p.id,
              title: p.title,
              price: Number(p.price?.per_night ?? p.price_per_night ?? 0),
              type: p.property_type,
              amenities: propertyAmenities,
              matchesSearch,
              matchesPrice,
              matchesType,
              matchesAmenities
            });
          }

          return matches;
        });

        setResults(filtered);
      } catch (err) {
        console.error("Search Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [location.search]);

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} setUser={setUser} onOpenSettings={onOpenSettings} onOpenSettingsAdmin={onOpenSettingsAdmin} />
      <main className="max-w-[1790px] mx-auto px-10 pt-32 pb-20 text-left">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-12 underline decoration-blue-500 decoration-8 underline-offset-4">{t('search.title')}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {loading ? [...Array(10)].map((_, i) => <PropertySkeleton key={i} />) : 
            results.map(p => <PropertyCard key={p.id} property={p} user={user} />)
          }
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SearchPage;