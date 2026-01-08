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
import ListingInfo from './ListingInfo.jsx';
import PaymentModal from '../Booking/PaymentModal.jsx';
import { pushHostNotification } from '../../utils/hostNotifications';
import { useTranslation } from '../../contexts/TranslationContext';

function ListingDetails({ user, setUser, onOpenLogin, onOpenSettings, onOpenSettingsAdmin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // State management
  const [alojamento, setAlojamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Reservation dates state
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 1));
  const [hospedes, setHospedes] = useState(1);

  // Review States
  const [canReview, setCanReview] = useState(false);
  const [eligibleReservation, setEligibleReservation] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);

  const handleStatsUpdate = React.useCallback((stats) => {
    if (stats && stats.average_rating && alojamento) {
      // Atualiza o rating da propriedade baseado nas reviews
      setAlojamento(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          rating: parseFloat(stats.average_rating).toFixed(2)
        }
      }));
    }
  }, [alojamento]);

  const formatTime = (value, fallback = '--:--') => {
    if (!value) return fallback;
    if (typeof value === 'string') {
      // Strict HH:MM
      if (/^\d{2}:\d{2}$/.test(value)) return value;
      // ISO date strings with T separator
      if (value.includes('T')) {
        const timePart = value.split('T')[1];
        if (timePart && timePart.length >= 5) return timePart.slice(0, 5);
      }
      // Datetime with space separator
      if (value.includes(' ')) return value.split(' ')[1]?.slice(0, 5) || fallback;
    }
    return fallback;
  };

  // Check if user can review this property (only needs to be authenticated)
  const checkReviewEligibility = () => {
    if (user && user.id) {
      setCanReview(true);
      // Create a temporary reservation object for the form
      setEligibleReservation({ id: null });
    } else {
      setCanReview(false);
    }
  };

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
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProperty();
      checkFavoriteStatus();
      checkReviewEligibility();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  // Renderizar as estrelas baseado no rating
  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={`${
              star <= (rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Guardar o pathname para redirecionar após login
  useEffect(() => {
    localStorage.setItem('propertyRedirect', window.location.pathname);
  }, [id]);

  // Logic to add/remove from account-based favorites
  const toggleFavorite = () => {
    if (!user || !user.id) {
      navigate("/login");
      return;
    }
    
    const storageKey = `favoritos_user_${user.id}`;
    const favs = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const isCurrentlyFavorite = favs.some(f => String(f.id) === String(id));

    if (isCurrentlyFavorite) {
      const newFavs = favs.filter(f => String(f.id) !== String(id));
      localStorage.setItem(storageKey, JSON.stringify(newFavs));
      setIsFavorite(false);
      notify(t('property.removedFromFavorites'), 'info');
    } else {
      const newFavs = [...favs, alojamento];
      localStorage.setItem(storageKey, JSON.stringify(newFavs));
      setIsFavorite(true);
      notify(t('property.addedToFavorites'), 'success');
    }
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

  // Get image URL or placeholder
  const getImageUrl = (index) => {
    // High-quality architectural placeholders to avoid delays
    const backupPlaceholders = [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', // Sala
      'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800', // Quarto
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', // Cozinha
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800'  // Casa de Banho
    ];

    // Get valid photos from alojamento
    const validPhotos = alojamento?.images || [];

    // Return the valid photo if available at this index
    if (validPhotos[index]) {
      const image = validPhotos[index];
      const raw = image.image_url || image.url || image.image_path || image.path;
      if (!raw) return backupPlaceholders[index % backupPlaceholders.length];
      if (raw.startsWith('http')) return raw;
      const base = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      return `${base}/storage/${raw.replace(/^\/storage\//, '')}`;
    }

    // Otherwise, use a placeholder from the list based on the slot index
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

  const handleOpenPayment = () => {
    setShowModal(false);
    setShowPaymentModal(true);
  };

  const handleFinalPayment = async (paymentData) => {
  try {
    setBookingLoading(true);

    // Dados SIMPLES para a reserva
    const reservationData = {
      property_id: parseInt(id),
      check_in: startDate.toISOString().split('T')[0],
      check_out: endDate.toISOString().split('T')[0],
      adults: parseInt(hospedes),
      children: 0,
      infants: 0,
      total_amount: totalPrice,
      nights: 1
    };

    // include safe payment info (no full card numbers) provided by PaymentModal
    const safePayment = paymentData ? {
      firstName: paymentData.firstName || null,
      lastName: paymentData.lastName || null,
      email: paymentData.email || null,
      phone: paymentData.phone || null,
      card_last4: paymentData.cardNumber ? paymentData.cardNumber.replace(/\s+/g, '').slice(-4) : null
    } : null;

    reservationData.payment_metadata = safePayment;

    console.log('Enviando:', reservationData);
    const response = await api.post('/reservations/with-payment', reservationData);

    if (response.data.success || response.status === 201) {
      notify(t('property.bookingSuccess') || 'Reserva confirmada! 🎉', 'success');

      const hostId = alojamento?.host?.id || alojamento?.user?.id;
      if (hostId) {
        pushHostNotification({
          hostId,
          type: 'payment',
          title: t('hostNotifications.paymentTitle'),
          message: `${t('hostNotifications.paymentBody')} ${alojamento?.title || ''} (€${totalPrice})`,
          propertyId: alojamento?.id,
        });
      }

      navigate('/payment/success');
    } else {
      throw new Error('Erro ao criar reserva');
    }
  } catch (error) {
    console.error('Erro:', error);
    notify('Erro ao criar reserva', 'error');
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
      <Header user={user} setUser={setUser} onOpenSettings={onOpenSettings} onOpenSettingsAdmin={onOpenSettingsAdmin} />
      <main className={`max-w-[1200px] mx-auto px-6 pt-28 pb-20 transition-all duration-700 ${(showModal || showPaymentModal) ? 'blur-xl scale-95 opacity-40 pointer-events-none' : ''}`}>
        
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">{alojamento.title}</h1>
            <p className="text-gray-400 font-bold mt-2 italic underline decoration-blue-400 decoration-2 underline-offset-4">
              📍 {alojamento.city?.name || t('property.locationNotDefined')}
            </p>
          </div>
          <div className="flex gap-3">
             <button className="p-3 border rounded-full hover:bg-gray-50 transition shadow-sm"><Share2 size={18}/></button>
             <button onClick={toggleFavorite} className={`p-3 border rounded-full hover:bg-gray-50 transition shadow-sm ${isFavorite ? 'bg-red-50 border-red-300' : ''}`}>
               <Heart size={18} className={isFavorite ? 'fill-red-500 text-red-500' : ''}/>
             </button>
          </div>
        </div>

        {/* Gallery Section - Instant Load Logic */}
        <div className="grid grid-cols-4 gap-2 h-[550px] rounded-[3rem] overflow-hidden mb-12 shadow-2xl bg-gray-50 border border-gray-100">
          <div className="col-span-2 row-span-2 overflow-hidden bg-gray-200">
            <img 
              src={getImageUrl(0)} 
              className="w-full h-full object-cover hover:scale-105 transition duration-700" 
              alt="Destaque"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'; }}
            />
          </div>
          <div className="overflow-hidden bg-gray-200">
            <img 
              src={getImageUrl(1)} 
              className="w-full h-full object-cover" 
              alt="Interior 1"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=800'; }}
            />
          </div>
          <div className="overflow-hidden bg-gray-200">
            <img 
              src={getImageUrl(2)} 
              className="w-full h-full object-cover" 
              alt="Interior 2"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'; }}
            />
          </div>
          <div className="col-span-2 overflow-hidden bg-gray-200">
            <img 
              src={getImageUrl(3)} 
              className="w-full h-full object-cover" 
              alt="Interior 3"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800'; }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <div className="flex gap-6 mb-10 border-b border-gray-100 pb-10 font-black text-[10px] uppercase text-gray-400 tracking-widest">
              <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl"><Users size={16}/> {alojamento.max_guests} {t('common.guests')}</span>
              <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl"><Bed size={16}/> {alojamento.bedrooms} {t('common.bedrooms')}</span>
              <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl"><Bath size={16}/> {alojamento.bathrooms || 1} {t('common.bathrooms')}</span>
            </div>

            <div className="flex flex-wrap gap-3 mb-10 text-xs font-black uppercase text-gray-500 tracking-widest">
              <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                <span className="text-gray-400">{t('property.checkIn')}</span>
                <span className="text-gray-800">{formatTime(alojamento.check_in_time, '15:00')}</span>
              </span>
              <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                <span className="text-gray-400">{t('property.checkOut')}</span>
                <span className="text-gray-800">{formatTime(alojamento.check_out_time, '11:00')}</span>
              </span>
            </div>

            <ListingInfo
              city={alojamento.location?.city?.name}
              description={alojamento.description || 'Sem descrição disponível.'}
              guests={alojamento.max_guests}
              bedrooms={alojamento.bedrooms}
              bathrooms={alojamento.bathrooms || 1}
              address={alojamento.location?.address || alojamento.address}
            />

            {/* Reviews Section */}
            <div className="mt-16 pt-16 border-t border-gray-200">
              <h3 className="text-2xl font-black mb-8 uppercase italic underline decoration-blue-500 decoration-[6px] underline-offset-8">{t('property.reviews')}</h3>
              
              {/* Review Eligibility Banner */}
              {!user && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                  <p className="text-sm text-blue-700">
                    <a href="/login" className="font-semibold underline">{t('auth.login')}</a> {t('review.loginToReview')}
                  </p>
                </div>
              )}

              {canReview && user && !showReviewForm && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">{t('review.shareYourOpinion')}</h4>
                    <p className="text-sm text-green-700">
                      {t('review.wouldYouLikeToReviewProperty')}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition font-semibold"
                  >
                    <Star size={18} />
                    {t('review.review')}
                  </button>
                </div>
              )}

              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-6">
                  <ReviewForm
                    reservation={eligibleReservation}
                    property={alojamento}
                    user={user}
                    onSuccess={() => {
                      setShowReviewForm(false);
                      setCanReview(false);
                      notify(t('review.reviewSubmittedSuccessfully'), 'success');
                      // Trigger ReviewsList to refresh
                      setReviewRefreshTrigger(prev => prev + 1);
                    }}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}

              <ReviewsList 
                propertyId={id} 
                key={reviewRefreshTrigger} 
                onStatsUpdate={handleStatsUpdate}
                user={user}
                propertyHostId={alojamento?.host?.id}
              />
            </div>
          </div>

          <aside>
              <div className="sticky top-32 bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-2xl text-left">
              <div className="flex justify-between items-baseline mb-8">
                <div>
                  <span className="text-3xl font-black italic">€{Math.round(pricePerNight)}</span>
                  <span className="text-gray-400 font-bold ml-1 text-sm uppercase">/ {t('property.perNight')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                {renderStars(alojamento?.metrics?.rating ? parseFloat(alojamento.metrics.rating) : 0)}
                <span>{alojamento?.metrics?.rating ? parseFloat(alojamento.metrics.rating).toFixed(1) : "0"}</span>
              </div>
              </div>

              <div className="border-2 border-gray-100 rounded-4xl mb-6 overflow-hidden">
                <div className="grid grid-cols-2 border-b-2 border-gray-100">
                  <div className="p-4 border-r-2 border-gray-100 hover:bg-gray-50 transition-colors">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">{t('property.checkIn')}</label>
                    <DatePicker selected={startDate} onChange={d => setStartDate(d)} minDate={new Date()} locale={pt} dateFormat="dd/MM/yyyy" className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer" />
                  </div>
                  <div className="p-4 hover:bg-gray-50 transition-colors">
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">{t('property.checkOut')}</label>
                    <DatePicker selected={endDate} onChange={d => setEndDate(d)} minDate={addDays(startDate, 1)} locale={pt} dateFormat="dd/MM/yyyy" className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer" />
                  </div>
                </div>
                <div className="p-4 hover:bg-gray-50 transition-colors">
                   <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">{t('common.guests')}</label>
                   <select value={hospedes} onChange={e => setHospedes(Number(e.target.value))} className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer appearance-none">
                    {[...Array(alojamento.max_guests || 1)].map((_, i) => <option key={i+1} value={i+1}>{i+1} {t('common.guests')}</option>)}
                   </select>
                </div>
              </div>

              <button onClick={handleOpenModal} className="w-full bg-blue-600 text-white font-black py-5 rounded-[1.8rem] uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                {t('property.reserveNow')}
              </button>

              <div className="mt-8 space-y-4 text-sm font-bold text-gray-500">
                <div className="flex justify-between items-center italic">
                  <span>{t('property.subtotal')} ({nights} {t('common.nights')})</span>
                  <span className="text-gray-900 font-black">€{nightsPrice}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest">
                  <span>{t('property.fixedFees')}</span>
                  <span>€{cleaningFee + serviceFee}</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-gray-900 pt-6 border-t border-gray-100 italic uppercase">
                  <span>{t('property.total')}</span>
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
            <h2 className="text-3xl font-black italic mb-2 uppercase text-gray-900 tracking-tighter">{t('property.confirmReservation')}</h2>
            <div className="space-y-4 my-8 font-bold text-gray-900">
              <div className="bg-gray-50 p-6 rounded-[2.5rem] flex justify-between">
                <div>
                  <p className="text-[10px] font-black text-blue-500 uppercase mb-1 tracking-widest">{t('property.dates')}</p>
                  <p className="text-sm">{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-blue-500 uppercase mb-1 tracking-widest">{t('common.guests')}</p>
                  <p className="text-sm font-black">{hospedes} {t('common.guests')}</p>
                </div>
              </div>
              <div className="px-2 space-y-3 text-gray-500">
                <div className="flex justify-between"><span>{t('property.subtotal')} ({nights} {t('common.nights')})</span><span className="text-gray-900 font-black">€{nightsPrice}</span></div>
                <div className="flex justify-between text-3xl font-black text-gray-900 pt-6 border-t border-gray-100 italic uppercase tracking-tighter">
                  <span>{t('property.total')}</span><span className="text-blue-600 font-black">€{totalPrice}</span>
                </div>
              </div>
            </div>
            <button onClick={handleOpenPayment} disabled={bookingLoading} className="w-full bg-blue-600 text-white font-black py-6 rounded-[2.2rem] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs italic">
                {bookingLoading ? <Loader2 className="animate-spin"/> : <><CreditCard size={18}/> {t('property.confirmAndPay')}</>}
            </button>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <PaymentModal 
            totalPrice={totalPrice} 
            onClose={() => setShowPaymentModal(false)} 
            onConfirm={handleFinalPayment}
            bookingLoading={bookingLoading}
        />
      )}
    </div>
  );
}

export default ListingDetails;