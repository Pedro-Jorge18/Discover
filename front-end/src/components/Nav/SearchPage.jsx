import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from '../Layout/Footer.jsx';
import PropertyCard from '../HomePage/PropertyCard.jsx';
import api from '../../api/axios';
import { Loader2, Heart, Sparkles, SearchX } from 'lucide-react';

function SearchPage({ user, setUser, onOpenSettings, onOpenSettingsHost }) {
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
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
        const isFavoritesPage = queryParams.get('filter') === 'favorites';

        if (isFavoritesPage) {
          // Favorites view with recommendations
          const favs = JSON.parse(localStorage.getItem('favoritos') || '[]');
          setResults(favs);
          const favIds = favs.map(f => f.id);
          setSuggestions(allProperties.filter(p => !favIds.includes(p.id)).slice(0, 10));
        } else {
          // Search view combining name, price and type filters
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
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Erro na pesquisa:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAndFilter();
  }, [location.search]); 

  return (
    <div className="min-h-screen bg-white text-left font-sans">
      <Header user={user} setUser={setUser} onOpenSettings={onOpenSettings} onOpenSettingsHost={onOpenSettingsHost} />
      <main className="max-w-[1790px] mx-auto px-5 sm:px-10 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
            {new URLSearchParams(location.search).get('filter') === 'favorites' ? "Os Meus Favoritos" : "Resultados da Pesquisa"}
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">
            Encontramos {results.length} estadias disponiveis
          </p>
        </div>

        {loading ? (
          <div className="py-40 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">A filtrar alojamentos...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
              {results.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
            {results.length === 0 && (
              <div className="py-40 text-center">
                <SearchX size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-black uppercase italic tracking-widest text-sm">Sem resultados disponiveis.</p>
              </div>
            )}
            {new URLSearchParams(location.search).get('filter') === 'favorites' && suggestions.length > 0 && (
              <div className="mt-40">
                <div className="flex items-center gap-3 mb-10">
                  <Sparkles className="text-blue-600" size={28} />
                  <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Sugestoes para si</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
                  {suggestions.map(p => <PropertyCard key={p.id} property={p} />)}
                </div>
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