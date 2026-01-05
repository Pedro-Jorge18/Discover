import React, { useState, useEffect } from 'react';
import Header from '../Nav/Header.jsx'; 
import api from '../../api/axios'; 
import PropertySlider from './PropertySlider.jsx';
import PropertyCard from './PropertyCard.jsx';

function Home({ user, setUser, termoPesquisa, setTermoPesquisa, onOpenSettings, onOpenSettingsHost, onOpenSettingsAdmin }) {
  const [alojamentos, setAlojamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarAlojamentos = async () => {
      try {
        setLoading(true);
        const resposta = await api.get('properties');
        // Usando a tua extração de dados que funciona
        let dados = resposta.data?.data?.data || resposta.data?.data || resposta.data || [];
        setAlojamentos(dados);
      } catch (erro) {
        console.error("Erro na API", erro);
      } finally {
        setLoading(false);
      }
    };
    buscarAlojamentos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 text-center">
        <Header user={user} setUser={setUser} termoPesquisa={termoPesquisa} setTermoPesquisa={setTermoPesquisa} onOpenSettings={onOpenSettings} onOpenSettingsHost={onOpenSettingsHost} onOpenSettingsAdmin={onOpenSettingsAdmin} />
        <div className="mt-20 text-2xl font-semibold text-gray-600">A carregar alojamentos...</div>
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

  // Filters using the Resource path: location.city.name
  const porto = alojamentos.filter(a => a.location?.city?.name?.toLowerCase().includes('porto'));
  const madrid = alojamentos.filter(a => a.location?.city?.name?.toLowerCase().includes('madri'));
  const economicos = alojamentos.filter(a => Number(a.price?.per_night ?? Infinity) <= 60);
  const luxo = alojamentos.filter(a => Number(a.price?.per_night ?? 0) >= 150);
  // Search filter: if `termoPesquisa` is numeric treat as price filter (<= for small numbers, >= for large)
  const filtrados = (() => {
    if (!termoPesquisa) return alojamentos;

    const q = String(termoPesquisa).trim().toLowerCase();
    const qNum = Number(q);
    const isNumber = !Number.isNaN(qNum);

    if (isNumber) {
      // heuristic: numbers <= 100 are economical filters (<=), larger numbers are luxury (>=)
      if (qNum <= 100) {
        return alojamentos.filter(a => Number(a.price?.per_night ?? Infinity) <= qNum);
      }
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
      <Header user={user} setUser={setUser} termoPesquisa={termoPesquisa} setTermoPesquisa={setTermoPesquisa} onOpenSettings={onOpenSettings} onOpenSettingsHost={onOpenSettingsHost} onOpenSettingsAdmin={onOpenSettingsAdmin} />

      <main className="max-w-[1790px] mx-auto px-5 sm:px-10 py-6">
        
        <PropertySlider title="Destaques Porto" subtitle="O melhor da Invicta" properties={porto} onVerTudo={() => handleVerTudo('Porto')} />
        
        <PropertySlider title="Estadias Económicas" subtitle="Viagens Low Cost" properties={economicos} onVerTudo={() => handleVerTudo('60')} />

        <PropertySlider title="Destaques Madrid" subtitle="Cultura e diversão" properties={madrid} onVerTudo={() => handleVerTudo('Madri')} />

        <PropertySlider title="Experiências de Luxo" subtitle="Estadias exclusivas" properties={luxo} onVerTudo={() => handleVerTudo('150')} />

        <hr className="my-16 border-gray-100" />
        
        <div id="resultados-pesquisa" className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {termoPesquisa ? `A mostrar alojamentos para "${termoPesquisa}"` : 'Todos os Alojamentos'}
          </h2>
          {termoPesquisa && (
            <button onClick={() => setTermoPesquisa('')} className="text-blue-500 font-semibold hover:underline cursor-pointer">Ver tudo de novo</button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12 mb-24">
          {filtrados.length > 0 ? (
            filtrados.map((a) => <PropertyCard key={a.id} property={a} />)
          ) : (
            !loading && <p className="col-span-full text-center text-gray-400">Nenhum alojamento encontrado.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;