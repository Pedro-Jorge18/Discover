import React, { createContext, useState, useContext, useEffect } from 'react';
import enTranslations from '../translations/en';
import ptTranslations from '../translations/pt';

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  // Get language from localStorage or default to 'pt'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'pt';
  });

  const translations = {
    en: enTranslations,
    pt: ptTranslations
  };

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function with interpolation support
  const t = (key, variables = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    if (!value) return key;
    
    // Support for {{variable}} interpolation
    let result = value;
    Object.entries(variables).forEach(([varName, varValue]) => {
      result = result.replace(new RegExp(`{{\\s*${varName}\\s*}}`, 'g'), varValue);
    });
    
    return result;
  };

  const switchLanguage = (lang) => {
    if (lang === 'en' || lang === 'pt') {
      setLanguage(lang);
    }
  };

  return (
    <TranslationContext.Provider value={{ language, t, switchLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
