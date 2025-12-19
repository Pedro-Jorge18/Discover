import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Nav/Header.jsx';
import Footer from '../Layout/Footer.jsx';
import { Share2, Heart, Star, Loader2, MapPin, Users, BedDouble, Bath } from 'lucide-react';
import api from '../../api/axios';

function ListingDetails({ user, setUser, onOpenLogin }) {
  const { id } = useParams();
  const [alojamento, setAlojamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        // Request to your Laravel API
        const response = await api.get(`properties/${id}`);
        
        // Handling the direct JSON structure you provided
        if (response.data && response.data.id) {
          setAlojamento(response.data);
        } else {
          setError("Alojamento não encontrado.");
        }
      } catch (err) {
        console.error("❌ API Error:", err);
        setError("Erro ao carregar os detalhes do alojamento.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-black" />
    </div>
  );

  if (error || !alojamento) return (
    <div className="min-h-screen">
      <Header user={user} setUser={setUser} onOpenLogin={onOpenLogin} />
      <div className="pt-40 text-center">
        <h2 className="text-2xl font-bold text-gray-800">{error}</h2>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} setUser={setUser} onOpenLogin={onOpenLogin} />

      <main className="max-w-[1120px] mx-auto px-6 pt-28 pb-12">
        {/* Title and Top Actions */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{alojamento.title}</h1>
          <div className="flex justify-between items-center mt-2 text-sm font-medium">
            <div className="flex items-center space-x-2 underline">
              <Star className="w-4 h-4 fill-current" />
              <span>{alojamento.rating || "Novo"}</span>
              <span>·</span>
              <span>{alojamento.city?.name}, {alojamento.neighborhood}</span>
            </div>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg underline"><Share2 size={16}/><span>Partilhar</span></button>
              <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg underline"><Heart size={16}/><span>Guardar</span></button>
            </div>
          </div>
        </div>

        {/* Gallery Placeholder (Using one of your images or Unsplash) */}
        <div className="grid grid-cols-4 gap-2 h-[400px] rounded-xl overflow-hidden mb-8">
          <div className="col-span-2 row-span-2">
            <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800" className="w-full h-full object-cover hover:brightness-90 transition" alt="Main" />
          </div>
          <div className="col-span-1">
            <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400" className="w-full h-full object-cover hover:brightness-90 transition" alt="Room" />
          </div>
          <div className="col-span-1">
            <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400" className="w-full h-full object-cover hover:brightness-90 transition" alt="Kitchen" />
          </div>
          <div className="col-span-2">
            <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800" className="w-full h-full object-cover hover:brightness-90 transition" alt="Interior" />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left Side: Description & Details */}
          <div className="md:col-span-2">
            <div className="border-b pb-6 mb-6">
              <h2 className="text-xl font-semibold">Espaço em {alojamento.city?.name} · Anfitrião: {alojamento.host?.name}</h2>
              <p className="text-gray-600 mt-1">
                {alojamento.max_guests} hóspedes · {alojamento.bedrooms} quartos · {alojamento.beds} camas · {alojamento.bathrooms} casa de banho
              </p>
            </div>

            <div className="py-2 mb-6">
              <h3 className="text-xl font-semibold mb-4">Sobre este espaço</h3>
              <p className="text-gray-700 leading-7 whitespace-pre-line">
                {alojamento.description}
              </p>
            </div>
          </div>

          {/* Right Side: Booking Card */}
          <div className="relative">
            <div className="sticky top-28 border rounded-2xl p-6 shadow-xl bg-white border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <p><span className="text-2xl font-bold">€{Math.round(alojamento.price_per_night)}</span> <span className="text-gray-600">noite</span></p>
                <div className="flex items-center space-x-1 text-sm font-semibold">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{alojamento.rating || "Novo"}</span>
                </div>
              </div>

              <div className="border border-gray-400 rounded-xl overflow-hidden mb-4">
                <div className="grid grid-cols-2 border-b border-gray-400">
                  <div className="p-3 border-r border-gray-400"><p className="text-[10px] font-bold">CHECK-IN</p><p className="text-sm text-gray-500">Adicionar data</p></div>
                  <div className="p-3"><p className="text-[10px] font-bold">CHECK-OUT</p><p className="text-sm text-gray-500">Adicionar data</p></div>
                </div>
                <div className="p-3"><p className="text-[10px] font-bold">HÓSPEDES</p><p className="text-sm text-gray-500">1 hóspede</p></div>
              </div>

              <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition mb-4">
                {alojamento.instant_book ? "Reservar Já" : "Pedir Reserva"}
              </button>

              <p className="text-center text-xs text-gray-500 mb-4">Não será cobrado nada ainda</p>

              <div className="space-y-3 text-gray-600">
                <div className="flex justify-between underline"><span>Taxa de limpeza</span><span>€{Math.round(alojamento.cleaning_fee)}</span></div>
                <div className="flex justify-between underline"><span>Taxa de serviço</span><span>€{Math.round(alojamento.service_fee)}</span></div>
                <hr className="my-4" />
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>€{Math.round(Number(alojamento.price_per_night) + Number(alojamento.cleaning_fee) + Number(alojamento.service_fee))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ListingDetails;