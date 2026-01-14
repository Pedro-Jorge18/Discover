import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTranslation } from '../../contexts/TranslationContext';

const BookingSuccess = () => {
    const { t } = useTranslation();

    useEffect(() => {
        // Trigger confetti celebration on mount
        const end = Date.now() + 3 * 1000;
        const colors = ['#2563eb', '#ffffff'];

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }, []);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-6 font-sans">
            <div className="max-w-md w-full text-center">
                <div className="mb-8 flex justify-center">
                    <div className="bg-green-100 p-5 rounded-full shadow-inner">
                        <CheckCircle size={60} className="text-green-600" />
                    </div>
                </div>

                <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 mb-4">
                    {t('reservation.paymentConfirmed')}
                </h1>
                
                <p className="text-gray-500 font-medium text-lg mb-10 leading-relaxed">
                    {t('reservation.reservationProcessed')}
                </p>

                <div className="space-y-4">
                    <Link 
                        to="/minhas-reservas" 
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-black py-5 rounded-4xl uppercase tracking-widest text-xs shadow-xl hover:bg-blue-700 transition-all active:scale-95"
                    >
                        {t('reservation.viewMyReservations')} <ArrowRight size={18} />
                    </Link>

                    <Link 
                        to="/" 
                        className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-900 font-black py-5 rounded-4xl uppercase tracking-widest text-xs border border-gray-100 hover:bg-gray-100 transition-all"
                    >
                        <Home size={18} /> {t('reservation.backHome')}
                    </Link>
                </div>

                <p className="mt-12 text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em]">
                    O comprovativo será enviado para o seu e-mail
                </p>
            </div>
        </div>
    );
};

export default BookingSuccess;