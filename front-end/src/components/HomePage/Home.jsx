import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Header from '../Nav/Header.jsx'; 
import api from '../../api/axios'; 
import PropertySlider from './PropertySlider.jsx';
import PropertyCard from './PropertyCard.jsx';
import PropertySkeleton from './PropertySkeleton.jsx';
import { useTranslation } from '../../contexts/TranslationContext';

function Home({ user, setUser, termoPesquisa, setTermoPesquisa, onOpenSettings, onOpenSettingsAdmin }) {
  const [alojamentos, setAlojamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(15); // Show only 15 properties initially
  const [activeCategory, setActiveCategory] = useState(null); // Track active category filter
  const { t } = useTranslation();
  const loaderRef = useRef(null); // Ref for infinite scroll trigger

  useEffect(() => {
  const buscarAlojamentos = async () => {
    try {
      setLoading(true);
      
      const resposta = await api.get('properties');
      const dados = resposta.data?.data?.data || resposta.data?.data || resposta.data || [];
      
      // Artificial delay to prevent UI flickering and allow shimmer effect to be visible
      setTimeout(() => {
        setAlojamentos(dados);
        setLoading(false);
      }, 0); // 0ms delay

    } catch (erro) {
      console.error("API Error:", erro);
      setLoading(false);
    }
  };
  buscarAlojamentos();
}, []);

  // Memoized handler for "Ver Tudo" button
  const handleVerTudo = useCallback((category) => {
    setActiveCategory(category);
    setTermoPesquisa(''); // Clear search term
    const section = document.getElementById('resultados-pesquisa');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [setTermoPesquisa]);

  // Pre-filtering logic for UI sections - memoized to avoid recalculating on every render
  const publicados = useMemo(() => 
    alojamentos.filter(a => (a.settings?.published ?? a.published ?? false)),
    [alojamentos]
  );
  
  const porto = useMemo(() => 
    publicados.filter(a => a.location?.city?.name?.toLowerCase().includes('porto')),
    [publicados]
  );
  
  const madrid = useMemo(() => 
    publicados.filter(a => a.location?.city?.name?.toLowerCase().includes('madri')),
    [publicados]
  );
  
  const economicos = useMemo(() => 
    publicados.filter(a => Number(a.price?.per_night ?? Infinity) <= 60),
    [publicados]
  );
  
  const luxo = useMemo(() => 
    publicados.filter(a => Number(a.price?.per_night ?? 0) >= 150),
    [publicados]
  );

  // Dynamic search logic for global listings - memoized
  const filtrados = useMemo(() => {
    // If category is active, return the specific category
    if (activeCategory === 'porto') return porto;
    if (activeCategory === 'madrid') return madrid;
    if (activeCategory === 'economicos') return economicos;
    if (activeCategory === 'luxo') return luxo;
    
    // If no category and no search term, return all
    if (!termoPesquisa) return publicados;
    
    // Otherwise, use search term logic
    const q = String(termoPesquisa).trim().toLowerCase();
    const qNum = Number(q);
    const isNumber = !Number.isNaN(qNum);

    if (isNumber) {
      if (qNum <= 100) return publicados.filter(a => Number(a.price?.per_night ?? Infinity) <= qNum);
      return publicados.filter(a => Number(a.price?.per_night ?? 0) >= qNum);
    }

    return publicados.filter(a => {
      const city = String(a.location?.city?.name ?? '').toLowerCase();
      const title = String(a.title ?? '').toLowerCase();
      return city.includes(q) || title.includes(q);
    });
  }, [publicados, termoPesquisa, activeCategory, porto, madrid, economicos, luxo]);

  // Paginated results for performance - only show limited properties
  const displayedProperties = useMemo(() => 
    filtrados.slice(0, displayLimit),
    [filtrados, displayLimit]
  );

  const hasMore = filtrados.length > displayLimit;

  const loadMore = useCallback(() => {
    setDisplayLimit(prev => prev + 15);
  }, []);

  // Infinite scroll: load more when loader element comes into view
  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0, rootMargin: '100px' } // Trigger 100px before reaching the element
    );

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loadMore]);

  // Professional loading state using Skeletons instead of a simple spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header user={user} setUser={setUser} termoPesquisa={termoPesquisa} setTermoPesquisa={setTermoPesquisa} onOpenSettings={onOpenSettings} onOpenSettingsAdmin={onOpenSettingsAdmin} />
        <main className="max-w-[1790px] mx-auto px-5 sm:px-10 pt-28 pb-20 text-left">
          <div className="mb-12">
            <div className="h-10 w-64 skeleton rounded-2xl mb-4" />
            <div className="h-3 w-40 skeleton rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
            {[...Array(15)].map((_, i) => (
              <PropertySkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <title>Discover - Página Inicial</title>
      <Header user={user} setUser={setUser} termoPesquisa={termoPesquisa} setTermoPesquisa={setTermoPesquisa} onOpenSettings={onOpenSettings} onOpenSettingsAdmin={onOpenSettingsAdmin} />

      <main className="max-w-[1790px] mx-auto px-5 sm:px-10 py-6 text-left">
        <PropertySlider user={user} title={t('home.featuredPorto')} subtitle={t('home.featuredPortoSubtitle')} properties={porto} onVerTudo={() => handleVerTudo('porto')} />
        <PropertySlider user={user} title={t('home.economicalStays')} subtitle={t('home.economicalStaysSubtitle')} properties={economicos} onVerTudo={() => handleVerTudo('economicos')} />
        <PropertySlider user={user} title={t('home.featuredMadrid')} subtitle={t('home.featuredMadridSubtitle')} properties={madrid} onVerTudo={() => handleVerTudo('madrid')} />
        <PropertySlider user={user} title={t('home.luxuryExperiences')} subtitle={t('home.luxuryExperiencesSubtitle')} properties={luxo} onVerTudo={() => handleVerTudo('luxo')} />

        <hr className="my-16 border-gray-100" />
        
        <div id="resultados-pesquisa" className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
            {termoPesquisa ? `${t('common.search')} "${termoPesquisa}"` : t('home.allProperties')}
          </h2>
          {termoPesquisa && (
            <button onClick={() => setTermoPesquisa('')} className="text-blue-600 font-black uppercase text-xs tracking-widest hover:underline cursor-pointer transition">{t('common.viewAll')}</button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12 mb-24">
          {displayedProperties.length > 0 ? (
            displayedProperties.map((a) => <PropertyCard key={a.id} property={a} user={user} />)
          ) : (
            <p className="col-span-full text-center text-gray-400 font-bold uppercase italic tracking-widest py-20">{t('home.noResults')}</p>
          )}
        </div>

        {/* Infinite Scroll Trigger */}
        {hasMore && (
          <div ref={loaderRef} className="flex justify-center mb-24 py-8">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;