import React, { useState, useEffect } from 'react';
import Header from '../Nav/Header.jsx'; 
import { Link } from 'react-router-dom';
import api from '../../api/axios'; 

function Home({ user, setUser, termoPesquisa, setTermoPesquisa, onOpenSettings, onOpenSettingsHost }) {
  const [alojamentos, setAlojamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const buscarAlojamentos = async () => {
      try {
        setLoading(true);
        const resposta = await api.get('properties');
        
        let dadosParaGuardar = [];
        if (resposta.data && resposta.data.data && Array.isArray(resposta.data.data.data)) {
            dadosParaGuardar = resposta.data.data.data;
        }

        setAlojamentos(dadosParaGuardar);
        setError(null);
      } catch (erro) {
        console.error("Error fetching listings:", erro);
        setError("Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };
    buscarAlojamentos();
  }, []);

  // Filter logic: Checks title, city name or neighborhood
  const alojamentosFiltrados = alojamentos.filter((alojamento) => {
    const busca = termoPesquisa.toLowerCase();
    return (
      alojamento.title?.toLowerCase().includes(busca) ||
      alojamento.location?.neighborhood?.toLowerCase().includes(busca) ||
      alojamento.city?.name?.toLowerCase().includes(busca)
    );
  });

  if (loading) {
    return (
        <div className="min-h-screen pt-20 text-center">
            <Header user={user} setUser={setUser} termoPesquisa={termoPesquisa} setTermoPesquisa={setTermoPesquisa} onOpenSettings={onOpenSettings} onOpenSettingsHost={onOpenSettingsHost}/>
            <div className="mt-20 text-2xl font-semibold text-gray-600">A carregar alojamentos...</div>
        </div>
    );
  }

  return (
    <div className="min-h-screen pt-20"> 
      <Header user={user} setUser={setUser} termoPesquisa={termoPesquisa} setTermoPesquisa={setTermoPesquisa} onOpenSettings={onOpenSettings} onOpenSettingsHost={onOpenSettingsHost}/>

      <main className="max-w-[1790px] mx-auto px-5 sm:px-10 py-6">
        <div className="text-center py-5">
          {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-5">{error}</div>}

          <h2 className="text-xl font-semibold text-gray-700 mb-8">Encontre o seu próximo destino!</h2>
          
          {alojamentosFiltrados.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
                Nenhum resultado encontrado para "{termoPesquisa}"
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
                {alojamentosFiltrados.map((alojamento) => (
                <Link key={alojamento.id} to={`/alojamento/${alojamento.id}`} className="group cursor-pointer">
                    <div className="h-72 bg-gray-200 rounded-xl mb-3 overflow-hidden shadow-sm group-hover:shadow-md transition duration-300 relative">
                        <img
                            src={'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400'}
                            alt={alojamento.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {e.target.src = 'https://placehold.co/600x400?text=Sem+Foto'}}
                        />
                    </div>
                    <div className="text-left">
                        <p className="font-semibold text-gray-800 truncate">{alojamento.title || 'Alojamento Local'}</p>
                        <p className="text-sm text-gray-500">{alojamento.location?.neighborhood || 'Local Desconhecido'}</p>
                        <p className="font-medium text-gray-900 mt-1">€<span className='font-bold'>{alojamento.price?.per_night || '0'}</span> / noite</p>
                    </div>
                </Link>
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;