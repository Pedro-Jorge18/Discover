import React, { useState } from 'react';
import { X, CreditCard, Lock, Loader2, User, Mail, Phone, Calendar } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import notify from '../../utils/notify';

const PaymentModal = ({ onClose, onConfirm, totalPrice, bookingLoading }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    // Handle Phone: Only numbers, strict 9 digits
    const handlePhone = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 9);
        setFormData({ ...formData, phone: val });
    };

    // Handle Card: Space every 4 digits, strict 16 digits
    const handleCardNumber = (e) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 16);
        const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
        setFormData({ ...formData, cardNumber: formatted });
    };

    // Handle Expiry: Auto-slash MM/YY, strict 4 digits
    const handleExpiry = (e) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (val.length >= 3) {
            val = val.slice(0, 2) + '/' + val.slice(2);
        }
        setFormData({ ...formData, expiry: val });
    };

    // Handle CVC: Only numbers, strict 3 digits
    const handleCvc = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 3);
        setFormData({ ...formData, cvc: val });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation: 16 card digits
        const cardDigits = formData.cardNumber.replace(/\s/g, '');
        if (cardDigits.length !== 16) {
            notify(t('errors.invalidCardNumber'), 'error');
            return;
        }
        
        // Validation: 3 CVC digits
        if (formData.cvc.length !== 3) {
            notify(t('errors.invalidCVC'), 'error');
            return;
        }
        
        // Validation: Expiry in MM/YY format
        if (formData.expiry.length !== 5 || !formData.expiry.includes('/')) {
            notify(t('errors.invalidExpiryFormat'), 'error');
            return;
        }
        
        // Validation: 9 contact digits
        if (formData.phone.length !== 9) {
            notify(t('errors.invalidPhoneNumber'), 'error');
            return;
        }
        
        // Send the clean data to the parent
        onConfirm(formData);
    };

    return (
        <div className="fixed inset-0 z-300 flex items-center justify-center p-4 font-sans">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl animate-slideUp overflow-y-auto max-h-[95vh] text-left">
                <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-black transition">
                    <X size={24} />
                </button>

                <div className="mb-10">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">{t('payment.securePayment')}</h3>
                    <div className="h-1 w-20 bg-blue-600 mt-2"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* PERSONAL INFORMATION SECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t('payment.firstName')}</label>
                            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                                <User size={18} className="text-gray-400" />
                                <input type="text" placeholder={t('payment.firstNamePlaceholder')} className="bg-transparent w-full outline-none font-bold text-sm" required 
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t('payment.lastName')}</label>
                            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                                <User size={18} className="text-gray-400" />
                                <input type="text" placeholder={t('payment.lastNamePlaceholder')} className="bg-transparent w-full outline-none font-bold text-sm" required 
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t('payment.email')}</label>
                            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                                <Mail size={18} className="text-gray-400" />
                                <input type="email" placeholder={t('payment.emailPlaceholder')} className="bg-transparent w-full outline-none font-bold text-sm" required 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t('payment.phone')}</label>
                            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                                <Phone size={18} className="text-gray-400" />
                                <input type="text" placeholder="912345678" value={formData.phone} onChange={handlePhone} className="bg-transparent w-full outline-none font-bold text-sm" required />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100 my-4" />

                    {/* CARD DETAILS SECTION */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t('payment.cardNumber')}</label>
                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                            <CreditCard size={18} className="text-blue-600" />
                            <input type="text" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={handleCardNumber} className="bg-transparent w-full outline-none font-bold text-sm tracking-widest" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t('payment.expiry')}</label>
                            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                                <Calendar size={18} className="text-gray-400" />
                                <input type="text" placeholder={t('payment.expiryPlaceholder')} value={formData.expiry} onChange={handleExpiry} className="bg-transparent w-full outline-none font-bold text-sm" required />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t('payment.cvc')}</label>
                            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                                <Lock size={18} className="text-gray-400" />
                                <input type="text" placeholder="000" value={formData.cvc} onChange={handleCvc} className="bg-transparent w-full outline-none font-bold text-sm" required />
                            </div>
                        </div>
                    </div>

                    {/* SUBMIT SECTION */}
                    <div className="bg-blue-50 p-6 rounded-[2.5rem] flex items-center justify-between mt-8">
                        <div>
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{t('payment.totalToPay')}</p>
                            <p className="text-2xl font-black text-blue-700 italic font-sans">€{totalPrice}</p>
                        </div>
                        <button 
                            type="submit"
                            disabled={bookingLoading}
                            className="bg-blue-600 text-white font-black px-10 py-4 rounded-2xl uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all flex items-center gap-2"
                        >
                            {bookingLoading ? <Loader2 className="animate-spin" /> : t('payment.confirmPayment')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;