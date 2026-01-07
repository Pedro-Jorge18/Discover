import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';

function LanguageSwitcher() {
  const { language, switchLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (lang) => {
    switchLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex items-center gap-1.5 p-3 text-gray-700 rounded-full hover:bg-gray-100 font-bold text-xs uppercase transition-all"
      >
        <Globe className="w-4 h-4" />
        {language.toUpperCase()}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <button
              onClick={() => handleLanguageChange('pt')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                language === 'pt' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
              }`}
            >
              🇵🇹 Português
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                language === 'en' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default LanguageSwitcher;
