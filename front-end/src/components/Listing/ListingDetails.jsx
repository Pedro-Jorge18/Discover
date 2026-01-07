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
import ReviewsList from '../Review/ReviewsList.jsx';
import ReviewForm from '../Review/ReviewForm.jsx';
import PaymentModal from '../Booking/PaymentModal.jsx';

function ListingDetails({ user, setUser, onOpenLogin, onOpenSettings, onOpenSettingsAdmin }) {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Core data and UI states
    const [alojamento, setAlojamento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    
    // Modals control
    const [showModal, setShowModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Reservation settings
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(addDays(new Date(), 1));
    const [hospedes, setHospedes] = useState(1);

    // Review and social states
    const [canReview, setCanReview] = useState(false);
    const [eligibleReservation, setEligibleReservation] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);

    const fallbacks = [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800'
    ];

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                const response = await api.get(`properties/${id}`);
                const data = response.data?.data || response.data;
                setAlojamento(data);
                
                // Sync favorites and review permissions if user is logged in
                if (user?.id) {
                    const storageKey = `favoritos_user_${user.id}`;
                    const favs = JSON.parse(localStorage.getItem(storageKey) || '[]');
                    setIsFavorite(favs.some(f => String(f.id) === String(id)));
                    setCanReview(true);
                    setEligibleReservation({ id: null });
                }
            } catch (err) {
                console.error("Fetch property error:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProperty();
    }, [id, user]);

    // Handles gallery rendering with modulo logic for short arrays
    const getImageUrl = (index) => {
        const validPhotos = (alojamento?.images || []).filter(img => img.image_path || img.url || img.path);
        if (validPhotos.length > 0) {
            const safeIndex = index % validPhotos.length;
            const path = validPhotos[safeIndex].image_path || validPhotos[safeIndex].url || validPhotos[safeIndex].path;
            if (path.startsWith('http')) return path;
            return `http://127.0.0.1:8000/storage/${path}`;
        }
        return fallbacks[index % 4];
    };

    const handleImgError = (e, index) => {
        e.target.onerror = null; 
        e.target.src = fallbacks[index % 4];
    };

    const toggleFavorite = () => {
        if (!user?.id) { navigate("/login"); return; }
        const storageKey = `favoritos_user_${user.id}`;
        let favs = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const exists = favs.some(f => String(f.id) === String(id));

        if (exists) {
            favs = favs.filter(f => String(f.id) !== String(id));
            setIsFavorite(false);
        } else {
            favs.push(alojamento);
            setIsFavorite(true);
        }
        localStorage.setItem(storageKey, JSON.stringify(favs));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
    };

    // Calculation logic for stay costs
    const pricePerNight = Number(alojamento?.price_per_night || 0);
    const cleaningFee = Number(alojamento?.cleaning_fee || 0);
    const serviceFee = 20; 
    const nights = (startDate && endDate) ? Math.max(0, differenceInDays(startOfDay(endDate), startOfDay(startDate))) : 0;
    const nightsPrice = nights * pricePerNight;
    const totalPrice = nights > 0 ? (nightsPrice + cleaningFee + serviceFee) : 0;

    // Transition from summary modal to payment modal
    const handleOpenPayment = () => {
        setShowModal(false);
        setShowPaymentModal(true);
    };

    // Final API call to process payment and reservation
    const handleFinalPayment = async () => {
        try {
            setBookingLoading(true);
            const response = await api.post('/payments', {
                property_id: id,
                check_in: startDate.toISOString().split('T')[0],
                check_out: endDate.toISOString().split('T')[0],
                guests: hospedes,
                total_price: totalPrice
            });

            notify('Pagamento processado com sucesso!', 'success');
            setShowPaymentModal(false);
            navigate('/payment/success');

        } catch (error) {
            console.error("Payment submission error:", error);
            notify(error.response?.data?.error || 'Erro ao processar o pagamento.', 'error');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white font-sans">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
    );

    if (!alojamento) return null;

    return (
        <div className="min-h-screen bg-white text-left font-sans text-gray-900">
            <Header user={user} setUser={setUser} onOpenSettings={onOpenSettings} onOpenSettingsAdmin={onOpenSettingsAdmin} />

            <main className={`max-w-[1200px] mx-auto px-6 pt-28 pb-20 transition-all duration-700 ${showModal || showPaymentModal ? 'blur-xl scale-95 opacity-40 pointer-events-none' : ''}`}>
                
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">{alojamento.title}</h1>
                        <p className="text-gray-400 font-bold mt-2 italic underline decoration-blue-400 decoration-2 underline-offset-4 font-sans text-xs">
                             {alojamento.city?.name || 'Portugal'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                         <button onClick={toggleFavorite} className={`p-3 border rounded-full transition shadow-sm active:scale-95 ${isFavorite ? 'bg-red-50 border-red-300' : ''}`}>
                           <Heart size={18} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}/>
                         </button>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-2 h-[550px] rounded-[3rem] overflow-hidden mb-12 shadow-2xl bg-gray-50 border border-gray-100">
                    <div className="col-span-2 row-span-2 overflow-hidden bg-gray-200">
                        <img src={getImageUrl(0)} onError={(e) => handleImgError(e, 0)} className="w-full h-full object-cover hover:scale-105 transition duration-700" alt="Main" />
                    </div>
                    <div className="overflow-hidden bg-gray-200"><img src={getImageUrl(1)} onError={(e) => handleImgError(e, 1)} className="w-full h-full object-cover" alt="Gallery 1" /></div>
                    <div className="overflow-hidden bg-gray-200"><img src={getImageUrl(2)} onError={(e) => handleImgError(e, 2)} className="w-full h-full object-cover" alt="Gallery 2" /></div>
                    <div className="col-span-2 overflow-hidden bg-gray-200"><img src={getImageUrl(3)} onError={(e) => handleImgError(e, 3)} className="w-full h-full object-cover" alt="Gallery 3" /></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2">
                        <div className="flex gap-6 mb-10 border-b border-gray-100 pb-10 font-black text-[10px] uppercase text-gray-400 tracking-widest">
                            <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl"><Users size={16}/> {alojamento.max_guests} hóspedes</span>
                            <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl"><Bed size={16}/> {alojamento.bedrooms} quartos</span>
                        </div>
                        
                        <h3 className="text-xl font-black mb-6 uppercase italic underline decoration-blue-500 decoration-[6px] underline-offset-8">Sobre este espaço</h3>
                        <p className="text-gray-700 leading-relaxed text-xl font-light whitespace-pre-line mb-10">{alojamento.description}</p>

                        <div className="mt-16 pt-16 border-t border-gray-200">
                            <h3 className="text-2xl font-black mb-8 uppercase italic underline decoration-blue-500 decoration-[6px] underline-offset-8 font-sans">Avaliações</h3>
                            <ReviewsList propertyId={id} key={reviewRefreshTrigger} />
                        </div>
                    </div>

                    <aside>
                        <div className="sticky top-32 bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-2xl text-left">
                            <div className="flex justify-between items-baseline mb-8">
                                <div>
                                    <span className="text-3xl font-black italic text-gray-900 font-sans">€{Math.round(pricePerNight)}</span>
                                    <span className="text-gray-400 font-bold ml-1 text-sm uppercase">/ noite</span>
                                </div>
                            </div>

                            <div className="border-2 border-gray-100 rounded-4xl mb-6 overflow-hidden">
                                <div className="grid grid-cols-2 border-b-2 border-gray-100 font-sans">
                                    <div className="p-4 border-r-2 border-gray-100 hover:bg-gray-50 transition-colors">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 font-sans">Entrada</label>
                                        <DatePicker selected={startDate} onChange={d => setStartDate(d)} minDate={new Date()} locale={pt} dateFormat="dd/MM/yyyy" className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer font-sans" />
                                    </div>
                                    <div className="p-4 hover:bg-gray-50 transition-colors font-sans">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 font-sans">Saída</label>
                                        <DatePicker selected={endDate} onChange={d => setEndDate(d)} minDate={addDays(startDate, 1)} locale={pt} dateFormat="dd/MM/yyyy" className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer font-sans" />
                                    </div>
                                </div>
                                <div className="p-4 hover:bg-gray-50 font-sans">
                                   <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 font-sans">Hóspedes</label>
                                   <select value={hospedes} onChange={e => setHospedes(Number(e.target.value))} className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer appearance-none font-sans">
                                    {[...Array(alojamento.max_guests || 1)].map((_, i) => <option key={i+1} value={i+1}>{i+1} hóspedes</option>)}
                                   </select>
                                </div>
                            </div>

                            <button onClick={() => setShowModal(true)} className="w-full bg-blue-600 text-white font-black py-5 rounded-[1.8rem] uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all font-sans">Reservar Agora</button>

                            <div className="mt-8 space-y-4 text-sm font-bold text-gray-500 font-sans text-left">
                                <div className="flex justify-between items-center italic font-sans"><span>Subtotal ({nights} noites)</span><span className="text-gray-900 font-black font-sans">€{nightsPrice}</span></div>
                                <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest font-sans"><span>Taxas fixas</span><span className="font-sans">€{cleaningFee + serviceFee}</span></div>
                                <div className="flex justify-between text-2xl font-black text-gray-900 pt-6 border-t border-gray-100 italic uppercase font-sans"><span>Total</span><span className="text-blue-600 font-black font-sans">€{totalPrice}</span></div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Step 1: Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-200 flex items-center justify-center p-4 font-sans">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white w-full max-w-lg rounded-[3.5rem] p-10 shadow-2xl text-left animate-slideUp">
                        <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-black transition"><X size={28}/></button>
                        <h2 className="text-3xl font-black italic mb-2 tracking-tighter uppercase text-gray-900 font-sans">Confirmar Reserva</h2>
                        <div className="space-y-4 my-8 font-bold text-gray-900 font-sans">
                            <div className="bg-gray-50 p-6 rounded-[2.5rem] flex justify-between font-sans">
                                <div><p className="text-[10px] font-black text-blue-500 uppercase mb-1 tracking-widest font-sans">Datas</p><p className="text-sm font-sans">{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</p></div>
                                <div className="text-right font-sans"><p className="text-[10px] font-black text-blue-500 uppercase mb-1 tracking-widest font-sans">Hóspedes</p><p className="text-sm font-black font-sans">{hospedes} pessoa(s)</p></div>
                            </div>
                            <div className="px-2 space-y-3 text-gray-500 font-sans">
                                <div className="flex justify-between font-sans"><span>Subtotal {nights} noites</span><span className="text-gray-900 font-black font-sans">€{nightsPrice}</span></div>
                                <div className="flex justify-between text-3xl font-black text-gray-900 pt-6 border-t border-gray-100 italic uppercase tracking-tighter font-sans"><span>Total</span><span className="text-blue-600 font-black font-sans">€{totalPrice}</span></div>
                            </div>
                        </div>
                        <button onClick={handleOpenPayment} className="w-full bg-blue-600 text-white font-black py-6 rounded-[2.2rem] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs italic font-sans">
                             Prosseguir para Pagamento
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: In-app Payment Modal */}
            {showPaymentModal && (
                <PaymentModal 
                    totalPrice={totalPrice} 
                    onClose={() => setShowPaymentModal(false)} 
                    onConfirm={handleFinalPayment}
                    bookingLoading={bookingLoading}
                />
            )}

            <Footer />
        </div>
    );
}

export default ListingDetails;