import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from '../Layout/Footer.jsx';
import PropertyCard from '../HomePage/PropertyCard.jsx';
import PropertySkeleton from '../HomePage/PropertySkeleton.jsx'; // Updated import
import api from '../../api/axios';
import { SearchX } from 'lucide-react';

function SearchPage({ user, setUser, onOpenSettings, onOpenSettingsHost, onOpenSettingsAdmin }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchAndFilter = async () => {
      try {
        setLoading(true);
        const response = await api.get('properties');
        const allProperties = response.data?.data?.data || response.data?.data || response.data || [];

        const queryParams = new URLSearchParams(location.search);
        const searchTerm = queryParams.get('q')?.toLowerCase().trim() || "";
        const filterPrice = queryParams.get('price');
        const filterType = queryParams.get('type');

        // Combined filtering logic for URL parameters
        const filtered = allProperties.filter(item => {
          const matchesText = !searchTerm || 
            `${item.title} ${item.description} ${item.location?.city?.name}`.toLowerCase().includes(searchTerm);
          const itemPrice = Number(item.price?.per_night || item.price_per_night || 0);
          const matchesPrice = !filterPrice || itemPrice <= Number(filterPrice);
          const matchesType = !filterType || filterType === 'Todos' || 
            item.type?.toLowerCase() === filterType.toLowerCase() ||
            item.title?.toLowerCase().includes(filterType.toLowerCase());

          return matchesText && matchesPrice && matchesType;
        });
        
        setResults(filtered);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAndFilter();
  }, [location.search]);

  return (
    <div className="min-h-screen bg-white text-left font-sans">
      <Header user={user} setUser={setUser} onOpenSettings={onOpenSettings} onOpenSettingsHost={onOpenSettingsHost} onOpenSettingsAdmin={onOpenSettingsAdmin} />
      
      <main className="max-w-[1790px] mx-auto px-5 sm:px-10 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Resultados da Pesquisa</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">
            Encontramos {results.length} estadias disponiveis
          </p>
        </div>

        {loading ? (
          /* Professional Skeleton Grid for Search Results */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
            {[...Array(10)].map((_, i) => (
              <PropertySkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
              {results.map(p => <PropertyCard key={p.id} property={p} user={user} />)}
            </div>
            {results.length === 0 && (
              <div className="py-40 text-center">
                <SearchX size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-black uppercase italic tracking-widest text-sm">Sem resultados disponiveis.</p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default SearchPage;