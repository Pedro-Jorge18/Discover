import React, { useState, useEffect } from 'react';
import Header from '../Nav/Header.jsx'; 
import api from '../../api/axios'; 
import PropertySlider from './PropertySlider.jsx';
import PropertyCard from './PropertyCard.jsx';
import PropertySkeleton from './PropertySkeleton.jsx';

function Home({ user, setUser, termoPesquisa, setTermoPesquisa, onOpenSettings, onOpenSettingsAdmin }) {
  const [alojamentos, setAlojamentos] = useState([]);
  const [loading, setLoading] = useState(true);

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
      }, 100); // 100ms delay

    } catch (erro) {
      console.error("API Error:", erro);
      setLoading(false);
    }
  };
  buscarAlojamentos();
}, []);

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
            {[...Array(10)].map((_, i) => (
              <PropertySkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  const handleVerTudo = (keyword) => {
    setTermoPesquisa(keyword);
    const section = document.getElementById('resultados-pesquisa');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Pre-filtering logic for UI sections
  const porto = alojamentos.filter(a => a.location?.city?.name?.toLowerCase().includes('porto'));
  const madrid = alojamentos.filter(a => a.location?.city?.name?.toLowerCase().includes('madri'));
  const economicos = alojamentos.filter(a => Number(a.price?.per_night ?? Infinity) <= 60);
  const luxo = alojamentos.filter(a => Number(a.price?.per_night ?? 0) >= 150);

  // Dynamic search logic for global listings
  const filtrados = (() => {
    if (!termoPesquisa) return alojamentos;
    const q = String(termoPesquisa).trim().toLowerCase();
    const qNum = Number(q);
    const isNumber = !Number.isNaN(qNum);

    if (isNumber) {
      if (qNum <= 100) return alojamentos.filter(a => Number(a.price?.per_night ?? Infinity) <= qNum);
      return alojamentos.filter(a => Number(a.price?.per_night ?? 0) >= qNum);
    }

    return alojamentos.filter(a => {
      const city = String(a.location?.city?.name ?? '').toLowerCase();
      const title = String(a.title ?? '').toLowerCase();
      return city.includes(q) || title.includes(q);
    });
  })();

  return (
    <div className="min-h-screen pt-20">
      <title>Discover - Página Inicial</title>
      <Header user={user} setUser={setUser} termoPesquisa={termoPesquisa} setTermoPesquisa={setTermoPesquisa} onOpenSettings={onOpenSettings} onOpenSettingsAdmin={onOpenSettingsAdmin} />

      <main className="max-w-[1790px] mx-auto px-5 sm:px-10 py-6 text-left">
        <PropertySlider user={user} title="Destaques Porto" subtitle="O melhor da Invicta" properties={porto} onVerTudo={() => handleVerTudo('Porto')} />
        <PropertySlider user={user} title="Estadias Económicas" subtitle="Viagens Low Cost" properties={economicos} onVerTudo={() => handleVerTudo('60')} />
        <PropertySlider user={user} title="Destaques Madrid" subtitle="Cultura e diversão" properties={madrid} onVerTudo={() => handleVerTudo('Madri')} />
        <PropertySlider user={user} title="Experiências de Luxo" subtitle="Estadias exclusivas" properties={luxo} onVerTudo={() => handleVerTudo('150')} />

        <hr className="my-16 border-gray-100" />
        
        <div id="resultados-pesquisa" className="mb-8 flex justify-between items-center">
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
            {termoPesquisa ? `A mostrar alojamentos para "${termoPesquisa}"` : 'Todos os Alojamentos'}
          </h2>
          {termoPesquisa && (
            <button onClick={() => setTermoPesquisa('')} className="text-blue-600 font-black uppercase text-xs tracking-widest hover:underline cursor-pointer transition">Ver tudo de novo</button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12 mb-24">
          {filtrados.length > 0 ? (
            filtrados.map((a) => <PropertyCard key={a.id} property={a} user={user} />)
          ) : (
            <p className="col-span-full text-center text-gray-400 font-bold uppercase italic tracking-widest py-20">Nenhum alojamento encontrado.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;