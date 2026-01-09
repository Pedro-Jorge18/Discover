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

        const filtered = all.filter(p => 
          p.title?.toLowerCase().includes(q) || 
          p.city?.name?.toLowerCase().includes(q) ||
          p.location?.city?.name?.toLowerCase().includes(q)
        );

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