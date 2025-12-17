import React, { useState, useEffect } from 'react';
import Header from '../Nav/Header.jsx'; 
import { Link } from 'react-router-dom';
// Correct import based on your folder structure (src/components/HomePage/ -> src/api/)
import api from '../../api/axios'; 

function Home({ user, setUser, onOpenLogin }) {
  // STATE: Stores the list of properties
  const [alojamentos, setAlojamentos] = useState([]);
  // STATE: Manages loading state (spinner/text)
  const [loading, setLoading] = useState(true);
  // STATE: Manages error messages
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch data from the API
    const buscarAlojamentos = async () => {
      try {
        setLoading(true);
        console.log("▶️ Starting API request...");
        
        // request to GET /api/properties
        // Note: The baseURL is already defined in src/api/axios.js
        const resposta = await api.get('properties');
        
        // DEBUG: Logs to inspect the data structure in the Console tomorrow
        console.log("✅ API Response:", resposta);
        console.log("📦 Raw Data (resposta.data):", resposta.data);

        // DATA HANDLING LOGIC:
        // Adapts to receive either a simple array or a Laravel Resource object { data: [...] }
        let dadosParaGuardar = [];

        if (Array.isArray(resposta.data)) {
            // Case 1: The response is directly the array
            dadosParaGuardar = resposta.data;
        } else if (resposta.data && Array.isArray(resposta.data.data)) {
            // Case 2: Laravel Resource wrapper (common standard) -> { data: [...] }
            dadosParaGuardar = resposta.data.data;
        } else {
            console.warn("⚠️ Unexpected data format. Received:", resposta.data);
        }

        // Update state with the clean data
        setAlojamentos(dadosParaGuardar);
        setError(null);

      } catch (erro) {
        console.error("❌ Error fetching listings:", erro);
        setError("Não foi possível carregar os dados. Verifique a ligação ao servidor.");
      } finally {
        // Stop loading whether it worked or failed
        setLoading(false);
      }
    };

    buscarAlojamentos();
  }, []); // Empty array ensures this runs only once on mount

  // 1. Loading View
  if (loading) {
    return (
        <div className="min-h-screen pt-20 text-center">
            <Header user={user} setUser={setUser} onOpenLogin={onOpenLogin}/>
            <div className="mt-20 text-2xl font-semibold text-gray-600">A carregar alojamentos...</div>
        </div>
    );
  }

  // 2. Main View
  return (
    <div className="min-h-screen pt-20"> 
      <title>Home Page</title>
      
      <Header user={user} setUser={setUser} onOpenLogin={onOpenLogin}/>

      <main className="max-w-[1790px] mx-auto px-5 sm:px-10 py-6">
        <div className="text-center py-5">
            {/* Error Message Display */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-5">
                    {error}
                </div>
            )}

          <h2 className="text-xl font-semibold text-gray-700 mb-8">
            Encontre o seu próximo destino (LIGADO À BASE DE DADOS!)
          </h2>
          
          {/* EMPTY STATE CHECK: If the array is empty, show a message instead of breaking */}
          {(!alojamentos || alojamentos.length === 0) ? (
            <div className="text-center py-10 text-gray-500">
                {error ? "Erro na conexão." : "Nenhum alojamento encontrado neste momento."}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
                
                {/* MAPPING LOOP: Iterate over the apartments */}
                {alojamentos.map((alojamento) => (
                <Link 
                    key={alojamento.id} 
                    to={`/alojamento/${alojamento.id}`} 
                    className="group cursor-pointer"
                >
                    <div className="h-72 bg-gray-200 rounded-xl mb-3 overflow-hidden shadow-sm group-hover:shadow-md transition duration-300 relative">
                        {/* Image with Fallback logic */}
                        <img 
                            // Tries multiple field names for the image, or a placeholder
                            src={alojamento.main_image_url || alojamento.image_url || 'https://placehold.co/600x400?text=Sem+Imagem'} 
                            alt={alojamento.title || 'Alojamento'}
                            className="w-full h-full object-cover"
                            // If the image link is broken, replace with placeholder
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400?text=Erro+Imagem'; }}
                        />
                    </div>
                    
                    <div className="text-left">
                        {/* Title with Fallback */}
                        <p className="font-semibold text-gray-800 truncate">
                            {alojamento.title || alojamento.name || 'Alojamento Local'}
                        </p>
                        
                        {/* Location with Fallback */}
                        <p className="text-sm text-gray-500">
                            {alojamento.city || 'Portugal'}, {alojamento.country || ''}
                        </p>
                        
                        {/* Price with Fallback */}
                        <p className="font-medium text-gray-900 mt-1">
                            €<span className='font-bold'>{alojamento.price_per_night || alojamento.price || '0'}</span> / noite
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