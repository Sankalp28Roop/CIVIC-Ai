"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, TranslationDictionary, translateScheme } from '@/utils/translations';
import { useTheme } from '@/context/ThemeContext';

interface LanguageContextType {
  lang: Language;
  isHindi: boolean;
  isUrdu: boolean;
  isRTL: boolean;
  setLang: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationDictionary;
  translateScheme: (scheme: { title: string; tagline: string; status: string }) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');
  const { display_language, setDisplayLanguage } = useTheme();

  useEffect(() => {
    const saved = localStorage.getItem('civic_lang') as Language;
    if (saved === 'hi' || saved === 'ur' || saved === 'en') {
      setLangState(saved);
      if (saved === 'hi' && display_language !== 'Hindi') setDisplayLanguage('Hindi');
      if (saved === 'ur' && display_language !== 'Urdu') setDisplayLanguage('Urdu');
      if (saved === 'en' && display_language !== 'English') setDisplayLanguage('English');
    } else if (display_language === 'Hindi') {
      setLangState('hi');
    } else if (display_language === 'Urdu') {
      setLangState('ur');
    }
  }, [display_language, setDisplayLanguage]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('civic_lang', newLang);
    if (newLang === 'hi') setDisplayLanguage('Hindi');
    else if (newLang === 'ur') setDisplayLanguage('Urdu');
    else setDisplayLanguage('English');
  };

  const toggleLanguage = () => {
    // Cycle EN -> HI -> UR -> EN
    const nextLang: Language = lang === 'en' ? 'hi' : lang === 'hi' ? 'ur' : 'en';
    setLang(nextLang);
  };

  // Apply font classes and RTL layout mirroring
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-hindi', 'font-urdu');
    
    if (lang === 'hi') {
      root.classList.add('font-hindi');
      root.setAttribute('lang', 'hi');
      root.setAttribute('dir', 'ltr');
    } else if (lang === 'ur') {
      root.classList.add('font-urdu');
      root.setAttribute('lang', 'ur');
      root.setAttribute('dir', 'rtl');
    } else {
      root.setAttribute('lang', 'en');
      root.setAttribute('dir', 'ltr');
    }
  }, [lang]);

  const t = translations[lang] || translations.en;

  const handleTranslateScheme = (scheme: { title: string; tagline: string; status: string }) => {
    return translateScheme(scheme, lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        isHindi: lang === 'hi',
        isUrdu: lang === 'ur',
        isRTL: lang === 'ur',
        setLang,
        toggleLanguage,
        t,
        translateScheme: handleTranslateScheme,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
