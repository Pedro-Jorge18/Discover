import React, { useState } from 'react';
import { X, Home, Building2, Tent, Warehouse, Waves, Wifi, Car, Wind, Bed } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../../contexts/TranslationContext';

function FilterModal({ onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [price, setPrice] = useState(queryParams.get('price') || 1000);
  const [type, setType] = useState(queryParams.get('type') || 'Todos');
  const [selectedExtras, setSelectedExtras] = useState(queryParams.get('amenities')?.split(',') || []);

  const types = [
    { label: 'Todos', text: t('filter.all'), icon: <Home size={20}/> },
    { label: 'Apartamento', text: t('filter.apartment'), icon: <Building2 size={20}/> },
    { label: 'Moradia', text: t('filter.house'), icon: <Warehouse size={20}/> },
    { label: 'Quarto', text: t('filter.villa'), icon: <Bed size={20}/> }
  ];

  {/*const extrasList = [
    { label: 'Wi-Fi', text: t('filter.wifi'), icon: <Wifi size={14}/> },
    { label: 'Piscina', text: t('filter.pool'), icon: <Waves size={14}/> },
    { label: 'Estacionamento', text: t('filter.parking'), icon: <Car size={14}/> },
    { label: 'AC', text: t('filter.ac'), icon: <Wind size={14}/> }
  ];

  const toggleExtra = (label) => {
    setSelectedExtras(prev => 
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };*/}

  const handleApply = () => {
    const currentQ = queryParams.get('q');
    const newParams = new URLSearchParams();
    
    if (currentQ) newParams.set('q', currentQ);
    newParams.set('price', price);
    newParams.set('type', type);
    if (selectedExtras.length > 0) newParams.set('amenities', selectedExtras.join(','));
    
    navigate(`/search?${newParams.toString()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp text-left">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">{t('filter.advancedFilters')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X /></button>
        </div>
        <div className="p-10 space-y-12 overflow-y-auto max-h-[70vh]">
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 italic">{t('filter.priceRange')}</h3>
            <input type="range" min="20" max="1000" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
            <div className="flex justify-between mt-4 font-black text-blue-600 italic">
              <span>20{t('filter.currency')}</span>
              <span className="text-2xl underline underline-offset-8">{t('filter.to')} {price}{t('filter.currency')}</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 italic">{t('filter.propertyType')}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {types.map((item) => (
                <button key={item.label} onClick={() => setType(item.label)} className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${type === item.label ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100'}`}>
                  {item.icon}
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.text}</span>
                </button>
              ))}
            </div>
          </div>
         {/* <div>
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 italic">{t('filter.amenities')}</h3>
            <div className="flex flex-wrap gap-3">
              {extrasList.map((item) => (
                <button key={item.label} onClick={() => toggleExtra(item.label)} className={`flex items-center gap-2 px-6 py-3 border-2 rounded-full font-black text-xs uppercase tracking-widest transition-all ${selectedExtras.includes(item.label) ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-100 text-gray-400'}`}>
                  {item.icon} {item.text}
                </button>
              ))}
            </div> 
          </div>*/}
        </div>
        <div className="p-8 bg-gray-50 flex justify-between items-center">
          <button onClick={() => { setPrice(1000); setType('Todos'); setSelectedExtras([]); }} className="text-gray-400 font-black uppercase text-xs tracking-widest underline">{t('filter.clearFilters')}</button>
          <button onClick={handleApply} className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">{t('filter.applyFilters')}</button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;