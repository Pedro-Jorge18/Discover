import React, { useState, useEffect } from 'react';
import Header from '../Nav/Header.jsx';
import Footer from '../Layout/Footer.jsx';
import api from '../../api/axios';
import { Calendar, MapPin, Loader2, ChevronRight, Briefcase } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

const MyReservations = ({ user, setUser, onOpenSettings, onOpenSettingsAdmin }) => {
    const { t } = useTranslation();
    const [reservas, setReservas] = useState([]); // Começa como array vazio
    const [loading, setLoading] = useState(true);
        const [showDetails, setShowDetails] = useState(false);
        const [selected, setSelected] = useState(null);
        const [showCancelConfirm, setShowCancelConfirm] = useState(false);
        const [cancelTarget, setCancelTarget] = useState(null);

        const openCancelConfirm = (reservation) => {
            setCancelTarget(reservation);
            setShowCancelConfirm(true);
        };

        const handleConfirmCancel = async () => {
            if (!cancelTarget) return;
            try {
                const response = await api.delete(`/reservations/${cancelTarget.id}`);
                const updated = response.data?.data;

                setReservas((prev) => prev.map(r => {
                    if (r.id !== cancelTarget.id) return r;
                    return {
                        ...r,
                        ...updated,
                        status: updated?.status ?? 'Cancelada',
                        status_name: updated?.status ?? 'Cancelada',
                        cancelled_at: updated?.cancelled_at ?? new Date().toISOString(),
                    };
                }));

                setShowCancelConfirm(false);
                setCancelTarget(null);
            } catch (err) {
                console.error('Erro a cancelar:', err);
                alert('Erro ao cancelar reserva.');
            }
        };

        useEffect(() => {
            const fetchReservas = async () => {
                try {
                    const response = await api.get('/reservations');
          
          // O backend responde com {success: true, data: ReservationCollection}
          // Onde ReservationCollection pode ser {data: [...]} ou uma array direto
          let reservasArray = [];
          
          if (response.data?.data) {
            const dataContent = response.data.data;
            
            // Se data.data é um array, usa direto
            if (Array.isArray(dataContent)) {
              reservasArray = dataContent;
            }
            // Se é um objeto com propriedade 'data' que é um array
            else if (dataContent?.data && Array.isArray(dataContent.data)) {
              reservasArray = dataContent.data;
            }
            // Se é um objeto com propriedade 'data' que é um Collection
            else if (dataContent?.data) {
              reservasArray = Array.isArray(dataContent.data) ? dataContent.data : [];
            }
          }
          
          
          setReservas(reservasArray);
        } catch (error) {
          console.error("Erro ao carregar viagens:", error);
          setReservas([]);
        } finally {
          setLoading(false);
        }
      };
      fetchReservas();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans text-left">
            <Header user={user} setUser={setUser} onOpenSettings={onOpenSettings} onOpenSettingsAdmin={onOpenSettingsAdmin} />
            
            <main className="grow max-w-[1200px] w-full mx-auto px-6 pt-32 pb-20">
                <div className="mb-12">
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">
                        {t('myReservations')} <span className="text-transparent" style={{ WebkitTextStroke: '1px #111' }}></span>
                    </h1>
                    <div className="h-1 w-20 bg-blue-600 mt-2"></div>
                </div>

                {(!reservas || reservas.length === 0) ? (
                    <div className="py-20 bg-white rounded-[3rem] shadow-sm border border-gray-100 text-center">
                        <Briefcase className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Sem reservas encontradas</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {reservas.map((res) => (
                            <div key={res.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-all">
                                <div className="w-full md:w-48 h-32 bg-gray-200 rounded-3xl overflow-hidden shrink-0">
                                    <img 
                                        src={res.property?.images?.[0]?.image_path 
                                            ? `http://127.0.0.1:8000/storage/${res.property.images[0].image_path}` 
                                            : 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'} 
                                        className="w-full h-full object-cover"
                                        alt="Alojamento"
                                    />
                                </div>
                                <div className="grow flex flex-col justify-center">
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 leading-none">
                                        {res.property?.title || 'Alojamento'}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <MapPin size={12} className="text-blue-500" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            {res.property?.city?.name || 'Localização'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-6 text-gray-400 font-bold text-xs uppercase">
                                        <div className="flex items-center gap-1"><Calendar size={14}/> {new Date(res.check_in).toLocaleDateString()}</div>
                                        <ChevronRight size={14}/>
                                        <div className="flex items-center gap-1 text-gray-900">{new Date(res.check_out).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-center">
                                    <span className="bg-green-100 text-green-600 text-[9px] font-black uppercase px-4 py-1.5 rounded-full">
                                        {res.is_paid || res.payment?.status === 'paid' || res.payment?.status === 'completed' ? 'PAGO' : 'PENDENTE'}
                                    </span>
                                    <p className="text-2xl font-black italic text-gray-900 leading-none">
                                        €{(res.pricing?.total_amount ?? res.total_amount ?? 0).toFixed ? (res.pricing?.total_amount ?? res.total_amount ?? 0).toFixed(2) : (res.pricing?.total_amount ?? res.total_amount ?? 0)}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1 uppercase font-bold">
                                        {res.status || (res.status_name ?? '')}
                                    </p>
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={() => { setSelected(res); setShowDetails(true); }}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase"
                                        >
                                            Detalhes
                                        </button>
                                        {(res.status === 'Pendente' || res.status === 'Pending' || (res.status_name && (res.status_name === 'Pendente' || res.status_name === 'Pending'))) && (
                                            <button
                                                onClick={() => openCancelConfirm(res)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-2xl font-black text-xs uppercase"
                                            >
                                                Cancelar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Details Modal */}
            {showDetails && selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetails(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl z-60">
                        <button onClick={() => setShowDetails(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black">Fechar</button>
                        <h3 className="text-2xl font-black mb-4">Detalhes da Reserva</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-bold">Alojamento</p>
                                <p className="text-gray-700">{selected.property?.title}</p>
                                <p className="text-xs text-gray-400 mt-2">Código: {selected.reservation_code}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold">Datas</p>
                                <p className="text-gray-700">{new Date(selected.check_in).toLocaleDateString()} - {new Date(selected.check_out).toLocaleDateString()}</p>
                                <p className="text-xs text-gray-400 mt-2">Noites: {selected.nights}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-sm font-bold">Hóspedes</p>
                            <p className="text-gray-700">Adultos: {selected.guests?.adults ?? selected.adults} | Crianças: {selected.guests?.children ?? selected.children}</p>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-bold">Preço</p>
                                <p className="text-gray-700">Subtotal: €{(selected.pricing?.subtotal ?? selected.subtotal ?? 0)}</p>
                                <p className="text-gray-700">Total: €{(selected.pricing?.total_amount ?? selected.total_amount ?? 0)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-bold">Pagamento</p>
                                <p className="text-gray-700">Status: {selected.payment?.status ?? (selected.payment_status ?? 'N/A')}</p>
                                <p className="text-gray-700">Método: {selected.payment?.method ?? (selected.payment_method ?? 'N/A')}</p>
                                <p className="text-gray-700">Data: {selected.payment?.payment_date ?? selected.payment_date ?? 'N/A'}</p>
                            </div>
                        </div>

                        {selected.payment_metadata && (
                            <div className="mt-6">
                                <p className="text-sm font-bold">Informações do Pagador</p>
                                <p className="text-gray-700">{selected.payment_metadata.firstName ?? ''} {selected.payment_metadata.lastName ?? ''}</p>
                                <p className="text-gray-700">{selected.payment_metadata.email ?? ''}</p>
                                <p className="text-gray-700">{selected.payment_metadata.phone ?? ''}</p>
                                {selected.payment_metadata.card_last4 && <p className="text-gray-700">Cartão (últimos 4): **** **** **** {selected.payment_metadata.card_last4}</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Cancel Confirm Modal */}
            {showCancelConfirm && cancelTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowCancelConfirm(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl z-60">
                        <h3 className="text-xl font-black text-gray-900 text-center mb-2">Confirmar cancelamento</h3>
                        <p className="text-gray-600 text-center mb-6">Tem a certeza que pretende cancelar a reserva <span className="font-bold">{cancelTarget.reservation_code}</span>?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowCancelConfirm(false)} className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition">Cancelar</button>
                            <button onClick={handleConfirmCancel} className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition">Confirmar cancelamento</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyReservations;