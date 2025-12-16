import React, { useState, useEffect } from 'react';
import Header from '../Nav/Header.jsx'; 
import { Link } from 'react-router-dom';
import api from '../../api/axios'; 

function Home({ user, setUser, onOpenLogin }) {
  // State to store the fetched properties
  const [alojamentos, setAlojamentos] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for error messages
  const [error, setError] = useState(null);

  useEffect(() => {
    const buscarAlojamentos = async () => {
      try {
        setLoading(true);
        
        // API Call to fetch properties (now using /api due to Vite Proxy)
        const resposta = await api.get('properties');
        
        let dadosParaGuardar = [];

        // Adjusted logic to parse Laravel Resource structure: { data: { data: [...] } }
        if (resposta.data && resposta.data.data && Array.isArray(resposta.data.data.data)) {
            dadosParaGuardar = resposta.data.data.data;
        } 

        setAlojamentos(dadosParaGuardar);
        setError(null); // Clear previous errors

      } catch (erro) {
        // Log the error for debugging purposes
        console.error("❌ CONNECTION ERROR. Check if 'php artisan serve' is running.", erro);
        setError("Erro ao carregar dados. Verifique a consola ou o servidor.");
      } finally {
        setLoading(false);
      }
    };

    buscarAlojamentos();
  }, []); 

  if (loading) {
    return (
        <div className="min-h-screen pt-20 text-center">
            <Header user={user} setUser={setUser} onOpenLogin={onOpenLogin}/>
            <div className="mt-20 text-2xl font-semibold text-gray-600">A carregar dados reais...</div>
        </div>
    );
  }

  return (
    <div className="min-h-screen pt-20"> 
      <title>Home Page</title>
      <Header user={user} setUser={setUser} onOpenLogin={onOpenLogin}/>

      <main className="max-w-[1790px] mx-auto px-5 sm:px-10 py-6">
        <div className="text-center py-5">
            {/* Display error message if connection fails */}
            {error && <div className="text-red-600 mb-5 text-xl font-semibold">{error}</div>}

          <h2 className="text-xl font-semibold text-gray-700 mb-8">
            Encontre o seu próximo destino (LIGADO À BASE DE DADOS!)
          </h2>
          
          {(!alojamentos || alojamentos.length === 0) ? (
            <div className="text-center py-10 text-gray-500">
                A lista de casas está vazia ou o formato de dados é inválido.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
                {alojamentos.map((alojamento) => (
                <Link key={alojamento.id} to={`/alojamento/${alojamento.id}`} className="group cursor-pointer">
                    <div className="h-72 bg-gray-200 rounded-xl mb-3 overflow-hidden shadow-sm group-hover:shadow-md transition duration-300 relative">
                        {/* Image Placeholder - Since image URL is not easily available in the provided JSON structure */}
                        <img 
                            src={'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&w=400'} 
                            alt={alojamento.title}
                            className="w-full h-full object-cover"
                            // Fallback image if the placeholder fails
                            onError={(e) => {e.target.src = 'https://placehold.co/600x400?text=Sem+Foto'}}
                        />
                    </div>
                    
                    <div className="text-left">
                        {/* Title: uses 'title' key from JSON */}
                        <p className="font-semibold text-gray-800 truncate">
                            {alojamento.title || 'Alojamento Local'}
                        </p>
                        
                        {/* Location: uses 'location.neighborhood' key from JSON */}
                        <p className="text-sm text-gray-500">
                            {alojamento.location?.neighborhood || 'Local Desconhecido'}
                        </p>
                        
                        {/* Price: uses 'price.per_night' key from JSON */}
                        <p className="font-medium text-gray-900 mt-1">
                            €<span className='font-bold'>{alojamento.price?.per_night || '0'}</span> / noite
                        </p>
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