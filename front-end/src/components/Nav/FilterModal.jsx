import React, { useState } from 'react';
import { X, Home, Building2, Tent, Warehouse, Waves, Wifi, Car, Wind } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

function FilterModal({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Initialize filters from URL or defaults
  const [price, setPrice] = useState(queryParams.get('price') || 1000);
  const [type, setType] = useState(queryParams.get('type') || 'Todos');
  const [selectedExtras, setSelectedExtras] = useState([]);

  const types = [
    { label: 'Todos', icon: <Home size={20}/> },
    { label: 'Apartamento', icon: <Building2 size={20}/> },
    { label: 'Moradia', icon: <Warehouse size={20}/> },
    { label: 'Chale', icon: <Tent size={20}/> }
  ];

  const extrasList = [
    { label: 'Wi-Fi', icon: <Wifi size={14}/> },
    { label: 'Piscina', icon: <Waves size={14}/> },
    { label: 'Estacionamento', icon: <Car size={14}/> },
    { label: 'AC', icon: <Wind size={14}/> }
  ];

  const toggleExtra = (label) => {
    setSelectedExtras(prev => 
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  const handleApply = () => {
    const currentQ = queryParams.get('q');
    const newParams = new URLSearchParams();
    
    if (currentQ) newParams.set('q', currentQ);
    newParams.set('price', price);
    newParams.set('type', type);
    
    // Logic to apply filters via URL navigation
    navigate(`/search?${newParams.toString()}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">Filtros Avancados</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X /></button>
        </div>

        <div className="p-10 space-y-12 overflow-y-auto max-h-[70vh] text-left text-gray-900">
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 italic">Gama de Preco</h3>
            <div className="px-2">
              <input type="range" min="20" max="1000" value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              <div className="flex justify-between mt-4 font-black text-blue-600 italic">
                <span>20€</span>
                <span className="text-2xl underline underline-offset-8">Ate {price}€</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 italic">Tipo de Alojamento</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {types.map((t) => (
                <button key={t.label} onClick={() => setType(t.label)}
                  className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all active:scale-95 ${
                    type === t.label ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 hover:border-gray-200'
                  }`}>
                  {t.icon}
                  <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 italic">Comodidades Essenciais</h3>
            <div className="flex flex-wrap gap-3">
              {extrasList.map((item) => (
                <button key={item.label} onClick={() => toggleExtra(item.label)}
                  className={`flex items-center gap-2 px-6 py-3 border-2 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                    selectedExtras.includes(item.label) 
                    ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100' 
                    : 'border-gray-100 text-gray-400 hover:border-blue-500 hover:text-blue-500'
                  }`}>
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <button onClick={() => { setPrice(1000); setType('Todos'); setSelectedExtras([]); }}
            className="text-gray-400 font-black uppercase text-xs tracking-widest underline hover:text-black transition">
            Limpar Filtros
          </button>
          <button onClick={handleApply}
            className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all">
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;