import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Nav/Header.jsx';
import { Star, Loader2, Users, Bed, Bath, CheckCircle2, X, CreditCard, Share2, Heart, Info } from 'lucide-react';
import api from '../../api/axios';
import notify from '../../utils/notify';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { pt } from 'date-fns/locale';
import { differenceInDays } from 'date-fns';

function ListingDetails({ user, setUser, onOpenLogin, onOpenSettings, onOpenSettingsHost, onOpenSettingsAdmin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Main States
  const [alojamento, setAlojamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Reservation Form States
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hospedes, setHospedes] = useState(1);

  // Check if this property is in user's favorites
  const checkFavoriteStatus = () => {
    if (!user || !user.id) {
      setIsFavorite(false);
      return;
    }
    const storageKey = `favoritos_user_${user.id}`;
    const favs = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setIsFavorite(favs.some(f => String(f.id) === String(id)));
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await api.get(`properties/${id}`);
        const data = response.data?.data || response.data;
        setAlojamento(data);
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProperty();
      checkFavoriteStatus();
    }
  }, [id, user]);

  // Logic to add/remove from account-based favorites
  const toggleFavorite = () => {
    if (!user || !user.id) {
      navigate("/login");
      return;
    }

    const storageKey = `favoritos_user_${user.id}`;
    let favs = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const exists = favs.find(f => String(f.id) === String(id));

    if (exists) {
      favs = favs.filter(f => String(f.id) !== String(id));
    } else {
      favs.push(alojamento);
    }

    localStorage.setItem(storageKey, JSON.stringify(favs));
    setIsFavorite(!exists);

    // Notify Header and other components in real-time
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

  // --- SAFE DATA MAPPING ---
  const pricePerNight = Number(alojamento?.price?.per_night || alojamento?.price_per_night || 0);
  const cleaningFee = Number(alojamento?.price?.cleaning_fee || alojamento?.cleaning_fee || 0);
  const serviceFee = Number(alojamento?.price?.service_fee || alojamento?.service_fee || 0);
  const city = alojamento?.location?.city?.name || alojamento?.city?.name || "Portugal";
  const photos = alojamento?.images || [];
  
  // Booking Calculations
  const nights = (startDate && endDate) ? Math.max(0, differenceInDays(endDate, startDate)) : 0;
  const nightsPrice = nights * pricePerNight;
  const totalPrice = nightsPrice + cleaningFee + serviceFee;

  const handleOpenModal = () => {
    if (!startDate || !endDate || nights <= 0) {
      notify("Por favor, selecione datas válidas de entrada e saída.", 'error');
      return;
    }
    if (!user) {
      if (typeof onOpenLogin === 'function') onOpenLogin();
      else notify("Inicie sessão para reservar.", 'error');
      navigate("/login");
      return;
    }
    setShowModal(true);
  };

  const handleConfirmBooking = async () => {
    try {
      setBookingLoading(true);
      await api.post('bookings', {
        property_id: id,
        check_in: startDate.toISOString().split('T')[0],
        check_out: endDate.toISOString().split('T')[0],
        guests: hospedes,
        total_price: totalPrice
      });
      setShowModal(false);
      notify('Reserva confirmada com sucesso!', 'success');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">A carregar detalhes...</p>
      </div>
    </div>
  );

  if (!alojamento) return <div className="p-20 text-center font-black uppercase italic tracking-tighter">Alojamento não encontrado.</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-left relative overflow-x-hidden">
      <Header 
        user={user} 
        setUser={setUser} 
        onOpenSettings={onOpenSettings} 
        onOpenSettingsHost={onOpenSettingsHost} 
        onOpenSettingsAdmin={onOpenSettingsAdmin} 
      />

      <main className={`max-w-[1200px] mx-auto px-6 pt-28 pb-20 transition-all duration-700 ${showModal ? 'blur-xl scale-95 opacity-40 pointer-events-none' : ''}`}>
        
        {/* Title Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">{alojamento.title}</h1>
            <p className="text-gray-400 font-bold mt-2 underline italic decoration-blue-400 decoration-2 underline-offset-4 cursor-pointer">
              📍 {city}
            </p>
          </div>
          <div className="flex gap-3">
             <button className="p-3 border rounded-full hover:bg-gray-50 transition shadow-sm active:scale-90"><Share2 size={18}/></button>
             {/* Updated Heart Button with Favorite Logic */}
             <button 
                onClick={toggleFavorite}
                className="p-3 border rounded-full hover:bg-gray-50 transition shadow-sm active:scale-90 group"
             >
                <Heart 
                    size={18} 
                    className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                    strokeWidth={isFavorite ? 0 : 2.5}
                />
             </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-4 gap-2 h-[400px] md:h-[550px] rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl bg-gray-100">
          <div className="col-span-2 row-span-2 overflow-hidden">
            <img src={photos[0]?.url || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200'} className="w-full h-full object-cover hover:scale-105 transition duration-1000" alt="Main" />
          </div>
          <img src={photos[1]?.url || 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600'} className="w-full h-full object-cover" alt="1" />
          <img src={photos[2]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600'} className="w-full h-full object-cover" alt="2" />
          <img src={photos[3]?.url || 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200'} className="col-span-2 w-full h-full object-cover" alt="3" />
        </div>

        {/* Content & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <div className="border-b border-gray-100 pb-10 mb-10 text-left">
              <h2 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter">Espaço em {city}</h2>
              <div className="flex flex-wrap gap-4 text-gray-500 font-bold mt-4 text-sm">
                <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl font-black uppercase tracking-widest text-[10px]"><Users size={16}/> {alojamento.max_guests} hóspedes</span>
                <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl font-black uppercase tracking-widest text-[10px]"><Bed size={16}/> {alojamento.bedrooms} quartos</span>
                <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl font-black uppercase tracking-widest text-[10px]"><Bath size={16}/> {alojamento.bathrooms} banho</span>
              </div>
            </div>
            
            <div className="mb-12 text-left">
              <h3 className="text-xl font-black mb-6 uppercase italic underline decoration-blue-500 decoration-[6px] underline-offset-8">Sobre este espaço</h3>
              <p className="text-gray-700 leading-relaxed text-xl font-light whitespace-pre-line">{alojamento.description}</p>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="relative">
            <div className="sticky top-32 bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-2xl ring-1 ring-gray-900/5 text-left">
              <div className="flex justify-between items-baseline mb-8">
                <div>
                  <span className="text-3xl font-black text-gray-900 italic">€{Math.round(pricePerNight)}</span>
                  <span className="text-gray-400 font-bold ml-1 text-sm uppercase">/ noite</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{alojamento.rating || "Novo"}</span>
                </div>
              </div>

              <div className="border-2 border-gray-100 rounded-[1.8rem] mb-6 overflow-hidden">
                <div className="grid grid-cols-2 border-b-2 border-gray-100">
                  <div className="p-4 border-r-2 border-gray-100 hover:bg-gray-50 transition-colors">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Check-in</label>
                    <DatePicker 
                      selected={startDate} 
                      onChange={d => setStartDate(d)} 
                      placeholderText="00/00/0000" 
                      className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer" 
                      locale={pt} 
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                  <div className="p-4 hover:bg-gray-50 transition-colors">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Check-out</label>
                    <DatePicker 
                      selected={endDate} 
                      onChange={d => setEndDate(d)} 
                      placeholderText="00/00/0000" 
                      className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer" 
                      locale={pt} 
                      dateFormat="dd/MM/yyyy" 
                      minDate={startDate}
                    />
                  </div>
                </div>
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Hóspedes</label>
                  <select value={hospedes} onChange={e => setHospedes(Number(e.target.value))} className="w-full bg-transparent text-sm font-bold outline-none appearance-none cursor-pointer">
                    {[...Array(alojamento.max_guests || 1)].map((_, i) => <option key={i+1} value={i+1}>{i+1} hóspedes</option>)}
                  </select>
                </div>
              </div>

              <button onClick={handleOpenModal} className="w-full bg-blue-600 text-white font-black py-5 rounded-[1.8rem] shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs">
                Reservar Agora
              </button>

              <div className="mt-8 space-y-4 text-sm font-bold text-gray-500">
                <div className="flex justify-between items-center underline decoration-gray-100 italic">
                  <span>Subtotal ({nights} noites)</span>
                  <span className="text-gray-900 font-black">€{nightsPrice}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-gray-900 pt-6 border-t border-gray-100 italic tracking-tighter uppercase">
                  <span>Total</span>
                  <span className="text-blue-600 font-black">€{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reservation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl p-10 animate-slideUp text-left">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-black transition"><X size={28}/></button>
            <h2 className="text-3xl font-black italic mb-2 tracking-tighter uppercase">Confirmar Estadia</h2>
            <div className="space-y-4 my-8 font-bold">
              <div className="bg-gray-50 p-6 rounded-[2.5rem] flex justify-between">
                <div><p className="text-[10px] font-black text-blue-500 uppercase mb-1 tracking-widest">Datas</p><p className="text-sm">{startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}</p></div>
                <div className="text-right"><p className="text-[10px] font-black text-blue-500 uppercase mb-1 tracking-widest">Hóspedes</p><p className="text-sm">{hospedes}</p></div>
              </div>
              <div className="px-2 space-y-4 text-gray-500">
                <div className="flex justify-between"><span>{nights} noites x €{pricePerNight}</span><span className="text-gray-900 font-black">€{nightsPrice}</span></div>
                <div className="flex justify-between"><span>Taxas fixas</span><span className="text-gray-900 font-black">€{cleaningFee + serviceFee}</span></div>
                <div className="flex justify-between text-3xl font-black text-gray-900 pt-6 border-t border-gray-100 italic tracking-tighter uppercase"><span>Total</span><span className="text-blue-600 font-black">€{totalPrice}</span></div>
              </div>
            </div>
            <button onClick={handleConfirmBooking} disabled={bookingLoading} className="w-full bg-blue-600 text-white font-black py-6 rounded-[2.2rem] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs italic">
              {bookingLoading ? <Loader2 className="animate-spin"/> : <><CreditCard size={18}/> Confirmar e Pagar</>}
            </button>
          </div>
        </div>
      )}

      

      <Footer />
    </div>
  );
}

export default ListingDetails;