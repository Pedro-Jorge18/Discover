import React from 'react';
import DatePicker from 'react-datepicker';
import { Star, Info, ChevronDown } from 'lucide-react';
import { pt } from 'date-fns/locale';

const BookingWidget = ({ 
  pricePerNight, rating, maxGuests, 
  startDate, setStartDate, endDate, setEndDate, 
  hospedes, setHospedes, onReserve 
}) => {
  return (
    <div className="relative">
      <div className="sticky top-32 bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-2xl ring-1 ring-gray-900/5">
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <span className="text-3xl font-black text-gray-900 italic">€{Math.round(pricePerNight)}</span>
            <span className="text-gray-400 font-bold ml-1 text-sm uppercase tracking-tighter">/ noite</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-black bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            <Star className="w-3 h-3 fill-current" />
            <span>{rating || "Novo"}</span>
          </div>
        </div>

        <div className="border-2 border-gray-100 rounded-[1.8rem] mb-6 overflow-visible">
          <div className="grid grid-cols-2 border-b-2 border-gray-100">
            {/* Input Check-in */}
            <div className="p-4 border-r-2 border-gray-100 hover:bg-gray-50 transition-colors rounded-tl-[1.6rem]">
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Check-in</label>
              <DatePicker 
                selected={startDate} 
                onChange={setStartDate} 
                placeholderText="Escolher" 
                className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer" 
                locale={pt} 
                dateFormat="dd/MM/yyyy"
                popperPlacement="bottom-start"
              />
            </div>
            {/* Input Check-out */}
            <div className="p-4 hover:bg-gray-50 transition-colors rounded-tr-[1.6rem]">
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Check-out</label>
              <DatePicker 
                selected={endDate} 
                onChange={setEndDate} 
                placeholderText="Escolher" 
                className="w-full bg-transparent text-sm font-bold outline-none cursor-pointer" 
                locale={pt} 
                dateFormat="dd/MM/yyyy" 
                minDate={startDate}
                popperPlacement="bottom-end"
              />
            </div>
          </div>
          <div className="p-4 hover:bg-gray-50 transition-colors relative">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Hóspedes</label>
            <select value={hospedes} onChange={(e) => setHospedes(Number(e.target.value))} className="w-full bg-transparent text-sm font-bold outline-none appearance-none cursor-pointer">
              {[...Array(maxGuests || 1)].map((_, i) => (
                <option key={i+1} value={i+1}>{i+1} hóspedes</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-6 bottom-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <button onClick={onReserve} className="w-full bg-blue-600 text-white font-black py-5 rounded-[1.8rem] shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs">
          Reservar Agora
        </button>

        <div className="mt-8 p-4 bg-gray-50 rounded-3xl flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0" />
          <p className="text-[11px] text-gray-400 leading-tight font-medium italic">Garantia de cancelamento flexível incluída.</p>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;