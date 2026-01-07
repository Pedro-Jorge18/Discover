import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Nav/Header.jsx';
import Footer from '../Layout/Footer.jsx';
import { Star, Loader2, Users, Bed, Bath, X, CreditCard, Share2, Heart } from 'lucide-react';
import api from '../../api/axios';
import notify from '../../utils/notify';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { pt } from 'date-fns/locale';
import { differenceInDays, addDays, startOfDay } from 'date-fns';

function ListingDetails({ user, setUser, onOpenLogin, onOpenSettings, onOpenSettingsHost, onOpenSettingsAdmin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [alojamento, setAlojamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Reservation dates state
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 1));
  const [hospedes, setHospedes] = useState(1);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await api.get(`properties/${id}`);
        const data = response.data?.data || response.data;
        setAlojamento(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  /**
   * Professional Image Filtering:
   * Prioritizes valid HTTP links (Unsplash) to avoid server timeouts.
   * If local files are broken or missing, it fills the slots with high-quality placeholders instantly.
   */
  const getImageUrl = (index) => {
    const photos = alojamento?.images || [];
    
    // 1. Filter only valid working links (starts with http)
    const validPhotos = photos.filter(img => {
      const p = img.image_path || img.url || img.path;
      return p && p.startsWith('http');
    });

    // 2. High-quality architectural placeholders to avoid delays
    const backupPlaceholders = [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', // Sala
      'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800', // Quarto
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', // Cozinha
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800'  // Casa de Banho
    ];

    // 3. Return the valid photo if available at this index
    if (validPhotos[index]) {
      return validPhotos[index].image_path || validPhotos[index].url || validPhotos[index].path;
    }

    // 4. Otherwise, use a placeholder from the list based on the slot index
    return backupPlaceholders[index % backupPlaceholders.length];
  };

  // Pricing logic
  const pricePerNight = Number(alojamento?.price_per_night || 0);
  const cleaningFee = Number(alojamento?.cleaning_fee || 0);
  const serviceFee = 20; 
  
  const nights = (startDate && endDate) ? Math.max(0, differenceInDays(startOfDay(endDate), startOfDay(startDate))) : 0;
  const nightsPrice = nights * pricePerNight;
  const totalPrice = nights > 0 ? (nightsPrice + cleaningFee + serviceFee) : 0;

  const handleOpenModal = () => {
    if (!user) { 
      if (typeof onOpenLogin === 'function') onOpenLogin();
      else navigate("/login"); 
      return; 
    }
    setShowModal(true);
  };

  const handleConfirmBooking = async () => {
    try {
      setBookingLoading(true);
      await api.post('reservations', {
        property_id: id,
        check_in: startDate.toISOString().split('T')[0],
        check_out: endDate.toISOString().split('T')[0],
        guests: hospedes,
        total_price: totalPrice
      });
      setShowModal(false);
      notify('Reserva efetuada com sucesso!', 'success');
    } catch (err) {
      notify('Erro ao processar reserva.', 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
    </div>
  );

  if (!alojamento) return null;

  return (
    <div className="min-h-screen bg-white text-left font-sans text-gray-900">
      <Header user={user} setUser={setUser} onOpenSettings={onOpenSettings} onOpenSettingsHost={onOpenSettingsHost} onOpenSettingsAdmin={onOpenSettingsAdmin} />

      <main className={`max-w-[1200px] mx-auto px-6 pt-28 pb-20 transition-all duration-700 ${showModal ? 'blur-xl scale-95 opacity-40 pointer-events-none' : ''}`}>
        
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">{alojamento.title}</h1>
            <p className="text-gray-400 font-bold mt-2 italic underline decoration-blue-400 decoration-2 underline-offset-4">
              📍 {alojamento.city?.name || 'Localização não definida'}
            </p>
          </div>
          <div className="flex gap-3">
             <button className="p-3 border rounded-full hover:bg-gray-50 transition shadow-sm"><Share2 size={18}/></button>
             <button className="p-3 border rounded-full hover:bg-gray-50 transition shadow-sm"><Heart size={18}/></button>
          </div>
        </div>

        {/* Gallery Section - Instant Load Logic */}
        <div className="grid grid-cols-4 gap-2 h-[550px] rounded-[3rem] overflow-hidden mb-12 shadow-2xl bg-gray-50 border border-gray-100">
          <div className="col-span-2 row-span-2 overflow-hidden bg-gray-200">
            <img src={getImageUrl(0)} className="w-full h-full object-cover hover:scale-105 transition duration-700" alt="Destaque" />
          </div>
          <div className="overflow-hidden bg-gray-200">
            <img src={getImageUrl(1)} className="w-full h-full object-cover" alt="Interior 1" />
          </div>
          <div className="overflow-hidden bg-gray-200">
            <img src={getImageUrl(2)} className="w-full h-full object-cover" alt="Interior 2" />
          </div>
          <div className="col-span-2 overflow-hidden bg-gray-200">
            <img src={getImageUrl(3)} className="w-full h-full object-cover" alt="Interior 3" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <div className="flex gap-6 mb-10 border-b border-gray-100 pb-10 font-black text-[10px] uppercase text-gray-400 tracking-widest">
              <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl"><Users size={16}/> {alojamento.max_guests} hóspedes</span>
              <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl"><Bed size={16}/> {alojamento.bedrooms} quartos</span>
              <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl"><Bath size={16}/> {alojamento.bathrooms || 1} banho</span>
            </div>
            <h3 className="text-xl font-black mb-6 uppercase italic underline decoration-blue-500 decoration-[6px] underline-offset-8">Sobre este espaço</h3>
            <p className="text-gray-700 leading-relaxed text-xl font-light whitespace-pre-line mb-10">{alojamento.description}</p>
          </div>

          <aside>
            <div className="sticky top-32 bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-2xl text-left">
              <div className="flex justify-between items-baseline mb-8">
                <div>
                  <span className="text-3xl font-black italic">€{Math.round(pricePerNight)}</span>
                  <span className="text-gray-400 font-bold ml-1 text-sm uppercase">/ noite</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  <Star size={12} className="fill-current"/> {alojamento.rating || '4.95'}
                </div>
              </div>

              <div className="border-2 border-gray-100 rounded-4xl mb-6 overflow-hidden">
                <div className="grid grid-cols-2 border-b-2 border-gray-100">
                  <div className="p-4 border-r-2 border-gray-100 hover:bg-gray-50 transition-colors">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Entrada</label>
                    <DatePicker selected={startDate} onChange={d => setStartDate(d)} minDate={new Date()} locale={pt} dateFormat="dd/MM/yyyy" className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer" />
                  </div>
                  <div className="p-4 hover:bg-gray-50 transition-colors">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Saída</label>
                    <DatePicker selected={endDate} onChange={d => setEndDate(d)} minDate={addDays(startDate, 1)} locale={pt} dateFormat="dd/MM/yyyy" className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer" />
                  </div>
                </div>
                <div className="p-4 hover:bg-gray-50 transition-colors">
                   <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Hóspedes</label>
                   <select value={hospedes} onChange={e => setHospedes(Number(e.target.value))} className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer appearance-none">
                    {[...Array(alojamento.max_guests || 1)].map((_, i) => <option key={i+1} value={i+1}>{i+1} hóspedes</option>)}
                   </select>
                </div>
              </div>

              <button onClick={handleOpenModal} className="w-full bg-blue-600 text-white font-black py-5 rounded-[1.8rem] uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                Reservar Agora
              </button>

              <div className="mt-8 space-y-4 text-sm font-bold text-gray-500">
                <div className="flex justify-between items-center italic">
                  <span>Subtotal ({nights} noites)</span>
                  <span className="text-gray-900 font-black">€{nightsPrice}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest">
                  <span>Taxas fixas</span>
                  <span>€{cleaningFee + serviceFee}</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-gray-900 pt-6 border-t border-gray-100 italic uppercase">
                  <span>Total</span>
                  <span className="text-blue-600 font-black">€{totalPrice}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Modal Section */}
      {showModal && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[3.5rem] p-10 shadow-2xl text-left animate-slideUp">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-black transition"><X size={28}/></button>
            <h2 className="text-3xl font-black italic mb-2 uppercase text-gray-900 tracking-tighter">Confirmar Reserva</h2>
            <div className="space-y-4 my-8 font-bold text-gray-900">
              <div className="bg-gray-50 p-6 rounded-[2.5rem] flex justify-between">
                <div>
                  <p className="text-[10px] font-black text-blue-500 uppercase mb-1 tracking-widest">Datas</p>
                  <p className="text-sm">{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-blue-500 uppercase mb-1 tracking-widest">Hóspedes</p>
                  <p className="text-sm font-black">{hospedes} pessoa(s)</p>
                </div>
              </div>
              <div className="px-2 space-y-3 text-gray-500">
                <div className="flex justify-between"><span>Subtotal noites</span><span className="text-gray-900 font-black">€{nightsPrice}</span></div>
                <div className="flex justify-between text-3xl font-black text-gray-900 pt-6 border-t border-gray-100 italic uppercase tracking-tighter">
                  <span>Total</span><span className="text-blue-600 font-black">€{totalPrice}</span>
                </div>
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