import React from 'react';
import Header from '../Nav/Header.jsx'; 
import { Link } from 'react-router-dom';

/**
 * The main application homepage component.
 * It integrates the Header and displays the accommodation listing grid.
 *
 * @param {object} props
 * @param {function} props.onOpenLogin - Function to open the Login modal.
 */
function Home({ onOpenLogin }) {
  return (
    <div className="min-h-screen pt-20"> 
      <title>Home Page</title>
      
      <Header />

      <main className="max-w-[1790px] mx-auto px-5 sm:px-10 py-6">
        
        <div className="text-center py-5">
          <h2 className="text-xl font-semibold text-gray-700 mb-8">
            Encontre o seu próximo destino em Portugal
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {Array.from({ length: 10 }).map((_, index) => (
              
              <Link 
                key={index} 
                // The 'to' prop points to the route defined in AppRoutes.jsx (/alojamento/:id)
                to={`/alojamento/${index + 1}`} 
                className="group cursor-pointer"
              >
                
                <div className="h-72 bg-gray-200 rounded-xl mb-3 overflow-hidden shadow-sm group-hover:shadow-md transition duration-300">
                </div>
                
                <div className="text-left">
                    <p className="font-semibold text-gray-800 truncate">Localização Exemplo, Portugal</p>
                    <p className="text-sm text-gray-500">20-25 Outubro</p>
                    <p className="text-sm text-gray-500">5.0 km de distância</p>
                    <p className="font-medium text-gray-900 mt-1">
                        €<span className='font-bold'>99</span> / noite
                    </p>
                </div>

              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;