import React from 'react';
import Header from '../Nav/Header.jsx';
import { Share2, Heart, Star } from 'lucide-react';

/**
 * The listing details page component (the route that will open when clicking a card).
 * This serves as the base template for all accommodation pages.
 */
function ListingDetails() {
  return (
    <div className="min-h-screen">
      
      {/* 1. The Fixed Header (transparent) */}
      <Header onOpenLogin={() => { console.log('Login solicitado da página Listing'); }} />

      <main className="max-w-[1790px] mx-auto px-5 sm:px-10 py-28"> 
        
        {/* Title and Actions (Share/Save) */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Alojamento Exemplo na Cidade Antiga de Lisboa
          </h1>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 fill-current text-green-500" />
              <span className="font-semibold">4.8</span>
              <span>(120 Avaliações)</span>
              <span>·</span>
              <span className="underline cursor-pointer">Localização Exata</span>
            </div>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-1 hover:text-gray-900 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Partilhar</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-gray-900 transition-colors">
                <Heart className="w-4 h-4" />
                <span>Guardar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery (Placeholder Grid) */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2 rounded-xl overflow-hidden mb-12 h-[600px] shadow-lg">
          {/* Main Image */}
          <div className="col-span-1 row-span-2 bg-gray-300">
            <div className="w-full h-full bg-cover bg-center flex items-center justify-center text-gray-700">
                Imagem Principal
            </div>
          </div>
          
          {/* Side Images */}
          <div className="col-span-1 row-span-1 bg-gray-200">
            <div className="w-full h-full bg-cover bg-center flex items-center justify-center text-gray-700">
                Imagem 2
            </div>
          </div>
          <div className="col-span-1 row-span-1 bg-gray-200">
            <div className="w-full h-full bg-cover bg-center flex items-center justify-center text-gray-700">
                Imagem 3
            </div>
          </div>
        </div>

        {/* Content Section (Description + Booking Box) */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Details and Description (Left) */}
          <div className="lg:w-7/12">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-4">
              Apartamento Inteiro, Hospedado por Pedro
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              2 Hóspedes · 1 Quarto · 1 Cama · 1 Casa de Banho
            </p>
            <p className="text-gray-700 leading-relaxed mb-8 border-b pb-8">
              Este é o design de base para a descrição do alojamento. Usaremos este espaço para descrever as comodidades, as regras da casa e a experiência de alojamento. A vista é fantástica!
            </p>

            {/* Amenities/Highlights (Placeholder) */}
            <div className="space-y-4">
                <p className="font-semibold">O que este lugar oferece:</p>
                <ul className="grid grid-cols-2 gap-y-2 text-gray-700">
                    <li>Wifi Grátis</li>
                    <li>Cozinha Completa</li>
                    <li>Estacionamento na Rua</li>
                    <li>Máquina de Lavar</li>
                </ul>
            </div>
          </div>

          {/* Booking Box (Right) */}
          <div className="lg:w-5/12">
            <div className="sticky top-24 p-6 border border-gray-200 rounded-xl shadow-lg bg-white">
              <div className="flex justify-between items-end mb-4">
                <span className="text-2xl font-bold text-gray-900">€120</span>
                <span className="text-sm text-gray-600">/ noite</span>
              </div>
              
              {/* Date and Guest Box (Placeholder) */}
              <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
                <div className="p-3 border-b">Datas (Calendário)</div>
                <div className="p-3">Hóspedes (Dropdown)</div>
              </div>

              <button className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors">
                Verificar Disponibilidade
              </button>

              <p className="text-center text-sm text-gray-500 mt-3">
                Não será cobrado nada para já.
              </p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

export default ListingDetails;