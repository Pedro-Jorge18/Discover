import React, { useState, useEffect } from 'react';
import Header from '../Nav/Header.jsx'; 
import api from '../../api/axios'; 
import PropertySlider from './PropertySlider.jsx';
import PropertyCard from './PropertyCard.jsx';

function Home({ user, setUser, termoPesquisa, setTermoPesquisa, onOpenSettings, onOpenSettingsHost }) {
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
        console.error("Erro na API");
      } finally {
        setLoading(false);
      }
    };
    buscarAlojamentos();
  }, []);

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
  const economicos = alojamentos.filter(a => a.price?.per_night <= 60);
  const luxo = alojamentos.filter(a => a.price?.per_night >= 150);

  // Search filter updated for city name
  const filtrados = alojamentos.filter(a => {
    const busca = termoPesquisa?.toLowerCase() || "";
    return (
        <div className="min-h-screen pt-20 text-center">
            <Header user={user} setUser={setUser} termoPesquisa={termoPesquisa} setTermoPesquisa={setTermoPesquisa} onOpenSettings={onOpenSettings} onOpenSettingsHost={onOpenSettingsHost}/>
            <div className="mt-20 text-2xl font-semibold text-gray-600">A carregar alojamentos...</div>
        </div>
      a.title?.toLowerCase().includes(busca) ||
      a.location?.city?.name?.toLowerCase().includes(busca)
    );
  });

  return (
    <div className="min-h-screen pt-20"> 
      <Header user={user} setUser={setUser} termoPesquisa={termoPesquisa} setTermoPesquisa={setTermoPesquisa} onOpenSettings={onOpenSettings} onOpenSettingsHost={onOpenSettingsHost}/>

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